<template>
  <Page>
    <div class="history">
      <vue-custom-scrollbar class="images">
        <div class="history-image" v-for="(img, index) in images" :key="index">
          <div @click="changeWallpaper(img)">
            <v-lazy-image :src="img.link"/>
          </div>
          <div class="image-buttons">
            <button class="yellow" v-if="img.fav" @click="unfavorite(img)">★</button>
          </div>
        </div>
      </vue-custom-scrollbar>
    </div>
  </Page>
</template>

<script>
import Page from '@/components/Page'
import vueCustomScrollbar from 'vue-custom-scrollbar'
export default {
  name: 'favorites',
  components: {
    Page,
    vueCustomScrollbar
  },
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
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .images {
    flex: 1;
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
