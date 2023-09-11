class DrawPoint{
    constructor(billboardParams){
        this.billboardImage = billboardParams.billboardImage;
        this.finalEntityId = undefined;
        this.drawPoint();
    }

    //绘制点
    drawPoint(){
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
                _this.createPoint(earthPosition);
                handler.destroy();
                PlotBus.$emit("DrawPoint_finish");
                PlotBus.$emit("addEntityPlot", {
                    plotType: 'Plot_Point',
                    entityId: _this.finalEntityId
                });
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //创建点
    createPoint(worldPosition) {
        let entity = viewer.entities.add({
            name: 'Plot_Point',
            position : worldPosition,
            billboard:{
                image: this.billboardImage,
                width: 50,
                height: 50,
                rotation: 0,
                scale: 1.0,
                distanceDisplayCondition : new Cesium.DistanceDisplayCondition(1000, 6000000),
                scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 6000000, 0.2)
            }
        });
		this.finalEntityId = entity.id;
    }


}

export default DrawPoint