class CreatePolyline{
    constructor(positionArr){
        this.finalEntityId = undefined;
        this.positionArr = positionArr;
        let positionData = [];
        for(let i=0,len=positionArr.length; i<len; i++){
            positionData.push(Number(positionArr[i].lon));
            positionData.push(Number(positionArr[i].lat));
        }
        this.createPolyline(positionData);
    }
    //创建线
    createPolyline(positionData) {
        let shape = viewer.entities.add({
            name:'Plot_Polyline',
            polyline : {
                positions : Cesium.Cartesian3.fromDegreesArray(positionData),
                clampToGround : true,
                material : Cesium.Color.RED,
                width: 2,
                height: 0
            }
        });
        this.finalEntityId = shape.id;
    }
}

export default CreatePolyline