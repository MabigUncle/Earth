<!-- 挖填方 -->
<template>
	<div id="cutFillId">
		<div class="tools">
			<div style="margin-bottom: 15px;">
				<el-input v-model="height" size="mini" placeholder="请输入整平高度"></el-input>
			</div>
		    <el-button @click="drawRect" type="primary" size="mini">绘制挖填方区域</el-button>
			<el-button @click="analy" type="primary" size="mini">计算</el-button>
		    <el-button @click="clear" type="primary" size="mini">清除</el-button>
		</div>
		<div v-show="resultShow" class="result">
			<div>
				图例：挖方 <span style="width: 16px; height:16px; background-color: #00ff00;display: inline-block;"></span>
				, 填方 <span style="width: 16px; height:16px; background-color: #ff0000;display: inline-block;"></span>
			</div>
			<div>
				<div>填方总量：{{fillTotal}} {{unit}}</div>
				<div>挖方总量：{{cutTotal}} {{unit}}</div>
				<div>填挖方总量：{{cutFillTotal}} {{unit}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {calcCutFillApi} from '@/api/SpatialAnalysisApi.js'
	export default{
		name:'CutFillComp',
		data(){
			return{
				height: '',
				
				fillTotal: 0,
				cutTotal: 0,
				cutFillTotal: 0,
				unit: '',
				resultShow: false,
				cutFillPrimitive: null,
				
				activeShapePoints: [],
				activeShape: undefined,
				floatingPoint: undefined,
				finalEntity: undefined,
			}
		},
		methods:{
			drawRect(){
				let _this = this;
				let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
				handler.setInputAction(function(event) {
				    if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
				        console.log('This browser does not support polylgons on terrain.');
				        return;
				    }
				    let earthPosition = viewer.camera.pickEllipsoid(event.position);
				    //在地形上绘制时
				    // let earthPosition = viewer.scene.pickPosition(event.position);
				    if (Cesium.defined(earthPosition)) {
				        if (_this.activeShapePoints.length === 0) {
				            _this.floatingPoint = _this.createPoint(earthPosition);
				            _this.activeShapePoints.push(earthPosition);
				            let dynamicPositions = new Cesium.CallbackProperty(function () {
				                return Cesium.Rectangle.fromCartesianArray(_this.activeShapePoints);
				            }, false);
				            _this.activeShape = _this.createRectangle(dynamicPositions);
				            _this.activeShapePoints.push(earthPosition);
				            // _this.createPoint(earthPosition);
				        }else{
				            // _this.createPoint(earthPosition);
				            _this.activeShapePoints.push(earthPosition);
				            _this.terminateRectangle();
				            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
				            handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
				        }
				    }
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
				
				handler.setInputAction(function(event) {
				    if (Cesium.defined(_this.floatingPoint)) {
				        let newPosition = viewer.camera.pickEllipsoid(event.endPosition);
				        //在地形上绘制时
				        // let newPosition = viewer.scene.pickPosition(event.endPosition);
				        if (Cesium.defined(newPosition)) {
				            _this.floatingPoint.position.setValue(newPosition);
				            _this.activeShapePoints.pop();
				            _this.activeShapePoints.push(newPosition);
				        }
				    }
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			},
			//创建点
			createPoint(worldPosition) {
			    let point = viewer.entities.add({
			        position : worldPosition,
			        point : {
			            color : Cesium.Color.WHITE,
			            pixelSize : 5,
			            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
			        }
			    });
			    return point;
			},
			
			//创建矩形
			createRectangle(positionData) {
			    let shape = viewer.entities.add({
			        rectangle : {
			            coordinates : positionData,
			            fill: true,
			            material : Cesium.Color.RED.withAlpha(0.3),
			            outline : true,
			            outlineWidth: 1,
			            outlineColor: Cesium.Color.RED,
			            height:0
			        }
			    });
			    return shape;
			},
			
			//鼠标右击结束绘制
			terminateRectangle() {
			    this.activeShapePoints.pop();
			    this.finalEntity = this.createRectangle(Cesium.Rectangle.fromCartesianArray(this.activeShapePoints));
			    viewer.entities.remove(this.floatingPoint);
			    viewer.entities.remove(this.activeShape);
			    this.floatingPoint = undefined;
			    this.activeShape = undefined;
			    // this.activeShapePoints = [];
			},
			
			analy(){
				viewer.entities.remove(this.finalEntity);
				let cartographic1 = Cesium.Cartographic.fromCartesian(this.activeShapePoints[0]);
				let cartographic2 = Cesium.Cartographic.fromCartesian(this.activeShapePoints[1]);
				let lon1 = Cesium.Math.toDegrees(cartographic1.longitude);
				let lat1 = Cesium.Math.toDegrees(cartographic1.latitude);
				let lon2 = Cesium.Math.toDegrees(cartographic2.longitude);
				let lat2 = Cesium.Math.toDegrees(cartographic2.latitude);
				let minLon = lon1 <= lon2 ? lon1 : lon2;
				let minLat = lat1 <= lat2 ? lat1 : lat2;
				let maxLon = lon1 >= lon2 ? lon1 : lon2;
				let maxLat = lat1 >= lat2 ? lat1 : lat2;
				calcCutFillApi(minLon, minLat, maxLon, maxLat, this.height).then((response)=>{
					if(response.data.status === "success"){
						this.$message({
							message: '挖填方计算成功！',
							type: 'success'
						});
						let result = response.data.result;
						this.cutTotal = result.cutTotalArea.toFixed(9);
						this.fillTotal = result.fillTotalArea.toFixed(9);
						this.cutFillTotal = result.totalArea.toFixed(9);
						this.unit = result.unit;
						this.resultShow = true;
						let cutFillGridInfo = result.cutFillGridInfo;
						let pointPositionArr = [];
						let pointColorArr = [];
						for(let i=0; i<cutFillGridInfo.length; i++){
							let lonlatArr = cutFillGridInfo[i].lonlatGrid;
							let p1 = Cesium.Cartesian3.fromDegrees(lonlatArr[0], lonlatArr[3], 0);
							pointPositionArr.push(p1.x, p1.y, p1.z);
							let p2 = Cesium.Cartesian3.fromDegrees(lonlatArr[0], lonlatArr[1], 0);
							pointPositionArr.push(p2.x, p2.y, p2.z);
							let p3 = Cesium.Cartesian3.fromDegrees(lonlatArr[2], lonlatArr[1], 0);
							pointPositionArr.push(p3.x, p3.y, p3.z);
							let p4 = Cesium.Cartesian3.fromDegrees(lonlatArr[2], lonlatArr[3], 0);
							pointPositionArr.push(p4.x, p4.y, p4.z);
							if(cutFillGridInfo[i].cutfillArea>0){
								pointColorArr.push(0.0, 1.0, 0.0, 0.3);
								pointColorArr.push(0.0, 1.0, 0.0, 0.3);
								pointColorArr.push(0.0, 1.0, 0.0, 0.3);
								pointColorArr.push(0.0, 1.0, 0.0, 0.3);
								
							}else{
								pointColorArr.push(1.0, 0.0, 0.0, 0.3);
								pointColorArr.push(1.0, 0.0, 0.0, 0.3);
								pointColorArr.push(1.0, 0.0, 0.0, 0.3);
								pointColorArr.push(1.0, 0.0, 0.0, 0.3);
							}
						}
						this.cutFillPrimitive = Cesium.PrimitiveUtil.addPrimitiveRect(viewer, pointPositionArr, 3, pointColorArr, 4);
					}
				})
			},
			clear(){
				viewer.entities.remove(this.finalEntity);
				this.finalEntity = null;
				this.activeShapePoints = [];
				viewer.scene.primitives.remove(this.cutFillPrimitive);
				this.cutFillPrimitive = null;
				this.resultShow = false;
				this.cutTotal = 0;
				this.fillTotal = 0;
				this.cutFillTotal = 0;
				this.unit = '';
				this.height = '';
			}
		}
	}
</script>

<style scoped="true">
	.result{
		margin-top: 15px;
	}
</style>
