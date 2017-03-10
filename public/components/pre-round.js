let vcPreRound = Vue.component("pre-round", {
    template: `
        <section class="pre-round">
            <section v-if="isPrompter">
                <input v-model="searchTerm" @keyup.enter="selectPrompt()" @keyup="makeSuggestions()" />
                <div class="suggestions" v-if="suggestions && suggestions.length">
                    <div v-for="(suggestion, index) in suggestions" @click="selectMovie(suggestion) :class="{ selected: index == suggestionIndex }">
                        {{ suggestion.Title }}
                    </div>
                </div>
            </section>
            <section v-if="!isPrompter">
                Waiting for other player to select a movie...
            </section>
        </section>
    `,
    props: ['gameId'],
    data: function(){
        return {
            isPrompter: false,
            searchTerm: "",
            suggestions: []
        }
    },
    mounted: function(){
        this.roundRef = firebaseData.games.child(`${this.gameId}/rounds/current`);
        this.roundRef
            .child("prompterId")
            .once("value", (data)=>{
                let prompterId = data.val();
                this.isPrompter = prompterId === user.uid;
            });
    },
    methods: {
        makeSuggestions(){
            movieData.search(this.searchTerm).then((res)=>{
                this.suggestions = res.Search;
            })
        },
        selectPrompt(prompt){
            if(!prompt) prompt = this.suggestions[0];
            if(!prompt) throw `Invalid movie selection!`;
            movieData.get(prompt.imdbID).then((movie)=>{
                this.roundRef
                    .child("prompt")
                    .set(movie);
                this.$emit("selection-made");
            });
            
        }
    }
});