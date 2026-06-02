// Grab the toggle button and the HTML element
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// 1. Check local storage on load to set initial state
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
} else {
    htmlElement.classList.remove('dark');
}

// 2. Add an event listener to the toggle button
themeToggleBtn.addEventListener('click', () => {
    // Toggle the 'dark' class on the <html> tag
    htmlElement.classList.toggle('dark');

    // Update localStorage so the preference is saved for their next visit
    if (htmlElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});