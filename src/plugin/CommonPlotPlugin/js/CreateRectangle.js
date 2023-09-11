class CreateRectangle{
    constructor(lonlatParams){
        this.finalEntityId = undefined;
        let minLon = lonlatParams.minLon;
        let maxLon = lonlatParams.maxLon;
        let minLat = lonlatParams.minLat;
        let maxLat = lonlatParams.maxLat;
        this.createRectangle(minLon, minLat, maxLon, maxLat);
    }
    //创建面
    createRectangle(minLon, minLat, maxLon, maxLat) {
        let shape = viewer.entities.add({
            name: 'Plot_Rectangle',
            rectangle : {
                coordinates : Cesium.Rectangle.fromDegrees(minLon, minLat, maxLon, maxLat),
                fill: true,
                material : Cesium.Color.RED.withAlpha(0.3),
                outline : true,
                outlineWidth: 1,
                outlineColor : Cesium.Color.RED,
                height:0
            }
        });
        this.finalEntityId = shape.id;
    }
}

export default CreateRectangle