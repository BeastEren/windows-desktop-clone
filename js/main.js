const desktop = document.getElementById("desktop");
const menu = document.getElementById("context-menu");

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    // Only show menu when clicking desktop, not icons or taskbar
    if (e.target === desktop) {
        menu.style.display = "block";
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
    }
    else {
        menu.style.display = "none";
    }
});

// Hide menu on left-click
document.addEventListener("click", () => {
    menu.style.display = "none";
});
