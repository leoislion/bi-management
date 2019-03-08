// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import vueParticleLine from 'vue-particle-line'
import 'vue-particle-line/dist/vue-particle-line.css'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
//引入jquery
import $ from 'jquery'
// 引入echarts
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
Vue.use(iView);
Vue.use(vueParticleLine)
Vue.config.productionTip = false

Vue.prototype.$http = axios
/* 发送请求前判断token*/
axios.interceptors.request.use(config=>{
  let token=localStorage.getItem("token");
  console.log(token)
  if(token){
    config.headers.token=token;
  }
  return config;
},
  error => {
    return Promise.reject(error)
  })
/* 如果后台拦截器返回验证token异常,重新登录 */
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    let message=error.response.data.message
    console.log(message)
    if(message==="验证错误，请重新登录"||message==="用户不存在，请重新登录"||message==="登录过期，请重新登录"||
      message==="您还没有登录,请登录"){
      alert(message);
      router.replace({
        path: '/',
        query: {redirect: router.currentRoute.fullPath}
      })

    }
    return Promise.reject(error.response.data)  // 返回接口返回的错误信息
  });


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
