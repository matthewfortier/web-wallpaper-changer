<template>
  <div id="app">
    <HeaderBar v-if="platform != 'darwin'"/>
    <div class="router-links">
      <router-link tag="li" to="/">Home</router-link>
      <router-link tag="li" to="/history">History</router-link>
      <router-link tag="li" to="/favorites">Favorites</router-link>
      <router-link tag="li" to="/blacklist">Blacklist</router-link>
    </div>
    <transition :name="transition">
      <router-view/>
    </transition>
    <FooterBar/>
  </div>
</template>

<script>
import HeaderBar from '@/components/HeaderBar'
import FooterBar from '@/components/FooterBar'

export default {
  name: 'radiant',
  components: {
    HeaderBar,
    FooterBar
  },
  data () {
    return {
      routes: ['home', 'history', 'favorites', 'blacklist'],
      transition: 'slide-left',
      platform: require('os').platform()
    }
  },
  created () {
    this.$router.beforeEach((to, from, next) => {
      var toIndex = this.routes.indexOf(to.name)
      var fromIndex = this.routes.indexOf(from.name)

      this.transition = fromIndex < toIndex ? 'slide-left' : 'slide-right'
      console.log(this.transition)
      next()
    })
  }
}
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
    min-height: 24px;

    .router-link-exact-active {
      background-color: #0f111a;
    }

    li {
      height: 24px;
      line-height: 24px;
      font-family: "Calibre", sans-serif;
      font-size: 1rem;
      padding: 0 10px;
      cursor: pointer;

      &:hover:not(.router-link-exact-active) {
        background-color: lighten(#090b10, 15);
      }
    }
  }
}

.slide-right-enter-active {
  animation: slideInLeft 0.3s;
}
.slide-right-leave-active {
  animation: slideOutRight 0.3s;
}

.slide-left-enter-active {
  animation: slideInRight 0.3s;
}
.slide-left-leave-active {
  animation: slideOutLeft 0.3s;
}

@keyframes slideInRight {
  from {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideInLeft {
  from {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideOutLeft {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
}

@keyframes slideOutRight {
  from {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  to {
    visibility: hidden;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
}

.ps .ps__rail-x:hover,
.ps .ps__rail-y:hover,
.ps .ps__rail-x:focus,
.ps .ps__rail-y:focus,
.ps .ps__rail-x.ps--clicking,
.ps .ps__rail-y.ps--clicking {
  background-color: transparent !important;
}
</style>
