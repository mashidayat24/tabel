function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const sideMenu = document.querySelector('.side-menu');
    const overlay = document.querySelector('.overlay');
    
    hamburger.classList.toggle('active');
    sideMenu.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeMenu() {
    const hamburger = document.querySelector('.hamburger');
    const sideMenu = document.querySelector('.side-menu');
    const overlay = document.querySelector('.overlay');
    
    hamburger.classList.remove('active');
    sideMenu.classList.remove('active');
    overlay.classList.remove('active');
}

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    // Close menu
    closeMenu();
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const sideMenu = document.querySelector('.side-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (!sideMenu.contains(event.target) && !hamburger.contains(event.target)) {
        closeMenu();
    }
});
