// entity实体编辑类
class EntityEdit{
    constructor(entityId){
        this.pointHandler = undefined;
        this.modelHandler = undefined;
        this.polylineHandler = undefined;
        this.polygonHandler = undefined;
        this.rectangleHandler = undefined;
        this.circleHandler = undefined;
        this.labelHandler = undefined;
        this.straightArrowHandler = undefined;
        this.attackArrowHandler = undefined;
        this.pincerArrowHandler = undefined;

        this.currentEditPoint = undefined;
        this.isEditting = false;
        this.pointsId = [];
        this.editEntity = viewer.entities.getById(entityId);

        this.editArrow = undefined;

        this.addAllEditPoint();
        this.addEntityEditListener(this.editEntity.name);

        window.viewer.scene.screenSpaceCameraController.enableRotate = false;
        window.viewer.scene.screenSpaceCameraController.enableZoom = false;
        window.viewer.scene.screenSpaceCameraController.enableTranslate = false;
    }

    addAllEditPoint(){
        switch(this.editEntity.name){
            case 'Plot_Point':
                let position = this.editEntity.position.getValue();
                let point = viewer.entities.add({
                    name: "edit_point",
                    position: position,
                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 10,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 1
                    }
                });
                this.pointsId.push(point.id);
                break;
            case 'Plot_Model':
                /*let position2 = this.editEntity.position.getValue();
                let point2 = viewer.entities.add({
                    name: "edit_point",
                    position: position2,
                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 10,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 1
                    }
                });
                this.pointsId.push(point2.id);*/
                break;
            case 'Plot_Polyline':
                let arr = this.editEntity.polyline.positions.getValue();
                for(let i=0,len=arr.length; i<len; i++){
                    let point = viewer.entities.add({
                        name: "edit_point",
                        position: arr[i],
                        point: {
                            color: Cesium.Color.YELLOW,
                            pixelSize: 10,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 1
                        }
                    });
                    this.pointsId.push(point.id);
                }
                break;
            case 'Plot_Polygon':
                let polygonArr = this.editEntity.polygon.hierarchy.getValue().positions;
                for(let i=0,len=polygonArr.length; i<len; i++){
                    let point = viewer.entities.add({
                        name: "edit_point",
                        position: polygonArr[i],
                        point: {
                            color: Cesium.Color.YELLOW,
                            pixelSize: 10,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 1
                        }
                    });
                    this.pointsId.push(point.id);
                }
                break;
            case 'Plot_Rectangle':
                let rectangleObj = this.editEntity.rectangle.coordinates.getValue();
                let rectanglePoint1 = viewer.entities.add({
                    name: "edit_point",
                    position: Cesium.Cartesian3.fromRadians(rectangleObj.west, rectangleObj.north),
                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 10,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 1
                    }
                });
                this.pointsId.push(rectanglePoint1.id);
                let rectanglePoint2 = viewer.entities.add({
                    name: "edit_point",
                    position: Cesium.Cartesian3.fromRadians(rectangleObj.east, rectangleObj.south),
                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 10,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 1
                    }
                });
                this.pointsId.push(rectanglePoint2.id);
                break;
            case 'Plot_Circle':
                //计算圆边界上的任一点作为边界点
                let center = this.editEntity.position._value;
                let r = this.editEntity.ellipse.semiMinorAxis.getValue();
                let matrix = Cesium.Transforms.eastNorthUpToFixedFrame(center);
                let inverseMatrix = Cesium.Matrix4.inverseTransformation(matrix, new Cesium.Matrix4());
                let localCenter = Cesium.Matrix4.multiplyByPoint(inverseMatrix, center, new Cesium.Cartesian3());
                let localX = localCenter.x + r*Math.cos(0);
                let localY = localCenter.x + r*Math.sin(0);
                let localPoint = new Cesium.Cartesian3(localX, localY, 0);
                let edgePoint = Cesium.Matrix4.multiplyByPoint(matrix, localPoint, new Cesium.Cartesian3());
                let circlePoint = viewer.entities.add({
                    name: "edit_point",
                    position: edgePoint,
                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 10,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 1
                    }
                });
                this.pointsId.push(circlePoint.id);
                break;
            case 'Plot_Label':
                let labelPosition = this.editEntity.position.getValue();
                let labelPoint = viewer.entities.add({
                    name: "edit_point",
                    position: labelPosition,
                    point: {
                        color: Cesium.Color.YELLOW,
                        pixelSize: 10,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 1
                    }
                });
                this.pointsId.push(labelPoint.id);
                break;
            case 'Plot_StraightArrow':
            case 'Plot_AttackArrow':
            case 'Plot_PincerArrow':
                for (let i = 0; i < arrow.drawArr.length; i++) {
                    if (arrow.drawArr[i].arrowEntity.id === this.editEntity.id) {
                        let selectedObj = arrow.drawArr[i];
                        this.editArrow = selectedObj;
                        switch(selectedObj.type){
                            case 'StraightArrow':
                                selectedObj.firstPoint.show = true;
                                selectedObj.floatPoint.show = true;
                                break;
                            case 'AttackArrow':
                                for (let j = 0; j < selectedObj.pointArr.length; j++) {
                                    selectedObj.pointArr[j].show = true;
                                }
                                break;
                            case 'PincerArrow':
                                for (let j = 0; j < selectedObj.pointArr.length; j++) {
                                    selectedObj.pointArr[j].show = true;
                                }
                                break;
                        }
                        break;
                    }
                }
                break;
        }
    }

    addEntityEditListener(entityType){
        switch(entityType){
            case 'Plot_Point':
                this.addPointEntityEditListener();
                break;
            case 'Plot_Model':
                this.addModelEntityEditListener();
                break;
            case 'Plot_Polyline':
                this.addPolylineEntityEditListener();
                break;
            case 'Plot_Polygon':
                this.addPolygonEntityEditListener();
                break;
            case 'Plot_Rectangle':
                this.addRectangleEntityEditListener();
                break;
            case 'Plot_Circle':
                this.addCircleEntityEditListener();
                break;
            case 'Plot_Label':
                this.addLabelEntityEditListener();
                break;
            case 'Plot_StraightArrow':
                this.addStraightArrowEntityEditListener();
                break;
            case 'Plot_AttackArrow':
                this.addAttackArrowEntityEditListener();
                break;
            case 'Plot_PincerArrow':
                this.addPincerArrowEntityEditListener();
                break;
        }
    }

    //增加编辑点标的事件监听
    addPointEntityEditListener(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(event){
            let pickedObject = viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if(!_this.isEditting && pickedObject.id.name === "edit_point"){
                    _this.currentEditPoint = pickedObject.id;
                    _this.isEditting = true;
                    document.body.style.cursor = "move";
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function(event){
            if(_this.isEditting){
                let cartesian = viewer.camera.pickEllipsoid(event.endPosition);
                _this.currentEditPoint.position = new Cesium.CallbackProperty(() => {
                    return cartesian;
                }, false);
                _this.editEntity.position = cartesian;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(event){
            _this.isEditting = false;
            _this.currentEditPoint = undefined;
            document.body.style.cursor = "default";
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.pointHandler = handler;
    }

    //增加编辑模型的事件监听
    addModelEntityEditListener(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(event){
            let pickedObject = viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if(!_this.isEditting && pickedObject.id.id === _this.editEntity.id){
                    _this.isEditting = true;
                    document.body.style.cursor = "move";
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function(event){
            if(_this.isEditting){
                _this.editEntity.position = viewer.camera.pickEllipsoid(event.endPosition);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(event){
            _this.isEditting = false;
            document.body.style.cursor = "default";
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.modelHandler = handler;
    }

    //增加编辑线的事件监听
    addPolylineEntityEditListener(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(event){
            let pickedObject = viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if(!_this.isEditting && pickedObject.id.name === "edit_point"){
                    _this.currentEditPoint = pickedObject.id;
                    _this.isEditting = true;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function(event){
            if(_this.isEditting){
                let cartesian = viewer.camera.pickEllipsoid(event.endPosition);
                _this.currentEditPoint.position = cartesian;
                let points = [];
                for (let id of _this.pointsId) {
                    points.push(viewer.entities.getById(id).position._value);
                }
                _this.editEntity.polyline.positions = new Cesium.CallbackProperty(() => {
                    return points;
                }, false);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(event){
            _this.isEditting = false;
            _this.currentEditPoint = undefined;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.polylineHandler = handler;
    }

    //增加编辑面的事件监听
    addPolygonEntityEditListener(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(event){
            let pickedObject = viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if(!_this.isEditting && pickedObject.id.name === "edit_point"){
                    _this.currentEditPoint = pickedObject.id;
                    _this.isEditting = true;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function(event){
            if(_this.isEditting){
                let cartesian = viewer.camera.pickEllipsoid(event.endPosition);
                _this.currentEditPoint.position = cartesian;
                let points = [];
                for (let id of _this.pointsId) {
                    points.push(viewer.entities.getById(id).position.getValue());
                }
                _this.editEntity.polygon.hierarchy = new Cesium.CallbackProperty(() => {
                    return new Cesium.PolygonHierarchy(points);
                }, false);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(event){
            _this.isEditting = false;
            _this.currentEditPoint = undefined;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.polygonHandler = handler;
    }

    //增加编辑矩形的事件监听
    addRectangleEntityEditListener(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(event){
            let pickedObject = viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if(!_this.isEditting && pickedObject.id.name === "edit_point"){
                    _this.currentEditPoint = pickedObject.id;
                    _this.isEditting = true;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function(event){
            if(_this.isEditting){
                let cartesian = viewer.camera.pickEllipsoid(event.endPosition);
                _this.currentEditPoint.position = cartesian;
                let points = [];
                for (let id of _this.pointsId) {
                    points.push(viewer.entities.getById(id).position._value);
                }
                _this.editEntity.rectangle.coordinates = new Cesium.CallbackProperty(() => {
                    return Cesium.Rectangle.fromCartesianArray(points);
                }, false);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(event){
            _this.isEditting = false;
            _this.currentEditPoint = undefined;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.rectangleHandler = handler;
    }

    //增加编辑圆的事件监听
    addCircleEntityEditListener(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(event){
            let pickedObject = viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if(!_this.isEditting && pickedObject.id.name === "edit_point"){
                    _this.currentEditPoint = pickedObject.id;
                    _this.isEditting = true;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function(event){
            if(_this.isEditting){
                let cartesian = viewer.camera.pickEllipsoid(event.endPosition);
                _this.currentEditPoint.position = cartesian;
                let r = Cesium.Cartesian3.distance(_this.editEntity.position._value, cartesian);
                _this.editEntity.ellipse.semiMinorAxis = new Cesium.CallbackProperty(() => {
                    return r;
                }, false);
                _this.editEntity.ellipse.semiMajorAxis = new Cesium.CallbackProperty(() => {
                    return r;
                }, false);
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(event){
            _this.isEditting = false;
            _this.currentEditPoint = undefined;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.circleHandler = handler;
    }

    //增加编辑标注的事件监听
    addLabelEntityEditListener(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(event){
            let pickedObject = viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if(!_this.isEditting && pickedObject.id.name === "edit_point"){
                    _this.currentEditPoint = pickedObject.id;
                    _this.isEditting = true;
                    document.body.style.cursor = "move";
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function(event){
            if(_this.isEditting){
                let cartesian = viewer.camera.pickEllipsoid(event.endPosition);
                _this.currentEditPoint.position = new Cesium.CallbackProperty(() => {
                    return cartesian;
                }, false);
                _this.editEntity.position = cartesian;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(event){
            _this.isEditting = false;
            _this.currentEditPoint = undefined;
            document.body.style.cursor = "default";
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.labelHandler = handler;
    }

    //增加编辑态势-直线箭头的事件监听
    addStraightArrowEntityEditListener(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(event){
            let pickedObject = viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if(!_this.isEditting && pickedObject.id.name === "edit_point"){
                    _this.currentEditPoint = pickedObject.id;
                    _this.isEditting = true;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function(event){
            if(_this.isEditting){
                let cartesian = viewer.camera.pickEllipsoid(event.endPosition);
                _this.currentEditPoint.position.setValue(cartesian);
                if (_this.currentEditPoint.type == "firstPoint") {
                    _this.editArrow.positions[1] = cartesian;
                }
                if (_this.currentEditPoint.type == "floatPoint") {
                    _this.editArrow.positions[2] = cartesian;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(event){
            _this.isEditting = false;
            _this.currentEditPoint = undefined;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.straightArrowHandler = handler;
    }

    //增加编辑态势-攻击箭头的事件监听
    addAttackArrowEntityEditListener(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(event){
            let pickedObject = viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if(!_this.isEditting && pickedObject.id.name === "edit_point"){
                    _this.currentEditPoint = pickedObject.id;
                    _this.isEditting = true;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function(event){
            if(_this.isEditting){
                let cartesian = viewer.camera.pickEllipsoid(event.endPosition);
                _this.currentEditPoint.position.setValue(cartesian);
                _this.editArrow.positions[_this.currentEditPoint.wz - 1] = cartesian;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(event){
            _this.isEditting = false;
            _this.currentEditPoint = undefined;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.attackArrowHandler = handler;
    }

    //增加编辑态势-钳击箭头的事件监听
    addPincerArrowEntityEditListener(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(event){
            let pickedObject = viewer.scene.pick(event.position);
            if (Cesium.defined(pickedObject)) {
                if(!_this.isEditting && pickedObject.id.name === "edit_point"){
                    _this.currentEditPoint = pickedObject.id;
                    _this.isEditting = true;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        handler.setInputAction(function(event){
            if(_this.isEditting){
                let cartesian = viewer.camera.pickEllipsoid(event.endPosition);
                _this.currentEditPoint.position.setValue(cartesian);
                _this.editArrow.positions[_this.currentEditPoint.wz - 1] = cartesian;
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        handler.setInputAction(function(event){
            _this.isEditting = false;
            _this.currentEditPoint = undefined;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        this.pincerArrowHandler = handler;
    }

    //移除所有的编辑点
    removeAllEditPoint(){
        for (let id of this.pointsId) {
            viewer.entities.removeById(id);
        }
        this.pointsId = [];
        //隐藏箭头的控制点
        if(this.editArrow != undefined){
            switch(this.editArrow.type){
                case 'StraightArrow':
                    this.editArrow.firstPoint.show = false;
                    this.editArrow.floatPoint.show = false;
                    break;
                case 'AttackArrow':
                    for (let j = 0; j < this.editArrow.pointArr.length; j++) {
                        this.editArrow.pointArr[j].show = false;
                    }
                    break;
                case 'PincerArrow':
                    for (let j = 0; j < this.editArrow.pointArr.length; j++) {
                        this.editArrow.pointArr[j].show = false;
                    }
                    break;
            }
        }
    }

    //移除所有的实体监听事件
    removeEntityEditListener(entityType){
		this.editEntity = undefined;
		this.entityType = undefined;
        switch(entityType){
            case 'Plot_Point':
                if(this.pointHandler){
                    this.pointHandler.destroy();
                    this.pointHandler = undefined;
                }
                break;
            case 'Plot_Model':
                if(this.modelHandler){
                    this.modelHandler.destroy();
                    this.modelHandler = undefined;
                }
                break;
            case 'Plot_Polyline':
                if(this.polylineHandler){
                    this.polylineHandler.destroy();
                    this.polylineHandler = undefined;
                }
                break;
            case 'Plot_Polygon':
                if(this.polygonHandler){
                    this.polygonHandler.destroy();
                    this.polygonHandler = undefined;
                }
                break;
            case 'Plot_Rectangle':
                if(this.rectangleHandler){
                    this.rectangleHandler.destroy();
                    this.rectangleHandler = undefined;
                }
                break;
            case 'Plot_Circle':
                if(this.circleHandler){
                    this.circleHandler.destroy();
                    this.circleHandler = undefined;
                }
                break;
            case 'Plot_Label':
                if(this.labelHandler){
                    this.labelHandler.destroy();
					this.labelHandler = undefined;
                }
                break;
            case 'Plot_StraightArrow':
                if(this.straightArrowHandler){
                    this.straightArrowHandler.destroy();
                    this.straightArrowHandler = undefined;
                }
                break;
            case 'Plot_AttackArrow':
                if(this.attackArrowHandler){
                    this.attackArrowHandler.destroy();
                    this.attackArrowHandler = undefined;
                }
                break;
            case 'Plot_PincerArrow':
                if(this.pincerArrowHandler){
                    this.pincerArrowHandler.destroy();
                    this.pincerArrowHandler = undefined;
                }
                break;

        }
    }

    //移除镜头的锁定
    removeCameraLock(){
        window.viewer.scene.screenSpaceCameraController.enableRotate = true;
        window.viewer.scene.screenSpaceCameraController.enableZoom = true;
        window.viewer.scene.screenSpaceCameraController.enableTranslate = true;
    }
}

export default EntityEdit