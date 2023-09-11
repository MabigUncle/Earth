class CesiumUtil{
    // 世界坐标系XYZ转化为经纬度坐标系
    static cartesianToLonlat(cartesianPoint){
        let cartographicPoint = Cesium.Cartographic.fromCartesian(cartesianPoint);
        let lon = Cesium.Math.toDegrees(cartographicPoint.longitude);
        let lat = Cesium.Math.toDegrees(cartographicPoint.latitude);
        let height = cartographicPoint.height;
        return {
            lon: lon,
            lat: lat,
            height: height
        }
    }

    // 经纬度坐标系转化为世界坐标系XYZ
    static lonlatToCartesian(lonlatPoint){
        let lon = Cesium.Math.toRadians(lonlatPoint.lon);
        let lat = Cesium.Math.toRadians(lonlatPoint.lat);
        let height = Cesium.Math.toRadians(lonlatPoint.height);
        let cartographic = new Cesium.Cartographic(lon, lat, height);
        return Cesium.Cartographic.toCartesian(cartographic);
    }

    // rgba(200, 120, 232,0.7)转化为Cesium.Color颜色
    static rgbaToColor(rgbaColor) {
        let values = rgbaColor
            .replace(/rgba?\(/, '')
            .replace(/\)/, '')
            .replace(/[\s+]/g, '')
            .split(',');
        let r = Number(values[0]) / 255;
        let g = Number(values[1]) / 255;
        let b = Number(values[2]) / 255;
        let a = Number(values[3] || 1);
        return new Cesium.Color(r, g, b, a);
    }

    // Cesium.Color颜色转化为rgba(200, 120, 232,0.7)
    static colorToRgba(cesiumColor){
        let r = parseInt(cesiumColor.red * 255);
        let g = parseInt(cesiumColor.green * 255);
        let b = parseInt(cesiumColor.blue * 255);
        let a = cesiumColor.alpha;
        return "rgba(" +r+ "," +g+ "," +b+ ","+a+")";
    }

    // entity对象属性信息转化为json字符串
    static entityTrantoJson(entityType, entity){
        if(typeof entity === "string"){
            entity = viewer.entities.getById(entity);
        }
        let str, jsonStr;
        switch(entityType){
            case 'Plot_Point':
                // 判断是图片还是模型
                if(entity.model){
                    let position = CesiumUtil.cartesianToLonlat(entity.position.getValue());
                    let heading = entity.properties.getValue().heading;
                    let pitch = entity.properties.getValue().pitch;
                    let roll = entity.properties.getValue().roll;
                    str = {
                        "lon": position.lon,
                        "lat": position.lat,
                        "height": position.height,
                        "modelUrl": entity.model.uri.getValue(),
                        "modelScale": entity.model.scale.getValue(),
                        "modelColor": CesiumUtil.colorToRgba(entity.model.color.getValue()),
                        "modelHeading": heading,
                        "modelPitch": pitch,
                        "modelRoll": roll,
                        "show": entity.show
                    };
                    jsonStr = JSON.stringify(str);
                }else{
                    let position = CesiumUtil.cartesianToLonlat(entity.position.getValue());
                    str = {
                        "lon": position.lon,
                        "lat": position.lat,
                        "height": position.height,
                        "billboardImage": entity.billboard.image.getValue(),
                        "billboardWidth": entity.billboard.width.getValue(),
                        "billboardHeight": entity.billboard.height.getValue(),
                        "billboardRotation": entity.billboard.rotation.getValue(),
                        "billboardScale": entity.billboard.scale.getValue(),
                        "show": entity.show
                    };
                    jsonStr = JSON.stringify(str);
                }
                break;
            case 'Plot_Polyline':
                let positionData = [];
                let arr = entity.polyline.positions.getValue();
                for(let i=0,len=arr.length; i<len; i++){
                    let item = CesiumUtil.cartesianToLonlat(arr[i]);
                    positionData.push(item.lon);
                    positionData.push(item.lat);
                }
                str = {
                    "position": positionData,
                    "polylineWidth": entity.polyline.width._value,
                    "polylineColor": CesiumUtil.colorToRgba(entity.polyline.material.color._value),
                    "show": entity.show
                };
                jsonStr = JSON.stringify(str);
                break;
            case 'Plot_Polygon':
                let positionData2 = [];
                let arr2 = entity.polygon.hierarchy.getValue();
                arr2 = Array.isArray(arr2) ? arr2 : arr2.positions;
                for(let i=0,len=arr2.length; i<len; i++){
                    let item = CesiumUtil.cartesianToLonlat(arr2[i]);
                    positionData2.push(item.lon);
                    positionData2.push(item.lat);
                }
                str = {
                    "position": positionData2,
                    "outlineShow": entity.polygon.outline === undefined ? true : entity.polygon.outline._value,
                    "outlineColor": CesiumUtil.colorToRgba(entity.polygon.outlineColor._value),
                    "fillShow": entity.polygon.fill === undefined ? true : entity.polygon.fill._value,
                    "fillColor": CesiumUtil.colorToRgba(entity.polygon.material.color._value),
                    "show": entity.show
                };
                jsonStr = JSON.stringify(str);
                break;
            case 'Plot_Rectangle':
                let positionData3 = entity.rectangle.coordinates.getValue();
                str = {
                    "position": positionData3,
                    "outlineShow": entity.rectangle.outline === undefined ? true : entity.rectangle.outline._value,
                    "outlineColor": CesiumUtil.colorToRgba(entity.rectangle.outlineColor._value),
                    "fillShow": entity.rectangle.fill === undefined ? true : entity.rectangle.fill._value,
                    "fillColor": CesiumUtil.colorToRgba(entity.rectangle.material.color._value),
                    "show": entity.show
                };
                jsonStr = JSON.stringify(str);
                break;
            case 'Plot_Circle':
                let position2 = CesiumUtil.cartesianToLonlat(entity.position.getValue());
                str = {
                    "lon": position2.lon,
                    "lat": position2.lat,
                    "height": position2.height,
                    "semiMinorAxis": entity.ellipse.semiMinorAxis.getValue(),
                    "semiMajorAxis": entity.ellipse.semiMajorAxis.getValue(),
                    "outlineShow": entity.ellipse.outline === undefined ? true : entity.ellipse.outline._value,
                    "outlineColor": CesiumUtil.colorToRgba(entity.ellipse.outlineColor._value),
                    "fillShow": entity.ellipse.fill === undefined ? true : entity.ellipse.fill._value,
                    "fillColor": CesiumUtil.colorToRgba(entity.ellipse.material.color._value),
                    "show": entity.show
                };
                jsonStr = JSON.stringify(str);
                break;
            case 'Plot_Label':
                let position3 = CesiumUtil.cartesianToLonlat(entity.position.getValue());
                str = {
                    "lon": position3.lon,
                    "lat": position3.lat,
                    "height": position3.height,
                    "text": entity.label.text._value,
                    "font": entity.label.font._value,
                    "fillColor": CesiumUtil.colorToRgba(entity.label.fillColor._value),
                    "showBackground": entity.label.showBackground === undefined ? true : entity.label.showBackground._value,
                    "backgroundColor": CesiumUtil.colorToRgba(entity.label.backgroundColor._value),
                    "show": entity.show
                };
                jsonStr = JSON.stringify(str);
                break;
            case 'StraightArrow':
            case 'AttackArrow':
            case 'PincerArrow':
                let positions;
                for (let step = 0; step < arrow.drawArr.length; step++) {
                    let item = arrow.drawArr[step];
                    if(item.objId === entity.objId){
                        positions = item.getLnglats();
                        break;
                    }
                }
                str = {
                    "type": entityType,
                    "positions": positions,
                    "outlineShow": entity.polygon.outline === undefined ? false : entity.polygon.outline._value,
                    "outlineColor": entity.polygon.outlineColor === undefined ? 'rgba(255,255,255,0)' : CesiumUtil.colorToRgba(entity.polygon.outlineColor._value),
                    "fillShow": entity.polygon.fill._value === undefined ? false : entity.polygon.fill._value,
                    "fillColor": CesiumUtil.colorToRgba(entity.polygon.material.color._value),
                    "show": entity.show
                };
                jsonStr = JSON.stringify(str);
                break;
        }
        return jsonStr;
    }

    // json字符串转化为entity对象属性信息
    static jsonToEntity(jsonStr){
        let jsonObj = JSON.parse(jsonStr);
        for(let i=0,len=jsonObj.Plot_Point.length; i<len; i++){
            CesiumUtil.jsonToPoint(jsonObj.Plot_Point[i].entityId, jsonObj.Plot_Point[i].entityStr);
        }
        for(let i=0,len=jsonObj.Plot_Polyline.length; i<len; i++){
            CesiumUtil.jsonToPolyline(jsonObj.Plot_Polyline[i].entityId, jsonObj.Plot_Polyline[i].entityStr);
        }
        for(let i=0,len=jsonObj.Plot_Polygon.length; i<len; i++){
            CesiumUtil.jsonToPolygon(jsonObj.Plot_Polygon[i].entityId, jsonObj.Plot_Polygon[i].entityStr);
        }
        for(let i=0,len=jsonObj.Plot_Rectangle.length; i<len; i++){
            CesiumUtil.jsonToRectangle(jsonObj.Plot_Rectangle[i].entityId, jsonObj.Plot_Rectangle[i].entityStr);
        }
        for(let i=0,len=jsonObj.Plot_Circle.length; i<len; i++){
            CesiumUtil.jsonToCircle(jsonObj.Plot_Circle[i].entityId, jsonObj.Plot_Circle[i].entityStr);
        }
        for(let i=0,len=jsonObj.Plot_Label.length; i<len; i++){
            CesiumUtil.jsonToLabel(jsonObj.Plot_Label[i].entityId, jsonObj.Plot_Label[i].entityStr);
        }
        for(let i=0,len=jsonObj.Plot_SituationArrow.straightArrowData.length; i<len; i++){
            CesiumUtil.jsonToSituationStraightArrow(jsonObj.Plot_SituationArrow.straightArrowData[i].entityId, jsonObj.Plot_SituationArrow.straightArrowData[i].entityStr);
        }
        for(let i=0,len=jsonObj.Plot_SituationArrow.attackArrowData.length; i<len; i++){
            CesiumUtil.jsonToSituationAttackArrow(jsonObj.Plot_SituationArrow.attackArrowData[i].entityId, jsonObj.Plot_SituationArrow.attackArrowData[i].entityStr);
        }
        for(let i=0,len=jsonObj.Plot_SituationArrow.pincerArrowData.length; i<len; i++){
            CesiumUtil.jsonToSituationPincerArrow(jsonObj.Plot_SituationArrow.pincerArrowData[i].entityId, jsonObj.Plot_SituationArrow.pincerArrowData[i].entityStr);
        }
    }

    // json字符串转化为point entity
    static jsonToPoint(entityId, pointObj) {
        if(typeof pointObj === 'string'){
            pointObj = JSON.parse(pointObj);
        }
        if(pointObj.modelUrl){
            let position = Cesium.Cartesian3.fromDegrees(pointObj.lon, pointObj.lat);
            let hpr = new Cesium.HeadingPitchRoll.fromDegrees(pointObj.modelHeading, pointObj.modelPitch, pointObj.modelRoll);
            let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
            let model = viewer.entities.add({
                id: entityId,
                name: 'Plot_Model',
                position: position,
                model:{
                    uri: pointObj.modelUrl,
                    scale: pointObj.modelScale,
                    color: CesiumUtil.rgbaToColor(pointObj.modelColor),
                },
                orientation: orientation,
                show: pointObj.show,
                properties:{
                    heading: pointObj.modelHeading,
                    pitch: pointObj.modelPitch,
                    roll: pointObj.modelRoll
                }
            });
            return model;
        }else{
            let point = viewer.entities.add({
                id: entityId,
                name: 'Plot_Point',
                position : Cesium.Cartesian3.fromDegrees(pointObj.lon, pointObj.lat),
                billboard:{
                    image: pointObj.billboardImage,
                    width: pointObj.billboardWidth,
                    height: pointObj.billboardHeight,
                    rotation: pointObj.billboardRotation,
                    scale: pointObj.billboardScale
                },
                show: pointObj.show
            });
            return point;
        }
    }

    // json字符串转化为polyline entity
    static jsonToPolyline(entityId, polylineObj) {
        if(typeof polylineObj === 'string'){
            polylineObj = JSON.parse(polylineObj);
        }
        let polyline = viewer.entities.add({
            id: entityId,
            name: 'Plot_Polyline',
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArray(polylineObj.position),
                clampToGround : true,
                material : CesiumUtil.rgbaToColor(polylineObj.polylineColor),
                width: polylineObj.polylineWidth
            },
            show: polylineObj.show
        });
        return polyline;
    }

    // json字符串转化为polygon entity
    static jsonToPolygon(entityId, polygonObj) {
        if(typeof polygonObj === 'string'){
            polygonObj = JSON.parse(polygonObj);
        }
        let polygon = viewer.entities.add({
            id: entityId,
            name: 'Plot_Polygon',
            polygon : {
                hierarchy : new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(polygonObj.position)),
                height: 0,
                outline: polygonObj.outlineShow,
                outlineColor: CesiumUtil.rgbaToColor(polygonObj.outlineColor),
                fill: polygonObj.fillShow,
                material : CesiumUtil.rgbaToColor(polygonObj.fillColor)
            },
            show: polygonObj.show
        });
        return polygon;
    }

    // json字符串转化为rectangle entity
    static jsonToRectangle(entityId, rectangleObj) {
        if(typeof rectangleObj === 'string'){
            rectangleObj = JSON.parse(rectangleObj);
        }
        let rectangle = viewer.entities.add({
            id: entityId,
            name: 'Plot_Rectangle',
            rectangle : {
                coordinates : new Cesium.Rectangle(rectangleObj.position.west, rectangleObj.position.south, rectangleObj.position.east, rectangleObj.position.north),
                outline: rectangleObj.outlineShow,
                outlineWidth: 1,
                outlineColor: CesiumUtil.rgbaToColor(rectangleObj.outlineColor),
                fill: rectangleObj.fillShow,
                material : CesiumUtil.rgbaToColor(rectangleObj.fillColor),
                height: 0
            },
            show: rectangleObj.show
        });
        return rectangle;
    }

    // json字符串转化为circle entity
    static jsonToCircle(entityId, circleObj) {
        if(typeof circleObj === 'string'){
            circleObj = JSON.parse(circleObj);
        }
        let circle = viewer.entities.add({
            id: entityId,
            name:'Plot_Circle',
            position: Cesium.Cartesian3.fromDegrees(circleObj.lon, circleObj.lat),
            ellipse: {
                semiMinorAxis: circleObj.semiMinorAxis,
                semiMajorAxis: circleObj.semiMajorAxis,
                fill: circleObj.fillShow,
                material: CesiumUtil.rgbaToColor(circleObj.fillColor),
                outline: circleObj.outlineShow,
                outlineColor: CesiumUtil.rgbaToColor(circleObj.outlineColor),
                outlineWidth: 1,
                height:circleObj.height
            },
            show: circleObj.show
        });
        return circle;
    }

    // json字符串转化为label entity
    static jsonToLabel(entityId, labelObj) {
        if(typeof labelObj === 'string'){
            labelObj = JSON.parse(labelObj);
        }
        let label = viewer.entities.add({
            id: entityId,
            name:'Plot_Label',
            position: Cesium.Cartesian3.fromDegrees(labelObj.lon, labelObj.lat),
            label: {
                text: labelObj.text,
                font: labelObj.font,
                fillColor: CesiumUtil.rgbaToColor(labelObj.fillColor),
                showBackground: labelObj.showBackground,
                backgroundColor: CesiumUtil.rgbaToColor(labelObj.backgroundColor),
                height:labelObj.height
            },
            show: labelObj.show
        });
        return label;
    }

    // json字符串转化为态势直线箭头
    static jsonToSituationStraightArrow(entityId, straightArrowObj){
        if(typeof straightArrowObj === 'string'){
            straightArrowObj = JSON.parse(straightArrowObj);
        }
        let positions = straightArrowObj.positions;
        let outlineShow = straightArrowObj.outlineShow;
        let outlineColor = straightArrowObj.outlineColor;
        let fillShow = straightArrowObj.fillShow;
        let fillColor = straightArrowObj.fillColor;
        let show = straightArrowObj.show;
        let straightArrow = new StraightArrow(viewer);
        straightArrow.createByData2(positions, entityId, outlineShow, outlineColor, fillShow, fillColor);
        arrow.drawArr.push(straightArrow);
    }

    // json字符串转化为攻击直线箭头
    static jsonToSituationAttackArrow(entityId, attackArrowObj){
        if(typeof attackArrowObj === 'string'){
            attackArrowObj = JSON.parse(attackArrowObj);
        }
        let positions = attackArrowObj.positions;
        let outlineShow = attackArrowObj.outlineShow;
        let outlineColor = attackArrowObj.outlineColor;
        let fillShow = attackArrowObj.fillShow;
        let fillColor = attackArrowObj.fillColor;
        let show = attackArrowObj.show;
        let attackArrow = new AttackArrow(viewer);
        attackArrow.createByData2(positions, entityId, outlineShow, outlineColor, fillShow, fillColor);
        arrow.drawArr.push(attackArrow);
    }

    // json字符串转化为钳击直线箭头
    static jsonToSituationPincerArrow(entityId, pincerArrowObj){
        if(typeof pincerArrowObj === 'string'){
            pincerArrowObj = JSON.parse(pincerArrowObj);
        }
        let positions = pincerArrowObj.positions;
        let outlineShow = pincerArrowObj.outlineShow;
        let outlineColor = pincerArrowObj.outlineColor;
        let fillShow = pincerArrowObj.fillShow;
        let fillColor = pincerArrowObj.fillColor;
        let show = pincerArrowObj.show;
        let pincerArrow = new PincerArrow(viewer);
        pincerArrow.createByData2(positions, entityId, outlineShow, outlineColor, fillShow, fillColor);
        arrow.drawArr.push(pincerArrow);
    }


    // entity实体坐标变换-平移
    static positionConvert(entity, toPosition){
        let entityType = entity.name;
        switch(entityType){
            case 'Plot_Polyline':
                let polylineCenterPosition = this.calcCenterPosition(entity);
                let polylineNewPosition = this.calcNewPosition(entity, polylineCenterPosition, toPosition);
                return polylineNewPosition;
            case 'Plot_Polygon':
                let polygonCenterPosition = this.calcCenterPosition(entity);
                let polygonNewPosition = this.calcNewPosition(entity, polygonCenterPosition, toPosition);
                return polygonNewPosition;
            case 'Plot_Rectangle':
                let rectangleCenterPosition = this.calcCenterPosition(entity);
                let rectangleNewPosition = this.calcNewPosition(entity, rectangleCenterPosition, toPosition);
                return rectangleNewPosition;
        }

    }

    // 计算entity实体的中心点坐标
    static calcCenterPosition(entity){
        let centerPosition;
        let entityType = entity.name;
        switch(entityType){
            case 'Plot_Polyline':
                let polyline_xSum = 0;
                let polyline_ySum = 0;
                let polyline_zSum = 0;
                let polylinePositions = entity.polyline.positions.getValue();
                let polyline_pNum = polylinePositions.length;
                for(let i=0,len=polyline_pNum; i<len; i++){
                    polyline_xSum += polylinePositions[i].x;
                    polyline_ySum += polylinePositions[i].y;
                    polyline_zSum += polylinePositions[i].z;
                }
                centerPosition = new Cesium.Cartesian3(polyline_xSum/polyline_pNum, polyline_ySum/polyline_pNum, polyline_zSum/polyline_pNum);
                break;
            case 'Plot_Polygon':
                let polygon_xSum = 0;
                let polygon_ySum = 0;
                let polygon_zSum = 0;
                let polygonPositions = entity.polygon.hierarchy.getValue();
                let polygon_pNum = polygonPositions.length;
                for(let i=0,len=polygon_pNum; i<len; i++){
                    polygon_xSum += polygonPositions[i].x;
                    polygon_ySum += polygonPositions[i].y;
                    polygon_zSum += polygonPositions[i].z;
                }
                centerPosition = new Cesium.Cartesian3(polygon_xSum/polygon_pNum, polygon_ySum/polygon_pNum, polygon_zSum/polygon_pNum);
                break;
            case 'Plot_Rectangle':
                let rectangle_center = Cesium.Rectangle.center(entity.rectangle.coordinates.getValue());
                centerPosition = Cesium.Cartographic.toCartesian(rectangle_center);
                break;
        }
        return centerPosition;
    }

    // 计算entity实体坐标平移后的新坐标数组
    static calcNewPosition(entity, fromPosition, toPosition){
        let x = toPosition.x - fromPosition.x;
        let y = toPosition.y - fromPosition.y;
        let z = toPosition.z - fromPosition.z;
        let entityType = entity.name;
        switch(entityType){
            case 'Plot_Polyline':
                let polylineNewPosition = [];
                let polylinePositions = entity.polyline.positions.getValue();
                for(let i=0,len=polylinePositions.length; i<len; i++){
                    polylineNewPosition.push(new Cesium.Cartesian3(polylinePositions[i].x+x, polylinePositions[i].y+y, polylinePositions[i].z+z));
                }
                return polylineNewPosition;
            case 'Plot_Polygon':
                let polygonNewPosition = [];
                let polygonPositions = entity.polygon.hierarchy.getValue();
                for(let i=0,len=polygonPositions.length; i<len; i++){
                    polygonNewPosition.push(new Cesium.Cartesian3(polygonPositions[i].x+x, polygonPositions[i].y+y, polygonPositions[i].z+z));
                }
                return polygonNewPosition;
            case 'Plot_Rectangle':
                let rectanglePositions = entity.rectangle.coordinates.getValue();
                let rectangle_f = Cesium.Cartographic.fromCartesian(fromPosition);
                let rectangle_t= Cesium.Cartographic.fromCartesian(toPosition);
                let rectangle_x_radian = rectangle_t.longitude - rectangle_f.longitude;
                let rectangle_y_radian = rectangle_t.latitude - rectangle_f.latitude;
                let rectangle_left_top2 = new Cesium.Cartographic(rectanglePositions.west+rectangle_x_radian, rectanglePositions.north+rectangle_y_radian);
                let rectangle_right_bottom2 = new Cesium.Cartographic(rectanglePositions.east+rectangle_x_radian, rectanglePositions.south+rectangle_y_radian);
                return Cesium.Rectangle.fromCartographicArray([rectangle_left_top2, rectangle_right_bottom2]);
        }
    }


    // 复制粘贴entity实体
    static copyEntity(copiedEntity, newPosition){
        let entity = null;
        let plotName = copiedEntity.name;
        switch(plotName){
            case 'Plot_Point':
                entity = viewer.entities.add({
                    name: 'Plot_Point',
                    position: newPosition,
                    billboard:{
                        image: copiedEntity.billboard.image.getValue(),
                        width: copiedEntity.billboard.width.getValue(),
                        height: copiedEntity.billboard.height.getValue(),
                        rotation: copiedEntity.billboard.rotation.getValue(),
                        scale: copiedEntity.billboard.scale.getValue()
                    }
                });
                break;
            case 'Plot_Model':
                let heading = copiedEntity.properties.getValue().heading;
                let pitch = copiedEntity.properties.getValue().pitch;
                let roll = copiedEntity.properties.getValue().roll;
                entity = viewer.entities.add({
                    name: 'Plot_Model',
                    position: newPosition,
                    model:{
                        uri: copiedEntity.model.uri.getValue(),
                        scale: copiedEntity.model.scale.getValue(),
                        color: copiedEntity.model.color.getValue()
                    },
                    orientation: copiedEntity.orientation.getValue(),
                    properties:{
                        heading: heading,
                        pitch: pitch,
                        roll: roll
                    }
                });
                break;
            case 'Plot_Polyline':
                entity = viewer.entities.add({
                    name: 'Plot_Polyline',
                    polyline:{
                        positions: CesiumUtil.positionConvert(copiedEntity, newPosition),
                        width: copiedEntity.polyline.width.getValue(),
                        material: copiedEntity.polyline.material.color.getValue(),
                        height: 0
                    }
                });
                break;
            case 'Plot_Polygon':
                entity = viewer.entities.add({
                    name: 'Plot_Polygon',
                    polygon:{
                        hierarchy: new Cesium.PolygonHierarchy(CesiumUtil.positionConvert(copiedEntity, newPosition)),
                        outline: copiedEntity.polygon.outline.getValue(),
                        outlineColor: copiedEntity.polygon.outlineColor.getValue(),
                        fill: copiedEntity.polygon.fill.getValue(),
                        material: copiedEntity.polygon.material.color.getValue(),
                        height: 0
                    }
                });
                break;
            case 'Plot_Rectangle':
                entity = viewer.entities.add({
                    name: 'Plot_Rectangle',
                    rectangle:{
                        coordinates: CesiumUtil.positionConvert(copiedEntity, newPosition),
                        outline: copiedEntity.rectangle.outline.getValue(),
                        outlineColor: copiedEntity.rectangle.outlineColor.getValue(),
                        fill: copiedEntity.rectangle.fill.getValue(),
                        material: copiedEntity.rectangle.material.color.getValue(),
                        height: 0
                    }
                });
                break;
            case 'Plot_Circle':
                entity = viewer.entities.add({
                    name: 'Plot_Circle',
                    position: newPosition,
                    ellipse:{
                        semiMinorAxis: copiedEntity.ellipse.semiMinorAxis.getValue(),
                        semiMajorAxis: copiedEntity.ellipse.semiMajorAxis.getValue(),
                        outline: copiedEntity.ellipse.outline.getValue(),
                        outlineColor: copiedEntity.ellipse.outlineColor.getValue(),
                        fill: copiedEntity.ellipse.fill.getValue(),
                        material: copiedEntity.ellipse.material.color.getValue(),
                        height: 0
                    }
                });
                break;
            case 'Plot_Label':
                entity = viewer.entities.add({
                    name: 'Plot_Label',
                    position: newPosition,
                    label:{
                        text: copiedEntity.label.text.getValue(),
                        font: copiedEntity.label.font.getValue(),
                        fillColor: copiedEntity.label.fillColor.getValue(),
                        showBackground: copiedEntity.label.showBackground.getValue(),
                        backgroundColor: copiedEntity.label.backgroundColor.getValue()
                    }
                });
                break;
        }
        return entity;
    }
	
	// entity是否是标绘实体
	static isPlotEntity(entity){
		let flag = false;
		switch(entity.name){
			case 'Plot_Point':
			case 'Plot_Polyline':
			case 'Plot_Polygon':
			case 'Plot_Rectangle':
			case 'Plot_Circle':
			case 'Plot_Label':
			case 'Plot_StraightArrow':
			case 'Plot_AttackArrow':
			case 'Plot_PincerArrow':
			case 'Plot_Model':
				flag = true;
				break;
		}
		return flag;
	}

	// 度分秒转经纬度
	static dmsToDegree(d, m, s){
		let degree = Number(d) + Number(m/60.0) + Number(s/3600.0);
		return degree.toFixed(6);
	}
	
	// 度分秒数组转经纬度数组
	static dmsArrToDegreeArr(dmsArr){
		let degreeArr = [];
		for(let i=0; i<dmsArr.length; i++){
			let lon = Number(dmsArr[i].d) + Number(dmsArr[i].m/60.0) + Number(dmsArr[i].s/3600.0);
			let lat = Number(dmsArr[i].d2) + Number(dmsArr[i].m2/60.0) + Number(dmsArr[i].s2/3600.0);
			degreeArr.push({
				lon: lon,
				lat: lat
			})
		}
		return degreeArr;
	}
}


export default CesiumUtil