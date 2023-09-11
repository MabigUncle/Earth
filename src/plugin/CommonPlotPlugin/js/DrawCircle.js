class DrawCircle{
    constructor(){
        this.activeShapePoints = [];
        this.activeShape = undefined;
        this.floatingPoint = undefined;
        this.finalEntityId = undefined;
        this.r = undefined;
        this.centerPoint = undefined;
        this.drawCircle();
    }

    //绘制圆
    drawCircle(){
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
                        return _this.calcRadius();
                    }, false);
                    _this.activeShape = _this.createCircle(dynamicPositions);
                    _this.activeShapePoints.push(earthPosition);
                    _this.createPoint(earthPosition);
                }else{
                    _this.activeShapePoints.push(earthPosition);
                    _this.terminateLine();
                    handler.destroy();
                    PlotBus.$emit("DrawCircle_finish");
                    PlotBus.$emit("addEntityPlot", {
                        plotType: 'Plot_Circle',
                        entityId: _this.finalEntityId
                    });
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
        this.centerPoint = point;
        return point;
    }

    //创建线
    createCircle(r) {
        let shape = viewer.entities.add({
            name:'Plot_Circle',
            position: this.activeShapePoints[0],
            ellipse: {
                semiMinorAxis: r,
                semiMajorAxis: r,
                fill: true,
                material: Cesium.Color.RED.withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.RED,
                outlineWidth: 1,
                height:0
            }
        });
        return shape;
    }

    //鼠标右击结束绘制
    terminateLine() {
        this.activeShapePoints.pop();
        let entity = this.createCircle(this.calcRadius());
		this.finalEntityId = entity.id;
        viewer.entities.remove(this.floatingPoint);
        viewer.entities.remove(this.activeShape);
        this.floatingPoint = undefined;
        this.activeShape = undefined;
        // this.activeShapePoints = [];
        if(this.centerPoint){
            viewer.entities.remove(this.centerPoint);
            this.centerPoint = undefined;
        }
    }

    calcRadius(){
        if(this.activeShapePoints.length === 1){
            this.r = 1;
        }else{
            this.r = Cesium.Cartesian3.distance(this.activeShapePoints[0], this.activeShapePoints[1]);
        }
        return this.r;
    }
}

export default DrawCircle