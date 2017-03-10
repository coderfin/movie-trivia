let vcGameRound = Vue.component('game-round', {
    template: `
        <div>

            <count-down :description="Starting in..." :seconds="5" @callback="startRound()"></count-down>

            <section v-if="started">
                <label>
                    <span>Guess a movie</span>
                    <input v-model="searchTerm" @keyup="makeSuggestions()" />
                </label>
                <div class="suggestions" v-if="suggestions && suggestions.length">
                    <div class="suggestion" v-for="(suggestion, index) in suggestions">
                        {{ suggestion.Title }}
                    </div>
                </div>
                <div v-for="player in round.players">
                    <div v-for="guess in player.guesses">
                        {{ guess.Title }}
                    </div>
                </div>
            </section>

        </div>
    `,
    props: ['gameId'],
    data: function(){
        return {
            round: {},
            started: false,
            searchTerm: "",
            suggestions: []
        }
    },
    mounted: function(){
        this.roundRef = firebaseData.games.child(`${this.gameId}/rounds/current`);
        this.roundRef.on("value", (data)=>{
            this.round = data.val();
        });
    },
    methods: {
        startRound(){
            this.started = true;
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