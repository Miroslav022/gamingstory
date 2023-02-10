//Elementi
let navLarge = document.querySelector("#navLarge");
let navSmall = document.querySelector("#navSmall");
let header = document.querySelector("header");

let headerSection = document.querySelector(".header");
let recension = document.querySelector(".recension");
let rcBlock = document.querySelectorAll(".rc-block");
let categorySec = document.querySelector(".category-ct");

let moveRight = document.querySelector(".block-right");
let moveLeft = document.querySelector(".block-left");

window.addEventListener("load", function () {
  //Navigacija
  let navAjax = fetch("assets/json/navigation.json")
    .then((response) => response.json())
    .then((data) => {
      ispisNavigacije(data);
    });

  //Sticky navigation (Intersection API)
  function stickyNav(entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      header.classList.add("sticky");
    } else header.classList.remove("sticky");
  }
  let headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
  });
  headerObserver.observe(headerSection);

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

  let block = 0;
  let slider = 0;
  let size = rcBlock[0].getBoundingClientRect().width;
  //Recension movement
  moveRight.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(size);
    if (slider < rcBlock.length - 1) {
      block += size + 16;
      sliderMovement(block);
      slider++;
    }
  });

  moveLeft.addEventListener("click", function (e) {
    e.preventDefault();
    if (slider != 0) {
      block -= size + 16;
      sliderMovement(block);
      slider--;
    } else slider = 0;
  });

  function sliderMovement(block) {
    recension.style.transform = `translateX(-${block}px)`;
  }

  //Ispisivanje Kategorija HomePage
  let categoryAjax = fetch("assets/json/homePageCaregory.json")
    .then((response) => response.json())
    .then((data) => ispisKategorija(data));

  //Funkcije
  function ispisNavigacije(navigacija) {
    let SiteLocation = window.location.pathname;
    SiteLocation = SiteLocation.substring(1);
    for (let x of navigacija) {
      navLarge.insertAdjacentHTML(
        "afterbegin",
        `<li><a href="${x.href}" class="${
          x.href == SiteLocation ? "active" : ""
        }">${x.name}</a></li>`
      );
      navSmall.insertAdjacentHTML(
        "afterbegin",
        `<li><a href="${x.href}" class="${
          x.href == SiteLocation ? "active" : ""
        }">${x.name}</a></li>`
      );
    }
  }

  function ispisKategorija(kategorije) {
    for (let kategorija of kategorije) {
      categorySec.innerHTML += `<div class="md middle-upper ${
        kategorija.wmark == "Mousepad" ? "diff-right" : ""
      } ${kategorija.wmark == "Keyboard" ? "diff-left" : ""}">
      <div class="lt-middle">
        <img src="${kategorija.img}" alt="" />
        <p class="wMark">${kategorija.wmark}</p>
      </div>
      <div class="rt-middle">
        <h3 class="cat-h3">${kategorija.naziv}</h3>
        <a href="" class="btn-i btn-cat">Shop Now</a>
      </div>
    </div>`;
    }
  }
});
