let vcPreRound = Vue.component("pre-round", {
    template: `
        <section>
            <section v-if="isPrompter" class="prompt-selection">
                <label>Select a movie (prompt)</label>
                <input v-model="searchTerm" @keyup.enter="selectPrompt()" @keyup="makeSuggestions()" />
                <ul class="suggestions" v-if="suggestions && suggestions.length">
                    <li v-for="suggestion in suggestions" @click="selectPrompt(suggestion)">
                        {{ suggestion.Title }}
                    </li>
                </ul>
            </section>
            <p v-if="!isPrompter">Waiting for the other player to select a movie...</p>
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