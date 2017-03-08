Promise.all([userPromise])
  .then(([user]) => {
    let games = {};

    let app = new Vue({
      el: "#app",
      data: {
        user,
        games
      }
    });

    firebaseData.games.on("value", (firebaseGames) => {
      app.games = firebaseGames.val();
    });

    document.querySelector("#new").addEventListener("click", () => {
      createNewGame();
    });
  });