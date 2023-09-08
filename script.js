"use strict";

const body = document.querySelector("body");
const countriesMain = document.querySelector(".countries__main");
const detailsMain = document.querySelector(".details__main");
const countriesContainer = document.querySelector(".countries__items");
const detailsContainer = document.querySelector(".details__container");
const countriesSearch = document.querySelector(".countries__input");
const backButton = document.querySelector(".details__back-button");
const darkmodeToggle = document.querySelector(".header__button");
const filterContainer = document.querySelector(".countries__filter");
const filterButton = document.querySelector(".countries__filter-button");
const filterDropdown = document.querySelector(".countries__filter-dropdown");

let state = {
  query: "",
  countries: [],
  codeToName: {},
  selectedCountry: "",
};

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
});

detailsContainer.addEventListener("click", function (e) {
  // e.preventDefault();

  const detailsContent = document.querySelector(".details__content");
  const selectedCountry = e.target.closest(".details__neighbour").innerHTML;

  if (!selectedCountry) return;

  detailsContent.parentNode.removeChild(detailsContent);
  getCountryDetails(selectedCountry);
});

backButton.addEventListener("click", function (e) {
  e.preventDefault();

  const detailsContent = document.querySelector(".details__content");

  detailsContent.parentNode.removeChild(detailsContent);
  countriesMain.classList.remove("hidden");
  detailsMain.classList.add("hidden");
});

countriesSearch.addEventListener("keyup", function () {
  // getCountries(countriesSearch.value, false);
  let filteredCountries = [];

  filteredCountries.push(
    state.countries.filter((country) =>
      country.name.common
        .toLowerCase()
        .includes(countriesSearch.value.toLowerCase())
    )
  );

  console.log(filteredCountries[0]);
});

const getCountries = async function (query, getData = true) {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();

  data.sort((a, b) => {
    const country1 = a.name.common;
    const country2 = b.name.common;

    if (country1 < country2) {
      return -1;
    }
    if (country1 > country2) {
      return 1;
    }

    return 0;
  });

  console.log(data);

  data.forEach((country, i) => {
    state.countries[i] = country;
    state.codeToName[country.cca3] = country.name.common;
    renderCountries(country);
  });
};

getCountries();

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
              <div class="details__neighbour-container">
              ${
                country.borders
                  ? country.borders
                      .map(
                        (border) =>
                          `<button class="details__neighbour">${state.codeToName[border]}</button>`
                      )
                      .join("")
                  : `<p class="details__no-border">There are no bordering countries.</p>`
              }      
              </div>   
          </div>
      </div>
  </div>
  `;

  detailsContainer.insertAdjacentHTML("beforeend", markup);
};
