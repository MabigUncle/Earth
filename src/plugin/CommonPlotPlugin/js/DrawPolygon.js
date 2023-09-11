class DrawPolygon{
    constructor(){
        this.activeShapePoints = [];
        this.activeShape = undefined;
        this.floatingPoint = undefined;
        this.finalEntityId = undefined;
        this.drawPolygon();
    }

    //绘制面
    drawPolygon(){
        let _this = this;
        let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
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
                        return new Cesium.PolygonHierarchy(_this.activeShapePoints)
                    }, false);
                    _this.activeShape = _this.createPolygon(dynamicPositions);
                }
                _this.activeShapePoints.push(earthPosition);
                // _this.createPoint(earthPosition);
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

        handler.setInputAction(function(event) {
            _this.terminatePolygon();
            handler.destroy();
            PlotBus.$emit("DrawPolygon_finish");
            PlotBus.$emit("addEntityPlot", {
                plotType: 'Plot_Polygon',
                entityId: _this.finalEntityId
            });
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
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

    //创建面
    createPolygon(positionData) {
        let shape = viewer.entities.add({
            name: 'Plot_Polygon',
            polygon: {
                hierarchy: positionData,
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
    terminatePolygon() {
        this.activeShapePoints.pop();
        let entity = this.createPolygon(this.activeShapePoints);
		this.finalEntityId = entity.id;
        viewer.entities.remove(this.floatingPoint);
        viewer.entities.remove(this.activeShape);
        this.floatingPoint = undefined;
        this.activeShape = undefined;
        // this.activeShapePoints = [];
    }
}

export default DrawPolygon