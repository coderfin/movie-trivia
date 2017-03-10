let resolveUser = (user, resolve, reject) => {
    let player = firebaseData.players.child(user.uid);

    player.on("value", (firebaseUser) => {
        if (firebaseUser.exists()) {
            resolve(firebaseUser.val());
        } else {
            let playerDetails = {
                displayName: user.displayName,
                photoUrl: user.photoURL,
                highScore: 0,
                uid: user.uid
            };

            player.set(playerDetails);

            resolve(playerDetails);
        }
    });
}

const userPromise = new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(function (user) {
        let currentUser = firebase.auth().currentUser;
        
        if (currentUser) {
            resolveUser(currentUser, resolve, reject);
        } else {
            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider).then(function (result) {
                resolveUser(result.user, resolve, reject);
            });
        }
    });
})
