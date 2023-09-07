"use strict";

const body = document.querySelector("body");
const countriesMain = document.querySelector(".countries__main");
const detailsMain = document.querySelector(".details__main");
const countriesContainer = document.querySelector(".countries__items");
const detailsContainer = document.querySelector(".details__container");
const backButton = document.querySelector(".details__back-button");
const darkmodeToggle = document.querySelector(".header__button");
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
  // e.preventDefault();
  const selectedCountry = e.target.closest(".country").dataset.countryName;

  if (!selectedCountry) return;

  getCountryDetails(selectedCountry);

  countriesMain.classList.toggle("hidden");
  detailsMain.classList.toggle("hidden");

  console.log(selectedCountry);
});

backButton.addEventListener("click", function (e) {
  e.preventDefault();

  const detailsContent = document.querySelector(".details__content");

  detailsContent.parentNode.removeChild(detailsContent);
  countriesMain.classList.remove("hidden");
  detailsMain.classList.add("hidden");
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

const getCountryDetails = async function (selectedCountry) {
  const response = await fetch(
    `https://restcountries.com/v3.1/name/${selectedCountry}`
  );
  const data = await response.json();

  console.log(data[0]);
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
  const borderContainer = document.querySelector("details__border-container");
  console.log(country);
  const markup = `
  <div class="details__content">
      <img src="${country.flags.png}" alt="" class="details__img">
      <div>
          <h3 class="details__name">${country.name.common}</h3>
          <div class="details__columns">
              <div class="details__column">
                  <p class="details__row"><strong>Native Name: </strong>${
                    Object.values(country.name.nativeName)[0].common
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
                    Object.values(country.currencies)[0].name
                  }</p>
                  <p class="details__row"><strong>Languages: </strong>${Object.values(
                    country.languages
                  )
                    .toString()
                    .replaceAll(",", ", ")}</p>
              </div>
          </div>
          <div class="details__border-container">
              <h3 class="details__border-label">Border Countries:</h3>
              ${country.borders
                .map(
                  (border) =>
                    `<button class="details__neighbour">${border}</button>`
                )
                .join("")}         
          </div>
      </div>
  </div>
  `;

  detailsContainer.insertAdjacentHTML("beforeend", markup);
};
