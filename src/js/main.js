//Menu Mobile
const menuBtn = document.querySelector('.menu-btn');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');

menuBtn.addEventListener("click", function() {
    mainNav.classList.toggle('active');
    
    const isMenuOpen = mainNav.classList.contains('active');
    menuBtn.setAttribute("aria-expanded", isMenuOpen);

});

navLinks.forEach((link) => {
    link.addEventListener("click", function() {
        mainNav.classList.remove('active');
        menuBtn.setAttribute("aria-expanded", "false");
    })
});

//Close menu with escape
document.addEventListener("keydown", function(event) {
    if(event.key === "Escape") {
       mainNav.classList.remove('active');
       menuBtn.setAttribute("aria-expanded", "false"); 
    }
});