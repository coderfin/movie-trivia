let vcUserProfile = Vue.component("user-profile", {
  template: `
    <section class="user-profile component center">
      <h1>&nbsp;</h1>
      <img v-bind:src="player.photoUrl" />
      <h2>{{ player.displayName }}</h2>
      <section class="stats">
        <dl>
          <dd>{{ player.highScore || "0" }}</dd>
          <dt>High Score</dt>
        </dl>
        <dl>
          <dd>{{ player.gamesPlayed || "0" }}</dd>
          <dt>Games Played</dt>
        </dl>
        <dl>
          <dd>{{ player.totalPoints || "0" }}</dd>
          <dt>Total Points</dt>
        </dl>
        <dl>
          <dd>{{ (player.totalPoints / player.gamesPlayed) || "-" }}</dd>
          <dt>Average Points / Game</dt>
        </dl>
      </section>
    </section>
  `,
  props: ["id"],
  data: function () {
    return {
      player: {}
    };
  },
  mounted: function () {
    firebaseData
        .players
        .child(this.$props.id)
        .on("value", (data) => {
            this.$data.player = data.val();
        });
        
  }
});