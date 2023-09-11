
const ServerUrl = window.GlobalConfig.ServerUrl;

// 获取所有方案(包含行动)的详情列表
export function getAllPlanAndActionApi() {
	return axios.get(ServerUrl + "/plan/getAll");
}
/* // 获取某个方案的详情列表
export function getOnePlanAndActionApi(planId) {
	return axios.get(ServerUrl + `/plan/getOne/${planId}`);
} */
// 获取某个方案下的所有行动列表
export function getAllActionByPlanId(planId){
	return axios.get(ServerUrl + `/plan/getAllActionByPlanId/${planId}`);
}
// 增加方案
export function addPlanApi(plan){
	return axios.post(ServerUrl + "/plan/add", plan);
}
// 根据id删除plan方案
export function deletePlanByIdApi(planId) {
	return axios.post(ServerUrl + `/plan/delete`, [planId])
}
// 根据id获取action行动详情
export function getActionInfoByIdApi(actionId) {
	return axios.get(ServerUrl + `/action/getById/${actionId}`);
}
// 根据id删除action行动
export function deleteActionByIdApi(actionId) {
	return axios.post(ServerUrl + `/action/delete`, [actionId])
}
// 增加action行动
export function addActionApi(action){
	return axios.post(ServerUrl + "/action/add", action)
}


// 雷达分析
export function randarAnalyApi(planId){
	return axios.get(ServerUrl+`/radarinfo/analysis/${planId}`)
}