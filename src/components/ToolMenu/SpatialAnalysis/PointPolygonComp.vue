<template>
	<div id="pointPolygonId">
		<el-form ref="ppForm" :model="ppForm" label-width="60px">
			<el-form-item label="观察点">
				<el-col :span="10">
					<el-form-item prop="lon1">
						<el-input v-model="ppForm.lon1" size="mini" placeholder="观察点经度"></el-input>
					</el-form-item>
				</el-col>
				<el-col class="line" :span="1">&nbsp;</el-col>
				<el-col :span="10">
					<el-form-item prop="lat1">
						<el-input v-model="ppForm.lat1" size="mini" placeholder="观察点纬度"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="3">
					<img src="image/RouteAnalysis/position.png" @click="mapPosition1" class="positionClass" title="图上选取坐标" />
				</el-col>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="drawRect">绘制目标区域</el-button>
				<el-button type="primary" size="mini" @click="ppCalc">分析</el-button>
				<el-button type="primary" size="mini" @click="ppClear">清除</el-button>
			</el-form-item>
		</el-form>
		<div class="result">
			<div>
				<div>点面通视图例</div>
				<div>
					<span>通视：</span>
					<span class="legend-item" style="background-color: #00ff00;"></span>
				</div>
				<div>
					<span>不通视：</span>
					<span class="legend-item" style="background-color: #ff0000;"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		calcPointPolygonApi
	} from '@/api/SpatialAnalysisApi.js'
	
	export default {
		name: 'PointPolygonComp',
		data(){
			return{
				ppForm: {
					lon1: '',
					lat1: ''
				},
				pointPolygonPrimitive: '',
				handler1: '',
				positionEntityId1: null,
				activeShapePoints: [],
				activeShape: undefined,
				floatingPoint: undefined,
				finalEntity: '',
			}
		},
		methods:{
			// 图上选取观察点的经纬度
			mapPosition1() {
				let _this = this;
				this.handler1 = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				this.handler1.setInputAction(function(evt) {
					let cartesian = viewer.camera.pickEllipsoid(evt.position);
					let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
					_this.ppForm.lon1 = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
					_this.ppForm.lat1 = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
					let entity = new Cesium.Entity({
						position: Cesium.Cartesian3.fromDegrees(_this.ppForm.lon1, _this.ppForm.lat1),
						point: {
							pixelSize: 5,
							color: Cesium.Color.YELLOW,
							outlineColor: Cesium.Color.RED,
							outlineWidth: 2
						},
						label:{
							text: '观察点',
							font: '18px sans-serif',
							fillColor: Cesium.Color.RED,
							pixelOffset: new Cesium.Cartesian2(0, 20)
						}
					});
					viewer.entities.add(entity);
					_this.positionEntityId1 = entity.id;
					_this.handler1.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
					_this.handler1 = '';
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			},
			
			// 绘制目标区域
			drawRect() {
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
							let dynamicPositions = new Cesium.CallbackProperty(function() {
								return Cesium.Rectangle.fromCartesianArray(_this.activeShapePoints);
							}, false);
							_this.activeShape = _this.createRectangle(dynamicPositions);
							_this.activeShapePoints.push(earthPosition);
							// _this.createPoint(earthPosition);
						} else {
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
					position: worldPosition,
					point: {
						color: Cesium.Color.WHITE,
						pixelSize: 5,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
					}
				});
				return point;
			},
			//创建矩形
			createRectangle(positionData) {
				let shape = viewer.entities.add({
					rectangle: {
						coordinates: positionData,
						fill: true,
						material: Cesium.Color.RED.withAlpha(0.3),
						outline: true,
						outlineWidth: 1,
						outlineColor: Cesium.Color.RED,
						height: 0
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
			
			
			ppCalc() {
				this.clearEntity();
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
				calcPointPolygonApi(this.ppForm.lon1, this.ppForm.lat1, minLon, minLat, maxLon, maxLat).then((response) => {
					if (response.status == 200) {
						if (response.data.status === 'fail') {
							this.$message({
								message: '点面通视计算失败！',
								type: 'error'
							});
						}
						if (response.data.status === 'success') {
							let pointPositionArr = [];
							let pointColorArr = [];
							let gridInfo = response.data.result.pointPolygonGridInfo;
							for(let i=0; i<gridInfo.length; i++){
								let lonlatArr = gridInfo[i].lonlatGrid;
								let p1 = Cesium.Cartesian3.fromDegrees(lonlatArr[0], lonlatArr[3], 0);
								pointPositionArr.push(p1.x, p1.y, p1.z);
								let p2 = Cesium.Cartesian3.fromDegrees(lonlatArr[0], lonlatArr[1], 0);
								pointPositionArr.push(p2.x, p2.y, p2.z);
								let p3 = Cesium.Cartesian3.fromDegrees(lonlatArr[2], lonlatArr[1], 0);
								pointPositionArr.push(p3.x, p3.y, p3.z);
								let p4 = Cesium.Cartesian3.fromDegrees(lonlatArr[2], lonlatArr[3], 0);
								pointPositionArr.push(p4.x, p4.y, p4.z);
								let visible = gridInfo[i].visible;
								if(visible){
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
							this.pointPolygonPrimitive = Cesium.PrimitiveUtil.addPrimitiveRect(viewer, pointPositionArr, 3, pointColorArr, 4);
						}
					}
				})
			},
			
			clearEntity(){
				if (this.finalEntity != '') {
					viewer.entities.remove(this.finalEntity);
					this.finalEntity = '';
				}
				if(this.pointPolygonPrimitive != ''){
					viewer.scene.primitives.remove(this.pointPolygonPrimitive);
					this.pointPolygonPrimitive = '';
				}
			},
			
			ppClear() {
				if (this.positionEntityId1 != '') {
					viewer.entities.removeById(this.positionEntityId1);
					this.positionEntityId1 = '';
				}
				this.clearEntity();
				this.resetForm();
				this.activeShapePoints = [];
			},
			
			// 重置表单
			resetForm() {
				this.$refs["ppForm"].resetFields();
			},
		},
		beforeDestroy() {
			this.ppClear();
		}
	}
</script>

<style scoped="true">
	.legend-item {
		width: 16px;
		height: 16px;
		display: inline-block;
	}
</style>
<style>
	#pointPolygonId .el-form-item {
	    margin-bottom: 0px !important;
	}
</style>
