Vue.component("count-down", {
  template: `
    <div class="count-down">
        <p v-if="countdown.description">{{ countdown.description }}</p>
        <div>{{ countdown.status }}</div>
    </div>
  `,
  props: ["description", "seconds", "finished"],
  data: function () {
    return {
      countdown: {
        seconds: this.seconds || 10,
        description: this.description,
        finished: this.finished,
        callback: this.callback,
        status: ""
      }
    };
  },
  mounted: function () {
    this.countdown.status = this.countdown.seconds;

    let interval = setInterval(() => {
        if(this.countdown.status) {
            this.countdown.status--;
        } else {
            clearInterval(interval);
            
            if(this.countdown.finished) {
                this.countdown.status = this.countdown.finished;
            }

            if(typeof this.callback === "function") {
                this.callback();
            }
        }
    }, 1000);
  }
});