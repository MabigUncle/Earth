class CreatePoint{
    constructor(lon, lat, billboardParams){
        this.billboardImage = billboardParams.billboardImage;
        this.billboardWidth = billboardParams.billboardWidth || 50;
        this.billboardHeight = billboardParams.billboardHeight || 50;
        this.show = true;
        this.lon = lon;
        this.lat = lat;
        this.height = 0;
		this.finalEntityId = null;
        this.createPoint();
    }

    //创建点
    createPoint() {
        let entity = viewer.entities.add({
            name: 'Plot_Point',
            position : Cesium.Cartesian3.fromDegrees(this.lon, this.lat),
            billboard:{
                image: this.billboardImage,
                width: this.billboardWidth,
                height: this.billboardHeight,
                rotation: 0,
                scale: 1.0,
                distanceDisplayCondition : new Cesium.DistanceDisplayCondition(1000, 6000000),
                scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 6000000, 0.2)
            }
        });
		this.finalEntityId = entity.id;
    }
}

export default CreatePoint