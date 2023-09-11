import Vue from 'vue'
import VueRouter from 'vue-router'

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

Vue.use(VueRouter);

import Login from '../views/Login.vue'
import CesiumViewer from '../views/CesiumViewer.vue'


const routes = [{
    path: "/",
    redirect: '/login'
},{
    path: "/login",
    name: "Login",
    component: Login,
},{
    path: "/home",
    name: "CesiumViewer",
    component: CesiumViewer
}];

const router = new VueRouter({
  routes
});

export default router
