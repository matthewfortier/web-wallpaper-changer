<template>
  <div class="history">
    <button id="clear-history" @click="clearHistory()">Clear History</button>
    <div
      class="history-image"
      v-for="(img, index) in images.slice(1)"
      :key="index"
      @click="changeWallpaper(img)"
    >
      <v-lazy-image :src="img.link" />
    </div>
  </div>
</template>

<script>
import store from "../store.js";
const electron = window.require("electron");

export default {
  name: "history",
  data() {
    return {
      images: [],
      scale: store.state.scale
    };
  },
  methods: {
    changeWallpaper(img) {
      console.log("Changing to " + img.link);
      electron.ipcRenderer.send("change-wallpaper", {
        link: img.link,
        subreddit: img.sub,
        scale: this.scale
      });
    },
    clearHistory() {
      electron.ipcRenderer.send("clear-history");
      this.images = [];
    }
  },
  created() {
    var that = this;
    electron.ipcRenderer.send("get-history");

    electron.ipcRenderer.on("history", function(event, args) {
      console.log(args);
      that.images = args;
    });
  }
};
</script>

<style lang="scss" scoped>
.history {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  #clear-history {
    position: fixed;
    height: 20px;
    width: 100px;
    right: 0px;
    top: 26px;
    border: none;
    padding: 0px;
    z-index: 1;
  }

  .history-image {
    img {
      width: calc(100% - 20px);
      margin-top: 10px;
      cursor: pointer;

      &:last-child {
        margin-bottom: 10px;
      }

      &:active {
        transform: scale(0.99);
      }
    }
  }
}
</style>
