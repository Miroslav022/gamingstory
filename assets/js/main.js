//Elementi
let navLarge = document.querySelector("#navLarge");
let navSmall = document.querySelector("#navSmall");
let header = document.querySelector("header");
let categoryBlock = document.querySelector(".category");
let brandBlock = document.querySelector(".brand");
let productsBlock = document.querySelector(".products");
let sideMenu = document.querySelector(".side-bar");
let cartNum = document.querySelector(".notify");

let headerSection = document.querySelector(".header");
let recension = document.querySelector(".recension");
let rcBlock = document.querySelectorAll(".rc-block");
let categorySec = document.querySelector(".category-ct");

let moveRight = document.querySelector(".block-right");
let moveLeft = document.querySelector(".block-left");
let filterBtn = document.querySelector(".filter-icon-block");
let closeFilter = document.querySelector(".close-btn");

//AJAX callback
const BASEURL = "assets/json/";
function ajaxCallBack(file, data) {
  $.ajax({
    url: BASEURL + file,
    method: "get",
    dataType: "json",
    success: data,
    error: function (jqXHR, exception) {
      // console.log(jqXHR);
      var msg = "";
      if (jqXHR.status === 0) {
        msg = "Not connect.\n Verify Network.";
      } else if (jqXHR.status == 404) {
        msg = "Requested page not found. [404]";
      } else if (jqXHR.status == 500) {
        msg = "Internal Server Error [500].";
      } else if (exception === "parsererror") {
        msg = "Requested JSON parse failed.";
      } else if (exception === "timeout") {
        msg = "Time out error.";
      } else if (exception === "abort") {
        msg = "Ajax request aborted.";
      } else {
        msg = "Uncaught Error.\n" + jqXHR.responseText;
      }
      alert(msg);
    },
  });
}

//Local Storage
function lsSave(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

function lsGet(name) {
  return JSON.parse(localStorage.getItem(name));
}

//update cart
function updateCart() {
  cartNum.innerHTML = lsGet("korpa").length;
}

//Check page
let page = window.location.pathname;
console.log(page);

window.addEventListener("load", function () {
  if (
    window.location.pathname.includes("index.html") ||
    window.location.pathname == "/"
  ) {
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
    updateCart();
  } else if (window.location.pathname.includes("shop.html")) {
    let proizvodi = [];

    //Ajax

    ajaxCallBack("kategorije.json", function (data) {
      ispiskategorija(data, categoryBlock);
    });

    ajaxCallBack("brand.json", function (data) {
      ispiskategorija(data, brandBlock);
    });

    ajaxCallBack("proizvodi.json", function (data) {
      ispisProizvoda(data);
      lsSave("proizvodi", data);
    });

    //Open side menu
    filterBtn.addEventListener("click", function (e) {
      e.preventDefault();
      sideMenu.classList.remove("side-bar-none");
    });
    closeFilter.addEventListener("click", function (e) {
      e.preventDefault();
      sideMenu.classList.add("side-bar-none");
    });

    //Functions
    function ispiskategorija(data, block) {
      for (let d of data) {
        block.innerHTML += `
        <div class="filter-block">
        <input type="checkbox" name="${d.id}" id="${d.naziv}" />
        <label for="mice">${d.naziv}</label>
        </div>
    
    `;
      }
    }

    function ispisProizvoda(proizvodi) {
      for (let proizvod of proizvodi) {
        productsBlock.innerHTML += `<div class="product" id="${proizvod.id}">
    <div class="freeShip ${proizvod.FreeShipping ? "" : "none"}">
      <p>Free Shipp</p>
    </div>
    <div class="discount ${proizvod.discount ? "" : "none"}">
      <p>Discount</p>
    </div>
    <div class="imgBlock">
      <img src="${proizvod.img.src}" alt="${proizvod.img.alt}" />
    </div>
    <div class="prodBrand"><h3>${proizvod.naziv}</h3></div>
    <div class="prodFt">
      <ul>
        <li>Stellar Wireless Bluetooth®</li>
        <li>Precision-tuned 6mm driver units</li>
        <li>60ms low-latency mode for gaming</li>
      </ul>
    </div>
    <div class="price-shop">
      
      <div class="price-discount">
                <p class="prodPrice">${proizvod.cena.aktuelnaCena}$</p>
                <del class="deletedPrice ${proizvod.discount ? "" : "none"}">${
          proizvod.cena.staraCena
        }$</del>
              </div>
      <div class="icon">
        <svg
          width="24px"
          height="24px"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="#000000"
        >
          <path
            d="M3 6h19l-3 10H6L3 6zm0 0l-.75-2.5M9.992 11h2m2 0h-2m0 0V9m0 2v2M11 19.5a1.5 1.5 0 01-3 0M17 19.5a1.5 1.5 0 01-3 0"
            stroke="#000000"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </div>
    </div>
  </div>`;
      }
      let atCart = document.querySelectorAll(".icon");
      atCart.forEach((el) => {
        el.addEventListener("click", (e) => {
          addToCart(e);
        });
      });
    }

    let korpa = lsGet("korpa");
    function addToCart(el) {
      let product = el.target.closest(".product");
      let productId = product.getAttribute("id");
      let proizvodi = lsGet("proizvodi");
      let choocenProduct = proizvodi.find((x) => x.id == productId);
      korpa.push(choocenProduct);
      lsSave("korpa", korpa);
      updateCart();
    }

    updateCart();
  }
});
