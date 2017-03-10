let vcGameLoop = Vue.component("game-loop", {
    template: `
        <section class="game-play">
            <section class="pre-game" v-if="gameState === 'pre-game'">
                <pre-game :game-id="gameId"></pre-game>
            </section>
            <section class="pre-round" v-if="gameState === 'pre-round'">
                <pre-round :game-id="gameId" @selection-made="startRound()"></pre-round>
            </section>
            <section class="round" v-if="gameState === 'round'">
                <game-round :game-id="gameId" @finished="endRound()"></game-round>
            </section>
            <section class="post-round" v-if="gameState === 'post-round'">
                <post-round :game-id="gameId"></post-round>
            </section>
            <section class="post-game" v-if="gameState === 'post-game'">
                <post-game :game-id="gameId"></post-game>
            </section>
        </section>
    `,
    props: ['gameId'],
    data: function(){
        return {
            numRounds: 0,
            thisRound: -1,
            nextRound: 0,
            isHost: false
        }
    },
    mounted: function(){
        this.gameRef = firebaseData.games.child(`${this.gameId}`);
        this.gameStateRef = this.gameRef.child("state");
        this.gameDetailsRef = this.gameRef.child("details");
        this.playersRef = this.gameRef.child('players');
        this.roundsRef = this.gameRef.child("rounds");
        this.roundIndexRef = this.roundsRef.child("index");
        this.currentRoundRef = this.roundsRef.child("current");

        this.gameDetailsRef.once("value", (data)=>{
            let details = data.val();
            this.numRounds = details.numRounds;
            this.currentRoundRef.child("prompterId").set(details.initialPrompterId);
        });

        this.gameStateRef.on("value", (data)=>{
            this.gameState = data.val() || "pre-game";
            if(this.gameState === "pre-round"){
                this.roundIndexRef.once("value", (data)=>{
                    let roundIndex = data.val() || -1;
                    roundIndex++;
                    this.roundIndexRef.set(roundIndex);
                });
            }
        });

        this.playersRef.on("value", (data)=>{
            this.players = data.val();
            if(!this.players) return;
            this.isHost = this.players[user.uid].host;
            if(this.gameState === "pre-game" || this.gameState === "post-game"){
                let readyCount = 0;
                let playerIds = Object.keys(this.players);
                playerIds.forEach((key)=>{
                    if(this.players[key].ready) readyCount++;
                });
                if(readyCount == 2){
                    playerIds.forEach((key)=>{
                        this.playersRef.child(`${key}/ready`).set(false);
                    });
                    this.roundsRef.once("value", (data)=>{
                        let prompterId = rounds.current.prompterId == playerIds[0]
                            ? playerIds[1]
                            : playerIds[0];
                        let rounds = data.val();
                        this.roundsRef.child(rounds.index).set(rounds.current);
                        this.roundsRef.child("current").set({prompterId});
                        this.gameStateRef.set("pre-round");
                    });
                }
            }
            
        });
        
    },
    methods: {
        startGame(){
            this.gameStateRef.set("pre-round");
        },
        startRound(){
            this.gameStateRef.set("round");
        },
        endRound(){
            if(this.nextRound < this.numRounds){
                this.gameStateRef.set("post-round");
            }else{
                this.gameStateRef.set("post-game");
            }
        }
    }
});