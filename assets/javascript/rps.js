
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

// When the client's connection state changes...
function newConnectionCallback(snap) {
    console.log("newConnectionCallback");
    // If they are connected..
    if (snap.val()) {
        console.log(snap.val());
        // Add user to the connections list.
        var con = connectionsRef.push(true);

        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    }
}

function connectionsCallback(snapshot) {
    console.log("connectionsCallback");
    if (!loggedIn) {
        if (snapshot.numChildren() > 2) {
            $("#watchers").text("No playing for you! Too many users!")
        } else {
            loggedIn = true;
            $("#watchers").text(snapshot.numChildren());
        }
    }
}

// When first loaded or when the connections list changes...

function rpsButtonClicked() {
    console.log("rpsButtonClicked", this);
}

function loginButtonClicked() {
    console.log("loginButtonClicked");
    connectedRef.on("value", newConnectionCallback);
    connectionsRef.on("value", connectionsCallback);
}

$(function () {
    $(document).on("click", ".rps-button", rpsButtonClicked);
    $(document).on("click", "#loginButton", loginButtonClicked);
});
