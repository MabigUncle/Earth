const serverUrl = window.GlobalConfig.SERVER_URL;


// 登录
export function loginApi(userName, password) {
	return axios.get(serverUrl + '/login',{
		params:{
			loginName: userName,
			loginPassword: password
		}
	});
}

// 校验token
export function checkTokenApi(userId, token) {
	return axios.post(serverUrl + '/check',{
		userId: userId,
		token: token
	});
}

// 获取用户的所有权限列表
export function getUserAllPermissionApi(userId){
	return axios.get(serverUrl+`/permission/permissionListByUser/${userId}`);
}
