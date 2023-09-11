class CreateModel{
    constructor(lon, lat, option){
        this.modelUrl = option.modelUrl;
        this.show = true;
        this.lon = lon;
        this.lat = lat;
        this.height = 0;
        this.finalEntityId = undefined;
        this.createModel();
    }

    //创建模型
    createModel() {
        let position = Cesium.Cartesian3.fromDegrees(this.lon, this.lat);
        let hpr = new Cesium.HeadingPitchRoll(0, 0, 0);
        let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
        let entity = viewer.entities.add({
            name: 'Plot_Model',
            position: position,
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

export default CreateModel