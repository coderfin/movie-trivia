const userPromise = new Promise((resolve, reject)=>{
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            resolve(user);
        }else{
            firebase.auth().getRedirectResult().then((result) => {
                googleUser = result.user;
                if (!googleUser) {
                    let provider = new firebase.auth.GoogleAuthProvider();
                    //provider.addScope("profile");
                    firebase.auth().signInWithRedirect(provider);
                }
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
        }
    });
})
