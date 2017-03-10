let vcRoundResult = Vue.component("round-result", {
    template: `
    <section class="round-result component center">
      <h1>{{game.details.title}}</h1>
      <section v-for="player in players">
        <section v-bind:class="{ winner: player.isWinner || true }">
            <button class="green">I'm ready for the next round</button>
            <section class="profile">
                <h2>{{player.displayName}}</h2>
                <img v-bind:src="player.photoUrl">
                <div v-if="player.isWinner || true" class="icon-medal-star"></div>
            </section>
            <section class="prompt">
                <h1><em>Some Movie</em></h1>
                <ul>
                    <li>Meg Ryan</li>
                    <li>Meg Ryan</li>
                    <li>Meg Ryan</li>
                </ul>
            </section>
            <section class="guesses">
                <section class="correct">
                    <h1><em>Title</em> - <strong>1/2</strong></h1>
                    <ul>
                        <li class="guessed">Meg Ryan</li>
                        <li>Meg Ryan</li>
                    </ul>
                </section>
                <section>
                    <h1>Title - 0</h1>
                    <ul>
                        <li>Meg Ryan</li>
                    </ul>
                </section>
            </section>
            <div flex></div>
            <section class="stats">
                <dl>
                    <dd>{{ player.totalPoints || "0" }}</dd>
                    <dt class="total">Total Points</dt>
                </dl>
            </section>
        </section>
        <section v-bind:class="{ winner: player.isWinner }">
            <button class="green">I'm ready for the next round</button>
            <section class="profile">
                <h2>{{player.displayName}}</h2>
                <img v-bind:src="player.photoUrl">
                <div v-if="player.isWinner" class="icon-medal-star"></div>
            </section>
            <section class="prompt">
                <h1>Some Movie</h1>
                <ul>
                    <li>Meg Ryan</li>
                    <li>Meg Ryan</li>
                    <li>Meg Ryan</li>
                </ul>
            </section>
            <section class="guesses">
                <section class="correct">
                    <h1><em>Title</em> - <strong>1/2</strong></h1>
                    <ul>
                        <li class="guessed">Meg Ryan</li>
                        <li>Meg Ryan</li>
                    </ul>
                </section>
                <section>
                    <h1>Title - 0</h1>
                    <ul>
                        <li>Meg Ryan</li>
                        <li>Meg Ryan</li>
                        <li>Meg Ryan</li>
                        <li>Meg Ryan</li>
                        <li>Meg Ryan</li>
                    </ul>
                </section>
                <section>
                    <h1>Title - 0</h1>
                    <ul>
                        <li>Meg Ryan</li>
                    </ul>
                </section>
                <section>
                    <h1>Title - 0</h1>
                    <ul>
                        <li>Meg Ryan</li>
                        <li>Meg Ryan</li>
                        <li>Meg Ryan</li>
                        <li>Meg Ryan</li>
                        <li>Meg Ryan</li>
                        <li>Meg Ryan</li>
                        <li>Meg Ryan</li>
                    </ul>
                </section>
                <section>
                    <h1>Title - 0</h1>
                    <ul>
                        <li>Meg Ryan</li>
                    </ul>
                </section>
                <section>
                    <h1>Title - 0</h1>
                    <ul>
                        <li>Meg Ryan</li>
                    </ul>
                </section>
            </section>
            <div flex></div>
            <section class="stats">
                <dl>
                    <dd>{{ player.totalPoints || "0" }}</dd>
                    <dt class="total">Total Points</dt>
                </dl>
            </section>
        </section>
      </section>
    </section>
  `,
    props: ["gameId"],
    data: function () {
        return {
            game: {
                details: {}
            },
            round: {
                prompt: {

                }
            },
            players: []
        };
    },
    mounted: function () {
        let dbGame = firebaseData.games.child(this.gameId);

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