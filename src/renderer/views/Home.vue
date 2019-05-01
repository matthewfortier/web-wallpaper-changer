<template>
  <div class="main-content">
    <section id="api">
      <Dropdown
        :selected="api"
        :data="apis"
        :color="'#82aaff'"
        v-on:select="api = $event"
      />
    </section>
    <Reddit v-if='api === "reddit"' />
    <Unsplash v-else />
    <label id="scales-label" for="scales">Scale:</label>
    <section id="segmented-control">
      <ul>
        <li
          v-for="s in scales"
          v-bind:key="s"
          :class="{ active: s == scale }"
          @click="scale = s"
        >{{ s }}</li>
      </ul>
    </section>
    <label id="refresh-label" for="interval">Update:</label>
    <section id="update">
      <input id="interval" placeholder="value" v-model="refreshInterval" type="text">
      <Dropdown
        :selected="intervalType"
        :data="intervals"
        :color="'#f78c6c'"
        :margin="'0px 5px'"
        v-on:select="intervalType = $event"
      />
      <Button
        id="refresh"
        @click.native="toggleRefresh()"
        :color="'#f78c6c'"
      >{{ autoRefresh ? "Stop" : "Start" }}</Button>
    </section>
    <section id="fetch">
      <Button id="change" @click.native="changeWallpaper()" :color="'#c3e88d'">Next Wallpaper</Button>
    </section>
    <Settings/>
  </div>
</template>

<script>
import Dropdown from '@/components/Dropdown'
import Page from '@/components/Page'
import Button from '@/components/Button'
import Checkbox from '@/components/Checkbox'
import Settings from '@/components/Settings'
import Reddit from '@/components/Reddit'
import Unsplash from '@/components/Unsplash'

import SetInterval from 'set-interval'

export default {
  name: 'home',
  components: {
    Dropdown,
    Page,
    Button,
    Checkbox,
    Reddit,
    Unsplash,
    Settings
  },
  computed: {
    api: {
      get () {
        return this.$store.getters.API
      },
      set (val) {
        this.$store.dispatch('CHANGE_API', val)
      }
    },
    scale: {
      get () {
        return this.$store.getters.SCALE
      },
      set (val) {
        console.log('SET_SCALE')
        this.$store.dispatch('CHANGE_SCALE', val)
      }
    },
    autoRefresh: {
      get () {
        return this.$store.getters.REFRESH
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_REFRESH', val)
        if (val) {
        // it seems to me this additional check would make sense?
          this.setRefreshInterval()
        } else {
          SetInterval.clear('refresh')
        }
      }
    },
    refreshInterval: {
      get () {
        return this.$store.getters.REFRESH_INTERVAL
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_INTERVAL', val)
        this.autoRefresh = false
      }
    },
    intervalType: {
      get () {
        return this.$store.getters.INTERVAL_TYPE
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_INTERVAL_TYPE', val)
        this.autoRefresh = false
      }
    }
  },
  data () {
    return {
      process: this.$electron.remote.process.platform,
      scales: [],
      apis: [
        { name: 'Reddit', id: 'reddit' },
        { name: 'Unsplash', id: 'unsplash' }
      ],
      intervals: [{ name: 'seconds' }, { name: 'minutes' }, { name: 'hours' }]
    }
  },
  methods: {
    grabImages () {
      console.log('Grab Image')
      this.$electron.ipcRenderer.send('grab-images')
    },
    changeWallpaper () {
      this.autoRefresh = false
      this.grabImages()
    },
    toggleRefresh () {
      this.autoRefresh = !this.$store.getters.REFRESH
    },
    getRefreshValue () {
      var time = 0
      switch (this.intervalType) {
        case 'seconds':
          time = this.refreshInterval * 1000
          break
        case 'minutes':
          time = this.refreshInterval * 60000
          break
        case 'hours':
          time = this.refreshInterval * 3600 * 1000
          break
      }

      console.log(this.refreshInterval)
      return time
    },
    setRefreshInterval () {
      SetInterval.start(this.grabImages, this.getRefreshValue(), 'refresh')
      /* this.timer = window.setInterval(() => {
        this.grabImages()
      }, this.getRefreshValue()) */
    }
  },
  created () {
    if (this.$electron.remote.process.platform === 'win32') {
      this.scales = ['Fit', 'Fill', 'Span', 'Stretch', 'Center', 'Tile']
    } else {
      this.scales = ['Auto', 'Fit', 'Fill', 'Stretch', 'Center']
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  mounted () {
    if (this.$store.getters.REFRESH) {
      this.setRefreshInterval()
    }

    this.$electron.ipcRenderer.on('next', () => {
      console.log('Next')
      this.changeWallpaper()
    })
  }
}
</script>

<style lang="scss">
@import "../themes.scss";

@font-face {
  font-family: "Calibre";
  src: url("../assets/fonts/calibre-regular.ttf") format("truetype");
}

@font-face {
  font-family: "Circular";
  src: url("../assets/fonts/circular-medium.ttf") format("truetype");
}

.main-content {
  display: flex;
  flex-direction: column;
  padding: 10px;
  flex: 1;
}

section {
  margin-bottom: 10px;
}

label {
  text-align: left;
  margin-bottom: 5px;
  font-weight: bold;

  &#subs-label {
    color: #82aaff;
  }

  &#scales-label {
    color: #ffcb6b;
  }

  &#refresh-label {
    color: #f78c6c;
  }
}

#segmented-control {
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ffcb6b;
    border-radius: 3px;
    display: flex;

    li {
      list-style-type: none;
      height: 36px;
      flex: 1;
      line-height: 36px;
      padding: 0 5px;
      cursor: pointer;
      color: #ffcb6b;

      &:not(:last-child) {
        border-right: 1px solid #ffcb6b;
      }

      &:hover {
        background-color: rgba(#ffcb6b, 0.3);
      }

      &:active {
        background-color: rgba(#ffcb6b, 0.5);
      }

      &.active {
        background-color: rgba(#ffcb6b, 0.5);
        font-weight: bold;
      }
    }
  }
}

#fetch {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

#update {
  display: flex;
}

input[type="text"] {
  height: 34px;
  max-height: 36px;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0 10px;
  background-color: lighten(#090b10, 10);
  border-radius: 3px;
  font-family: "Calibre", sans-serif;
  font-size: 1rem;

  &#interval {
    color: #f78c6c;
    border: 1px solid #f78c6c;
    max-width: 55px;
  }
}
</style>
