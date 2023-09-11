class DrawModel{
    constructor(option){
        this.modelUrl = option.modelUrl;
        this.finalEntityId = undefined;
        this.drawModel();
    }

    //绘制模型
    drawModel(){
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
                _this.createModel(earthPosition);
                PlotBus.$emit("DrawModel_finish");
                handler.destroy();
                PlotBus.$emit("addEntityPlot", {
                    plotType: 'Plot_Model',
                    entityId: _this.finalEntityId
                });
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //创建模型
    createModel(worldPosition) {
        let hpr = new Cesium.HeadingPitchRoll(0, 0, 0);
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(worldPosition, hpr);
        let entity = viewer.entities.add({
            name: 'Plot_Model',
            position : worldPosition,
            model:{
                uri: this.modelUrl,
                scale: 1.0,
                color: Cesium.Color.WHITE
            },
            orientation: orientation,
            show: true,
            properties:{
                heading: 0,
                pitch: 0,
                roll: 0
            }
        })
		this.finalEntityId = entity.id;
    }
}

export default DrawModel