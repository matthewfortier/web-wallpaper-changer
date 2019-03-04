<template>
  <div id="app">
    <HeaderBar/>
    <input placeholder="Subreddit" v-model="subreddit" type="text">
    <select v-model="scale">
      <option selected>Fit</option>
      <option>Auto</option>
      <option>Fill</option>
      <option>Stretch</option>
      <option>Center</option>
      <option>Tile</option>
    </select>
    <button @click="grabImages()">Fetch</button>
    <button @click="autoRefresh = !autoRefresh">{{ autoRefresh ? "Stop" : "Start" }}</button>
    <p>{{ picturelist.pictureCount }}</p>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
const electron = window.require("electron");
require("reddit.js");

var timer = null;

export default {
  name: "app",
  components: {
    HeaderBar
  },
  data() {
    return {
      subreddit: "aww",
      scale: "Fit",
      response: {},
      picturelist: {
        pictures: [],
        pictureCount: 0
      },
      autoRefresh: false
    };
  },
  methods: {
    grabImages() {
      //electron.ipcRenderer.send("grabImages", this.subreddit);
      var that = this;

      that.picturelist.pictures = [];
      that.picturelist.pictureCount = 0;

      reddit
        .top(this.subreddit)
        .t("all")
        .limit(50)
        .fetch(res => {
          this.picturelist.pictureCount = res.data.children.length;

          var image =
            res.data.children[
              Math.floor(Math.random() * res.data.children.length)
            ];

          while (image.data.url.endsWith(".jpg") == false) {
            console.log("While");
            image =
              res.data.children[
                Math.floor(Math.random() * res.data.children.length)
              ];
          }

          electron.ipcRenderer.send("grabImages", {
            link: image.data.url,
            scale: this.scale
          });
        });
    }
  },
  watch: {
    autoRefresh(val) {
      if (val) {
        // it seems to me this additional check would make sense?
        timer = window.setInterval(() => {
          this.grabImages();
        }, 10 * 1000);
      } else {
        window.clearInterval(timer);
        timer = null;
      }
    }
  },
  created() {
    //this.startStop();
  },
  mounted() {}
};
</script>

<style lang="scss">
@import "./themes.scss";
body {
  background-color: $header-color;
  padding: 0;
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $flag-selected-color-light;
}
</style>
