class DrawRectangle{
    constructor(){
        this.activeShapePoints = [];
        this.activeShape = undefined;
        this.floatingPoint = undefined;
        this.finalEntity = undefined;
        this.drawRectangle();
    }

    //绘制矩形
    drawRectangle(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        handler.setInputAction(function(event) {
            if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
                console.log('This browser does not support polylgons on terrain.');
                return;
            }
            let earthPosition = viewer.camera.pickEllipsoid(event.position);
            //在地形上绘制时
            // let earthPosition = viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                if (_this.activeShapePoints.length === 0) {
                    _this.floatingPoint = _this.createPoint(earthPosition);
                    _this.activeShapePoints.push(earthPosition);
                    let dynamicPositions = new Cesium.CallbackProperty(function () {
                        return Cesium.Rectangle.fromCartesianArray(_this.activeShapePoints);
                    }, false);
                    _this.activeShape = _this.createRectangle(dynamicPositions);
                    _this.activeShapePoints.push(earthPosition);
                    // _this.createPoint(earthPosition);
                }else{
                    // _this.createPoint(earthPosition);
                    _this.activeShapePoints.push(earthPosition);
                    _this.terminateRectangle();
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    Bus.$emit("DrawRectangle_finish");
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function(event) {
            if (Cesium.defined(_this.floatingPoint)) {
                let newPosition = viewer.camera.pickEllipsoid(event.endPosition);
                //在地形上绘制时
                // let newPosition = viewer.scene.pickPosition(event.endPosition);
                if (Cesium.defined(newPosition)) {
                    _this.floatingPoint.position.setValue(newPosition);
                    _this.activeShapePoints.pop();
                    _this.activeShapePoints.push(newPosition);
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    //创建点
    createPoint(worldPosition) {
        let point = viewer.entities.add({
            position : worldPosition,
            point : {
                color : Cesium.Color.WHITE,
                pixelSize : 5,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }
        });
        return point;
    }

    //创建矩形
    createRectangle(positionData) {
        let shape = viewer.entities.add({
            name:'Plot_Rectangle',
            rectangle : {
                coordinates : positionData,
                fill: true,
                material : Cesium.Color.RED.withAlpha(0.3),
                outline : true,
                outlineWidth: 1,
                outlineColor : Cesium.Color.RED,
                height:0
            }
        });
        return shape;
    }

    //鼠标右击结束绘制
    terminateRectangle() {
        this.activeShapePoints.pop();
        this.finalEntity = this.createRectangle(Cesium.Rectangle.fromCartesianArray(this.activeShapePoints));
        viewer.entities.remove(this.floatingPoint);
        viewer.entities.remove(this.activeShape);
        this.floatingPoint = undefined;
        this.activeShape = undefined;
        // this.activeShapePoints = [];
    }
}

export default DrawRectangle