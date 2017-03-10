let vcPreGame = Vue.component("pre-game", {
    template: `
        <section>
            <button v-if="!playerReady" @click="setReady" class="green">I'm Ready</button>
            <p v-if="playerReady">Waiting for the other player...</p> 
        </section>
    `,
    props: ['gameId'],
    data: function(){
        return {
            playerReady: false
        }
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