<template>
  <div id="app">
    <HeaderBar/>
    <div class="main-content">
      <div class="reddit">
        <input
          id="subs"
          placeholder="subreddits"
          v-model="subreddit"
          @change="autoRefresh = false"
          type="text"
        >
      </div>
      <div class="reddit">
        <Dropdown :selected="0" :data="filterData" v-on:select="filter = $event"/>
        <Dropdown
          class="subFilter"
          v-if="filter == 'Controversial' || filter == 'Top'"
          :selected="0"
          :data="subFilterData"
          v-on:select="subFilter = $event"
        />
        <input id="count" placeholder="#" v-model="count" @change="autoRefresh = false" type="text">
      </div>
      <div class="segmented-control">
        <ul>
          <li
            v-for="s in scales"
            v-bind:key="s"
            :class="{ active: s == scale }"
            @click="scale = s"
          >{{ s }}</li>
        </ul>
      </div>
      <div class="fetch">
        <button id="change" @click="changeWallpaper()">Change Wallpaper</button>
      </div>

      <div class="update">
        <input id="interval" placeholder="seconds" v-model="refreshInterval" type="text">
        <button
          id="refresh"
          @click="autoRefresh = !autoRefresh"
        >{{ autoRefresh ? "Stop" : "Start" }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
import Dropdown from "@/components/Dropdown";
const electron = window.require("electron");

var timer = null;

export default {
  name: "app",
  components: {
    HeaderBar,
    Dropdown
  },
  data() {
    return {
      scales: ["Auto", "Fit", "Fill", "Stretch", "Center"],
      scale: "Auto",
      subreddit: "wallpapers",
      count: 100,
      response: {},
      picturelist: {
        pictures: [],
        pictureCount: 0
      },
      autoRefresh: false,
      refreshInterval: 60,
      filter: "Hot",
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
      subFilter: "hour"
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
    },
    changeWallpaper() {
      this.autoRefresh = false;
      this.grabImages();
    }
  },
  watch: {
    autoRefresh(val) {
      if (val) {
        // it seems to me this additional check would make sense?
        timer = window.setInterval(() => {
          this.grabImages();
        }, this.refreshInterval * 1000);
      } else {
        window.clearInterval(timer);
        timer = null;
      }
    },
    subreddit() {
      this.autoRefresh = false;
    },
    refreshInterval() {
      this.autoRefresh = false;
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
  font-size: 16px;
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

  .reddit {
    display: flex;
    margin-bottom: 10px;

    .subFilter {
      margin-left: 5px;
    }
    .dropdown {
      width: 100%;
      .dropdown-display {
        border-color: #82aaff;
        border-radius: 3px;
        color: #82aaff;
        height: 34px;
        line-height: 36px;
        padding: 0 10px;
        border: 1px solid;
        background-color: lighten(#090b10, 10);
      }
      ul {
        background-color: lighten(#090b10, 10);
        //border: 1px solid #82aaff;
        border-radius: 3px;
        margin-top: 5px;
        min-width: 100%;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
          0 10px 10px rgba(0, 0, 0, 0.22);

        li {
          height: 34px;
          text-align: left;
          line-height: 34px;
          cursor: pointer;
          padding: 0 10px;
          white-space: nowrap;

          &:not(:last-child) {
            border-bottom: 1px solid #090b10;
          }

          &:hover {
            background-color: lighten(#090b10, 20);
          }
        }
      }
    }
  }

  .segmented-control {
    margin-bottom: 10px;

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

  .fetch {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .update {
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

    &#count {
      margin-left: 5px;
    }

    &#interval {
      color: #f78c6c;
      border: 1px solid #f78c6c;
      max-width: 55px;
      margin-right: 5px;
    }
  }

  button {
    height: 36px;
    max-height: 36px;
    width: 100%;
    color: #eee;
    border-radius: 3px;
    background-color: lighten(#090b10, 10);
    font-family: "Calibre", sans-serif;
    font-size: 1rem;
    outline: none;

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
}
</style>
