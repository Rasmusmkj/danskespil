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

let angle; // vinklen på kanonen

// ---- LOADER SVG'EN
function loadSVG() {
  fetch("svg/pirategame.svg")
    .then(response => response.text())
    .then(svgdata => {
      document
        .querySelector("#svg_pirategame")
        .insertAdjacentHTML("afterbegin", svgdata);
      initSVG();
    });
}

function initSVG() {
  findAngle(); // til at finde vinklen på kanonen.

  // Når der bliver klikket på kannonen:
  document.querySelector("#cannon").addEventListener("click", () => {
    // Finder den nuværende vinkel.
    findAngle();

    console.log(angle);
  });
}

// ----  FINDER VINKLEN PÅ KANONEN
function findAngle() {
  // Da vi skal kunne aflæse vinklen på kanonen, bruger vi getComputedStyle().transform.
  // Men da denne viser en matrix istedet for den egentlige vinkel i grader, benyttes den følgende kode til at omregne de givne tal om til vinklen.
  // Koden stammer fra dette link: https://css-tricks.com/get-value-of-css-rotation-through-javascript/ (Chris Coyier)

  // Her finder vi styling transform angivet i en matrix (dette er i en string).
  let cannon = document.querySelector("#cannon");
  let cMatrix = window.getComputedStyle(cannon, null).transform;
  // Betydningen af de værdier der befinder sig i matrixen i forhold til rotate:
  //    rotate(Xdeg) = matrix(cos(X), sin(X), -sin(X), cos(X), 0, 0)

  // Her "splitter" vi stringen op, så vi står tilbage med værdierne.
  let cMatrixValues = cMatrix
    .split("(")[1]
    .split(")")[0]
    .split(",");

  // For at finde vinklen, skal man bruge værdien sin(x). Det er denne vi udvælger her.
  let s = cMatrixValues[1];

  // man finder vinklen ved at sige v = radian * 180/pi. radian = arcsin(number).
  angle = Math.round(Math.asin(s) * (180 / Math.PI));
  //console.log("Rotate: " + angle + "deg");

  return angle;
}
