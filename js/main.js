// Toggle Dark/Light Theme
const themeToggles = document.querySelectorAll(".theme-toggle");
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
updateToggleIcons(savedTheme);
themeToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateToggleIcons(newTheme);
    });
});
function updateToggleIcons(theme) {
    themeToggles.forEach(toggle => {
        toggle.textContent = theme === "dark" ? "🌙" : "☀️";
    });
}

// Mobile Menu Toggle
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
});
document.addEventListener("click", (event) => {
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        mobileMenu.classList.remove("open");
    }
});

// Disable Links for Coming Soon Topics
const disabled = document.querySelectorAll("a.coming-soon");
disabled.forEach((element) => {
    element.addEventListener("click", (event) => {
        event.preventDefault();
    });
});