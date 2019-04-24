<template>
  <Page>
    <div class="history">
      <button id="clear-history" @click="clearHistory()">Clear History</button>
      <vue-custom-scrollbar class="images">
        <div class="history-image" v-for="(img, index) in history" :key="index">
          <div @click="changeWallpaper(img)">
            <v-lazy-image :src="img.link"/>
          </div>
          <span class="image-title">[/r/{{img.sub}}] {{ img.title }}</span>
          <div class="image-buttons">
            <div class="left">
              <div class="favorite-buttons" v-if="img.fav || !img.blacklist">
                <button
                  class="yellow"
                  title="Unfavorite"
                  v-if="img.fav"
                  @click="unfavorite(img, index)"
                >★</button>
                <button class="yellow" title="Favorite" v-else @click="favorite(img, index)">☆</button>
              </div>

              <div class="blacklist-buttons" v-if="img.blacklist || !img.fav">
                <button
                  class="red"
                  title="Unblacklist"
                  v-if="img.blacklist"
                  @click="unblack(img, index)"
                >
                  <font-awesome-icon icon="minus-square"></font-awesome-icon>
                </button>
                <button class="red" title="Blacklist" v-else @click="black(img, index)">
                  <font-awesome-icon :icon="['far', 'minus-square']"></font-awesome-icon>
                </button>
              </div>
            </div>

            <div class="right">
              <button class="trash" title="Open Post in Browser" @click="open(img.permalink)">
                <font-awesome-icon icon="external-link-alt"></font-awesome-icon>
              </button>
              <button class="trash" title="Remove From History" @click="trash(img, index)">
                <font-awesome-icon icon="trash"></font-awesome-icon>
              </button>
            </div>
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
  name: 'history',
  components: {
    Page,
    vueCustomScrollbar
  },
  data () {
    return {
      history: this.$store.getters.HISTORY
    }
  },
  methods: {
    changeWallpaper (img) {
      console.log('Changing to ' + img.link)
      this.$electron.ipcRenderer.send('change-wallpaper', {
        origin: 'history',
        link: img.link,
        subreddit: img.sub,
        scale: this.$store.getters.SCALE
      })
    },
    clearHistory () {
      this.$store.dispatch('CLEAR_HISTORY')
      this.$electron.ipcRenderer.send('clear-history')
    },
    open (link) {
      this.$electron.remote.shell.openExternal('https://reddit.com/' + link)
    },
    trash (img, index) {
      this.$store.dispatch('REMOVE', index)
    },
    favorite (img, index) {
      this.$store.dispatch('FAVORITE', index)
    },
    unfavorite (img, index) {
      this.$store.dispatch('UNFAVORITE', index)
    },
    black (img, index) {
      this.$store.dispatch('BLACKLIST', index)
    },
    unblack (img, index) {
      this.$store.dispatch('UNBLACKLIST', index)
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
    overflow-x: hidden;
    overflow-y: auto;
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
    border: 1px solid;
  }

  .history-image {
    width: calc(100% - 20px);
    margin-left: 10px;
    position: relative;

    &:not(:first-child) {
      margin-top: 10px;
    }

    &:hover {
      .image-buttons {
        opacity: 1;
        z-index: 1;
        transition: opacity 0.2s ease-in-out;
      }

      .image-title {
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
      }
    }

    .image-title {
      position: absolute;
      top: 50%;
      left: -10px;
      width: 100%;
      transform: translateY(-50%);
      font-size: 22px;
      background-color: rgba(0, 0, 0, 0.6);
      padding: 0 10px;
      opacity: 0; // Hidden
      transition: opacity 0.2s ease-in-out;
    }

    .image-buttons {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      opacity: 0; // Hidden
      transition: opacity 0.2s ease-in-out;

      .left,
      .right {
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
