const spatialAnalysisServiceUrl = window.GlobalConfig.SpatialAnalysis_SERVER_URL;


// 点点通视分析
export function calcPointPointApi(lon1, lat1, lon2, lat2){
    return axios.get(spatialAnalysisServiceUrl+"/SpatialAnaly/Point-Point",{
        params:{
			sLon: lon1,
			sLat: lat1,
			eLon: lon2,
			eLat: lat2
		}
    });
}

// 挖填方分析
export function calcCutFillApi(minLon, minLat, maxLon, maxLat, height){
	return axios.get(spatialAnalysisServiceUrl+"/SpatialAnaly/Cut-Fill",{
	    params:{
			minLon: minLon,
			minLat: minLat,
			maxLon: maxLon,
			maxLat: maxLat,
			height: height
		}
	});
}

// 等高线分析
export function calcContourApi(minLon, minLat, maxLon, maxLat){
	return axios.get(spatialAnalysisServiceUrl+"/SpatialAnaly/Contour",{
	    params:{
			minLon: minLon,
			minLat: minLat,
			maxLon: maxLon,
			maxLat: maxLat
		}
	});
}

// 坡度坡向分析
export function calcSlopeAspectApi(minLon, minLat, maxLon, maxLat){
	return axios.get(spatialAnalysisServiceUrl+"/SpatialAnaly/Slope-Aspect",{
	    params:{
			minLon: minLon,
			minLat: minLat,
			maxLon: maxLon,
			maxLat: maxLat
		}
	});
}

// 点面分析
export function calcPointPolygonApi(lon, lat, minLon, minLat, maxLon, maxLat){
	return axios.get(spatialAnalysisServiceUrl+"/SpatialAnaly/Point-Polygon",{
	    params:{
			lon: lon,
			lat: lat,
			minLon: minLon,
			minLat: minLat,
			maxLon: maxLon,
			maxLat: maxLat
		}
	})
}


// 剖面分析
export function calcProfileApi(sLon, sLat, eLon, eLat){
	return axios.get(spatialAnalysisServiceUrl+"/SpatialAnaly/Profile",{
	    params:{
			sLon: sLon,
			sLat: sLat,
			eLon: eLon,
			eLat: eLat
		}
	})
}



