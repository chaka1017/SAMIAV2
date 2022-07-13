import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// import PerfectScrollbar from 'vue2-perfect-scrollbar'
// import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import moment from 'moment'
import './interceptors/axios'
import axios from 'axios'
import Vueaxios from "vue-axios"
Vue.use(Vueaxios, axios)

// Vue.use(PerfectScrollbar)
Vue.config.productionTip = false
Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
});
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
