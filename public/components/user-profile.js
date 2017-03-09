let vcUserProfile = Vue.component("user-profile", {
  template: `
    <section>
      <h2>{{ player.displayName }}</h2>
      <img v-bind:src="player.photoUrl" />
      <dl>
        <dt>High Score</dt>
        <dd>{{ player.highScore || "0" }}</dd>
      </dl>
      <dl>
        <dt>Games Played</dt>
        <dd>{{ player.gamesPlayed || "0" }}</dd>
      </dl>
      <dl>
        <dt>Total Points</dt>
        <dd>{{ player.totalPoints || "0" }}</dd>
      </dl>
      <dl>
        <dt>Average Points / Game</dt>
        <dd>{{ (player.totalPoints / player.gamesPlayed) || "-" }}</dd>
      </dl>
    </section>
  `,
  props: ['id'],
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