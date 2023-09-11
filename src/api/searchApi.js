const sdcServiceUrl = window.GlobalConfig.SDC_SERVER_URL;


// 查询筛选所有的数据
export function searchData(type, param) {
    if (type === '3dtile') {
        return axios.get(`${sdcServiceUrl}/manager/rest/filecatalog/getByParentId?${param}`)
    }
    return axios.post(`${sdcServiceUrl}/manager/rest/${type}/search`, param);
}


// 查询影像数据的地图服务信息
export function getImageMapService(id){
    return axios.get(`${sdcServiceUrl}/gisserver/rest/imageservice/${id}`)
}

// 查询矢量数据的地图服务信息
export function getShapeMapService(id){
    return axios.get(`${sdcServiceUrl}/gisserver/rest/shapeservice/${id}`)
}

// 查询地形数据的地图服务信息
export function getTerrainMapService(id){
    return axios.get(`${sdcServiceUrl}/gisserver/rest/terrainservice/${id}`)
}


