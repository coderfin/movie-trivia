{
    firebase.initializeApp({
        apiKey: "AIzaSyDSdVC2imDDwkIWqz6dZeE-QXjIrgO_BVI",
        authDomain: "movie-trivia-c65e7.firebaseapp.com",
        databaseURL: "https://movie-trivia-c65e7.firebaseio.com",
        storageBucket: "movie-trivia-c65e7.appspot.com",
        messagingSenderId: "887080651432"
    });

    let db = firebase.database();

    window.firebaseData = { 
        games: db.ref("games"),
        players: db.ref("players")
    };
}
