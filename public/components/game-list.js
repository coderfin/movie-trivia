let vcGameList = Vue.component("game-list", {
  template: `
    <section class="game-list">
      <h1>Join a game!</h1>
      <nav>
        <router-link v-for="(game, key) in games" v-bind:to="{ name: 'game', params: { id: key } }">{{ game.displayName }}</router-link>
      </nav>
      <div>or</div>
      <button v-on:click="newGame">create new game</button>
    </section>
  `,
  data: function () {
    return {
      games: {}
    };
  },
  mounted: function () {
    firebaseData.games.on("value", (firebaseGames) => { // todo: explore child_added
      this.$data.games = firebaseGames.val();
    });
  },
  methods: {
    newGame: function () {
      router.push({
        name: "create-game"
      });
    }
  }
});