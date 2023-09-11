
// 判断权限列表中是否包含某一权限
export function isHasPermission(permission){
	let permissionList = JSON.parse(sessionStorage.getItem("permissionList"));
	for(let i=0,len=permissionList.length; i<len; i++){
		if(permissionList[i].permissionName === permission){
			return true;
		}
	}
	return false;
}