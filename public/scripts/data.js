{
    const config = {
        apiKey: "AIzaSyDSdVC2imDDwkIWqz6dZeE-QXjIrgO_BVI",
        authDomain: "movie-trivia-c65e7.firebaseapp.com",
        databaseURL: "https://movie-trivia-c65e7.firebaseio.com",
        storageBucket: "movie-trivia-c65e7.appspot.com",
        messagingSenderId: "887080651432"
    };
    firebase.initializeApp(config);
    let db = firebase.database();
    let players = database.ref("players");
    let games = database.ref("games");
    window.data = { games, players };
}
