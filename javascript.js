// Match Variables
let totalRuns = 0;
let wickets = 0;
let overs = 0;
let balls = 0;
let innings = 1;
let firstInningsScore = 0;

const TOTAL_OVERS = 20;
const TARGET = 180;
let matchEnded = false;

// Teams
const indiaPlayers = [
    "Rohit Sharma", "Shubman Gill", "Virat Kohli", "KL Rahul", 
    "Hardik Pandya", "Jadeja", "Rishabh Pant", "Bumrah", 
    "Siraj", "Kuldeep", "Shami"
];
const australiaPlayers = [
    "David Warner", "Travis Head", "Steve Smith", "Glenn Maxwell",
    "Cameron Green", "Alex Carey", "Pat Cummins", "Mitchell Starc",
    "Josh Hazlewood", "Adam Zampa", "Nathan Lyon"
];

let currentPlayers = indiaPlayers;
let striker = 0;
let nonStriker = 1;
let nextPlayer = 2;

// Batting Stats
let batterStats = {};

function initializePlayers() {
    batterStats = {};
    currentPlayers.forEach(player => {
        batterStats[player] = { runs: 0, balls: 0 };
    });
}

initializePlayers();

// THIS IS THE MISSING FUNCTION CAUSING YOUR ERROR
function showPlayers() {
    let team = document.getElementById("teamSelect").value;
    let india = document.getElementById("indiaPlayers");
    let aus = document.getElementById("australiaPlayers");

    india.style.display = "none";
    aus.style.display = "none";
    document.body.classList.remove("india-bg", "australia-bg");

    if (team === "india") {
        india.style.display = "block";
        document.body.classList.add("india-bg");
    } 
    else if (team === "australia") {
        aus.style.display = "block";
        document.body.classList.add("australia-bg");
    }
}

// PLAYER CARD CLICK TO SHOW IMAGE
document.addEventListener("DOMContentLoaded", function() {
    const playerCards = document.querySelectorAll(".player-card");
    console.log("Found player cards:", playerCards.length);
    
    playerCards.forEach(card => {
        card.style.cursor = "pointer";
        card.onclick = function() {
            const imgSrc = this.querySelector("img").src;
            const playerName = this.querySelector("p").innerText;
            
            document.getElementById("modalImage").src = imgSrc;
            document.getElementById("modalName").innerText = playerName;
            document.getElementById("playerModal").style.display = "flex";
        };
    });
});

function closeModal() {
    document.getElementById("playerModal").style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("playerModal");
    if (event.target == modal) {
        closeModal();
    }
}

// Update Scoreboard
function updateScoreboard() {
    document.getElementById("totalScore").innerHTML = totalRuns;
    document.getElementById("score").innerHTML = totalRuns + "/" + wickets;
    document.getElementById("overs").innerHTML = overs + "." + balls;

    let totalBalls = overs * 6 + balls;
    let runRate = 0;
    if (totalBalls > 0) {
        runRate = (totalRuns / (totalBalls / 6)).toFixed(2);
    }
    document.getElementById("runRate").innerHTML = runRate;

    if (innings == 1) {
        document.getElementById("target").innerHTML = "-";
        document.getElementById("needRuns").innerHTML = "-";
    } else {
        document.getElementById("target").innerHTML = firstInningsScore + 1;
        document.getElementById("needRuns").innerHTML = Math.max((firstInningsScore + 1) - totalRuns, 0);
    }

    document.getElementById("ballsLeft").innerHTML = (TOTAL_OVERS * 6) - totalBalls;

    document.getElementById("batsman1").innerHTML = currentPlayers[striker];
    document.getElementById("bat1Runs").innerHTML = batterStats[currentPlayers[striker]].runs;
    document.getElementById("bat1Balls").innerHTML = batterStats[currentPlayers[striker]].balls;

    document.getElementById("batsman2").innerHTML = currentPlayers[nonStriker];
    document.getElementById("bat2Runs").innerHTML = batterStats[currentPlayers[nonStriker]].runs;
    document.getElementById("bat2Balls").innerHTML = batterStats[currentPlayers[nonStriker]].balls;
}

function startSecondInnings() {
    innings = 2;
    totalRuns = 0;
    wickets = 0;
    overs = 0;
    balls = 0;
    currentPlayers = australiaPlayers;
    striker = 0;
    nonStriker = 1;
    nextPlayer = 2;
    matchEnded = false;
    initializePlayers();
    document.getElementById("fallList").innerHTML = "";
    document.getElementById("secondInningsBtn").style.display = "none";
    document.getElementById("result").innerHTML = "🏏 Australia is chasing " + (firstInningsScore + 1);
    updateScoreboard();
}

function nextBall() {
    balls++;
    if (balls == 6) {
        overs++;
        balls = 0;
        let temp = striker;
        striker = nonStriker;
        nonStriker = temp;
    }
    updateScoreboard();
    checkMatch();
}

function addRun() {
    if (matchEnded) { alert("Match is already over!"); return; }
    totalRuns++;
    batterStats[currentPlayers[striker]].runs++;
    batterStats[currentPlayers[striker]].balls++;
    let temp = striker;
    striker = nonStriker;
    nonStriker = temp;
    nextBall();
}

function addFourRun() {
    if (matchEnded) { alert("Match is already over!"); return; }
    totalRuns += 4;
    batterStats[currentPlayers[striker]].runs += 4;
    batterStats[currentPlayers[striker]].balls++;
    nextBall();
}

function addSixRun() {
    if (matchEnded) { alert("Match is already over!"); return; }
    totalRuns += 6;
    batterStats[currentPlayers[striker]].runs += 6;
    batterStats[currentPlayers[striker]].balls++;
    nextBall();
}

function addWicket() {
    if (matchEnded) {
        alert("Match is already over!");
        return;
    }

    batterStats[currentPlayers[striker]].balls++;
    let li = document.createElement("li");
    li.innerHTML = (wickets + 1) + "-" + totalRuns + " (" + currentPlayers[striker] + " " + overs + "." + balls + ")";
    document.getElementById("fallList").appendChild(li);
    wickets++;

    // FIX: Check if all out BEFORE assigning new batsman
    if (wickets >= 10) {
        updateScoreboard();
        checkMatch();
        return; // Stop here, don't assign new batsman
    }

    // Only assign new batsman if wickets < 10
    striker = nextPlayer;
    nextPlayer++;
    nextBall();
}
function addReset() {
    totalRuns = 0;
    wickets = 0;
    overs = 0;
    balls = 0;
    innings = 1;
    firstInningsScore = 0;
    currentPlayers = indiaPlayers;
    striker = 0;
    nonStriker = 1;
    nextPlayer = 2;
    matchEnded = false;
    initializePlayers();
    document.getElementById("fallList").innerHTML = "";
    document.getElementById("result").innerHTML = "";
    document.getElementById("secondInningsBtn").style.display = "none";
    updateScoreboard();
}

function checkMatch() {
    if (innings == 1) {
        if (wickets >= 10 || overs >= TOTAL_OVERS) {
            matchEnded = true;
            firstInningsScore = totalRuns;
            document.getElementById("result").innerHTML = "🏏 First Innings Completed! Target: " + (firstInningsScore + 1);
            document.getElementById("secondInningsBtn").style.display = "inline-block";
        }
    } else {
        if (totalRuns >= firstInningsScore + 1) {
            matchEnded = true;
            document.getElementById("result").innerHTML = "🏆 AUSTRALIA WON THE MATCH";
        } else if (wickets >= 10 || overs >= TOTAL_OVERS) {
            matchEnded = true;
            if (totalRuns == firstInningsScore) {
                document.getElementById("result").innerHTML = "🤝 MATCH TIED";
            } else if (totalRuns < firstInningsScore) {
                document.getElementById("result").innerHTML = "🏆 INDIA WON THE MATCH";
            }
        }
    }
}
updateScoreboard();
