<template>
  <div class="history">
    <button id="clear-history" @click="clearHistory()">Clear History</button>
    <div class="images">
      <div class="history-image" v-for="(img, index) in images" :key="index">
        <div @click="changeWallpaper(img)">
          <v-lazy-image :src="img.link"/>
        </div>
        <div class="image-buttons">
          <div class="left">
            <div class="favorite-buttons" v-if="img.fav || !img.blacklist">
              <button class="yellow" v-if="img.fav" @click="unfavorite(img, index)">★</button>
              <button class="yellow" v-else @click="favorite(img, index)">☆</button>
            </div>

            <div class="blacklist-buttons" v-if="img.blacklist || !img.fav">
              <button class="red" v-if="img.blacklist" @click="unblack(img, index)">
                <font-awesome-icon icon="minus-square"></font-awesome-icon>
              </button>
              <button class="red" v-else @click="black(img, index)">
                <font-awesome-icon :icon="['far', 'minus-square']"></font-awesome-icon>
              </button>
            </div>
          </div>

          <button class="trash" @click="trash(img)">
            <font-awesome-icon icon="trash"></font-awesome-icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const electron = window.require('electron')
const ElectronStore = electron.remote.require('electron-store')
const state = new ElectronStore()

export default {
  name: 'history',
  data () {
    return {
      images: state.get('history').sort((a, b) => a.date < b.date),
      scale: this.$store.getters.SCALE,
      platform: electron.remote.process.platform
    }
  },
  methods: {
    changeWallpaper (img) {
      console.log('Changing to ' + img.link)
      electron.ipcRenderer.send('change-wallpaper', {
        link: img.link,
        subreddit: img.sub,
        scale: this.scale
      })
    },
    clearHistory () {
      electron.ipcRenderer.send('clear-history')
      this.images = []
    },
    trash (img) {
      var filtered = this.images.filter(wall => wall.link !== img.link)
      state.set('history', filtered)
      this.images = filtered
    },
    favorite (img, index) {
      this.images[index].fav = true
      state.set('history', this.images)
      this.images = state.get('history')
    },
    unfavorite (img, index) {
      this.images[index].fav = false
      state.set('history', this.images)
      this.images = state.get('history')
    },
    black (img, index) {
      this.images[index].blacklist = true
      state.set('history', this.images)
      this.images = state.get('history')
    },
    unblack (img, index) {
      this.images[index].blacklist = false
      state.set('history', this.images)
      this.images = state.get('history')
    }
  }
}
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

  #clear-history {
    height: 24px;
    margin: 10px;
    color: #eee;
    border-radius: 3px;
    background-color: lighten(#090b10, 10);
    font-family: "Calibre", sans-serif;
    font-size: 1rem;
    outline: none;
    cursor: pointer;
    color: #82aaff;
    border-color: #82aaff;
  }

  .history-image {
    width: calc(100% - 20px);
    margin-left: 10px;
    position: relative;

    &:not(:first-child) {
      margin-top: 10px;
    }

    .image-buttons {
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;

      .left {
        display: flex;
        background-color: #0f111a;
        border-radius: 3px;
      }

      .yellow {
        color: #ffcb6b;
      }

      .red {
        color: #ff5370;
      }

      .trash {
        position: absolute;
        right: 0;
        color: #eee;
      }

      button {
        background-color: #0f111a;
        border-radius: 3px;
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
