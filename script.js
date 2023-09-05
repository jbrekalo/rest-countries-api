"use strict";

const body = document.querySelector("body");
const countriesContainer = document.querySelector(".countries__items");
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

const getCountries = async function () {
  const response = await fetch("data.json");
  const data = await response.json();

  data.forEach((country) => {
    renderCountries(country);
  });
};

getCountries();

const renderCountries = function (country) {
  const markup = `
  <article class="country">
  <img class="country__img" src="${country.flag}" />
  <div class="country__data">
    <h3 class="country__name">${country.name}</h3>
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
