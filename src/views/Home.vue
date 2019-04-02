<template>
  <div class="main-content">
    <label id="subs-label" for="subs">Subreddit(s):</label>
    <section id="reddit">
      <input
        id="subs"
        placeholder="subreddits"
        v-model="subreddit"
        type="text"
      />
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
      <input
        id="count"
        placeholder="#"
        v-model="count"
        @change="autoRefresh = false"
        type="text"
      />
    </section>
    <label id="scales-label" for="scales">Scale:</label>
    <section id="segmented-control">
      <ul>
        <li
          v-for="s in scales"
          v-bind:key="s"
          :class="{ active: s == scale }"
          @click="scale = s"
        >
          {{ s }}
        </li>
      </ul>
    </section>
    <label id="refresh-label" for="interval">Update:</label>
    <section id="update">
      <input
        id="interval"
        placeholder="value"
        v-model="refreshInterval"
        type="text"
      />
      <Dropdown
        :selected="intervalType"
        :data="intervals"
        :color="'#f78c6c'"
        :margin="'0px 5px'"
        v-on:select="intervalType = $event"
      />
      <button id="refresh" @click="toggleRefresh()">
        {{ autoRefresh ? "Stop" : "Start" }}
      </button>
    </section>
    <section id="fetch">
      <button id="change" @click="changeWallpaper()">Next Wallpaper</button>
    </section>
  </div>
</template>

<script>
import Dropdown from "@/components/Dropdown";
import store from "../store.js";
const electron = window.require("electron");
const ElectronStore = electron.remote.require("electron-store");
const state = new ElectronStore();

var timer = null;

export default {
  name: "home",
  components: {
    Dropdown
  },
  data() {
    return {
      scale: store.state.scale,
      subreddit: store.state.subs,
      count: store.state.count,
      autoRefresh: store.state.autoRefresh,
      refreshInterval: store.state.refreshInterval,
      intervalType: store.state.intervalType,
      filter: store.state.filter,
      subFilter: store.state.subFilter,
      scales: [],
      filterData: [
        { name: "Hot", icon: "burn" },
        { name: "New", icon: "certificate" },
        { name: "Controversial", icon: "bolt" },
        { name: "Top", icon: "arrow-up" },
        { name: "Rising", icon: "chart-line" }
      ],
      subFilterData: [
        { name: "Hour", id: "hour" },
        { name: "24 Hour", id: "day" },
        { name: "Week", id: "week" },
        { name: "Month", id: "month" },
        { name: "Year", id: "year" },
        { name: "All", id: "all" }
      ],
      intervals: [{ name: "seconds" }, { name: "minutes" }, { name: "hours" }]
    };
  },
  methods: {
    grabImages() {
      //electron.ipcRenderer.send("grabImages", this.subreddit);
      electron.ipcRenderer.send("grab-images", {
        subreddit: this.subreddit,
        scale: this.scale,
        filter: this.filter,
        subFilter: this.subFilter,
        count: this.count
      });
      console.log(electron.remote.process.platform);
    },
    changeWallpaper() {
      this.autoRefresh = false;
      this.grabImages();
    },
    toggleRefresh() {
      this.autoRefresh = !store.state.autoRefresh;
    },
    sendState() {
      state.set("state", store.state);
    },
    getRefreshValue() {
      var time = 0;
      switch (this.intervalType) {
        case "seconds":
          time = this.refreshInterval * 1000;
          break;
        case "minutes":
          time = this.refreshInterval * 60000;
          break;
        case "hours":
          time = this.refreshInterval * 3600 * 1000;
          break;
      }

      console.log(this.refreshInterval);
      return time;
    },
    setRefreshInterval() {
      timer = window.setInterval(() => {
        this.grabImages();
      }, this.getRefreshValue());
    }
  },
  watch: {
    autoRefresh(val) {
      console.log(this.refreshInterval);
      console.log(this.intervalType);
      store.changeRefresh(val);
      if (val) {
        // it seems to me this additional check would make sense?
        timer = window.setInterval(() => {
          this.grabImages();
        }, this.getRefreshValue());
      } else {
        window.clearInterval(timer);
        timer = null;
      }
    },
    scale() {
      store.changeScale(this.scale);
    },
    subreddit() {
      store.changeSubs(this.subreddit);
    },
    refreshInterval() {
      this.autoRefresh = false;
      store.changeInterval(this.refreshInterval);
    },
    intervalType() {
      this.autoRefresh = false;
      store.changeIntervalType(this.intervalType);
    },
    count() {
      store.changeCount(this.count);
    },
    filter() {
      store.changeFilter(this.filter);
    },
    subFilter() {
      store.changeSubFilter(this.subFilter);
    }
  },
  beforeCreate() {
    //state.delete("state");
    if (state.get("state")) store.setState(state.get("state"));

    electron.ipcRenderer.on("hide", () => {
      state.set("state", store.state);
      //electron.ipcRenderer.send("close");
    });

    electron.ipcRenderer.on("close", () => {
      state.set("state", store.state);
      electron.ipcRenderer.send("close");
    });
  },
  created() {
    console.log(electron.remote.process.platform);
    if (electron.remote.process.platform === "win32") {
      this.scales = ["Fit", "Fill", "Span", "Stretch", "Center", "Tile"];
    } else {
      this.scales = ["Auto", "Fit", "Fill", "Stretch", "Center"];
    }
  },
  mounted() {
    if (store.state.autoRefresh) {
      this.setRefreshInterval();
    }

    electron.ipcRenderer.on("next", () => {
      console.log("Next");
      this.changeWallpaper();
    });
  },
  beforeDestroy() {
    state.set("state", store.state);
  }
};
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

input {
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

.main-content button {
  height: 36px;
  max-height: 36px;
  width: 100%;
  color: #eee;
  border-radius: 3px;
  background-color: lighten(#090b10, 10);
  font-family: "Calibre", sans-serif;
  font-size: 1rem;
  outline: none;
  cursor: pointer;

  &#change {
    border: 1px solid #c3e88d;
    color: #c3e88d;
  }

  &#refresh {
    border: 1px solid #f78c6c;
    color: #f78c6c;
  }

  &:hover {
    background-color: lighten(#090b10, 15);
  }

  &:active {
    border-radius: 5px;
    transform: scale(0.99);
  }
}
</style>
