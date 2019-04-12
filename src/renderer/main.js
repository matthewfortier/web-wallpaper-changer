import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import { VLazyImagePlugin } from 'v-lazy-image'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBurn,
  faCertificate,
  faBolt,
  faArrowUp,
  faChartLine,
  faChevronDown,
  faStar,
  faMinusSquare,
  faTrash,
  faCheck
} from '@fortawesome/free-solid-svg-icons'

import { faMinusSquare as farMinusSquare, faSquare } from '@fortawesome/free-regular-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.use(VLazyImagePlugin)

library.add(faBurn)
library.add(faCertificate)
library.add(faBolt)
library.add(faChartLine)
library.add(faArrowUp)
library.add(faChevronDown)
library.add(faStar)
library.add(faMinusSquare)
library.add(farMinusSquare)
library.add(faTrash)
library.add(faCheck)
library.add(faSquare)

Vue.component('font-awesome-icon', FontAwesomeIcon)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
