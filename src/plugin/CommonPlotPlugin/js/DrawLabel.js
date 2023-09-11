class DrawLabel{
    constructor(text){
        this.text = text;
        this.finalEntityId = undefined;
        this.drawLabel();
    }

    //绘制文字标注
    drawLabel(){
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
                _this.createLabel(earthPosition);
                handler.destroy();
                PlotBus.$emit("DrawLabel_finish");
                PlotBus.$emit("addEntityPlot", {
                    plotType: 'Plot_Label',
                    entityId: _this.finalEntityId
                });
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //创建文字标注
    createLabel(earthPosition) {
        let shape = viewer.entities.add({
            name:'Plot_Label',
            position: earthPosition,
            label: {
                text: this.text,
                font: 'normal 20px sans-serif',
                fillColor: Cesium.Color.WHITE,
                showBackground: true,
                backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8),
                distanceDisplayCondition : new Cesium.DistanceDisplayCondition(1000, 6000000),
                scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 6000000, 0.2)
            }
        });
        this.finalEntityId = shape.id;
    }
}

export default DrawLabel