let vcGame = Vue.component("game", {
  template: `
    <game-loop v-bind:game-id="id"></game-loop>
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