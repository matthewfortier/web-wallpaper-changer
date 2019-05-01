import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    history: [],
    scale: 'Fit',
    autoRefresh: false,
    refreshInterval: 60,
    intervalType: 'seconds',
    api: 'reddit',
    reddit: {
      subs: 'wallpaper',
      count: 100,
      filter: 'Hot',
      subFilter: 'Hour'
    },
    unsplash: {
      terms: '',
      collection: 'collection',
      id: '',
      resolution: '1920x1080',
      featured: false
    },
    settings: {
      repeats: true,
      startup: false,
      download: true,
      organize: true,
      nsfw: false
    }
  },
  getters: {
    HISTORY: state => {
      return state.history
    },
    API: state => {
      return state.api
    },
    FAVORITES: state => {
      return state.history.filter(image => image.fav)
    },
    BLACKED: state => {
      return state.history.filter(image => image.blacklist)
    },
    SCALE: state => {
      return state.scale
    },
    REFRESH: state => {
      return state.autoRefresh
    },
    REFRESH_INTERVAL: state => {
      return state.refreshInterval
    },
    INTERVAL_TYPE: state => {
      return state.intervalType
    },
    REDDIT: state => {
      return state.reddit
    },
    UNSPLASH: state => {
      return state.unsplash
    },
    SETTINGS: state => {
      return state.settings
    }
  },
  mutations: {
    ADD_TO_HISTORY (state, payload) {
      state.history.unshift(payload)
    },
    FAVORITE (state, payload) {
      state.history[payload].fav = true
    },
    UNFAVORITE (state, payload) {
      state.history[payload].fav = false
    },
    BLACKLIST (state, payload) {
      state.history[payload].blacklist = true
    },
    UNBLACKLIST (state, payload) {
      state.history[payload].blacklist = false
    },
    REMOVE (state, payload) {
      state.history.splice(payload, 1)
    },
    CLEAR_HISTORY (state) {
      state.history.splice(0)
    },
    CHANGE_API (state, payload) {
      state.api = payload
    },
    CHANGE_SCALE (state, payload) {
      state.scale = payload
    },
    CHANGE_REFRESH (state, payload) {
      state.autoRefresh = payload
    },
    CHANGE_INTERVAL (state, payload) {
      state.refreshInterval = payload
    },
    CHANGE_INTERVAL_TYPE (state, payload) {
      state.intervalType = payload
    },
    CHANGE_REDDIT (state, payload) {
      state.reddit[payload.setting] = payload.value
    },
    CHANGE_UNSPLASH (state, payload) {
      state.unsplash[payload.setting] = payload.value
    },
    CHANGE_SETTING (state, payload) {
      state.settings[payload.setting] = payload.value
    }
  },
  actions: {
    ADD_TO_HISTORY (context, payload) {
      var history = this.state.history
      var filename = payload.link.split('/').pop()

      if (!history.some(img => img.link.endsWith(filename))) {
        context.commit('ADD_TO_HISTORY', payload)
      }
    },
    FAVORITE (context, payload) {
      context.commit('FAVORITE', payload)
    },
    UNFAVORITE (context, payload) {
      context.commit('UNFAVORITE', payload)
    },
    BLACKLIST (context, payload) {
      context.commit('BLACKLIST', payload)
    },
    UNBLACKLIST (context, payload) {
      context.commit('UNBLACKLIST', payload)
    },
    REMOVE (context, payload) {
      context.commit('REMOVE', payload)
    },
    CLEAR_HISTORY (context) {
      context.commit('CLEAR_HISTORY')
    },
    CHANGE_API (context, payload) {
      context.commit('CHANGE_API', payload)
    },
    CHANGE_SCALE (context, payload) {
      context.commit('CHANGE_SCALE', payload)
    },
    CHANGE_REFRESH (context, payload) {
      context.commit('CHANGE_REFRESH', payload)
    },
    CHANGE_INTERVAL (context, payload) {
      context.commit('CHANGE_INTERVAL', payload)
    },
    CHANGE_INTERVAL_TYPE (context, payload) {
      context.commit('CHANGE_INTERVAL_TYPE', payload)
    },
    CHANGE_REDDIT (context, payload) {
      context.commit('CHANGE_REDDIT', payload)
    },
    CHANGE_UNSPLASH (context, payload) {
      context.commit('CHANGE_UNSPLASH', payload)
    },
    CHANGE_SETTING (context, payload) {
      context.commit('CHANGE_SETTING', payload)
    }
  },
  plugins: [createPersistedState(), createSharedMutations()],
  strict: process.env.NODE_ENV !== 'production'
})
