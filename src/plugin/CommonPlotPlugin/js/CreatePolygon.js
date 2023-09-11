class CreatePolygon{
    constructor(positionArr){
        this.finalEntityId = undefined;
        this.positionArr = positionArr;
        let positionData = [];
        for(let i=0,len=positionArr.length; i<len; i++){
            positionData.push(Number(positionArr[i].lon));
            positionData.push(Number(positionArr[i].lat));
        }
        this.createPolygon(positionData);
    }
    //创建面
    createPolygon(positionData) {
        let shape = viewer.entities.add({
            name: 'Plot_Polygon',
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(positionData)),
                fill: true,
                material : Cesium.Color.RED.withAlpha(0.3),
                outline : true,
                outlineWidth: 1,
                outlineColor: Cesium.Color.RED,
                height:0
            }
        });
        this.finalEntityId = shape.id;
    }
}

export default CreatePolygon