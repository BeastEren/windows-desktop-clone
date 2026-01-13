/* ========================= */
/* RIGHT-CLICK MENU */
/* ========================= */

let alarted = false;
const desktop = document.getElementById("desktop");
const menu = document.getElementById("context-menu");

// Elements that should NOT open the menu
const blockedAreas = ["taskbar", "pinned-apps", "time-date-others"];

// Right-click handler
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    if (!alarted) {
        alert("Right-click context menu has 'Change Desktop Background' and 'Refresh' options only!");
        alarted = true;
    }

    // If clicking on blocked area → STOP
    if (blockedAreas.some(id => document.getElementById(id)?.contains(e.target))) {
        menu.style.display = "none";
        return;
    }

    // If clicking on desktop OR clicking on the menu itself
    if (desktop.contains(e.target) || menu.contains(e.target)) {
        /* --------- Calculate menu position --------- */
        menu.style.display = "block";
        menu.style.visibility = "hidden"; // render but invisible

        const menuWidth = menu.offsetWidth;
        const menuHeight = menu.offsetHeight;

        menu.style.visibility = "visible";

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight - 52; // exclude taskbar

        let x = e.clientX;
        let y = e.clientY;

        /* --------- Prevent going outside --------- */

        // Right overflow
        if (x + menuWidth > screenWidth) {
            x = screenWidth - menuWidth - 5;
        }

        // Bottom overflow
        if (y + menuHeight > screenHeight) {
            y = screenHeight - menuHeight - 5;
        }

        // Top overflow (rare)
        if (y < 0) y = 0;

        // Left overflow (rare)
        if (x < 0) x = 0;

        /* --------- Apply final position --------- */
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.style.display = "block";

        return;
    }

    // Anywhere else → close menu
    menu.style.display = "none";
});

// LEFT CLICK → close menu unless clicking menu
document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) {
        menu.style.display = "none";
    }
});

/* ========================= */
/* CONTEXT MENU ITEM CLICK */
/* ========================= */

menu.addEventListener("click", (e) => {
    const li = e.target.closest("li");

    // Ignore clicks on separators
    if (!li || li.classList.contains("separator")) return;

    const action = li.textContent.trim();

    // reloads the page
    if (action === "Refresh") {
        location.reload();
    }

    // Handle menu actions
    if (action === "Next desktop background") {
        changeDesktopBackground();
    }

    // (Later: handle action here based on text / data-attribute)
    // console.log("Menu action:", li.textContent.trim());

    // Close menu after selection (Windows behavior)
    menu.style.display = "none";
});

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* ========================= */
/* HIDDEN ICONS TOGGLE */
/* ========================= */

const hiddenArrow = document.querySelector(".arrow");
const hiddenPopup = document.getElementById("hidden-icons-popup");

// hiddenArrow.addEventListener("click", (e) => {
//     e.stopPropagation();

//     const isOpen = hiddenPopup.style.display === "flex";

//     hiddenPopup.style.display = isOpen ? "none" : "flex";
//     hiddenArrow.classList.toggle("rotate", !isOpen);
//     hiddenArrow.classList.toggle("active", !isOpen);
// });

// // Close when clicking anywhere else
// document.addEventListener("click", () => {
//     hiddenPopup.style.display = "none";
//     hiddenArrow.classList.remove("rotate", "active");
// });

hiddenArrow.addEventListener("click", (e) => {
    e.stopPropagation();

    hiddenPopup.classList.toggle("show");
    hiddenArrow.classList.toggle("rotate");
    hiddenArrow.classList.toggle("active");
});

document.addEventListener("click", () => {
    hiddenPopup.classList.remove("show");
    hiddenArrow.classList.remove("rotate", "active");
});

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

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
        // updateLocalTime();
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

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* ========================= */
/* LOGIC FOR CALENDAR POPUP */
/* ========================= */

const calendarPopup = document.getElementById("calendar-popup");
const timeDateBtn = document.getElementById("time-date");

// timeDateBtn.addEventListener("click", (e) => {
//     e.stopPropagation();
//     calendarPopup.style.display =
//         calendarPopup.style.display === "block" ? "none" : "block";

//     renderCalendar();
// });

// // Close calendar if clicked anywhere else
// document.addEventListener("click", () => {
//     calendarPopup.style.display = "none";
// });

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
timeDateBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    calendarPopup.classList.toggle("show");
    renderCalendar();
});

document.addEventListener("click", () => {
    calendarPopup.classList.remove("show");
});

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

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

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* ========================= */
/* START MENU */
/* ========================= */

const startBtn = document.querySelector(".windows-start");
const startMenu = document.getElementById("start-menu");

startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.classList.toggle("show");
});

document.addEventListener("click", () => {
    startMenu.classList.remove("show");
});

startMenu.addEventListener("click", (e) => {
    e.stopPropagation(); // keep start menu open
});

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* ========================= */
/* DESKTOP BACKGROUND LOGIC  */
/* ========================= */

// List of desktop backgrounds
const desktopBackgrounds = [
    "./assets/wallpapers/225b715ecc78c6071789f9f53caad786.jpg",
    "./assets/wallpapers/pc-background-sczzraqq7smxmrt3.jpg",
    "./assets/wallpapers/windows-11-windows-10-minimalism-hd-wallpaper-preview.jpg"
];

let currentBgIndex = 0;

function changeDesktopBackground() {
    currentBgIndex++;

    // Reset index when array ends
    if (currentBgIndex >= desktopBackgrounds.length) {
        currentBgIndex = 0;
    }

    desktop.style.backgroundImage = `url("${desktopBackgrounds[currentBgIndex]}")`;
}

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* ========================= */
/* DESKTOP SELECTION (DRAG) */
/* ========================= */

const selectionBox = document.getElementById("selection-box");

let isSelecting = false;
let startX = 0;
let startY = 0;
const TASKBAR_HEIGHT = 52;

// START selection
desktop.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;

    // Block selection on taskbar / menus
    if (
        menu.contains(e.target) ||
        document.getElementById("taskbar").contains(e.target)
    ) return;

    isSelecting = true;

    startX = e.clientX;
    startY = e.clientY;

    selectionBox.style.display = "block";
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = `0px`;
    selectionBox.style.height = `0px`;
});

// UPDATE selection
document.addEventListener("mousemove", (e) => {
    if (!isSelecting) return;

    const maxY = window.innerHeight - TASKBAR_HEIGHT;

    const currentX = e.clientX;
    const currentY = Math.min(e.clientY, maxY);

    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    selectionBox.style.left = `${x}px`;
    selectionBox.style.top = `${y}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
});

// END selection
document.addEventListener("mouseup", () => {
    if (!isSelecting) return;

    const selectionRect = selectionBox.getBoundingClientRect();

    desktopIcons.forEach(icon => {
        const iconRect = icon.getBoundingClientRect();

        const isIntersecting =
            selectionRect.left < iconRect.right &&
            selectionRect.right > iconRect.left &&
            selectionRect.top < iconRect.bottom &&
            selectionRect.bottom > iconRect.top;

        if (isIntersecting) {
            icon.classList.add("selected");
        }
    });

    isSelecting = false;
    selectionBox.style.display = "none";
});

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* ========================= */
/* DESKTOP ICON SELECTION */
/* ========================= */

const desktopIcons = document.querySelectorAll(".desktop-icon");

// Single click selection
desktopIcons.forEach(icon => {
    icon.addEventListener("click", (e) => {
        e.stopPropagation();

        // Clear previous selections
        desktopIcons.forEach(i => i.classList.remove("selected"));

        icon.classList.add("selected");
    });
});

// Click on empty desktop clears selection
desktop.addEventListener("click", () => {
    desktopIcons.forEach(i => i.classList.remove("selected"));
});

function setRecycleBinState(isEmpty) {
    const recycleIcon = document.querySelector(".recycle-bin img");

    recycleIcon.src = isEmpty
        ? recycleIcon.dataset.empty
        : recycleIcon.dataset.full;
}

setRecycleBinState(false); // shows full bin
setRecycleBinState(true);  // shows empty bin

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

/* ========================= */
/* Thinking of add a Notepad and a calculator */
/* ========================= */ 