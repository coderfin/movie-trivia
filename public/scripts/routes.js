let router = new VueRouter({
    routes: [
        { path: "/", name: "home", component: vcHomeScreen },
        { path: "/game-list", name: "game-list", component: vcGameList },
        { path: "/game/:id", name: "game", component: vcGame, props: true },
        { path: "*", redirect: "/" }
    ]
});

new Vue({
    router
}).$mount("main");