
import Vue from "vue";
import App from "./App";

const settings = {
  apiKey: '0cabbb2d-fcfa-4c0a-a758-700ffa39a469',
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
}
import YmapPlugin from 'vue-yandex-maps'

Vue.use(YmapPlugin, settings)
new Vue({
  render: h => h(App)
}).$mount("#app");
