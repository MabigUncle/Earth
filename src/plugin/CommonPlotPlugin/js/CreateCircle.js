class CreateCircle{
    constructor(params){
        this.lon = Number(params.lon);
        this.lat = Number(params.lat);
        this.r = Number(params.radius)*1000;
        this.createCircle();
    }

    //创建圆
    createCircle() {
        let shape = viewer.entities.add({
            name:'Plot_Circle',
            position: Cesium.Cartesian3.fromDegrees(this.lon, this.lat),
            ellipse: {
                semiMinorAxis: this.r,
                semiMajorAxis: this.r,
                fill: true,
                material: Cesium.Color.RED.withAlpha(0.5),
                outline: true,
                outlineColor: Cesium.Color.RED,
                outlineWidth: 1,
                height:0
            }
        });
    }
}

export default CreateCircle