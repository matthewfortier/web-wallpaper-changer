import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState } from 'vuex-electron'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    form: {
      subs: 'wallpaper',
      scale: 'Fit',
      count: 100,
      autoRefresh: false,
      refreshInterval: 60,
      intervalType: 'seconds',
      filter: 'Hot',
      subFilter: 'Hour'
    }
  },
  getters: {
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
    }
  },
  mutations: {
    CHANGE_SUBS (state, payload) {
      state.form.subs = payload
    },
    CHANGE_SCALE (state, payload) {
      state.form.scale = payload
    },
    CHANGE_COUNT (state, payload) {
      state.formcount = payload
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
    }
  },
  actions: {
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
    }
  },
  plugins: [
    createPersistedState()
  ],
  strict: process.env.NODE_ENV !== 'production'
})
