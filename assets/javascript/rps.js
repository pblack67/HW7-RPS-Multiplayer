
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDipImY3E3D3wQGifx2_x8bP-k92bdfWUc",
    authDomain: "fir-sandbox-14b6e.firebaseapp.com",
    databaseURL: "https://fir-sandbox-14b6e.firebaseio.com",
    projectId: "fir-sandbox-14b6e",
    storageBucket: "fir-sandbox-14b6e.appspot.com",
    messagingSenderId: "407143467438"
};
firebase.initializeApp(config);

var database = firebase.database();

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var rpsDataRef = database.ref("/rpsData");
var userName = "";
var loggedIn = false;
var choices = [];
var myChoice = "";

function newConnectionCallback(snap) {
    console.log("newConnectionCallback");
    if (snap.val()) {
        console.log(snap.val());
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
    }
}

function connectionsCallback(snapshot) {
    console.log("connectionsCallback");
    if (!loggedIn) {
        if (snapshot.numChildren() > 2) {
            $("#watchers").text("You need to wait for someone to logout! You'll be automatically connected to the next player available.");
        } else {
            loggedIn = true;
            $("#playArea").show();
            $("#loginArea").hide();
            $("#watchers").text(snapshot.numChildren());
            userName = $("#userName").val()
            database.ref("/rpsData").on("value", rpsDataCallback);
        }
    }
    $("#watchers").text(snapshot.numChildren());
}

function saveChoices() {
    rpsDataRef.set(
        {
            choices
        }
    );
}

function rpsDataCallback(snapshot) {
    console.log("rpsDataCallback called");
    console.log("snapshot.val()", snapshot.val());
    if (snapshot.val() != null) {
        choices = snapshot.val().choices;
        if (choices.length == 2) {
            console.log("Choose winner here", choices);
            choices = [];
            myChoice = "";
            saveChoices();
        }
    }
}

function rpsButtonClicked() {
    console.log("rpsButtonClicked", this);
    if (myChoice == "") {
        myChoice = $(this).attr("data-name");
        choices.push(myChoice);
        saveChoices();
    } else {
        console.log("You made your choice. Wait for the other player!");
    }
}

function loginButtonClicked(event) {
    console.log("loginButtonClicked");
    event.preventDefault();
    connectedRef.on("value", newConnectionCallback);
    connectionsRef.on("value", connectionsCallback);
}

$(function () {
    $(document).on("click", ".rps-button", rpsButtonClicked);
    $(document).on("click", "#loginButton", loginButtonClicked);
    $("#playArea").hide();
});
