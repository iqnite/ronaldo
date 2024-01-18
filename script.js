var money;
var clicks;
var cps;
var currentTeam;
var startTime;

const TEAMS = [
    {
        "name": "No team",
        "moneyPerFound": 1,
        "required": 0
    },
    {
        "name": "Sporting CP",
        "moneyPerFound": 2,
        "required": 3
    },
    {
        "name": "Manchester United",
        "moneyPerFound": 3,
        "required": 10
    },
    {
        "name": "Real Madrid",
        "moneyPerFound": 5,
        "required": 25
    },
    {
        "name": "Juventus",
        "moneyPerFound": 10,
        "required": 50
    },
    {
        "name": "Al Nassr",
        "moneyPerFound": 20,
        "required": 150
    }
];
const board = document.getElementById("board");
const ronaldo = document.getElementById("ronaldo");
const moneyDisplay = document.getElementById("money");
const clicksDisplay = document.getElementById("clicks");
const teamDisplay = document.getElementById("team");
const cpsDisplay = document.getElementById("cps");
const infoButton = document.getElementById("info-btn");
const offerButton = document.getElementById("offer-btn");
const siuu = new Audio("siuu.wav");
const long_siuu = new Audio("long_siuu.wav");

ronaldo.ondragstart = () => false;
infoButton.addEventListener("click", () => {
    alert("The goal is to find Ronaldo. The closer you click, the louder the Siuuu becomes.\nGame inspired by Sium Clicker 23 by Crazy_Tomatoes.");
});
cpsDisplay.addEventListener("click", () => {
    startTime = Date.now();
    clicks = 0;
});
offerButton.addEventListener("click", () => {
    const newTeam = TEAMS[currentTeam + 1];
    if (money < newTeam.required) return;
    if (!confirm("Do you want to join " + newTeam.name + "?\nIt will cost you " + newTeam.required + "M$, but you will earn " + newTeam.moneyPerFound + "M$ every time you find Ronaldo.")) return;
    offerButton.style.display = "none";
    money -= newTeam.required;
    moneyDisplay.innerText = money;
    currentTeam += 1;
    teamDisplay.innerText = TEAMS[currentTeam].name;
});

function start() {
    money = 0;
    clicks = 0;
    currentTeam = 0;
    startTime = Date.now();

    place();
    board.addEventListener("click", click);
    ronaldo.addEventListener("click", found);
}

function found(event) {
    if (!ronaldo.classList.contains("hidden")) return;
    long_siuu.play();
    money += TEAMS[currentTeam].moneyPerFound;
    moneyDisplay.innerText = money;
    clicksDisplay.innerText = clicks;
    ronaldo.classList.remove("hidden");
    if (TEAMS.length - 1 > currentTeam) {
        if (money >= TEAMS[currentTeam + 1].required) {
            offerButton.innerText = "Contract offer from " + TEAMS[currentTeam + 1].name + "!";
            offerButton.style.display = "inline-block";
        }
    }
    setTimeout(() => {
        ronaldo.classList.add("hidden");
        place();
    }, 1000);
}

function click(event) {
    const distance = calcDistance(event.clientX, event.clientY, ronaldo.offsetLeft, ronaldo.offsetTop);
    const maxDistance = Math.sqrt((board.offsetWidth ** 2) + (board.offsetHeight ** 2));
    const volume = 1 - (distance / maxDistance);

    siuu.volume = volume;
    siuu.play();
    board.style.borderColor = `rgba(0, ${volume * 255}, 0)`;
    clicks += 1;
    clicksDisplay.innerText = clicks;
    cps = getCps().toFixed(2);
    cpsDisplay.innerText = cps;
}

function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function place() {
    const x = Math.floor(Math.random() * (board.clientWidth - ronaldo.offsetWidth));
    const y = Math.floor(Math.random() * (board.clientHeight - ronaldo.offsetHeight));
    ronaldo.style.left = x + "px";
    ronaldo.style.top = y + "px";
}

function getCps() {
    const currentTime = Date.now();
    const timeElapsed = (currentTime - startTime) / 1000;
    return (clicks / timeElapsed);
}

start();
