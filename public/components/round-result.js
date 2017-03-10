let vcRoundResult = Vue.component("round-result", {
    template: `
    <section class="round-result component center">
      <button class="green" @click="setReady">I'm ready for the next round</button>
      {{ round.players }}
      <section v-for="player in round.players">
        <section v-bind:class="{ winner: player.isWinner || true }">
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
            round: {},
            players: []
        };
    },
    mounted: function () {
        let getResult = (data) => {
            let round = data.val();
            round.prompt._actors = round.prompt.Actors.split(/,\s+/);
            let players = round.players;
            let playerIds = Object.keys(players);
            let winnerPoints = 0;
            let winnerId;
            playerIds.forEach((userId)=>{
                let player = players[userId];
                let guesses = player.guesses;
                player._points = 0;
                Object.keys(guesses).forEach((imdbID)=>{
                    let guess = guesses[imdbID];
                    guess._actors = [];
                    let actors = guess.Actors.split(/,\s+/);
                    actors.forEach((actor)=>{
                        if(round.prompt._actors.indexOf(actor) !== -1){
                            guess._actors.push(actor);
                            player._points++;
                        }
                    });
                    if(guess._actors.length) guess._correct = true;
                });
                if(player._points > winnerPoints){
                    winnerId = userId;
                    winnerPoints = player._points;
                }
            });
            round.players[winnerId].isWinner = true;

            console.log(`\n\nROUND DATA:\n`);
            console.dir(round);
            console.log(`\n\n`);
        }

        firebaseData
            .games
            .child(`${this.gameId}/rounds/current`)
            .once("value", getResult);
    },
    methods: {
        setReady: function(){
            this.playerReady = true;
            firebaseData
                .games
                .child(`${this.gameId}/players/${user.uid}/ready`)
                .set(true);
        }
    }
});