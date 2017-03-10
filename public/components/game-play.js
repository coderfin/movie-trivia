let vcGamePlay = Vue.component("game-play", {
    template: `
        <section class="game-play">
            <section class="ready" v-if="gameState === 'pre-game' || gameState === 'ready'">
                <button v-if="!playerReady" @click="setReady">I'm Ready</button>
                <div v-if="countDown.running">{{ countDown.description }} {{ countDown.status }}</div>
            </section>
            <section class="pre-round" v-if="gameState === 'pre-round'">
                <label>
                    <span>Please select a movie to start</span>
                    <input v-model="movieSearchTerm" @keyup="searchMovies" />
                </label>
                <div class="suggestion" v-for="suggestion in suggestions" @click="selectPrompt(suggestion)">
                    {{ suggestion.Title }}
                </div>
            </section>
            <section class="round" v-if="gameState === 'round'">
                <div class="timer">{{ roundTimer.description }} {{ roundTimer.status }}</div>
                <div class="player-guesses" vv-for="(player, key) in round.players">
                    
                </div>
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
                seconds: 5,
                status: ""
            },
            roundTimer: {
                description: "Time left: ",
                seconds: 10,
                status: ""
            },
            players: {},
            gameState: "waiting",
            movieSearchTerm: "",
            suggestions: [],
            prompt: {},


            guess: "",
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
            this.roundTimer.seconds = details.roundDuration;
            // TODO ...??
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
            this.gameState = data.val() || "pre-game";
            if(this.gameState === "ready"){
                startRound();
            }else if(this.gameState === "round"){
                this.roundTimer.status = this.roundTimer.seconds;
                roundTimerInterval = setInterval(()=>{
                    this.roundTimer.status--;
                    if(this.roundTimer.status <= 0){
                        clearInterval(roundTimerInterval);
                        if(this.isHost) this.gameStateRef.set("post-round");
                    }
                }, 1000);
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
                Object.keys(this.players).forEach((key)=>{
                    this.playersRef.child(`${key}/ready`).set(false);
                });
                this.gameStateRef.set("ready");
            }
        });

        this.currentRoundRef.on("value", (data)=>{
            this.round = data.val();
        })

        let startRound = () => {
            this.countDown.running = true;
            this.countDown.status = this.countDown.seconds;
            countDownInterval = setInterval(()=>{
                this.countDown.status--;
                if(this.countDown.status <= 0){
                    clearInterval(countDownInterval);
                    this.countDown.running = false;
                    this.playerReady = false;
                    if(this.isHost) this.gameStateRef.set("pre-round");
                }
            }, 1000);
        }

    },
    methods: {
        setReady: function() {
            this.playerReady = true;
            this.playersRef.child(`${user.uid}/ready`).set(true);  
        },
        searchMovies: function() {
            movieData.search(this.movieSearchTerm).then((res)=>{
                this.suggestions = res.Search;
            });
        },
        selectPrompt: function(movie) {
            this.movieSearchTerm = "";
            this.suggestions = [];
            this.promptMovie = movie;
            this.gameStateRef.set("round");
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
            this.suggestionIndex--;
            if(this.suggestionIndex <= 0){
                this.suggestionIndex = this.suggestions.length - 1;
            }
        },
        moveDown: function(e) {
            this.suggestionIndex++;
            if(this.suggestionIndex >= this.suggestions.length){
                this.suggestionIndex = 0;
            }
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