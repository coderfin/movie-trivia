const userPromise = firebase.auth().getRedirectResult().then((result) => {
    let googleUser = result.user;
    if (!googleUser) {
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");

        firebase.auth().signInWithRedirect(provider);
    }

    return new Promise((resolve, reject) => {
        let firebaseUser = firebaseData.players.child(googleUser.uid);
        firebaseUser.on("value", (user) => {
            if (user.exists()) {
                let player = user.val();
                
                resolve({
                    displayName: player.displayName,
                    photoUrl: player.photoUrl,
                    highScore: player.highScore,
                    firebaseUser
                });
            } else {
                firebaseUser.set({
                    displayName: googleUser.displayName,
                    photoUrl: googleUser.photoURL,
                    highScore: 0
                }, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            displayName: googleUser.displayName,
                            photoUrl: googleUser.photoURL,
                            highScore: 0,
                            firebaseUser
                        });
                    }
                });
            }
        });
    });
});