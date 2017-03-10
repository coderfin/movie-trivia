let vcGameRound = Vue.component('game-round', {
    template: `
        <section class="round">
            <count-down :description="'Starting in...'" :seconds="5" @callback="startRound()" key="game-round-timer" v-if="!started"></count-down>
            <count-down :description="'Time left...'" :seconds="roundDuration" @callback="stopRound()" key="game-round-timer2" v-if="started"></count-down>

            <section v-if="started" class="prompt-selection">
                <h2>{{ round.prompt.Title }}</h2>
                <label>Guess a movie</label>
                <input v-model="searchTerm" @keyup="makeSuggestions()" @keyup.enter="makeGuess()" />
                <ul class="suggestions" v-if="suggestions && suggestions.length">
                    <li class="suggestion" v-for="(suggestion, index) in suggestions" @click="makeGuess(suggestion)">
                        {{ suggestion.Title }}
                    </li>
                </ul>
                <section v-for="player in round.players" class="guesses">
                    <h1>{{player.displayName}}</h1>
                    <ul v-for="guess in player.guesses">
                        <li>{{ guess.Title }}</li>
                    </ul>
                </section>
            </section>
        </section>
    `,
    props: ['gameId'],
    data: function(){
        return {
            round: {},
            roundDuration: 0,
            started: false,
            searchTerm: "",
            suggestions: []
        }
    },
    mounted: function(){
        firebaseData.games.child(`${this.gameId}/details/roundDuration`).once("value", (data)=>{
            this.roundDuration = data.val();
        });
        this.roundRef = firebaseData.games.child(`${this.gameId}/rounds/current`);
        this.roundRef.on("value", (data)=>{
            this.round = data.val();
        });
    },
    methods: {
        startRound(){
            this.started = true;
        },
        stopRound(){
            this.$emit("finished");
        },
        makeSuggestions(){
            movieData.search(this.searchTerm).then((res)=>{
                this.suggestions = res.Search;
            });
        },
        makeGuess(guess){
            if(!guess) guess = this.suggestions[0];
            if(!guess) throw `Invalid movie selection!`;
            movieData.get(guess.imdbID).then((movie)=>{
                this.roundRef
                    .child(`players/${user.uid}/guesses/${movie.imdbID}`)
                    .set(movie);
                this.searchTerm = "";
                this.suggestions = [];
            });
        }
    }
});