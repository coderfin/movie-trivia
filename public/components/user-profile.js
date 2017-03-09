let vcUserProfile = Vue.component("user-profile", {
  template: `
    <section class="user-profile component center">
      <h1>&nbsp;</h1>
      <img v-bind:src="player.photoUrl" />
      <h2>{{ player.displayName }}</h2>
      <section class="stats">
        <dl>
          <dd>{{ player.highScore || "0" }}</dd>
          <dt class="won">Won</dt>
        </dl>
        <dl>
          <dd>{{ player.gamesPlayed || "0" }}</dd>
          <dt class="played">Played</dt>
        </dl>
        <dl>
          <dd>{{ player.highScore || "0" }}</dd>
          <dt class="high">High Score</dt>
        </dl>
        <dl>
          <dd>{{ player.totalPoints || "0" }}</dd>
          <dt class="total">Total Points</dt>
        </dl>
        <dl>
          <dd>{{ (player.totalPoints / player.gamesPlayed) || "0" }}</dd>
          <dt class="average">Average Points</dt>
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