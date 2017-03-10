let vcGameResult = Vue.component("game-result", {
    template: `
    <section class="game-result component center">
      <section v-for="player in game.players">
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
    props: ["gameId"],
    data: function () {
        return {
            game: {}
        };
    },
    mounted: function () {
        let getResult = (data) => {
            let game = data.val();
            let playerIds = Object.keys(game.players);
            playerIds.forEach((userId)=>{
                game.players[userId]._totalPoints = 0;
            });
            let numRounds = parseInt(game.details.numRounds);
            for(let i=0; i < 10; i++){
                let round = game.rounds[i];
                if(!round || !round.prompt) continue;
                round.prompt._actors = round.prompt.Actors.split(/,\s+/);
                console.log(round.prompt._actors);
                let players = round.players;
                playerIds.forEach((userId)=>{
                    let player = players[userId];
                    let guesses = player.guesses;
                    Object.keys(guesses).forEach((imdbID)=>{
                        let guess = guesses[imdbID];
                        guess._actors = [];
                        let actors = guess.Actors.split(/,\s+/);
                        actors.forEach((actor)=>{
                            if(round.prompt._actors.indexOf(actor) !== -1){
                                guess._actors.push(actor);
                                game.players[userId]._totalPoints++;
                            }
                        });
                        if(guess._actors.length) guess._correct = true;
                    });
                });

            }
            /*
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
            */

            console.log(`\n\nGAME DATA:\n`);
            console.dir(game);
            console.log(`\n\n`);
            this.game = game;
        }

        firebaseData
            .games
            .child(this.gameId)
            .once("value", getResult);   
    }
});