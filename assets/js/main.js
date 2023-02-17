let korpa = lsGet("korpa") == null ? [] : lsGet("korpa");

let cekiraniCat = [];
let cekiraniBrand = [];
let cekiraniDiscount = [];
let cekiraniShipping = [];
let proizvodiPoCeni = [];

//Elementi
let navLarge = document.querySelector("#navLarge");
let navSmall = document.querySelector("#navSmall");
let header = document.querySelector("header");
let categoryBlock = document.querySelector(".category");
let brandBlock = document.querySelector(".brand");
let productsBlock = document.querySelector(".products");
let sideMenu = document.querySelector(".side-bar");
let cartNum = document.querySelectorAll(".notify");
let productCt = document.querySelector(".productList");
let subTotalBlock = document.querySelector(".subtotalText");
let successBlock = document.querySelector(".done");
let bbs = document.querySelector(".swiper-wrapper");
let featureCt = document.querySelector(".feature-ct");
let recensionCt = document.querySelector(".recension");

let headerSection = document.querySelector(".header");
let recension = document.querySelector(".recension");
let rcBlock = document.querySelectorAll(".rc-block");
let categorySec = document.querySelector(".category-ct");

let moveRight = document.querySelector(".block-right");
let moveLeft = document.querySelector(".block-left");
let filterBtn = document.querySelector(".filter-icon-block");
let closeFilter = document.querySelector(".close-btn");

let discountCb = document.querySelector("#discountElement");
let freeShippCb = document.querySelector("#shippingCb");
let search = document.querySelector("#searchElement");
let range = document.querySelector("#range");
let sort = document.querySelector("#sortElement");
let dayDDL = document.querySelector("#day");
let monthDDL = document.querySelector("#month");
let yearDDL = document.querySelector("#year");

//add to cart funkcija
function addToCart(el) {
  let product = el.target.closest(".product");
  let productId = product.getAttribute("id");
  let proizvodi = lsGet("proizvodi");
  let choocenProduct = proizvodi.find((x) => x.id == productId);
  korpa.push(choocenProduct);
  lsSave("korpa", korpa);
  updateCart();
}

//add to cart from home page
function atcHome(el) {
  let product = el.target.closest(".b-seller");
  let productId = product.getAttribute("id");
  let proizvodi = lsGet("proizvodi");
  let choocenProduct = proizvodi.find((x) => x.id == productId);
  korpa.push(choocenProduct);
  lsSave("korpa", korpa);
  updateCart();
}

//Update Cart
function updateCart() {
  cartNum.forEach((cart) => {
    cart.innerHTML = lsGet("korpa") == null ? 0 : lsGet("korpa").length;
  });
}

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

function getNavigation() {
  //Navigacija
  let navAjax = fetch("assets/json/navigation.json")
    .then((response) => response.json())
    .then((data) => {
      ispisNavigacije(data);
    });
}

//Check page
let page = window.location.pathname;

//ispis Navigacije
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

window.addEventListener("load", function () {
  if (
    window.location.pathname.includes("index.html") ||
    window.location.pathname == "/"
  ) {
    //Navigacija
    getNavigation();

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

    //Best buy section
    fetch("assets/json/bestseller.json")
      .then((response) => response.json())
      .then((data) => ispisBestSellera(data));

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


    //Ispisivanje Kategorija HomePage
    let categoryAjax = fetch("assets/json/homePageCaregory.json")
      .then((response) => response.json())
      .then((data) => ispisKategorija(data));

    //Ispisivanje Features sekcije
    let features = ajaxCallBack("features.json", function (data) {
      ispisFeatures(data);
    });

    //Ispisivanje recenzija
    let recenzije = ajaxCallBack("recension.json", function (data) {
      ispisRecenzija(data);
    });

    //Funkcije

    function ispisRecenzija(recension) {
      recension.forEach((rec) => {
        recensionCt.innerHTML += `
        <div class="rc-block">
          <div class="upper-rc">
            <div class="img-rc"></div>
            <span>${rec.name}</span>
          </div>
          <div class="down-rc">
            <p>
            ${rec.message}
            </p>
          </div>
        </div>
        `;
      });

      //slider movment
      let rcBlock = document.querySelectorAll(".rc-block");
      let block = 0;
      let slider = 0;
      let size = rcBlock[0].getBoundingClientRect().width;

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
    }

    function ispisFeatures(features) {
      features.forEach((feature) => {
        featureCt.innerHTML += `
        <div class="feature">
            <img src="assets/img/${feature.img.src}" alt="${feature.img.alt}" />
            <h3>${feature.naziv}</h3>
            <p>${feature.description}</p>
          </div>`;
      });
    }

    function sliderMovement(block) {
      recension.style.transform = `translateX(-${block}px)`;
    }

    function ispisBestSellera(bestseller) {
      bestseller.forEach((bs) => {
        bbs.innerHTML += `
        <div class="b-seller swiper-slide" id="${bs.id}">
              <div class="bs-content">
                <div class="upper">
                  <div class="news">
                    <div class="new">
                      <span>New</span>
                    </div>
                    <div class="new new-2">
                      <span>New</span>
                    </div>
                  </div>
                  <h2>${proslediBrend(bs.idBrand)}</h2>
                  <h4 class="h4">${bs.naziv}</h4>
                  <span class="price">${bs.cena.aktuelnaCena}</span>
                </div>
                <div class="down">
                  <div class="cart">
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
                    <h4 class="h4">Add to cart</h4>
                  </div>
                </div>
              </div>
              <div class="bs-img">
                <img src="${bs.img.src}" alt="${bs.img.alt}" />
              </div>
            </div>`;
      });
      let atCart = document.querySelectorAll(".icon");
      atCart.forEach((el) => {
        el.addEventListener("click", (e) => {
          atcHome(e);
        });
      });
    }

    //Prikazi kategoriju pomocu izabranog id-a
    function proslediBrend(id) {
      let brendovi = fetch("assets/json/brand.json")
        .then((response) => response.json())
        .then((data) => {
          data.forEach((brand) => {
            if (brand.id == id) return brand.naziv;
          });
        });
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
      <a href="shop.html" class="btn-i btn-cat">Shop Now</a>
    </div>
  </div>`;
      }
    }
    updateCart();
  } else if (window.location.pathname.includes("shop.html")) {
    //Proizvodi
    let proizvodi = lsGet("proizvodi");
    //Ajax
    ajaxCallBack("kategorije.json", function (data) {
      ispisFiltera(data, categoryBlock, "kategorijeCt");
    });

    ajaxCallBack("brand.json", function (data) {
      ispisFiltera(data, brandBlock, "brendCt");
    });

    ajaxCallBack("proizvodi.json", function (data) {
      ispisProizvoda(data);
      lsSave("proizvodi", data);
    });
    ajaxCallBack("sortiranje.json", function (data) {
      ispisElemenataSortiranja(data);
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

    //Search
    search.addEventListener("blur", function (e) {
      e.preventDefault();
      let searchedProducts = [];
      const searchFilter = e.target.value.toLowerCase().trim();
      searchedProducts = proizvodi.filter((item) =>
        item.naziv.toLowerCase().includes(searchFilter)
      );
      ispisProizvoda(searchedProducts);
    });
    this.document.querySelector("#forma").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    //Discount option
    discountCb.addEventListener("change", (e) => {
      if (e.target.checked) {
        ShippDiscount("discount", cekiraniDiscount);
      } else cekiraniDiscount = [];
      konacniProizvodi();
    });

    //Free shipping
    freeShippCb.addEventListener("change", (e) => {
      if (e.target.checked) {
        ShippDiscount("FreeShipping", cekiraniShipping);
      } else cekiraniShipping = [];
      konacniProizvodi();
    });

    //Range price
    range.addEventListener("change", (e) => {
      proizvodiPoCeni = [];
      let cena = e.target.value;
      proizvodi.forEach((proizvod) => {
        if (proizvod.cena.aktuelnaCena < cena) {
          proizvodiPoCeni.push(proizvod.id);
        }
      });
      this.document.querySelector("#max").innerHTML = `${cena}$`;
      console.log(proizvodiPoCeni);
      konacniProizvodi();
    });

    // Sortiranje
    sort.addEventListener("change", konacniProizvodi);

    //Function
    function ispisElemenataSortiranja(elementi) {
      elementi.forEach((e) => {
        sort.innerHTML += `<option value="${e.vrednost}">${e.naziv}</option>`;
      });
    }

    function ShippDiscount(type, array) {
      proizvodi.forEach((proizvod) => {
        if (proizvod[type]) array.push(proizvod.id);
      });
    }

    function ispisFiltera(data, block, tip) {
      for (let d of data) {
        block.innerHTML += `
        <div class="${tip}">
        <input type="checkbox" name="${d.id}" id="${d.naziv}" />
        <label for="mice">${d.naziv}</label>
        </div>
    
    `;
      }
      let categoryCb = document.querySelectorAll(".kategorijeCt input");
      let brandCb = document.querySelectorAll(".brendCt input");
      if (tip == "kategorijeCt") {
        categoryCb.forEach((cat) => {
          cat.addEventListener("change", function (e) {
            let id = e.target.getAttribute("name");
            if (e.target.checked) {
              cekiraniCat.push(id);
            } else {
              cekiraniCat = cekiraniCat.filter((x) => x != id);
            }
            konacniProizvodi();

            // let zaIspis = FiltriranjeProizvoda(proizvodi, "kat", cekiraniCat);
            // ispisProizvoda(zaIspis);
            // let zaIspis = [];
            // cekirani.forEach((id) => {
            //   proizvodi.forEach((proizvod) => {
            //     if (!Array.isArray(proizvod.idCategory)) {
            //       proizvod.idCategory == id ? zaIspis.push(proizvod) : "";
            //     } else {
            //       proizvod.idCategory.forEach((nizKat) => {
            //         nizKat == id ? zaIspis.push(proizvod) : "";
            //       });
            //     }
            //   });
            // });
            // if (zaIspis.length != 0) {
            //   ispisProizvoda(zaIspis);
            // } else ispisProizvoda(proizvodi);
          });
        });
      } else {
        brandCb.forEach((brand) => {
          brand.addEventListener("change", function (e) {
            let id = e.target.getAttribute("name");
            if (e.target.checked) {
              cekiraniBrand.push(id);
            } else {
              cekiraniBrand = cekiraniBrand.filter((x) => x != id);
            }

            // let zaIspis = FiltriranjeProizvoda(proizvodi, "brand",  cekiraniBrand);
            konacniProizvodi();
            // ispisProizvoda(zaIspis);
          });
        });
      }
    }

    function konacniProizvodi() {
      let proizvodi = lsGet("proizvodi");
      proizvodi = FiltriranjeProizvoda(proizvodi, "kat", cekiraniCat);
      proizvodi = FiltriranjeProizvoda(proizvodi, "brand", cekiraniBrand);
      proizvodi = FiltriranjeProizvoda(proizvodi, "discount", cekiraniDiscount);
      proizvodi = FiltriranjeProizvoda(proizvodi, "shipping", cekiraniShipping);
      proizvodi = FiltriranjeProizvoda(proizvodi, "range", proizvodiPoCeni);
      proizvodi = sortiranjeProizvoda(proizvodi);
      ispisProizvoda(proizvodi);
    }

    function FiltriranjeProizvoda(proizvodi, tip, nizId) {
      let filtiraniPorizvodi = [];
      let property = null;
      if (tip == "kat") {
        property = "idCategory";
      }
      if (tip == "brand") {
        property = "idBrand";
      }
      if (tip == "discount" || tip == "shipping" || tip == "range") {
        nizId.forEach((id) => {
          proizvodi.forEach((proizvod) => {
            proizvod.id == id ? filtiraniPorizvodi.push(proizvod) : "";
          });
        });
      }

      if (nizId.length == 0) {
        filtiraniPorizvodi = proizvodi;
      } else {
        nizId.forEach((id) => {
          proizvodi.forEach((proizvod) => {
            if (!Array.isArray(proizvod[property])) {
              proizvod[property] == id ? filtiraniPorizvodi.push(proizvod) : "";
            } else {
              proizvod[property].forEach((nizKat) => {
                nizKat == id ? filtiraniPorizvodi.push(proizvod) : "";
              });
            }
          });
        });
      }
      return filtiraniPorizvodi;
    }

    function sortiranjeProizvoda(nizProizvoda) {
      let sortiraniProizvodi = [];
      let izabrano = sort.value;
      if (izabrano == 0) {
        sortiraniProizvodi = nizProizvoda;
      } else {
        sortiraniProizvodi = nizProizvoda.sort(function (a, b) {
          if (izabrano == "cena-rastuce") {
            return a.cena.aktuelnaCena - b.cena.aktuelnaCena;
          }
          if (izabrano == "cena-opadajuce") {
            return b.cena.aktuelnaCena - a.cena.aktuelnaCena;
          }
          if (izabrano == "naziv-rastuce") {
            if (a.naziv < b.naziv) {
              return -1;
            } else if (a.naziv > b.naziv) {
              return 1;
            } else {
              return 0;
            }
          }
          if (izabrano == "naziv-opadajuce") {
            if (a.naziv > b.naziv) {
              return -1;
            } else if (a.naziv < b.naziv) {
              return 1;
            } else {
              return 0;
            }
          }
        });
      }
      return sortiraniProizvodi;
    }

    function ispisProizvoda(proizvodi) {
      productsBlock.innerHTML = "";
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

    updateCart();
  } else if (window.location.pathname.includes("payment.html")) {
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

    //Navigacija
    getNavigation();

    //Update cart
    updateCart();

    //Show all products
    let allprod = lsGet("korpa");
    ispisProizvodaIzKorpe(allprod);

    //DDL for expiry date

    //day
    ddLista(dayDDL, 1, 31);
    ddLista(monthDDL, 1, 12);
    ddLista(yearDDL, 1980, 2030);

    //Regex for checkout form
    let mailRegex = /^[A-z0-9-\.]{3,30}@[a-z]{2,8}\.(com|rs)$/;
    let cvvRegex = /^[0-9]{3}$/;
    let addressReg = /^[A-z]{3,20}\s[0-9]{1,5}[A-z]*$/;
    let cardNumberRegex = /^[0-9]{4}[0-9]{4}[0-9]{4}[0-9]{4}$/;

    let phoneRegex = /^\+[0-9]{9,13}$/;
    let errors = [];
    console.log(monthDDL.selectedIndex);

    //Validate form

    let brojGresaka = 0;

    //phone
    let imgCard = document.querySelectorAll(".card-opt img");

    imgCard.forEach((img) => {
      img.addEventListener("click", function (e) {
        imgCard.forEach((img) => {
          img.classList.remove("selectedCard");
        });
        e.target.classList.add("selectedCard");
      });
    });
    let checkout = this.document.querySelector("#checkout");
    checkout.addEventListener("click", function () {
      brojGresaka = 0;

      //Choose card type
      for (let i = 0; i < imgCard.length; i++) {
        let parrent = imgCard[i].closest(".card-opt");
        let errors = parrent.querySelector(".errors");
        if (!imgCard[i].classList.contains("selectedCard")) {
          brojGresaka++;
          errors.textContent = `Please select card type`;
        } else {
          errors.textContent = ``;
          break;
        }
      }

      //validate card number
      validateForm(
        "Please enter right format for credit card",
        "#cardNum",
        cardNumberRegex
      );

      //validate day
      validateDDL(dayDDL, "day");
      //validate month
      validateDDL(monthDDL, "month");
      //validate year
      validateDDL(yearDDL, "year");
      //email validate
      validateForm(
        "Please enter correct email (jessica@gmai.com)",
        "#mail",
        mailRegex
      );

      //validate cvv

      //validate address
      validateForm(
        "Please enter your address like 'Street 29b'",
        "#adress",
        addressReg
      );

      //phone
      validateForm(
        "Phone needs to be formated like this '+38160452154'",
        "#phone",
        phoneRegex
      );

      //Radio btn
      let radioBtn = document.getElementsByName("type");
      for (let i = 0; i < radioBtn.length; i++) {
        let parret = radioBtn[i].closest(".single-option");
        let error = parret.querySelector(".errors");
        if (radioBtn[i].checked) {
          error.textContent = "";
          break;
        } else {
          error.textContent = "please choose customer type";
          brojGresaka++;
          console.log(errors);
        }
      }

      //Terms
      validateBox("#terms", "Please accept Terms of Use & Privacy Policy");
      console.log(brojGresaka);
      if (brojGresaka == 0) {
        successBlock.classList.add("success");
        setTimeout(function () {
          successBlock.classList.remove("success");
        }, 5000);
      }
    });

    //Funkcije

    function validateBox(id, message) {
      let cb = document.querySelectorAll(id);
      cb.forEach((e) => {
        let parret = e.closest(".single-option");
        let error = parret.querySelector(".errors");
        if (!e.checked) {
          error.textContent = message;
        } else {
          error.textContent = "";
        }
      });
    }
    function validateForm(message, id, regex) {
      let element = document.querySelector(id);
      let parret = element.closest(".single-option");
      let error = parret.querySelector(".errors");
      error.textContent = ``;
      if (!regex.test(element.value)) {
        error.textContent += message;
        brojGresaka++;
      } else {
        error.textContent = "";
      }
    }

    function validateDDL(el, message) {
      let parret = el.closest(".single-option");
      let error = parret.querySelector(".errors");
      if (el.selectedIndex == 0) {
        brojGresaka++;
        errors.push(`Please select ${message} from drop down list`);
        error.innerHTML += `<p>Please select ${message} from drop down list</p>`;
      } else {
        error.textContent = ``;
      }
    }

    function ddLista(id, numfrom, numto) {
      for (let i = numfrom; i <= numto; i++) {
        id.innerHTML += `<option value="day:${i}">${i}</option>`;
      }
    }

    function ispisProizvodaIzKorpe(proizvodi) {
      productCt.innerHTML = "";
      proizvodi.forEach((prod) => {
        productCt.innerHTML += `<div class="single-product" id="${prod.id}">
        <div class="prod-block">
          <div class="p-img-block">
            <img src="${prod.img.src}" alt="${prod.img.alt}" />
          </div>
          <div class="prod-name">
            <h3>${prod.naziv}</h3>
            <p>Earphones</p>
          </div>
        </div>
        <div class="prodLine"></div>
        <div class="prod-info-shipp">
          <h3>${prod.FreeShipping ? "Free shipping" : "5$"}</h3>
        </div>
        <div class="prodLine"></div>
        <div class="prod-count">
          <div class="circle">
            <a href="#" class="increase">+</a>
          </div>
          <p class="quantity">1</p>
          <div class="circle">
            <a href="" class="decrease">-</a>
          </div>
        </div>
        <div class="prodLine"></div>
        <div class="prod-price">
          <p>Price:</p>
          <strong class="price">${prod.cena.aktuelnaCena}$</strong>
        </div>
        <div class="removeProduct">
          <p class="remove">x</p>
        </div>
      </div>`;
      });

      //Remove Product
      let removeBtn = this.document.querySelectorAll(".remove");
      removeListener(removeBtn);

      //increase quantity
      let increase = document.querySelectorAll(".increase");
      increaseQuantity(increase);

      //decreace quantity
      let decrease = document.querySelectorAll(".decrease");
      decreseQuantity(decrease);
    }

    //Remove product function
    function removeListener(removeBtn) {
      removeBtn.forEach((remove) => {
        remove.addEventListener("click", function (e) {
          let proizvodiIzKorpe = lsGet("korpa");
          let currentProduct = e.target.closest(".single-product");
          let currentProductId = currentProduct.getAttribute("id");
          let afterRemove = [];
          proizvodiIzKorpe.forEach((prod) => {
            if (prod.id != currentProductId) afterRemove.push(prod);
          });
          lsSave("korpa", afterRemove);

          ispisProizvodaIzKorpe(afterRemove);
          updateCart();
          subTotal();
        });
      });
    }

    //Increase quantity function
    function increaseQuantity(increaseBtn) {
      increaseBtn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          changeQuantity(e, "increase");
        });
      });
    }

    //Decrease quantity function
    function decreseQuantity(decreseBtn) {
      decreseBtn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          changeQuantity(e, "decrease");
        });
      });
    }

    function changeQuantity(e, type) {
      e.preventDefault();
      let currentProduct = e.target.closest(".single-product");
      let quantity = currentProduct.querySelector(".quantity");
      let quantityNum = quantity.innerHTML;
      quantityNum = parseInt(quantityNum);
      if (type == "increase") quantityNum++;
      else if (type == "decrease") {
        if (quantityNum <= 0) {
          quantityNum = 0;
          return;
        }
        quantityNum--;
      }
      quantity.innerHTML = quantityNum;
      subTotal();
    }

    function subTotal() {
      let sum = 0;
      let proizvodi = document.querySelectorAll(".single-product");
      proizvodi.forEach((proizvod) => {
        let shipping = proizvod.querySelector(
          ".prod-info-shipp h3"
        ).textContent;

        let quantity = proizvod.querySelector(".quantity").innerHTML;
        quantity = parseInt(quantity);
        let productPrice = proizvod.querySelector(".price").innerHTML;
        productPrice = productPrice.substring(0, productPrice.length - 1);
        productPrice = Number(productPrice);
        sum += productPrice * quantity;
        shipping != "Free shipping" ? (sum += 5) : "";
      });
      subTotalBlock.innerHTML = `${sum}$`;
    }
    subTotal();
  }
});
