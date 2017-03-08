const userPromise = firebase.auth().getRedirectResult().then(result => {
    if (result.credential) {
        let token = result.credential.accessToken;
    }

    let user = result.user;
    if (!user) {
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");

        firebase.auth().signInWithRedirect(provider);
    }

    return new Promise((resolve, reject) => {
        let dbUser = data.players.child(user.uid);
        dbUser.on("value", data => {
            if (data.exists()) {
                let player = data.val();
                
                resolve({
                    displayName: player.displayName,
                    photoUrl: player.photoUrl,
                    highScore: player.highScore,
                    dbUser
                });
            } else {
                dbUser.set({
                    displayName: user.displayName,
                    photoUrl: user.photoURL,
                    highScore: 0
                }, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve({
                            displayName: user.displayName,
                            photoUrl: user.photoURL,
                            highScore: 0,
                            dbUser
                        });
                    }
                });
            }
        });
    });
});