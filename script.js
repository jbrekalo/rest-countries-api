"use strict";

const body = document.querySelector("body");
const countriesMain = document.querySelector(".countries__main");
const detailsMain = document.querySelector(".details__main");
const countriesContainer = document.querySelector(".countries__items");
const detailsContainer = document.querySelector(".details__container");
const darkmodeToggle = document.querySelector(".header__button");
const darkmodeIcon = document.querySelector(".header__button-icon");
const filterContainer = document.querySelector(".countries__filter");
const filterButton = document.querySelector(".countries__filter-button");
const filterDropdown = document.querySelector(".countries__filter-dropdown");
let countries;
let selectedCountry;

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
  const selectedCountry = e.target.closest(".country").dataset.countryName;

  if (!selectedCountry) return;

  getCountryDetails(selectedCountry);

  countriesMain.classList.toggle("hidden");
  detailsMain.classList.toggle("hidden");

  console.log(selectedCountry);
});

const getCountries = async function () {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();
  console.log(data);

  data.forEach((country) => {
    renderCountries(country);
  });

  // if (data) {
  //   countries = countriesContainer.querySelectorAll(".country");
  //   moreDetails(countries);
  // }
};

getCountries();

// function moreDetails(array) {
//   console.log(array);
//   array.forEach((item) => {
//     item.addEventListener("click", () => {
//       detailCountry = item.dataset.countryName.toLocaleLowerCase().trim();
//       console.log(detailCountry);
//     });
//   });
// }

const getCountryDetails = async function (selectedCountry) {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${selectedCountry}`
  );
  const data = await response.json();

  renderCountryDetails(data[0]);
};

const renderCountries = function (country) {
  const markup = `
  <article class="country" data-country-name="${country.name.common}" >
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
};

const renderCountryDetails = function (country) {
  const markup = `
            <div class="details__content">
                <img src="${country.flags.png}" alt="" class="details__img">
                <div>
                    <h3 class="details__name">${country.name.common}</h3>
                    <div class="details__columns">
                        <div class="details__column">
                            <p class="details__row"><strong>Native Name: </strong>${
                              country.name.nativeName
                            }</p>
                            <p class="details__row"><strong>Population: </strong>${new Intl.NumberFormat(
                              "de-DE"
                            ).format(+country.population)}</p>
                            <p class="details__row"><strong>Region: </strong>${
                              country.region
                            }</p>
                            <p class="details__row"><strong>Sub Region: </strong>${
                              country.subregion
                            }</p>
                            <p class="details__row"><strong>Capital: </strong>${
                              country.capital
                            }</p>
                        </div>
                        <div class="details__column">
                            <p class="details__row"><strong>Top Level Domain: </strong>${
                              country.tld
                            }</p>
                            <p class="details__row"><strong>Currencies: </strong>${
                              country.currencies
                            }</p>
                            <p class="details__row"><strong>Languages: </strong>${
                              country.languages
                            }</p>
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
