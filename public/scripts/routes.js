let router = new VueRouter({
    routes: [
        { path: "/game-list", name: "game-list", component: vcGameList },
        { path: "/game/:id", name: "game", component: vcGame, props: true },
        { path: "*", redirect: "/game-list" }
    ]
});

new Vue({
    router
}).$mount("main");