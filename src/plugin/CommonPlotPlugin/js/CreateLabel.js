class CreateLabel{
    constructor(params){
        this.lon = Number(params.lon);
        this.lat = Number(params.lat);
        this.text = params.text;
        this.createLabel();
    }

    //创建文字标注
    createLabel() {
        let shape = viewer.entities.add({
            name:'Plot_Label',
            position: Cesium.Cartesian3.fromDegrees(this.lon, this.lat),
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

export default CreateLabel