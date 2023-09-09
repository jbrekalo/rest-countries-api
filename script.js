"use strict";

const body = document.querySelector("body");
const countriesMain = document.querySelector(".countries__main");
const detailsMain = document.querySelector(".details__main");
const countriesItems = document.querySelector(".countries__items");
const detailsContainer = document.querySelector(".details__container");
const countriesSearch = document.querySelector(".countries__input");
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

const getCountries = async function () {
  // Fetch Data
  const response = await fetch(`${API_URL}/all`);
  const data = await response.json();

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
      population: new Intl.NumberFormat("de-DE").format(+country.population),
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
      flag: country.flags.png,
      borders: country.borders,
    };
  });

  // Pair Country codes with names
  data.forEach((country) => {
    state.codeToName[country.cca3] = country.name.common;
  });

  // Render Countries
  renderCountries(state.countries);
};

getCountries();

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

countriesItems.addEventListener("click", function (e) {
  e.preventDefault();
  state.selectedCountry = e.target.closest(".country").dataset.countryName;
  let [selectedCountryData] = state.countries.filter(
    (name) => name.commonName === state.selectedCountry
  );

  if (!selectedCountryData) return;

  renderCountryDetails(selectedCountryData);

  countriesMain.classList.toggle("hidden");
  detailsMain.classList.toggle("hidden");
});

detailsContainer.addEventListener("click", function (e) {
  e.preventDefault();

  const detailsContent = document.querySelector(".details__content");
  let [selectedCountryData] = state.countries.filter(
    (name) => name.commonName === state.selectedCountry
  );

  if (!selectedCountryData) return;

  detailsContent.parentNode.removeChild(detailsContent);
  renderCountryDetails(selectedCountryData);
});

backButton.addEventListener("click", function (e) {
  e.preventDefault();

  const detailsContent = document.querySelector(".details__content");

  detailsContent.parentNode.removeChild(detailsContent);
  countriesMain.classList.remove("hidden");
  detailsMain.classList.add("hidden");
});

countriesSearch.addEventListener("keyup", function () {
  let filteredCountries = [];

  filteredCountries.push(
    state.countries.filter((country) =>
      country.name.common
        .toLowerCase()
        .includes(countriesSearch.value.toLowerCase())
    )
  );

  countriesItems.innerHTML = "";
  filteredCountries[0].forEach((country) => renderCountries(country));
});

filterContainer.addEventListener("click", function (e) {
  e.preventDefault();

  filterDropdown.classList.toggle("hidden");

  const selectedRegion = e.target.dataset.region;

  if (!selectedRegion) return;

  let filteredCountries = [];

  filteredCountries.push(
    state.countries.filter((country) =>
      country.region.toLowerCase().includes(selectedRegion.toLowerCase())
    )
  );

  countriesItems.innerHTML = "";
  filteredCountries[0].forEach((country) => renderCountries(country));
});

// const getCountryDetails = async function (selectedCountry) {
//   const response = await fetch(
//     `${API_URL}/name/${selectedCountry}?fullText=true`
//   );
//   const data = await response.json();

//   renderCountryDetails(data[0]);
// };

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
