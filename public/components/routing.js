const routes = {
    "#home": { template: `<game-list></game-list>` },
    "#about": { template: "<route-about></route-about>" }
}

Vue.component("route-about", {
    template: `
    <div>
        <h1>About</h1>
        <route-link href="#home">Home</route-link>
        <route-link href="#about">About</route-link>
    </div>
    `
})

Vue.component("route-link", {
    template: `
    <a :href="href" @click="go"><slot></slot></a>
    `,
    props: {
    href: String,
    required: true
    },
    methods: {
    go (e){
        e.preventDefault();
        this.$root.hash = this.href;
        window.history.pushState(null, routes[this.href], this.href);
    }
    }
})

new Vue({
    el: "app-router",
    data: {
    hash: location.hash,
    default: "#home"
    },
    computed: {
    currentRoute(){
        if(!routes[this.hash]){
        this.hash = this.default;
        }
        return routes[this.hash];
    }
    },
    render(h){
    return h(this.currentRoute);
    }
})

window.addEventListener("popstate", () => {
    app.currentRoute = location.hash;
})