<template>
  <div class="footer-bar">
    <span>{{ alert }}</span>
    <button @click="quit">Quit</button>
  </div>
</template>

<script>
export default {
  name: 'FooterBar',
  data () {
    return {
      alert: ''
    }
  },
  methods: {
    quit () {
      this.$electron.ipcRenderer.send('quit')
    }
  },
  mounted () {
    this.$electron.ipcRenderer.on('alert', (_, args) => {
      this.alert = args
      setTimeout(() => {
        this.alert = ''
      }, 5000)
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../themes.scss";
.footer-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  user-select: none;
  background-color: #090b10;
  border-top: 1px solid #000;
  text-align: left;
  line-height: 24px;

  span {
    margin-left: 10px;
  }

  button {
    margin-right: 10px;
    float: right;
    height: 80%;
  }
}
</style>
