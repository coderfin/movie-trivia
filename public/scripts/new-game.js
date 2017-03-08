{
    let newUuid = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            let r = Math.random()*16|0;
            let v = (c === "x") ? r : (r&0x3|0x8);

            return v.toString(16);
        });
    };

    window.createNewGame = () => {
        let displayName = window.prompt("Name this game:");

        let firebaseGame = firebaseData.games.child(newUuid());

        firebaseGame.set({
            displayName,
            // players: [data.] // current user
        }, (error) => {
            if(error) {
                console.log(error);
            }
        });
    };
}