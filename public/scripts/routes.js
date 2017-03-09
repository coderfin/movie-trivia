let router = new VueRouter({
    routes: [
        { path: "/", name: "home", component: vcHomeScreen },
        { path: "/game/:id", name: "game", component: vcGame, props: true },
        { path: "*", redirect: "/" }
    ]
});

new Vue({
    router
}).$mount("main");