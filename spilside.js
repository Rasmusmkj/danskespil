"use strict";

//------- SKAL ARBEJDES VIDERE PÅ SENERE
// window.addEventListener("DOMContentLoaded", getJson);

// // this function gets the json-file from the DB and then displayes the data in the html DOM
// function getJson() {
//   fetch("https://danskespil-cd72.restdb.io/rest/danskespil", {
//     method: "get",
//     headers: {
//       "Content-Type": "application/json; charset=utf-8",
//       "x-apikey": "5ce28dfc780a473c8df5c9cc",
//       "cache-control": "no-cache"
//     }
//   })
//     .then(getJson => getJson.json())
//     .then(getJson => {
//       getJson.forEach(showPerson);
//       //   console.log(getJson);
//     });
// }
// const form = document.querySelector("form");

// function showPerson(name) {
//   const template = document.querySelector("template").content;
//   const clone = template.cloneNode(true);
//   clone.querySelector("h1").textContent = name.fullname;
//   document.querySelector("main").appendChild(clone);
//   console.log(name);
// }

window.addEventListener("DOMContentLoaded", loadSVG);

// ---- LOADER SVG'EN
function loadSVG() {
  fetch("svg/pirategame.svg")
    .then(response => response.text())
    .then(svgdata => {
      document
        .querySelector("#svg_pirategame")
        .insertAdjacentHTML("afterbegin", svgdata);
      console.log(document.querySelector("#svg_pirategame"));
    });
}
