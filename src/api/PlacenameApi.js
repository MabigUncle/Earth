const placenameServiceUrl = window.GlobalConfig.PLACENAME_SERVER_URL;


// 根据关键词查询地名
export function seachPlacenameByKeyword(keyword, pageNum, pageSize){
    return axios.get(placenameServiceUrl+"/poi/searchLnglatByName",{
        params:{
			placeName: keyword,
			pageNum: pageNum,
			pageSize: pageSize
		}
    });
}

// 根据经纬度查询地名
export function searchPlaceameByLnglat(lng, lat){
    return axios.get(placenameServiceUrl+"/poi/searchNameByLnglat",{
        params:{
			lng: lng,
			lat: lat
		}
    });
}

