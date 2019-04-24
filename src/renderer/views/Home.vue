<template>
  <div class="main-content">
    <label id="subs-label" for="subs">Subreddit(s):</label>
    <section id="reddit">
      <input id="subs" placeholder="subreddits" v-model="subs" type="text">
    </section>
    <section id="reddit">
      <Dropdown
        :selected="filter"
        :data="filterData"
        :color="'#82aaff'"
        :margin="
          filter != 'Controversial' && filter != 'Top' ? '0px 5px 0px 0px' : ''
        "
        v-on:select="filter = $event"
      />
      <Dropdown
        class="subFilter"
        v-if="filter == 'Controversial' || filter == 'Top'"
        :selected="subFilter"
        :data="subFilterData"
        :color="'#82aaff'"
        :margin="'0px 5px'"
        v-on:select="subFilter = $event"
      />
      <input id="count" placeholder="#" v-model="count" @change="autoRefresh = false" type="text">
    </section>
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

import SetInterval from 'set-interval'

export default {
  name: 'home',
  components: {
    Dropdown,
    Page,
    Button,
    Checkbox,
    Settings
  },
  computed: {
    scale: {
      get () {
        return this.$store.getters.SCALE
      },
      set (val) {
        console.log('SET_SCALE')
        this.$store.dispatch('CHANGE_SCALE', val)
      }
    },
    subs: {
      get () {
        return this.$store.getters.SUBS
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_SUBS', val)
      }
    },
    count: {
      get () {
        return this.$store.getters.COUNT
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_COUNT', val)
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
    },
    filter: {
      get () {
        return this.$store.getters.FILTER
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_FILTER', val)
      }
    },
    subFilter: {
      get () {
        return this.$store.getters.SUB_FILTER
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_SUB_FILTER', val)
      }
    }
  },
  data () {
    return {
      process: this.$electron.remote.process.platform,
      scales: [],
      filterData: [
        { name: 'Hot', icon: 'burn' },
        { name: 'New', icon: 'certificate' },
        { name: 'Controversial', icon: 'bolt' },
        { name: 'Top', icon: 'arrow-up' },
        { name: 'Rising', icon: 'chart-line' }
      ],
      subFilterData: [
        { name: 'Hour', id: 'hour' },
        { name: '24 Hour', id: 'day' },
        { name: 'Week', id: 'week' },
        { name: 'Month', id: 'month' },
        { name: 'Year', id: 'year' },
        { name: 'All', id: 'all' }
      ],
      intervals: [{ name: 'seconds' }, { name: 'minutes' }, { name: 'hours' }]
    }
  },
  methods: {
    grabImages () {
      console.log('Grab Image')
      this.$electron.ipcRenderer.send('grab-images', {
        subreddit: this.subs,
        scale: this.scale,
        filter: this.filter,
        subFilter: this.subFilter,
        count: this.count
      })
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

#reddit {
  display: flex;
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

  &#subs,
  &#count {
    color: #82aaff;
    border: 1px solid #82aaff;
    width: 100%;
  }

  &#interval {
    color: #f78c6c;
    border: 1px solid #f78c6c;
    max-width: 55px;
  }
}
</style>
