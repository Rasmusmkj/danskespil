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
  let count = 0; // til at tælle antalet af skud.

  // Når der bliver klikket på kannonen:
  document.querySelector("#cannon").addEventListener("click", () => {
    count += 1; //Tæller hver gang der bliver klikket på kanonen.

    // Man kan maks skyde 3 gange.
    if (count < 4) {
      // når kanonenkuglen er blevet skudt, fjerner vi den så man ikke kan se den, idet den bevæger sig tilbage til kanonen
      // man nå man så klikker igen på kanonen skal man kunne se den igen.
      cannonball.style.display = "inline";

      // Finder den nuværende vinkel.
      findAngle();

      // Affyrer kannonen.
      fireCannon();

      // Efter den 3. gang der bliver skudt skal der dukke et modal-vindue op.
      if (count == 3) {
        console.log("Der er blevet skudt 3 gange");
        // DER SKAL KALDES PÅ EN FUNKTION, DER ÅBNER ET MODAL VINDUE
      }
    }
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
// ----  AFFYRER KANONEN
function fireCannon() {
  let cannonball = document.querySelector("#cannonball");

  // Udfaldet af hvor man rammer, afhænger af kannonens vinkel.
  // Vi placerer derfor kanonkuglen der, hvor det passer med vinklen på kanonen.
  if (angle >= -19 && angle <= -12.5) {
    // Rammer den skib 1
    cannonball.style.transform = "translate(-127px, -450px)";
    setTimeout(hitShip1, 500);
  } else if (angle > -12.5 && angle < -3) {
    // Rammer i vandet
    cannonball.style.transform = "translate(-77px, -385px)";
    setTimeout(hitWater1, 500);
  } else if (angle >= -3 && angle <= 7) {
    // Rammer den skib 2
    cannonball.style.transform = "translate(10px, -340px)";
    setTimeout(hitShip2, 500);
  } else if (angle > 7 && angle < 13.5) {
    // Rammer i vandet
    cannonball.style.transform = "translate(80px, -385px)";
    setTimeout(hitWater2, 500);
  } else if (angle >= 13.5 && angle <= 20) {
    // Rammer den skib 3
    cannonball.style.transform = "translate(135px, -450px)";
    setTimeout(hitShip3, 500);
  } else if (angle < -19) {
    cannonball.style.transform = "translate(-250px, -430px)";
  } else if (angle > 20) {
    cannonball.style.transform = "translate(245px, -450px)";
  }
  setTimeout(newBall, 550); // til at fjerne kuglen, når den har nået sit mål.

  document.querySelector("#cannon").style.animationPlayState = "paused"; // Sætter kanonen på pause idet den skuder.
}

// ----  RAMMER DET FØRSTE SKIB
function hitShip1() {
  document.querySelector("#ship1").style.visibility = "hidden";
  document.querySelector("#shipwreck1").style.visibility = "visible";
  document.querySelector("#shine1").style.visibility = "visible";
  document.querySelector("#prize1").style.visibility = "visible";
}

// ----  RAMMER DET ANDET SKIB
function hitShip2() {
  document.querySelector("#ship2").style.visibility = "hidden";
  document.querySelector("#shipwreck2").style.visibility = "visible";
  document.querySelector("#shine2").style.visibility = "visible";
  document.querySelector("#prize2").style.visibility = "visible";
}

// ----  RAMMER DET TREDJE SKIB
function hitShip3() {
  document.querySelector("#ship3").style.visibility = "hidden";
  document.querySelector("#shipwreck3").style.visibility = "visible";
  document.querySelector("#shine3").style.visibility = "visible";
  document.querySelector("#prize3").style.visibility = "visible";
}

// ----  RAMMER VANDET I VENSTRE SIDE
function hitWater1() {
  let hitsWater = document.querySelector("#hits_water");
  hitsWater.style.display = "inline";
  hitsWater.classList.add("splash");

  // fjerne animationen, når den er færdig med at kører
  hitsWater.addEventListener("animationend", () => {
    stopHitWater(hitsWater);
  });
}

// ----  RAMMER VANDET I HØJRE SIDE
function hitWater2() {
  let hitsWater = document.querySelector("#hits_water");
  hitsWater.style.display = "inline";
  hitsWater.style.transform = "translateX(154px)";
  hitsWater.classList.add("splash");

  // fjerne animationen, når den er færdig med at kører
  hitsWater.addEventListener("animationend", () => {
    stopHitWater(hitsWater);
  });
}

// ----  STOPPER ANIMATIONEN PÅ PLASKET I VANDET
function stopHitWater(hitsWater) {
  hitsWater.style.transform = "translateX(0)";
  hitsWater.style.display = "none";
  hitsWater.classList.remove("splash");
}

// ----  SÆTTER KANONKUGLEN TILBAGE TIL DENS UDGANGSPUNKT
function newBall() {
  cannonball.style.display = "none";
  cannonball.style.transform = "translate(0, 0)";
  document.querySelector("#cannon").style.animationPlayState = "running";
}
