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
  mounted: function () {
    this.time = new Date().getTime();
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