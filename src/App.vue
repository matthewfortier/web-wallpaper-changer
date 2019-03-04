<template>
  <div id="app">
    <HeaderBar/>
    <div class="main-content">
      <input placeholder="Subreddit" v-model="subreddit" type="text">
      <div class="fetch">
        <div class="select-wrapper">
          <select v-model="scale">
            <option selected>Fit</option>
            <option>Auto</option>
            <option>Fill</option>
            <option>Stretch</option>
            <option>Center</option>
            <option>Tile</option>
          </select>
        </div>
        <button @click="grabImages()">Change Wallpaper</button>
      </div>

      <button @click="autoRefresh = !autoRefresh">{{ autoRefresh ? "Stop" : "Start" }}</button>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
const electron = window.require("electron");

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
      electron.ipcRenderer.send("grab-images", {
        subreddit: this.subreddit,
        scale: this.scale
      });
    }
  },
  watch: {
    autoRefresh(val) {
      if (val) {
        // it seems to me this additional check would make sense?
        timer = window.setInterval(() => {
          this.grabImages();
        }, 60 * 1000);
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

@font-face {
  font-family: "Calibre";
  src: url("./assets/fonts/calibre-regular.ttf") format("truetype");
}

@font-face {
  font-family: "Circular";
  src: url("./assets/fonts/circular-medium.ttf") format("truetype");
}

body {
  background-color: #0f111a;
  padding: 0;
  margin: 0;
  font-family: "Calibre", sans-serif;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $flag-selected-color-light;

  .main-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px;
  }

  input {
    background-color: transparent;
    border: none;
    color: #eee;
    border-bottom: 2px solid #ffcb6b;
    outline: none;
    margin-bottom: 10px;
    padding: 10px;
    background-color: lighten(#090b10, 10);
    border-radius: 3px;
    font-family: "Calibre", sans-serif;
  }

  .fetch {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .select-wrapper {
      width: 100%;
      margin-right: 5px;

      select {
        width: 100%;
        min-width: 100px;
        max-height: 36px;
        padding: 10px;
        background-color: lighten(#090b10, 10);
        border: none;
        border-bottom: 2px solid #ffcb6b;
        border-radius: 3px;
        color: #eee;
        outline: none;
        font-family: "Calibre", sans-serif;
      }

      button {
        margin-left: 5px;
      }
    }
  }
  button {
    height: 36px;
    max-height: 36px;
    width: 100%;
    border: 2px solid #ffcb6b;
    border-radius: 3px;
    background-color: lighten(#090b10, 10);
    color: #ffcb6b;
    font-family: "Calibre", sans-serif;
    outline: none;

    &:hover {
      background-color: lighten(#090b10, 15);
    }

    &:active {
      border-radius: 5px;
    }
  }
}
</style>
