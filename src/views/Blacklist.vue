<template>
  <div class="history">
    <div class="images">
      <div class="history-image" v-for="(img, index) in images" :key="index">
        <div>
          <v-lazy-image :src="img.link" />
        </div>
        <div class="image-buttons">
          <button class="red" v-if="img.blacklist" @click="unblack(img)">
            <font-awesome-icon icon="minus-square"></font-awesome-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const electron = window.require("electron");
const ElectronStore = electron.remote.require("electron-store");
const state = new ElectronStore();

export default {
  name: "blacklist",
  data() {
    return {
      images: this.getBlacklist(),
      platform: electron.remote.process.platform
    };
  },
  methods: {
    getBlacklist() {
      return state
        .get("history")
        .filter(wall => wall.blacklist)
        .sort((a, b) => a.date < b.date);
    },
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
    },
    unblack(img) {
      var full = state.get("history");
      var place = full.find(wall => wall.link == img.link);
      place.blacklist = false;
      state.set("history", full);
      this.images = this.getBlacklist();
    }
  }
};
</script>

<style lang="scss" scoped>
.history {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .images {
    height: calc(100vh - 49px);
    overflow: auto;
  }

  .history-image {
    width: calc(100% - 20px);
    margin-left: 10px;
    margin-top: 10px;
    position: relative;

    .image-buttons {
      background-color: #0f111a;
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 3px;
      height: 32px;

      .yellow {
        color: #ffcb6b;
      }

      .red {
        color: #ff5370;
      }

      button {
        background: none;
        border: none;
        font-size: 24px;
        line-height: 32px;
        z-index: 1;
        outline: none;
      }
    }

    img {
      width: 100%;
      cursor: pointer;

      &:active {
        transform: scale(0.99);
      }
    }
  }
}
</style>
