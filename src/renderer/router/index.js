import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/views/Home').default
    },
    {
      path: '/history',
      name: 'history',
      component: require('@/views/History.vue').default
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: require('@/views/Favorites.vue').default
    },
    {
      path: '/blacklist',
      name: 'blacklist',
      component: require('@/views/Blacklist.vue').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
