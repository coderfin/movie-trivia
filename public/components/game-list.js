let vcGameList = Vue.component("game-list", {
  template: `
    <section class="game-list component">
      <h1>Join a Game</h1>
      <nav>
        <router-link v-for="(game, key) in games" v-bind:to="{ name: 'game', params: { id: key } }" v-bind:key="key">{{ game.details.title }}</router-link>
      </nav>
      <div class="or">or</div>
      <button v-on:click="create" class="blue">create new game</button>
    </section>
  `,
  data: function () {
    return {
      games: {}
    };
  },
  mounted: function () {
    firebaseData.games.orderByChild("open").equalTo(true).on("value", (firebaseGames) => { // todo: explore child_added
      this.games = firebaseGames.val();
    });
  },
  methods: {
    create: function () {
      router.push({
        name: "create"
      });
    }
  }
});