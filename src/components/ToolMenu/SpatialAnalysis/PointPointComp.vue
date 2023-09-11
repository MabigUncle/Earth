<template>
	<div id="pointPointId">
		<el-form ref="ppForm" :model="ppForm" label-width="60px">
			<!-- <el-form-item label="数据格式">
				<el-select v-model="ppValue" placeholder="请选择">
					<el-option v-for="item in ppOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item> -->
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
			<el-form-item label="目标点">
				<el-col :span="10">
					<el-form-item prop="lon2">
						<el-input v-model="ppForm.lon2" size="mini" placeholder="目标点经度"></el-input>
					</el-form-item>
				</el-col>
				<el-col class="line" :span="1">&nbsp;</el-col>
				<el-col :span="10">
					<el-form-item prop="lat2">
						<el-input v-model="ppForm.lat2" size="mini" placeholder="目标点纬度"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="3">
					<img src="image/RouteAnalysis/position.png" @click="mapPosition2" class="positionClass" title="图上选取坐标" />
				</el-col>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="ppCalc">分析</el-button>
				<el-button type="primary" size="mini" @click="ppClear">清除</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {
		calcPointPointApi
	} from '@/api/SpatialAnalysisApi.js'
	
	export default {
		name: 'PointPointComp',
		data(){
			return{
				ppOptions: [{
					label: 'DEM',
					value: 'DEM'
				}, {
					label: '3DTiles',
					value: '3DTiles'
				}],
				ppValue: 'DEM',
				ppForm: {
					lon1: '',
					lat1: '',
					lon2: '',
					lat2: '',
				},
				ppResultEntityId: '',
				positionEntityId1: '',
				positionEntityId2: '',
				handler1: '',
				handler2: '',
				ppResultEntityId1: '',
				ppResultEntityId2: '',
			}
		},
		methods:{
			// 图上选取起点的经纬度
			mapPosition1() {
				let _this = this;
				this.handler1 = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				this.handler1.setInputAction(function(evt) {
					let cartesian = viewer.camera.pickEllipsoid(evt.position);
					let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
					_this.ppForm.lon1 = Cesium.Math.toDegrees(cartographic.longitude);
					_this.ppForm.lat1 = Cesium.Math.toDegrees(cartographic.latitude);
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
			// 图上选取终点的经纬度
			mapPosition2() {
				let _this = this;
				this.handler2 = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				this.handler2.setInputAction(function(evt) {
					let cartesian = viewer.camera.pickEllipsoid(evt.position);
					let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
					_this.ppForm.lon2 = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
					_this.ppForm.lat2 = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
					let entity = new Cesium.Entity({
						position: Cesium.Cartesian3.fromDegrees(_this.ppForm.lon2, _this.ppForm.lat2),
						point: {
							pixelSize: 5,
							color: Cesium.Color.YELLOW,
							outlineColor: Cesium.Color.RED,
							outlineWidth: 2
						},
						label:{
							text: '目标点',
							font: '18px sans-serif',
							fillColor: Cesium.Color.RED,
							pixelOffset: new Cesium.Cartesian2(0, 20)
						}
					});
					viewer.entities.add(entity);
					_this.positionEntityId2 = entity.id;
					_this.handler2.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
					_this.handler2 = '';
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			},
			ppCalc() {
				this.clearResultEntity();
				calcPointPointApi(this.ppForm.lon1, this.ppForm.lat1, this.ppForm.lon2, this.ppForm.lat2).then((response) => {
					if (response.status == 200) {
						if (response.data.status === 'fail') {
							this.$message({
								message: '点点通视计算失败！',
								type: 'error'
							});
						}
						if (response.data.status === 'success') {
							if (response.data.result.visible) {
								let entity = new Cesium.Entity({
									polyline: {
										positions: Cesium.Cartesian3.fromDegreesArray([this.ppForm.lon1, this.ppForm.lat1, this.ppForm.lon2, this
											.ppForm.lat2
										]),
										width: 3,
										material: Cesium.Color.GREEN
									}
								});
								viewer.entities.add(entity);
								this.ppResultEntityId = entity.id;
							} else {
								let entity1 = new Cesium.Entity({
									polyline: {
										positions: Cesium.Cartesian3.fromDegreesArray([this.ppForm.lon1, this.ppForm.lat1, response.data.result.obstaclePoint[
											0], response.data.result.obstaclePoint[1]]),
										width: 3,
										material: Cesium.Color.GREEN
									}
								});
								let entity2 = new Cesium.Entity({
									polyline: {
										positions: Cesium.Cartesian3.fromDegreesArray([response.data.result.obstaclePoint[0], response.data.result
											.obstaclePoint[1], this.ppForm.lon2, this.ppForm.lat2
										]),
										width: 3,
										material: Cesium.Color.RED
									}
								});
								viewer.entities.add(entity1);
								viewer.entities.add(entity2);
								this.ppResultEntityId1 = entity1.id;
								this.ppResultEntityId2 = entity2.id;
							}
						}
					}
				})
			},
			ppClear() {
				this.clearResultEntity();
				if (this.positionEntityId1 != '') {
					viewer.entities.removeById(this.positionEntityId1);
					this.positionEntityId1 = '';
				}
				if (this.positionEntityId2 != '') {
					viewer.entities.removeById(this.positionEntityId2);
					this.positionEntityId2 = '';
				}
				this.resetForm();
			},
			clearResultEntity(){
				if (this.ppResultEntityId != '') {
					viewer.entities.removeById(this.ppResultEntityId);
					this.ppResultEntityId = '';
				}
				if (this.ppResultEntityId1 != '') {
					viewer.entities.removeById(this.ppResultEntityId1);
					this.ppResultEntityId1 = '';
				}
				if (this.ppResultEntityId2 != '') {
					viewer.entities.removeById(this.ppResultEntityId2);
					this.ppResultEntityId2 = '';
				}
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
	.positionClass {
		position: relative;
		left: 10px;
		cursor: pointer;
	}
</style>
<style>
	#pointPointId .el-form-item {
	    margin-bottom: 0px !important;
	}
</style>
