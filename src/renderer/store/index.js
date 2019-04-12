import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    history: [],
    form: {
      subs: 'wallpaper',
      scale: 'Fit',
      count: 100,
      autoRefresh: false,
      refreshInterval: 60,
      intervalType: 'seconds',
      filter: 'Hot',
      subFilter: 'Hour'
    },
    settings: {
      repeats: true,
      startup: false,
      download: false,
      organize: false
    }
  },
  getters: {
    HISTORY: state => {
      return state.history
    },
    FAVORITES: state => {
      return state.history.filter(image => image.fav)
    },
    BLACKED: state => {
      return state.history.filter(image => image.blacklist)
    },
    SUBS: state => {
      return state.form.subs
    },
    SCALE: state => {
      return state.form.scale
    },
    COUNT: state => {
      return state.form.count
    },
    REFRESH: state => {
      return state.form.autoRefresh
    },
    REFRESH_INTERVAL: state => {
      return state.form.refreshInterval
    },
    INTERVAL_TYPE: state => {
      return state.form.intervalType
    },
    FILTER: state => {
      return state.form.filter
    },
    SUB_FILTER: state => {
      return state.form.subFilter
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
    CHANGE_SUBS (state, payload) {
      state.form.subs = payload
    },
    CHANGE_SCALE (state, payload) {
      state.form.scale = payload
    },
    CHANGE_COUNT (state, payload) {
      state.form.count = payload > 100 ? 100 : payload
    },
    CHANGE_REFRESH (state, payload) {
      state.form.autoRefresh = payload
    },
    CHANGE_INTERVAL (state, payload) {
      state.form.refreshInterval = payload
    },
    CHANGE_INTERVAL_TYPE (state, payload) {
      state.form.intervalType = payload
    },
    CHANGE_FILTER (state, payload) {
      state.form.filter = payload
    },
    CHANGE_SUB_FILTER (state, payload) {
      state.form.subFilter = payload
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
    CHANGE_SUBS (context, payload) {
      context.commit('CHANGE_SUBS', payload)
    },
    CHANGE_SCALE (context, payload) {
      context.commit('CHANGE_SCALE', payload)
    },
    CHANGE_COUNT (context, payload) {
      context.commit('CHANGE_COUNT', payload)
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
    CHANGE_FILTER (context, payload) {
      context.commit('CHANGE_FILTER', payload)
    },
    CHANGE_SUB_FILTER (context, payload) {
      context.commit('CHANGE_SUB_FILTER', payload)
    },
    CHANGE_SETTING (context, payload) {
      context.commit('CHANGE_SETTING', payload)
    }
  },
  plugins: [createPersistedState(), createSharedMutations()],
  strict: process.env.NODE_ENV !== 'production'
})
