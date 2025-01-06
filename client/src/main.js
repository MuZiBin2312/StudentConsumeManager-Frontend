import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

axios.defaults.headers.common['userid'] = sessionStorage.getItem('id');

// 从 sessionStorage 获取 id 和 type
let userId = sessionStorage.getItem('id');
let userType = sessionStorage.getItem('type');

// 如果 sessionStorage 有值，设置到 axios 默认请求头

axios.defaults.headers.common['userid'] = String(userId);
axios.defaults.headers.common['usertype'] = String(userType);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
