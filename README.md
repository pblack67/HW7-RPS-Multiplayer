# Multiplayer Rock, Paper, Scissors

* URL: [https://pblack67.github.io/RPS-Multiplayer/](https://pblack67.github.io/RPS-Multiplayer/)

* Technologies: HTML, CSS, Bootstrap, JavaScript, Events, jQuery, Firebase

## Overview

This application allows two users to play a game of Rock, Paper, Scissors together. There's a simple login screen to capture the user's name. Only two players can be logged in at a time. Then the main game screen appears. Both users choose one of the three options and then the application notifies each player of who won. The wins, losses and ties appear in a score window. The users can then click the Play Again button for another round. Also, there is a chat window so the users can taunt one another during a heated game. 

## Architecture

The application uses the FireBase .info/connected reference and the application's own connectionsRef to keep track of logged in users. Only two are allowed at a time and will turn away others until someone quits their browser. The RPS choice is saved to Firebase and propogated via event to the browser. It's then compared to the other user's choice to see who wins. Chat messages behave similarly. A chat message is saved to a single database reference and populated in the browser via an event.  
