let vcPlayerGuesses = Vue.component("player-guesses", {
    template: `
        <section class="player-guesses">
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
    `,
    props: ['gameId', 'round', 'otherUserId'],
    data: function() {
        return {
            guess: "",
            suggestions: [],
            suggestionIndex: 0,
            myGuesses: [],
            theirGuesses: []
        }
    },
    mounted: function() {
        firebaseData
            .games
            .child(`${this.gameId}/rounds/${this.round}/${user.uid}`)
            .on("child_added", (data)=>{
                this.myGuesses.push(data.val());
            });

        firebaseData
            .games
            .child(`${this.gameId}/rounds/${this.round}/${this.otherUserId}`)
            .on("child_added", (data)=>{
                this.theirGuesses.push(data.val());
            })
    },
    methods: {
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
    }
});