let vcPreGame = Vue.component("pre-game", {
    template: `
        <div>
            <button v-if="!playerReady" @click="setReady" class="green">I'm Ready</button>
            <div v-if="playerReady">Waiting for other player</div> 
        </div>
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