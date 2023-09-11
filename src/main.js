import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import echarts from 'echarts'
window.echarts = echarts;

import 'echarts-wordcloud'

import axios from 'axios'
window.axios = axios;

/* import $ from 'jquery'
window.$ = $; */

import qs from 'qs'
window.qs = qs;

import Bus from './Bus/Bus'
window.Bus = Bus;

import './style/index.css'
import './assets/icons/iconfont/iconfont.css'
import './assets/icons/iconfont/iconfont.js'


/* // router路由拦截+权限过滤
import {routerFilter} from './filter/routerFilter.js'
routerFilter();

// axios接口拦截+权限过滤
import {axiosFilter} from './filter/axiosFilter.js'
axiosFilter();

// 判断是否有权限
import {isHasPermission} from './js/utils.js'
window.isHasPermission = isHasPermission; */

// 加载自定义的各种插件
import './plugin/vuePlugin.js'

// 加载自定义的各种指令
import {allow, drag} from './directive/vueDirective.js'

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
