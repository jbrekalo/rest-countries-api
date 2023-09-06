"use strict";

const body = document.querySelector("body");
const countriesMain = document.querySelector(".countries__main");
const detailsMain = document.querySelector(".details__main");
const countriesContainer = document.querySelector(".countries__items");
const detailsContainer = document.querySelector(".details__container");
// const countries = document.querySelectorAll(".country");
const darkmodeToggle = document.querySelector(".header__button");
const darkmodeIcon = document.querySelector(".header__button-icon");
const filterContainer = document.querySelector(".countries__filter");
const filterButton = document.querySelector(".countries__filter-button");
const filterDropdown = document.querySelector(".countries__filter-dropdown");

darkmodeToggle.addEventListener("click", (e) => {
  e.preventDefault();
  if (body.dataset.theme === "dark") {
    body.removeAttribute("data-theme", "dark");
    body.setAttribute("data-theme", "light");
  } else {
    body.removeAttribute("data-theme", "light");
    body.setAttribute("data-theme", "dark");
  }
});

filterContainer.addEventListener("click", function (e) {
  e.preventDefault();
  filterDropdown.classList.toggle("hidden");
});

countriesContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const countries = document.querySelectorAll(".country");
  const clicked = e.target.closest(".country");

  if (!clicked) return;

  countriesMain.classList.add("hidden");

  //   countries.forEach((c) => c.classList.add("hidden"));

  console.log(clicked);
});

const getCountries = async function () {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();
  console.log(data);

  data.forEach((country) => {
    renderCountries(country);
  });
};

getCountries();

const renderCountries = function (country) {
  const markup = `
  <article class="country" href="#${country.name.common}" >
  <img class="country__img" src="${country.flags.png}" />
  <div class="country__data">
    <h3 class="country__name">${country.name.common}</h3>
    <p class="country__row"><strong>Population: </strong>${new Intl.NumberFormat(
      "de-DE"
    ).format(+country.population)}</p>
    <p class="country__row"><strong>Region: </strong>${country.region}</p>
    <p class="country__row"><strong>Capital: </strong>${country.capital}</p>
  </div>
</article>
  `;

  countriesContainer.insertAdjacentHTML("beforeend", markup);

  // if (country )
};

const renderCountryDetails = function () {
  const markup = `
  <div class="details__content">
                <img src="img/flag.png" alt="" class="details__img">
                <div>
                    <h3 class="details__name">Country</h3>
                    <div class="details__columns">
                        <div class="details__column">
                            <p class="details__row"><strong>Native Name: </strong>City</p>
                            <p class="details__row"><strong>Population: </strong>1,000,000</p>
                            <p class="details__row"><strong>Region: </strong>Europe</p>
                            <p class="details__row"><strong>Sub Region: </strong>City</p>
                            <p class="details__row"><strong>Capital: </strong>City</p>
                        </div>
                        <div class="details__column">
                            <p class="details__row"><strong>Top Level Domain: </strong>1,000,000</p>
                            <p class="details__row"><strong>Currencies: </strong>Europe</p>
                            <p class="details__row"><strong>Languages: </strong>City</p>
                        </div>
                    </div>
                    <div class="details__border-container">
                        <h3 class="details__border-label">Border Countries:</h3><button class="details__neighbour">France</button>
                    </div>
                </div>
            </div>
  `;

  detailsContainer.insertAdjacentHTML("beforeend", markup);
};
