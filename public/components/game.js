let vcGame = Vue.component("game", {
  template: `
    <section>
      <p>This is a new game.</p>
      <section v-if="game">
        <h1>{{ game.displayName }}</h1>
      </section>
      <section v-else>no game</section>

      <game-loop v-bind:game-id="id"></game-loop>

    </section>
  `,
  props: ["id"],
  data: function () {
    return {
      game: {}
    };
  },
  mounted: function () {
    let gameRef = firebaseData.games.child(this.$props.id);
    
    gameRef.on("value", (data) => {
        this.game = data.val();

        if(!this.game.players[user.uid] && Object.keys(this.game.players).length < 2) {
          
          gameRef.child(`players/${user.uid}`).set({ 
            ready: false,
            host: true
          });
        }
    });
  }
});