<template>
  <div class="header-bar">
    <div
      v-bind:class="os == 'darwin' && !maximized ? 'darwin' : ''"
      class="left"
    ></div>
    <div class="center"></div>
    <div class="right">
      <div v-if="os == 'win32'" class="windows-buttons">
        <div @click="minimize" class="windows-icon-bg">
          <div id="minimize"></div>
        </div>
        <div @click="maximize" class="windows-icon-bg">
          <div id="maximize"></div>
        </div>
        <div @click="close" class="windows-icon-bg">
          <div id="close"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const BrowserWindow = window.require("electron").remote.BrowserWindow;
export default {
  name: "HeaderBar",
  data() {
    return {
      os: window.require("electron").remote.process.platform
    };
  },
  methods: {
    minimize: () => {
      BrowserWindow.getFocusedWindow().minimize();
    },
    maximize: () => {
      var win = BrowserWindow.getFocusedWindow();
      win.isMaximized() ? win.unmaximize() : win.maximize();
    },
    close: () => {
      BrowserWindow.getFocusedWindow().close();
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "../themes.scss";
.header-bar {
  display: block;
  height: 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  -webkit-app-region: drag;
  user-select: none;
  background-color: #090b10;
  border-bottom: 1px solid #000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;

  .right {
    -webkit-app-region: no-drag;
    .windows-buttons {
      display: flex;
      .windows-icon-bg {
        & > div {
          background-color: #8f93a2;
          height: 24px;
          width: 50px;
        }

        &:hover {
          background-color: lighten(#090b10, 10);

          &:last-child {
            background-color: $windows-close-hover;

            & > div {
              background-color: white;
            }
          }
        }
      }
    }

    #minimize {
      -webkit-mask: url(../assets/minimize.svg) no-repeat 50%;
    }

    #maximize {
      -webkit-mask: url(../assets/maximize.svg) no-repeat 50%;
    }

    #close {
      -webkit-mask: url(../assets/close.svg) no-repeat 50%;
    }
  }
}
</style>
