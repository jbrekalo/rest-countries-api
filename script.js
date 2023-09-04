"use strict";

const body = document.querySelector("body");
const darkmodeToggle = document.querySelector(".header__button");
const filterButton = document.querySelector(".countries__filter");
const filterDropdown = document.querySelector(".countries__filter-dropdown");
const darkmodeIcon = document.querySelector(".header__button-icon");

const countriesContainer = document.querySelector(".countries__items");

darkmodeToggle.addEventListener("click", (e) => {
  e.preventDefault();
  if (body.dataset.theme === "dark") {
    body.removeAttribute("data-theme", "dark");
    body.setAttribute("data-theme", "light");
    darkmodeIcon.lastElementChild.attributes.fill.value = "none";
    darkmodeIcon.lastElementChild.style.stroke = "black";
  } else {
    body.removeAttribute("data-theme", "light");
    body.setAttribute("data-theme", "dark");
    darkmodeIcon.lastElementChild.attributes.fill.value = "white";
    darkmodeIcon.lastElementChild.style.stroke = "white";
  }
});

filterButton.addEventListener("click", function (e) {
  e.preventDefault();
  filterDropdown.classList.toggle("hidden");
});

const getCountries = async function () {
  const response = await fetch("data.json");
  const data = await response.json();

  data.forEach((country) => {
    console.log(country);
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
