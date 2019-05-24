// Initialize Firebase
const config = {
    apiKey: "AIzaSyDipImY3E3D3wQGifx2_x8bP-k92bdfWUc",
    authDomain: "fir-sandbox-14b6e.firebaseapp.com",
    databaseURL: "https://fir-sandbox-14b6e.firebaseio.com",
    projectId: "fir-sandbox-14b6e",
    storageBucket: "fir-sandbox-14b6e.appspot.com",
    messagingSenderId: "407143467438"
};
firebase.initializeApp(config);

const database = firebase.database();

const connectionsRef = database.ref("/connections");
const connectedRef = database.ref(".info/connected");
const rpsDataRef = database.ref("/rpsData");
const chatDataRef = database.ref("/chatData");

// Global Variables
let userName = "";
let loggedIn = false;
let choices = [];
let myChoice = "";

// Standings
let wins = 0;
let losses = 0;
let ties = 0;

function newConnectionCallback(snap) {
    console.log("newConnectionCallback");
    if (snap.val()) {
        console.log(snap.val());
        let con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
}

function connectionsCallback(snapshot) {
    console.log("connectionsCallback");
    if (!loggedIn) {
        if (snapshot.numChildren() > 2) {
            $("#tooManyWarning").show();
            $("#loginButton").hide();
            $("#userNameLabel").hide();
            $("#userName").hide();

        } else {
            loggedIn = true;
            $("#playArea").show();
            $("#chatArea").show();
            $("#standings").show();
            $("#loginArea").hide();
            userName = $("#userName").val()
            database.ref("/rpsData").on("value", rpsDataCallback);
        }
    }
}

function saveChoices() {
    rpsDataRef.set(
        {
            choices
        }
    );
}

function updateStandings() {
    console.log("Wins:", wins);
    console.log("Losses:", losses);
    console.log("Ties:", ties);
    $("#wins").text(wins);
    $("#losses").text(losses);
    $("#ties").text(ties);
}

function isWinner(choice1, choice2) {
    if ((choice1 === "rock") && (choice2 === "scissors") ||
        (choice1 === "scissors") && (choice2 === "paper") ||
        (choice1 === "paper") && (choice2 === "rock")) {
        return true;
    }

    return false;
}

function setWinLossMessage(rps1, rps2, isWin) {
    let winLossMessage = "";
    if (isWin) {
        winLossMessage = rps1 + " beats " + rps2 + ". You Win!!!";
    } else {
        winLossMessage = rps2 + " beats " + rps1 + ". You Lose!!! Bummer, dude.";
    }
    $("#winloss").text(winLossMessage);
}

function chatDataCallback(snapshot) {
    console.log("Received chat message: ", snapshot.val());
    if (snapshot.val() != null) {
        let chatText = $("#chatText").text();
        $("#chatText").text(snapshot.val().sendText + "\n" + chatText);
    }
}

function rpsDataCallback(snapshot) {
    console.log("rpsDataCallback called");
    console.log("snapshot.val()", snapshot.val());
    if (snapshot.val() != null) {
        choices = snapshot.val().choices;
        // If both players have made a choice
        if (choices.length === 2) {
            let opponentChoice = "";
            // Figure out whose choice is whose
            if (choices[0] === myChoice) {
                opponentChoice = choices[1];
            } else {
                opponentChoice = choices[0];
            }
            // Figure out wins/losses/ties
            console.log("myChoice", myChoice);
            console.log("opponentChoice", opponentChoice);
            if (myChoice == opponentChoice) {
                $("#winloss").text("You both chose " + myChoice + ". It's a tie!");
                ties++;
            } else {
                let result = isWinner(myChoice, opponentChoice);
                setWinLossMessage(myChoice, opponentChoice, result);
                if (result) {
                    wins++;
                } else {
                    losses++;
                }
            }

            updateStandings();

            choices = [];
            myChoice = "";
            saveChoices();

            $("#playAgainButton").show();
        }
    }
}

function rpsButtonClicked() {
    console.log("rpsButtonClicked", this);
    if (myChoice == "") {
        myChoice = $(this).attr("data-name");
        console.log("myChoice", myChoice);
        choices.push(myChoice);
        saveChoices();
        $("#rpsButtons").hide();
        if (choices.length == 1) {
            $("#winloss").text("You chose " + myChoice + ". Waiting for other player.");
        }
    }
}

function loginButtonClicked(event) {
    console.log("loginButtonClicked");
    event.preventDefault();
    connectedRef.on("value", newConnectionCallback);
    connectionsRef.on("value", connectionsCallback);
    chatDataRef.on("value", chatDataCallback);
    $("#welcome").text("Welcome, " + $("#userName").val());
}

function playAgainButtonClicked(event) {
    $(".rps-button").prop("disable", false);
    $("#playAgainButton").hide();
    $("#winloss").text("");
    $("#rpsButtons").show();
}

function sentTextButtonClicked(event) {
    event.preventDefault();
    let sendText = userName + ": " + $("#sendText").val();
    console.log("Sending chat text", sendText)
    chatDataRef.set(
        {
            sendText
        }
    );
    chatDataRef.remove();
    $("#sendText").val("");
}

$(function () {
    $(document).on("click", ".rps-button", rpsButtonClicked);
    $(document).on("click", "#loginButton", loginButtonClicked);
    $("#playAgainButton").on("click", playAgainButtonClicked);
    $("#sendTextButton").on("click", sentTextButtonClicked);
});
