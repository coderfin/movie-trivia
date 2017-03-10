let vcGameLoop = Vue.component("game-loop", {
    template: `
        <section class="game-loop">
            <section>
                <h1>{{ title }}</h1>
                <p>Number of players: {{ playerCount }}</p>
            </section>
            <pre-game :game-id="gameId" v-if="gameState === ''"></pre-game>
            <pre-round :game-id="gameId" @selection-made="startRound()" v-if="gameState === 'pre-round'"></pre-round>
            <game-round :game-id="gameId" @finished="endRound()" v-if="gameState === 'round'"></game-round>
            <round-result :game-id="gameId" v-if="gameState === 'post-round'"></round-result>
            <game-result :game-id="gameId" v-if="gameState === 'post-game'"></game-result>
        </section>
    `,
    props: ['gameId'],
    data: function(){
        return {
            numRounds: 0,
            isHost: false,
            gameState: "",
            playerCount: 0,
            title: ""
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
            if(!details){
                return router.push("home");
            }
            this.title = details.title;
            this.numRounds = details.numRounds;
        });

        this.gameStateRef.on("value", (data)=>{
            this.gameState = data.val() || "";
            console.log(this.gameState);
            if(this.gameState === "pre-round"){
                this.roundIndexRef.once("value", (data)=>{
                    let roundIndex = data.val() || -1;
                    roundIndex++;
                    this.roundIndexRef.set(roundIndex);
                });
            }
        });

        this.playersRef.on("value", (data)=>{
            let players = data.val();
            if(!players) return;
            let playerIds = Object.keys(players);
            this.playerCount = playerIds.length;
            this.isHost = players[user.uid].host;
            if(this.isHost){
                if(playerIds.length !== 2) return;
                if(this.gameState === ""){
                    this.currentRoundRef.child("prompterId").once("value", (data)=>{
                        let prompterId = data.val();
                        if(!prompterId){
                            prompterId = playerIds[Math.floor(Math.random() * 2) + 0];
                            this.currentRoundRef.child("prompterId").set(prompterId);
                        }
                    });
                }
                if(this.gameState === "" || this.gameState === "post-game"){
                    let readyCount = 0;
                    playerIds.forEach((key)=>{
                        if(players[key].ready) readyCount++;
                    });
                    if(readyCount == 2){
                        playerIds.forEach((key)=>{
                            this.playersRef.child(`${key}/ready`).set(false);
                        });
                        this.roundsRef.once("value", (data)=>{
                            let rounds = data.val();
                            let prompterId = rounds.current.prompterId == playerIds[0]
                                ? playerIds[1]
                                : playerIds[0];
                            this.roundsRef.child(rounds.index || "0").set(rounds.current);
                            this.roundsRef.child("current").set({prompterId});
                            this.gameStateRef.set("pre-round");
                        });
                    }
                }
            }
        });
        
    },
    methods: {
        startGame(){
            if(this.isHost) this.gameStateRef.set("pre-round");
        },
        startRound(){
            this.gameStateRef.set("round");
        },
        endRound(){
            if(this.isHost){
                this.roundIndexRef.once("value", (data)=>{
                    let roundIndex = data.val();
                    if(roundIndex < this.numRounds - 1){
                        this.gameStateRef.set("post-round");
                    }else{
                        this.gameStateRef.set("post-game");
                    }
                });
            }
        }
    }
});