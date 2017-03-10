let vcGame = Vue.component("game", {
  template: `
    <section>
      <p>This is a new game.</p>
      <section v-if="game">
        <h1>{{ game.displayName }}</h1>
      </section>
      <section v-else>no game</section>

      <game-loop :game-id="id"></game-loop>

    </section>
  `,
  props: ["id"],
  data: function () {
    return {
      game: null
    };
  },
  mounted: function () {
    let game = firebaseData.games.child(this.$props.id);
    
    game.on("value", (firebaseGame) => {
        this.game = firebaseGame.val();

        //this.game.child("players/")
    });
  },
  methods: {
    // newGame: function () {
    //   router.go("#game");
    // }
  }
});

// let displayName = prompt("Enter a name for this new game.");

//       let firebaseGame = firebaseData.games.child(firebaseData.games.push().key);

//       firebaseGame.set({
//           displayName,
//           // players: [data.] // current user
//       }, (error) => {
//           if(error) {
//               console.log(error);
//           }
//       });