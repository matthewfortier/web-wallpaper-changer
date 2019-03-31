import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { VLazyImagePlugin } from "v-lazy-image";

Vue.use(VLazyImagePlugin);

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBurn,
  faCertificate,
  faBolt,
  faArrowUp,
  faChartLine,
  faChevronDown,
  faStar,
  faMinusSquare,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

import { faMinusSquare as farMinusSquare } from "@fortawesome/free-regular-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faBurn);
library.add(faCertificate);
library.add(faBolt);
library.add(faChartLine);
library.add(faArrowUp);
library.add(faChevronDown);
library.add(faStar);
library.add(faMinusSquare);
library.add(farMinusSquare);
library.add(faTrash);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
