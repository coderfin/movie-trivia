let vcHighScore = Vue.component("high-score", {
  template: `
    <section class="high-score">
      <h2>High Scores</h2>
      <div v-for="player in players" class="player">
        <img v-bind:src="player.photoUrl" />
        <router-link v-bind:to="{ name: 'profile', params: { id: player.key } }">{{ player.displayName }}</router-link>
        <span flex></span>
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

    firebaseData
      .players
      .orderByChild("highScore")
      .limitToFirst(10)
      .on("child_added", (data) => {
        let player = data.val();
        player.key = data.key;
        this.$data.players.push(player);
      });

    firebaseData
      .players
      .on("child_removed", (data) => {
        let player = data.val();
        player.key = data.key;
        this.$data.players.splice(this.$data.players.indexOf(player), 1);
      });

  }
});