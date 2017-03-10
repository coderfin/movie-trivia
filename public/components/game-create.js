let vcGameCreate = Vue.component("game-create", {
  template: `
    <section class="game-create component center">
      <h1>Create a Game</h1>
      <label>Title</label>
      <input type="text" v-model="details.title">
      <label>Number of rounds</label>
      <input type="number" value="2" v-model="details.numRounds">
      <label class="time">Time limit in seconds per round</label>
      <input type="number" value="60" v-model="details.roundDuration">
      <button v-on:click="create" class="green">create</button>
    </section>
  `,
  data: function () {
    return {
      details: {
        numRounds: 2,
        roundDuration: 60
      }
    };
  },
  methods: {
    create: function () {
      let gameId = firebaseData.games.push().key;

      let players = {};
      players[user.uid] = {
        ready: false,
        displayName: user.displayName,
        photoUrl: user.photoUrl
      };

      let firebaseGame = firebaseData.games.child(gameId)
      firebaseGame.set({
        open: true,
        details: {
          title: this.details.title || "Game",
          numRounds: this.details.numRounds || 2,
          roundDuration: this.details.roundDuration || 60
        },
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