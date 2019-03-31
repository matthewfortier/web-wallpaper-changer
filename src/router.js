import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import History from "./views/History.vue";
import Favorites from "./views/Favorites.vue";
import Blacklist from "./views/Blacklist.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/history",
      name: "history",
      component: History
    },
    {
      path: "/favorites",
      name: "favorites",
      component: Favorites
    },
    {
      path: "/blacklist",
      name: "blacklist",
      component: Blacklist
    }
  ]
});
