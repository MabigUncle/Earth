import router from '../router'

import {
	checkToken
} from '../api/loginApi.js'


// 路由拦截
export function routerFilter() {
	router.beforeEach((to, from, next) => {
		let userId = sessionStorage.getItem('userId');
		let token = sessionStorage.getItem('token');
		if (to.path === '/' || to.path === '/login') {
			next();
		} else {
			if (userId && token) {
				checkToken(userId, token).then((res) => {
					if (res.data.data) {
						if (to.meta.permission) {
							let flag = isHasPermission(to.meta.permission);
							if (flag) {
								// 权限满足
								next();
							} else {
								// 权限不足
								this.$message.error('权限不足！');
								next({
									path: '/login'
								})
							}
						} else {
							// 该路由没有权限限制
							next();
						}
					} else {
						// userId或token是伪造的
						next({
							path: '/login'
						})
					}
				})
			} else {
				next({
					path: '/login'
				})
			}
		}
	});
}
