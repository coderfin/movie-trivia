Vue.component("game-list", {
  template: `
    <section>
      <p>Create a new game or join an existing game.</p>
      <ul>
        <li v-for="game in games">{{ game.displayName }}</li>
      </ul>
      <button>create new game</button>
    </section>
  `
});

// let games = new Vue({
//   el: "#games",
//   data: {
//     user,
//     games
//   }
// });

// Promise.all([userPromise])
//   .then(([user]) => {
//     let games = {};



//     firebaseData.games.on("value", (firebaseGames) => {
//       app.games = firebaseGames.val();
//     });

//     document.querySelector("#new").addEventListener("click", () => {
//       createNewGame();
//     });
//   });