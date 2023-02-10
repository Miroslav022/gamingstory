let categoryBlock = document.querySelector(".category");
let brandBlock = document.querySelector(".brand");
let productsBlock = document.querySelector(".products");
let sideMenu = document.querySelector(".side-bar");

let filterBtn = document.querySelector(".filter-icon-block");
let closeFilter = document.querySelector(".close-btn");

//Ajax
let catAjax = fetch("assets/json/kategorije.json")
  .then((response) => response.json())
  .then((data) => ispiskategorija(data, categoryBlock));

let brandAjax = fetch("assets/json/brand.json")
  .then((response) => response.json())
  .then((data) => ispiskategorija(data, brandBlock));
let productsAjax = fetch("assets/json/proizvodi.json")
  .then((respone) => respone.json())
  .then((data) => ispisProizvoda(data));

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
    productsBlock.innerHTML += `<div class="product">
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
}
