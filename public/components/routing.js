{
    const routes = {
        "#home": { template: `<game-list></game-list>` },
        "#about": { template: `<route-about></route-about>` }
    }

    Vue.component("route-about", {
        template: `
        <div>
            <h1>About</h1>
            <route-link href="#home">Home</route-link>
            <route-link href="#about">About</route-link>
        </div>
        `
    });

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
    });

    let router = new Vue({
        el: "app-router",
        data: {
            hash: location.hash
        },
        computed: {
            currentRoute(){
                if(!routes[this.hash]){
                    let defaultHash = this.$el.getAttribute("default-route");
                    this.hash = defaultHash;
                    window.history.pushState(null, routes[this.hash], this.hash);
                }
                return routes[this.hash];
            }
        },
        methods: {
            go (hash){
                this.hash = hash;
                window.history.pushState(null, routes[hash], hash);
            }
        },
        render(h){
            return h(this.currentRoute);
        }
    });

    window.addEventListener("popstate", () => {
        router.currentRoute = location.hash;
    });

    window.router = router;
}