"use strict";

const body = document.querySelector("body");
const countriesMain = document.querySelector(".countries__main");
const detailsMain = document.querySelector(".details__main");
const countriesItems = document.querySelector(".countries__items");
const detailsContainer = document.querySelector(".details__container");
const countriesSearch = document.querySelector(".countries__input");
const countriesMessage = document.querySelector(".countries__message");
const backButton = document.querySelector(".details__back-button");
const darkmodeToggle = document.querySelector(".header__button");
const filterContainer = document.querySelector(".countries__filter");
const filterDropdown = document.querySelector(".countries__filter-dropdown");

const API_URL = "https://restcountries.com/v3.1";

let state = {
  countries: [],
  codeToName: {},
  selectedCountry: "",
};

///////////////////////////
// Functions

const renderSpinner = function (location, status = "open") {
  const markup = `
  <div class="spinner">
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><style>.spinner_S1WN{animation:spinner_MGfb .8s linear infinite;animation-delay:-.8s}.spinner_Km9P{animation-delay:-.65s}.spinner_JApP{animation-delay:-.5s}@keyframes spinner_MGfb{93.75%,100%{opacity:.2}}</style><circle class="spinner_S1WN" cx="4" cy="12" r="3"/><circle class="spinner_S1WN spinner_Km9P" cx="12" cy="12" r="3"/><circle class="spinner_S1WN spinner_JApP" cx="20" cy="12" r="3"/></svg>
  </div>
  `;

  if (status === "open") {
    location.innerHTML = "";
    location.insertAdjacentHTML("beforeend", markup);
  } else {
    location.innerHTML = "";
  }
};

const getCountries = async function () {
  try {
    renderSpinner(countriesMessage);

    // Fetch Data
    const response = await fetch(`${API_URL}/all`);
    const data = await response.json();

    if (!response.ok)
      throw new Error(
        "Oops, page not found. Check your connection and try again... :("
      );

    // Sort Data
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

    // Update State
    state.countries = data.map((country) => {
      return {
        commonName: country.name.common,
        nativeName: country.name.nativeName
          ? Object.values(country.name.nativeName)[0].common
          : "No Native Name",
        population: new Intl.NumberFormat("en-US").format(+country.population),
        region: country.region,
        subregion: country.subregion ? country.subregion : "No Subregion",
        capital: country.capital ? country.capital[0] : "No Capital City",
        tld: country.tld
          ? country.tld.toString().replaceAll(",", ", ")
          : "No TLD",
        currencies: country.currencies
          ? Object.values(country.currencies)[0].name
          : "No Official Currency",
        languages: country.languages
          ? Object.values(country.languages).toString().replaceAll(",", ", ")
          : "No Official Language",
        flag: country.flags.svg,
        borders: country.borders,
      };
    });

    // Pair Country codes with names
    data.forEach((country) => {
      state.codeToName[country.cca3] = country.name.common;
    });

    // Render Countries
    renderCountries(state.countries);

    renderSpinner(countriesMessage, "close");
  } catch (err) {
    console.error(`${err} 💥`);
    renderError("Oops! Something went wrong... :(", countriesMessage);
  }
};

getCountries();

///////////////////////////
// Event Listeners

// Toggle Dark Mode
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

// Open country and get details
countriesItems.addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo(0, 0);

  state.selectedCountry = e.target.closest(".country").dataset.countryName;
  let [selectedCountryData] = state.countries.filter(
    (name) => name.commonName === state.selectedCountry
  );

  if (!selectedCountryData) return;

  renderCountryDetails(selectedCountryData);

  countriesMain.classList.toggle("hidden");
  detailsMain.classList.toggle("hidden");
});

// Open Border Countries
detailsContainer.addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo(0, 0);

  const detailsContent = document.querySelector(".details__content");
  state.selectedCountry = e.target.dataset.borderCountry;
  let [selectedCountryData] = state.countries.filter(
    (name) => name.commonName === state.selectedCountry
  );

  if (!selectedCountryData) return;

  detailsContent.parentNode.removeChild(detailsContent);
  renderCountryDetails(selectedCountryData);
});

// Return back to Main Page
backButton.addEventListener("click", function (e) {
  e.preventDefault();

  countriesSearch.value = "";
  countriesItems.innerHTML = "";
  renderCountries(state.countries);

  const detailsContent = document.querySelector(".details__content");

  detailsContent.parentNode.removeChild(detailsContent);
  countriesMain.classList.remove("hidden");
  detailsMain.classList.add("hidden");
});

// Search for Countries
countriesSearch.addEventListener("keyup", function () {
  let filteredCountries = [];

  filteredCountries.push(
    state.countries.filter((country) =>
      country.commonName
        .toLowerCase()
        .includes(countriesSearch.value.toLowerCase())
    )
  );

  countriesItems.innerHTML = "";
  countriesMessage.innerHTML = "";

  if (filteredCountries[0].length) {
    filteredCountries[0].forEach((country) => renderCountries([country]));
  } else {
    renderError(
      `Oops! No results for "${countriesSearch.value}", try again!`,
      countriesMessage
    );
  }
});

// Filter by Region
filterContainer.addEventListener("click", function (e) {
  e.preventDefault();

  filterDropdown.classList.toggle("hidden");

  const selectedRegion = e.target.dataset.region;
  let filteredCountries = [];

  if (!selectedRegion) return;

  if (selectedRegion === "All") {
    filteredCountries.push(state.countries);
  } else {
    filteredCountries.push(
      state.countries.filter((country) =>
        country.region.toLowerCase().includes(selectedRegion.toLowerCase())
      )
    );
  }

  countriesItems.innerHTML = "";
  filteredCountries.forEach((country) => renderCountries(country));
});

///////////////////////////
// Render Content
const renderCountries = function (countries) {
  let markup = "";

  countries.forEach((country) => {
    markup += `
    <article class="country" data-country-name="${country.commonName}" >
      <img class="country__img" src="${country.flag}" />
      <div class="country__data">
        <h3 class="country__name">${country.commonName}</h3>
        <p class="country__row"><strong>Population: </strong>${country.population}</p>
        <p class="country__row"><strong>Region: </strong>${country.region}</p>
        <p class="country__row"><strong>Capital: </strong>${country.capital}</p>
      </div>
    </article>
    `;
  });

  countriesItems.insertAdjacentHTML("beforeend", markup);
};

const renderCountryDetails = function (country) {
  const markup = `
  <div class="details__content">
      <img src="${country.flag}" alt="" class="details__img">
      <div>
          <h3 class="details__name">${country.commonName}</h3>
          <div class="details__columns">
              <div class="details__column">
                  <p class="details__row"><strong>Native Name: </strong>${
                    country.nativeName
                  }</p>
                  <p class="details__row"><strong>Population: </strong>${
                    country.population
                  }</p>
                  <p class="details__row"><strong>Sub Region: </strong>${
                    country.subregion
                  }
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
              <h3 class="details__border-label">Border Countries:</h3>
              <div class="details__neighbour-container">
              ${
                country.borders
                  ? country.borders
                      .map(
                        (border) =>
                          `<button class="details__neighbour" data-border-country="${state.codeToName[border]}">${state.codeToName[border]}</button>`
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

const renderError = function (message, location) {
  const markup = `
  <div class="error">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-1{fill:;opacity:0;}.cls-2{fill:;}</style></defs><title>alert-triangle</title><g id="Layer_2" data-name="Layer 2"><g id="alert-triangle"><g id="alert-triangle-2" data-name="alert-triangle"><rect class="cls-1" width="24" height="24" transform="translate(24 0) rotate(90)"/><path class="cls-2" d="M22.56,16.3,14.89,3.58a3.43,3.43,0,0,0-5.78,0L1.44,16.3a3,3,0,0,0-.05,3A3.37,3.37,0,0,0,4.33,21H19.67a3.37,3.37,0,0,0,2.94-1.66A3,3,0,0,0,22.56,16.3Zm-1.7,2.05a1.31,1.31,0,0,1-1.19.65H4.33a1.31,1.31,0,0,1-1.19-.65,1,1,0,0,1,0-1L10.82,4.62a1.48,1.48,0,0,1,2.36,0l7.67,12.72A1,1,0,0,1,20.86,18.35Z"/><circle class="cls-2" cx="12" cy="16" r="1"/><path class="cls-2" d="M12,8a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V9A1,1,0,0,0,12,8Z"/></g></g></g></svg>
    </div>
    <p>${message}</p>
  </div>
  `;

  location.innerHTML = "";
  location.insertAdjacentHTML("beforeend", markup);
};
