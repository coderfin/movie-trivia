let vcGamePlay = Vue.component("game-play", {
    template: `
        <section class="game-play">
            <section class="ready" v-if="gameState === 'waiting' || gameState === 'ready'">
                <button v-if="!playerReady" @click="setReady">I'm Ready</button>
                <count-down v-if="countDown.running" :description="countDown.description" :seconds="countDown.seconds" @callback="onTimerComplete"></count-down>
            </section>
            <section class="round" v-if="gameState === 'round'">
                <count-down :description="roundTimer.description" :seconds="roundTimer.seconds" @callback="endRound"></count-down>
                Round!!!
            </section>
        </section>
    `,
    props: ['gameId'],
    data: function() {
        return {
            isHost: false,
            playerReady: false,
            countDown: {
                running: false,
                description: "Starting in...",
                seconds: 5
            },
            roundTimer: {
                running: false,
                description: "Time left: ",
                seconds: 10
            },
            players: {},
            gameState: "waiting",


            guess: "",
            suggestions: [],
            suggestionIndex: 0,
            currentRound: 0,
            roundData: {}
        }
    },
    mounted: function() {
        this.gameRef = firebaseData.games.child(`${this.gameId}`);
        this.gameStateRef = this.gameRef.child("state");
        this.playersRef = this.gameRef.child('players');
        this.roundsRef = this.gameRef.child("rounds");
        this.roundIndexRef = this.roundsRef.child("index");
        this.gameDetailsRef = this.gameRef.child("details");
        this.currentRoundRef = this.roundsRef.child("current");

        this.roundIndex = 0;
        this.gameState = null;

        this.gameDetailsRef.once("value", (data)=>{
            let details = data.val();
            console.log(details);
            this.roundTimer.seconds = details.roundDuration;
            // TODO ...
        });

        this.roundIndexRef.on("value", (data)=>{
            let newIndex = data.val();
            if(newIndex === null) {
                this.roundIndexRef.set(0);
                return;
            }
            if(typeof newIndex !== typeof this.roundIndex){
                throw `Data types are not compatible: ${typeof newIndex} ${typeof this.roundIndex}`;
            }
            if(newIndex !== this.roundIndex){
                this.currentRoundRef.once("value", (data)=>{
                    this.rounds.child(this.roundIndex).set(data.val());
                    this.roundIndex = newIndex;
                });
            }
        });

        this.gameStateRef.on("value", (data)=>{
            this.gameState = data.val();
            if(this.gameState === "ready"){
                startRound();
            }else if(this.gameState === "round"){

            }
        })
        
        this.playersRef.on("value", (data)=>{
            this.players = data.val();
            if(!this.players) return;
            this.isHost = this.players[user.uid].host;
            let readyCount = 0;
            Object.keys(this.players).forEach((key)=>{
                let player = this.players[key];
                if(player.ready) readyCount++;
            });
            if(readyCount == 1){
                this.gameStateRef.set("ready");
            }
        });

        this.currentRoundRef.on("value", (data)=>{
            this.round = data.val();
        })

        let startRound = () => {
            this.countDown.running = true;

            // TODO remove round ref listeners
        }

    },
    methods: {
        setReady: function() {
            this.playerReady = true;
            this.playersRef.child(`${user.uid}/ready`).set(true);  
        },
        onTimerComplete: function() {
            this.playerReady = false;
            this.countDown.running = false;
            if(this.isHost) this.gameStateRef.set("round");
        }
        
        /*,
        makeGuess: function() {
            if(this.suggestions && this.suggestions.length){
                movieData
                    .get(this.suggestions[0].imdbID)
                    .then((movie)=>{
                        let roundUserRef = firebaseData
                            .games
                            .child(`${this.gameId}/rounds/${this.round}/${user.uid}`);
                        roundUserRef
                            .child(roundUserRef.push().key)
                            .set(movie);
                        this.guess = "";
                        this.suggestions = [];
                            
                    });
            }
        },
        makeSuggestions: function() {
            movieData.search(this.guess).then((movies)=>{
                this.suggestions = movies.Search;
                this.suggestionIndex = 0;
            });
        },
        moveUp: function(e) {
            e.preventDefault();
            console.log(this.suggestionIndex);
            this.suggestionIndex--;
            if(this.suggestionIndex <= 0){
                this.suggestionIndex = this.suggestions.length - 1;
            }
            console.log(this.suggestionIndex);
        },
        moveDown: function(e) {
            console.log(this.suggestionIndex);
            this.suggestionIndex++;
            if(this.suggestionIndex >= this.suggestions.length){
                this.suggestionIndex = 0;
            }
            console.log(this.suggestionIndex);
        }
        */

        /*

            <section class="round">
                <div class="my-player">
                    <input v-model="guess" @keyup.enter="makeGuess" @keyup.up="moveUp" @keyup.moveDown="down" @keyup="makeSuggestions" />
                    <div class="suggestions" v-if="suggestions && suggestions.length">
                        <div v-for="(suggestion, index) in suggestions" :class="{ selected: index == suggestionIndex }">
                            {{index}} {{ suggestion.Title }}
                        </div>
                    </div>
                    <div v-for="guess in myGuesses" class="guess">
                        {{ guess.Title }}
                    </div>
                </div>
                <div class="their-player">
                    <div v-for="guess in theirGuesses" class="guess">
                        {{ guess.Title }}
                    </div>
                </div>
            </section>

        */
    }
});