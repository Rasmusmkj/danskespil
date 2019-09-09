"use strict";
window.addEventListener("DOMContentLoaded", init);

const form = document.querySelector("form");
let angle; // vinklen på kanonen
let count = 0; // til at tælle antallet af skud.
let jsonData = [];

function init() {
  // Hvis brugeren ikke har været inde på siden, skal der komme en alert, der viser er der er tale om en skole opgave.
  if (!localStorage.getItem("notificationShown")) {
    alert("DETTE ER EN SKOLE OPGAVE")
    localStorage.setItem('notificationShown', true);
  };
  getJson();
  loadSVG();
  preparePost();
  document.querySelector("#ready").addEventListener("click", readyToPlay);
}

// ---- NÅR MAN ER KLAR TIL AT SPILLE
function readyToPlay() {
  // Baggrundsmusik
  document.querySelector("#baggrundlyd").play();
  document.querySelector("#baggrundlyd").volume = 0.3;
  document.querySelector("#baggrundlyd").currentTime = 8;
  // fjerne modalvinduet (forklaring til spil)
  document.querySelector("#game_explainer").style.display = "none";
  // Gør det muligt at klikke på kanonen.
  document.querySelector("#cannon").style.pointerEvents = "auto";
  // Gør svg/spillet fuldt synligt.
  document.querySelector("svg").style.opacity = "1";

  // klikker på skibet
  document.querySelectorAll(".ship").forEach(shippet => {
    shippet.addEventListener("click", wrongClick);
  });
}

// ---- VED KLIK PÅ ET AF SKIBENE I STEDET FOR KANONEN
function wrongClick() {
  document.querySelector("#haand").style.display = "block";
}

// ---- LOADER SVG'EN
function loadSVG() {
  fetch("svg/game.svg")
    .then(response => response.text())
    .then(svgdata => {
      document
        .querySelector("#svg_pirategame")
        .insertAdjacentHTML("afterbegin", svgdata);
      // Når der bliver klikket på kannonen:
      document.querySelector("#cannon").addEventListener("click", prepareShot);
    });
}

// ----  FORBEREDER SKUD AF KANONEN
function prepareShot() {
  // sørger for at hånden ikke er tilstedet når man har klikket på kanonen.
  document.querySelector("#haand").style.display = "none";

  count += 1; //Tæller hver gang der bliver klikket på kanonen.

  // Man kan maks skyde 3 gange.
  if (count < 4) {
    // når kanonenkuglen er blevet skudt, fjerner vi den så man ikke kan se den, idet den bevæger sig tilbage til kanonen
    // man nå man så klikker igen på kanonen skal man kunne se den igen.
    cannonball.style.visibility = "visible";

    // Finder den nuværende vinkel.
    findAngle();

    // Affyrer kannonen.
    fireCannon();

    // Efter den 3. gang der bliver skudt skal der dukke et modal-vindue op.
    if (count == 3) {
      setTimeout(doneShooting, 1500);
    }
  }

  // I spillet er der 3 kanonkugler der indikerer hvor mange skud man har tilbage.
  // herunder fjernes en kanonkugle hver gang der bliver skudt.
  if (count == 1) {
    document.querySelector("#shot1").style.display = "none";
  } else if (count == 2) {
    document.querySelector("#shot2").style.display = "none";
  } else if (count == 3) {
    document.querySelector("#shot3").style.display = "none";
  }
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

  document.querySelector("#kanonlyd").play();

  // Udfaldet af hvor man rammer, afhænger af kannonens vinkel.
  // Vi placerer derfor kanonkuglen der, hvor det passer med vinklen på kanonen.
  if (angle >= -19 && angle <= -12.5) {
    // Rammer den skib 1
    cannonball.style.transform = "translate(-127px, -450px)";
    setTimeout(hitShip1, 1000);
  } else if (angle > -12.5 && angle < -3) {
    // Rammer i vandet
    cannonball.style.transform = "translate(-77px, -385px)";
    setTimeout(hitWater1, 1000);
  } else if (angle >= -3 && angle <= 7) {
    // Rammer den skib 2
    cannonball.style.transform = "translate(10px, -340px)";
    setTimeout(hitShip2, 1000);
  } else if (angle > 7 && angle < 13.5) {
    // Rammer i vandet
    cannonball.style.transform = "translate(80px, -385px)";
    setTimeout(hitWater2, 1000);
  } else if (angle >= 13.5 && angle <= 20) {
    // Rammer den skib 3
    cannonball.style.transform = "translate(135px, -450px)";
    setTimeout(hitShip3, 1000);
  } else if (angle < -19) {
    cannonball.style.transform = "translate(-250px, -430px)";
  } else if (angle > 20) {
    cannonball.style.transform = "translate(245px, -450px)";
  }
  setTimeout(newBall, 1000); // til at fjerne kuglen, når den har nået sit mål.

  document.querySelector("#cannon").style.animationPlayState = "paused"; // Sætter kanonen på pause idet den skyder.

  // Røg-effekt ved kanonen.
  document.querySelector("#smoke").style.display = "block";
  document.querySelector("#smoke").addEventListener("animationend", () => {
    document.querySelector("#smoke").style.display = "none";
  });
}

// ----  RAMMER DET FØRSTE SKIB
function hitShip1() {
  document.querySelector("#ship1").style.visibility = "hidden";
  document.querySelector("#hitship1").style.visibility = "visible";
  let shipwreck = document.querySelector("#hitship1");
  randomPrize(shipwreck);
}

// ----  RAMMER DET ANDET SKIB
function hitShip2() {
  document.querySelector("#ship2").style.visibility = "hidden";
  document.querySelector("#hitship2").style.visibility = "visible";
  let shipwreck = document.querySelector("#hitship2");
  randomPrize(shipwreck);
}

// ----  RAMMER DET TREDJE SKIB
function hitShip3() {
  document.querySelector("#ship3").style.visibility = "hidden";
  document.querySelector("#hitship3").style.visibility = "visible";
  let shipwreck = document.querySelector("#hitship3");
  randomPrize(shipwreck);
}

// ----  RAMMER VANDET I VENSTRE SIDE
function hitWater1() {
  let hitsWater = document.querySelector("#hits_water");
  document.querySelector("#plasklyd").play();
  document.querySelector("#plasklyd").addEventListener("ended", () => {
    document.querySelector("#taberlyd").play();
    document.querySelector("#taberlyd").currentTime = 1;
  });
  // Sørger for at animationen er synlig.
  hitsWater.style.display = "inline";
  // tilføjer den class der har animationen.
  hitsWater.classList.add("splash");

  // fjerne animationen, når den er færdig med at kører
  hitsWater.addEventListener("animationend", () => {
    stopHitWater(hitsWater);
  });
}

// ----  RAMMER VANDET I HØJRE SIDE
function hitWater2() {
  let hitsWater = document.querySelector("#hits_water");
  document.querySelector("#plasklyd").play();
  document.querySelector("#plasklyd").addEventListener("ended", () => {
    document.querySelector("#taberlyd").play();
    document.querySelector("#taberlyd").currentTime = 1;
  });

  // Sørger for at animationen er synlig.
  hitsWater.style.display = "inline";
  // rykker den hen i højre side, hvor den skal udspille sig.
  hitsWater.style.transform = "translateX(154px)";
  // tilføjer den class der har animationen.
  hitsWater.classList.add("splash");

  // fjerne animationen, når den er færdig med at kører
  hitsWater.addEventListener("animationend", () => {
    stopHitWater(hitsWater);
  });
}

// ----  STOPPER ANIMATIONEN PÅ PLASKET I VANDET
function stopHitWater(hitsWater) {
  // rykkes tilbage til udgangspunktet (i tilfælde af at man har ramt i højre side)
  hitsWater.style.transform = "translateX(0)";
  // fjerner den fra skærmen
  hitsWater.style.display = "none";
  // fjerner class'en med animationen.
  hitsWater.classList.remove("splash");
}

// ----  SÆTTER KANONKUGLEN TILBAGE TIL DENS UDGANGSPUNKT
function newBall() {
  let cannonball = document.querySelector("#cannonball");
  cannonball.style.visibility = "hidden";
  cannonball.style.transform = "translate(0, 0)";
  document.querySelector("#cannon").style.animationPlayState = "running";
}

// ---- TILFÆLDIG PRÆMIE FOR AT RAMME ET AF SKIBENE
function randomPrize(shipwreck) {
  document.querySelector("#eksplosionlyd").play();

  document.querySelector("#eksplosionlyd").addEventListener("ended", () => {
    document.querySelector("#vinderlyd").play();
    document.querySelector("#vinderlyd").currentTime = 0.1;
    document.querySelector("#vinderlyd").volume = 1;
  });
  let bannertext = shipwreck.querySelector(".bannertext");
  if (bannertext.innerHTML == "0 point") {
    // sørger for at der er 3 forskellige tal (husk at nul er medregnet).
    // Det er tilfældig hvilket af de tre tal, n bliver.
    let n = Math.floor(Math.random() * Math.floor(3));

    // præmien på nedskudte skib afhænger af hvilket tal n bliver.
    // shipwreck er det skib der er blevet skudt på og ".bannertext" er dens child-element.
    if (n === 1) {
      bannertext.innerHTML = "0 spil";
    } else if (n === 2) {
      bannertext.innerHTML = "1 spil";
    } else {
      bannertext.innerHTML = "2 spil";
    }
  }
}

// ---- NÅR DER ER BLEVET SKUDT 3 GANGE
function doneShooting() {
  // Finder værdierne/præmierne på de skibene
  let prize1 = document.querySelector("#bannertext1").innerHTML.split(" ")[0];
  let prize2 = document.querySelector("#bannertext2").innerHTML.split(" ")[0];
  let prize3 = document.querySelector("#bannertext3").innerHTML.split(" ")[0];

  // beregner den samlede præmie
  let prize = Number(prize1) + Number(prize2) + Number(prize3);

  if (prize == 0) {
    refreshGame();
  } else {
    gameEnd(prize);
  }
}

// ---- HVIS BRUGEREN FÅR 0 POINT
function refreshGame() {
  let retryGame = document.querySelector("#retryGame");

  // Gør modal-vinduet synligt over en transition.
  retryGame.style.visibility = "visible";
  retryGame.style.opacity = "1";

  document.querySelector("#refresh").addEventListener("click", () => {
    window.location.reload();
  });
}

// ---- HVIS BRUGER FÅR OVER 0 POINT
function gameEnd(prize) {
  let endOfGame = document.querySelector("#end_of_game");

  // Gør modal-vinduet synligt over en transition.
  endOfGame.style.visibility = "visible";
  endOfGame.style.opacity = "1";

  // skriver det ind i modal-vinduet.
  document.querySelector("#prize").innerHTML =
    "Du har vundet " + prize + " gratis spil!";

  // Brugerens navn til spilsiden
  document.querySelector("#result").innerHTML = sessionStorage.getItem("title");

  // Gør spillet i baggrunden mindre tydelig og stopper kanonens bevæglser
  document.querySelector("svg").style.filter = "opacity(0.3)";
  document.querySelector("#cannon").style.animationPlayState = "paused";
}

// ----  POSTER DATAERNE
function preparePost() {
  let name = sessionStorage.getItem("title");
  let formEmail = form.elements.emailadresse;

  document.querySelector(".confirm").addEventListener("click", e => {
    e.preventDefault();
    if (form.checkValidity()) {
      let findEmail = jsonData.findIndex(x => x.email === formEmail.value);
      if (findEmail === -1) {
        post({
          fullname: name,
          email: formEmail.value
        });
      } else {
        document.querySelector("#wrongMail").innerHTML =
          "E-mailen eksisterer allerede";

        formEmail.style.border = "1px solid red";
        formEmail.style.backgroundColor = "rgb(255, 239, 239)";
      }
    } else {
      document.querySelector("#email").classList.add("check_validation");
      document.querySelector("#checkbox").classList.add("check_validation");
    }
  });
}

// this function adds a new line in our DB that contains the last addet post
function post(userData) {
  const postData = JSON.stringify(userData);
  fetch("https://danskespil-cd72.restdb.io/rest/danskespil", {
    method: "post",
    body: postData,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5ce28dfc780a473c8df5c9cc",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // this clears the form fields when refreshed
      document.querySelector(".confirm").disabled = false;
      form.elements.emailadresse.value = null;
      dataIsSend(); //åbner det sidste modalvindue, når dataerne er blevet postet.
    });
}

// ----  EFTER BRUGERENS DATA ER BLEVET POSTET
function dataIsSend() {
  // fjerner den første del af modalvinduet (der hvor brugeren skriver sin mail)
  document.querySelector("#slut_spil_1").style.display = "none";
  // indsætter den anden del af modalvindiuet (Tak-beskeden og link til quick)
  document.querySelector("#slut_spil_2").style.display = "block";
}

function getJson() {
  fetch("https://danskespil-cd72.restdb.io/rest/danskespil", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5ce28dfc780a473c8df5c9cc",
      "cache-control": "no-cache"
    }
  })
    .then(getJson => getJson.json())
    .then(getJson => {
      jsonData = getJson;
    });
}

document.querySelector(".mute").addEventListener("click", mutePage)

// Muter et enkelt element i HTML'en
function muteMe(elem) {
  elem.muted = true;
  elem.pause();
}

// Vil mute alle elementer på siden
function mutePage() {
  let elems = document.querySelectorAll("audio");

  [].forEach.call(elems, function (elem) {
    muteMe(elem);
  });
}
