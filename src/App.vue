<template>
  <div id="app">
    <HeaderBar />
    <div class="router-links">
      <router-link tag="li" to="/">
        <a>Home</a>
      </router-link>
      <router-link tag="li" to="/history">
        <a>History</a>
      </router-link>
    </div>
    <router-view></router-view>
    <FooterBar />
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
import FooterBar from "@/components/FooterBar";
export default {
  name: "app",
  components: {
    HeaderBar,
    FooterBar
  }
};
</script>

<style lang="scss">
body {
  background-color: #0f111a;
  padding: 0;
  margin: 0;
  font-family: "Calibre", sans-serif;
  font-size: 16px;
  overflow: hidden;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #dce0e4;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .router-links {
    display: flex;
    list-style-type: none;
    background-color: lighten(#090b10, 10);
    width: 100%;

    .router-link-exact-active {
      background-color: #0f111a;
    }

    li {
      height: 24px;
      line-height: 24px;
      font-family: "Calibre", sans-serif;
      font-size: 1rem;
      padding: 0 10px;

      a {
        text-decoration: none;
        color: #dce0e4;
      }

      &:hover:not(.router-link-exact-active) {
        background-color: lighten(#090b10, 15);
      }
    }
  }
}
</style>
