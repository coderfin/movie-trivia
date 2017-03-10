let vcGameResult = Vue.component("game-result", {
    template: `
    <section class="game-result component center">
      <h1>{{game.details.title}}</h1>
      <section v-for="player in players">
        <section v-bind:class="{ winner: player.isWinner }">
            <h2>{{player.displayName}}</h2>
            <img v-bind:src="player.photoUrl">
            <div v-if="player.isWinner" class="icon-medal-star"></div>
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
      </section>
    </section>
  `,
    props: ["id"],
    data: function () {
        return {
            game: {
                details: {}
            },
            players: []
        };
    },
    mounted: function () {
        let dbGame = firebaseData.games.child(this.$props.id);

        dbGame.on("value", (firebaseGame) => {
            this.game = firebaseGame.val();

            Object.keys(this.game.players).forEach((playerId) => {
                if (playerId !== "undefined") {
                    let dbPlayer = firebaseData.players.child(playerId);

                    dbPlayer.on("value", (firebasePlayer) => {
                        this.players.push(firebasePlayer.val());
                    });
                }
            });
        });
    },
});