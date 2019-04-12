<template>
  <div class="history">
    <div class="images">
      <div class="history-image" v-for="(img, index) in images" :key="index">
        <div @click="changeWallpaper(img)">
          <v-lazy-image :src="img.link"/>
        </div>
        <div class="image-buttons">
          <button class="yellow" v-if="img.fav" @click="unfavorite(img)">★</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'favorites',
  data () {
    return {
      images: this.$store.getters.FAVORITES,
      history: this.$store.getters.HISTORY,
      scale: this.$store.getters.SCALE,
      platform: this.$electron.remote.process.platform
    }
  },
  methods: {
    changeWallpaper (img) {
      console.log('Changing to ' + img.link)
      this.$electron.ipcRenderer.send('change-wallpaper', {
        origin: 'favorites',
        link: img.link,
        subreddit: img.sub,
        scale: this.scale
      })
    },
    unfavorite (img) {
      this.$store.dispatch('UNFAVORITE', this.history.indexOf(img))
    }
  }
}
</script>

<style lang="scss" scoped>
.history {
  position: absolute;
  top: 24px;
  height: calc(100% - 48px);
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
