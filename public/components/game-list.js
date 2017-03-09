let vcGameList = Vue.component("game-list", {
  template: `
    <section>
      <p>Create a new game or join an existing game.</p>
      <nav>
        <router-link v-for="(game, key) in games" v-bind:to="{ name: 'game', params: { id: key } }">{{ game.displayName }}</router-link>
      </nav>
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