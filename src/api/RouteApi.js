const routeServiceUrl = window.GlobalConfig.ROUTE_SERVER_URL;


// 计算路径分析
export function calcRoadResult(lon1, lat1, lon2, lat2){
    return axios.post(routeServiceUrl+"/route/routeAnaly",{
        startLon: lon1,
		startLat: lat1,
		endLon: lon2,
		endLat: lat2
    });
}

