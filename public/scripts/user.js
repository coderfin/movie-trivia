let userPromise = firebase.auth().getRedirectResult().then((result)=>{
    if (result.credential) {
        let token = result.credential.accessToken;
    }
    let user = result.user;
    if(!user){ 
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        firebase.auth().signInWithRedirect(provider);
    }
    return user;
});