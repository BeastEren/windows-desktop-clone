/* ========================= */
/* RIGHT-CLICK MENU */
/* ========================= */
const desktop = document.getElementById("desktop");
const menu = document.getElementById("context-menu");
const lis = document.getElementById("context-menu").querySelectorAll("li");

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    lis.forEach(li => {
        if (e.target === desktop || e.target === li) {
            console.log(e.target === li);
            const menuWidth = menu.offsetWidth;
            const menuHeight = menu.offsetHeight;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight - 50; // 50px taskbar height

            let x = e.clientX;
            let y = e.clientY;

            // If menu goes outside RIGHT edge
            if (x + menuWidth > screenWidth) {
                x = screenWidth - menuWidth - 5; // 5px padding
            }

            // If menu goes outside BOTTOM edge
            if (y + menuHeight > screenHeight) {
                y = screenHeight - menuHeight - 5;
            }

            // If menu goes above screen (rare)
            if (y < 0) y = 0;

            // If menu goes left of screen (rare)
            if (x < 0) x = 0;

            menu.style.display = "block";
            menu.style.left = `${x}px`;
            menu.style.top = `${y}px`;
        }
        else {
            menu.style.display = "none";
        }
    });
});

document.addEventListener("click", () => {
    menu.style.display = "none";
});


/* ========================= */
/* FETCHING DATE & TIME FROM A PUBLIC API */
/* ========================= */
async function updateInternetTime() {
    try {
        const res = await fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata");
        const data = await res.json();

        const dateTime = new Date(data.datetime);

        const time = dateTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const date = dateTime.toLocaleDateString("en-IN");

        document.getElementById("time").textContent = time;
        document.getElementById("date").textContent = date;
    } catch (error) {
        console.log("Internet time fetch failed. Using local device time.");
        updateLocalTime();
    }
}

function updateLocalTime() {
    const now = new Date();
    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    });
    const date = now.toLocaleDateString("en-IN");

    document.getElementById("time").textContent = time;
    document.getElementById("date").textContent = date;
}

// Refresh every 60 seconds
setInterval(updateInternetTime, 60000);

// First load
updateInternetTime();


/* ========================= */
/* LOGIC FOR CALENDAR POPUP */
/* ========================= */
const calendarPopup = document.getElementById("calendar-popup");
const timeDateBtn = document.getElementById("time-date");

timeDateBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    calendarPopup.style.display =
        calendarPopup.style.display === "block" ? "none" : "block";

    renderCalendar();
});

// Close calendar if clicked anywhere else
document.addEventListener("click", () => {
    calendarPopup.style.display = "none";
});

function renderCalendar() {
    const date = new Date();

    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });

    document.getElementById("cal-month").textContent = month;
    document.getElementById("cal-year").textContent = year;

    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach(d => {
        const div = document.createElement("div");
        div.textContent = d;
        div.classList.add("calendar-weekday");
        grid.appendChild(div);
    });

    // calendar logic
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // empty spaces
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        grid.appendChild(empty);
    }

    // days
    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement("div");
        cell.textContent = day;

        if (day === date.getDate()) {
            cell.classList.add("current-day");
        }

        grid.appendChild(cell);
    }
}


/* ========================= */
/* NOTIFICATION ICON TOGGLE */
/* ========================= */
const notificationBtn = document.getElementById("notification-icon");
const icon = notificationBtn.querySelector("i");

notificationBtn.addEventListener("click", () => {
    if (icon.classList.contains("ri-notification-snooze-line")) {
        icon.classList.remove("ri-notification-snooze-line");
        icon.classList.add("ri-notification-3-line");
    } else {
        icon.classList.remove("ri-notification-3-line");
        icon.classList.add("ri-notification-snooze-line");
    }
});

