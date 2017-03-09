const movies = {
    search(term){
        return fetch(`https://www.omdbapi.com/?s=${term}`).then(res => res.json())
    },
    get(id){
        return fetch(`https://www.omdbapi.com/?i=${id}`).then(res => res.json());
    }
}