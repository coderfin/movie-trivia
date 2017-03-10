let vcCountDown = Vue.component("count-down", {
  template: `
    <div class="count-down">
        <p v-if="description">{{ description }}</p>
        <div>{{ status }}</div>
    </div>
  `,
  props: ["description", "seconds", "finished"],
  data: function () {
    return {
      status: ""
    };
  },
  updated: function() {
    console.log(`UPDATED: ${this.seconds}`);
    console.log(`\n${this.time}\n`)
  },
  created: function () {
    console.log(`CREATED: ${this.seconds}`);
  },
  mounted: function () {
    this.time = new Date().getTime();
    console.log(`MOUNTED: ${this.seconds}`);
    this.status = this.seconds;

    let interval = setInterval(() => {
        if(this.status) {
            this.status--;
        } else {
            clearInterval(interval);
            
            if(this.finished) {
                this.status = this.finished;
            }

            this.$emit("callback");
        }
    }, 1000);
  }
});