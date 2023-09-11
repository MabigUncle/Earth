import Vue from 'vue';
let vm = new Vue();

import router from '../router'

export function axiosFilter() {
	// axios请求拦截
	axios.interceptors.request.use((config) => {
		let token = sessionStorage.getItem('token');
		let userId = sessionStorage.getItem('userId');
		config.headers['Authorization'] = 'Bearer ' + token;
		config.headers['userId'] = userId;
		return config;
	});

	// axios响应拦截
	axios.interceptors.response.use((response) => {
		return response;
	}, (error) => {
		console.log(error);
		if (error.response.status == 401) {
			vm.$message.error('权限不足！');
			router.push('/login');
		}
		if (error.response.status == 500) {
			vm.$message.error('接口访问失败！');
		}
		return error;
	});
}
