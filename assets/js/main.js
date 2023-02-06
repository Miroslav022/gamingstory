//Hamburger menu
let hamburger = document.querySelector(".menu-btn");
let sideMenu = document.querySelector(".side-menu");
hamburger.addEventListener("click", function (e) {
  e.preventDefault();

  if (hamburger.classList.contains("open")) {
    hamburger.classList.remove("open");
    sideMenu.classList.add("none");
  } else {
    hamburger.classList.add("open");
    sideMenu.classList.remove("none");
  }
});

// Best buy section slider
const swiper = new Swiper(".swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});
