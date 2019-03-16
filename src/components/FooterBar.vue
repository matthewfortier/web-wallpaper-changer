<template>
  <div class="footer-bar">{{ alert }}</div>
</template>

<script>
const electron = window.require("electron");
export default {
  name: "FooterBar",
  data() {
    return {
      alert: ""
    };
  },
  methods: {},
  mounted() {
    electron.ipcRenderer.on("alert", (_, args) => {
      this.alert = args;
      setTimeout(() => {
        this.alert = "";
      }, 5000);
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../themes.scss";
.footer-bar {
  display: block;
  height: 24px;
  width: 100%;
  user-select: none;
  background-color: #090b10;
  border-top: 1px solid #000;
  text-align: left;
  line-height: 24px;
  padding-left: 10px;
}
</style>
