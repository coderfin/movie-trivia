let vcHighScore = Vue.component("high-score", {
  template: `
    <section>
      <h2>High Scores</h2>
      <div v-for="player in players">
        <span>{{ player.displayName }}</span>
        <span>{{ player.highScore }}</span>
      </div>
    </section>
  `,
  data: function () {
    return {
      players: []
    };
  },
  mounted: function () {
    firebaseData.players.on("child_added", (data) => {
      let player = data.val();
      this.$data.players.push(player);
    });
    firebaseData.players.on("child_removed", (data) => {
      let player = data.val();
      this.$data.players.splice(this.$data.players.indexOf(player), 1);
    });
  }
});