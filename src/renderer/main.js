import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

import api from './service/index'
import './permission'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import './udp/receiver'
import swal from 'sweetalert2'
import global from './global'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(api)
Vue.use(Notifications, {velocity})
Vue.component('icon', Icon)
Vue.prototype.swal = swal
Vue.prototype.global = global

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
