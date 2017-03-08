const config = {
    apiKey: "AIzaSyDSdVC2imDDwkIWqz6dZeE-QXjIrgO_BVI",
    authDomain: "movie-trivia-c65e7.firebaseapp.com",
    databaseURL: "https://movie-trivia-c65e7.firebaseio.com",
    storageBucket: "movie-trivia-c65e7.appspot.com",
    messagingSenderId: "887080651432"
};

firebase.initializeApp(config);

let database = firebase.database();
let playersRef = database.ref("players");
let playerList = document.getElementById("players");

playersRef.on("child_added", (data) => {
    let player = data.val();
    let li = document.createElement("LI");
    li.textContent = player.name;
    playerList.appendChild(li);
    console.dir(player);
});