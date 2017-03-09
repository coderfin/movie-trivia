let vcGameCreate = Vue.component("game-create", {
  template: `
    <section class="game-create component center">
      <h1>Create a Game</h1>
      <label>Title</label>
      <input type="text" v-model="game.title">
      <label>Number of rounds</label>
      <input type="number" value="2" v-model="game.numRounds">
      <label class="time">Time limit in seconds per round</label>
      <input type="number" value="60" v-model="game.roundDuration">
      <button v-on:click="create">create</button>
    </section>
  `,
  data: function () {
    return {
      game: {
        numRounds: 2,
        roundDuration: 60
      }
    };
  },
  methods: {
    create: function () {
      let gameId = firebaseData.games.push().key;

      let players = {};
      players[user.uid] = { ready: false };

      let firebaseGame = firebaseData.games.child(gameId)
      firebaseGame.set({
          title: this.game.title || "Game",
          numRounds: this.game.numRounds || 2,
          roundDuration: this.game.roundDuration || 60,
          players
      }, (error) => {
          if(error) {
              console.log(error);
          }
      });

      router.push({
        name: "game",
        params: {
          id: gameId
        }
      });
    }
  }
});