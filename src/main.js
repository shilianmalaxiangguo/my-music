import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import fastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import analyze from 'rgbaster'

Vue.prototype.$analyze = analyze
Vue.config.productionTip = false;
fastClick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
