<!-- 路径分析组件 -->
<template>
	<div id="spatialAnalysisCompId" class="wrap">
		<div class="wrap-title">
			<span class="wrap-title-text">路径分析</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close" />
		</div>
		<div class="container">
			<div>
				<el-form ref="roadForm" :model="roadForm" label-width="80px" size="mini">
					<el-form-item label="起点">
						<el-col :span="10">
							<el-form-item prop="lon1">
								<el-input v-model="roadForm.lon1" placeholder="起点经度"></el-input>
							</el-form-item>
						</el-col>
						<el-col class="line" :span="1">&nbsp;</el-col>
						<el-col :span="10">
							<el-form-item prop="lat1">
								<el-input v-model="roadForm.lat1" placeholder="起点纬度"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<img src="image/RouteAnalysis/position.png" @click="mapPosition1" class="positionClass" title="图上选取坐标" />
						</el-col>
					</el-form-item>
					<el-form-item label="终点">
						<el-col :span="10">
							<el-form-item prop="lon2">
								<el-input v-model="roadForm.lon2" placeholder="终点经度"></el-input>
							</el-form-item>
						</el-col>
						<el-col class="line" :span="1">&nbsp;</el-col>
						<el-col :span="10">
							<el-form-item prop="lat2">
								<el-input v-model="roadForm.lat2" placeholder="终点纬度"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<img src="image/RouteAnalysis/position.png" @click="mapPosition2" class="positionClass" title="图上选取坐标" />
						</el-col>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="calcRoad">分析</el-button>
						<el-button type="primary" size="mini" @click="clear">清除</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div v-show="roadLengthShow">
				<span>路线总长度：{{roadResultLength}}千米</span>
			</div>

			<div id="roadStepDescId" v-show="roadLengthShow">
				<el-steps direction="vertical" :active="1">
					<el-step v-for="item in stepDescArr">
						<div slot="title">{{item}}</div>
					</el-step>
				</el-steps>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		calcRoadResult
	} from '@/api/RouteApi'
	export default {
		name: 'RouteAnalysisComp',
		data() {
			return {
				roadForm: {
					lon1: '',
					lat1: '',
					lon2: '',
					lat2: '',
				},

				positionEntityId1: '',
				positionEntityId2: '',
				roadLengthShow: false,
				roadResultEntityId: '',
				roadResultLength: 0,
				stepDescArr: [],

				handler1: '',
				handler2: '',
			}
		},
		methods: {
			// 图上选取起点的经纬度
			mapPosition1() {
				let _this = this;
				this.handler1 = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				this.handler1.setInputAction(function(evt) {
					if (_this.positionEntityId1 != '') {
						viewer.entities.removeById(_this.positionEntityId1);
						_this.positionEntityId1 = '';
					}
					let cartesian = viewer.camera.pickEllipsoid(evt.position);
					let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
					_this.roadForm.lon1 = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
					_this.roadForm.lat1 = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
					let entity = new Cesium.Entity({
						position: Cesium.Cartesian3.fromDegrees(_this.roadForm.lon1, _this.roadForm.lat1),
						billboard: {
							image: 'image/RouteAnalysis/locat.png'
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
					if (_this.positionEntityId2 != '') {
						viewer.entities.removeById(_this.positionEntityId2);
						_this.positionEntityId2 = '';
					}
					let cartesian = viewer.camera.pickEllipsoid(evt.position);
					let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
					_this.roadForm.lon2 = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
					_this.roadForm.lat2 = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
					let entity = new Cesium.Entity({
						position: Cesium.Cartesian3.fromDegrees(_this.roadForm.lon2, _this.roadForm.lat2),
						billboard: {
							image: 'image/RouteAnalysis/locat2.png'
						}
					});
					viewer.entities.add(entity);
					_this.positionEntityId2 = entity.id;
					_this.handler2.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
					_this.handler2 = '';
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			},
			// 路径分析计算
			calcRoad() {
				if (this.roadResultEntityId != '') {
					viewer.entities.removeById(this.roadResultEntityId);
				}
				calcRoadResult(this.roadForm.lon1, this.roadForm.lat1, this.roadForm.lon2, this.roadForm.lat2).then((response) => {
					if (response.data.status === 200) {
						let pathWithNameArr = response.data.pathWithName;
						let path = [];
						this.stepDescArr = [];
						for (let i = 0, len = pathWithNameArr.length; i < len; i++) {
							for (let j = 0, len2 = pathWithNameArr[i].path.length; j < len2; j++) {
								path.push(pathWithNameArr[i].path[j][0]);
								path.push(pathWithNameArr[i].path[j][1]);
							}
							let descName = pathWithNameArr[i].name;
							let descLength = Number(pathWithNameArr[i].length).toFixed(2);
							let descSpeed = pathWithNameArr[i].maxSpeed == 0 ? "无限速" : "限速" + pathWithNameArr[i].maxSpeed + "m/s";
							let descWidth = pathWithNameArr[i].width == null ? "" : "，路宽 " + pathWithNameArr[i].width + "米";
							this.stepDescArr.push("沿 " + descName + " 路向前行驶 " + descLength + " 米，当前路段" +
								descSpeed + descWidth);
						}
						let entity = new Cesium.Entity({
							polyline: {
								positions: Cesium.Cartesian3.fromDegreesArray(path),
								material: new Cesium.Color(0.0, 1.0, 1.0, 1.0),
								width: 5
							}
						});
						viewer.entities.add(entity);
						this.roadResultEntityId = entity.id;
						this.roadResultLength = Number(response.data.distance / 1000).toFixed(2);
						this.roadLengthShow = true;
					}
				}).catch(() => {
					this.$message.error('路径分析计算失败！');
				})
			},
			// 清除路径分析结果
			clear() {
				if (this.roadResultEntityId != '') {
					viewer.entities.removeById(this.roadResultEntityId);
					this.roadResultEntityId = '';
				}
				if (this.positionEntityId1 != '') {
					viewer.entities.removeById(this.positionEntityId1);
					this.positionEntityId1 = '';
				}
				if (this.positionEntityId2 != '') {
					viewer.entities.removeById(this.positionEntityId2);
					this.positionEntityId2 = '';
				}
				this.roadResultLength = 0;
				this.roadLengthShow = false;
				this.resetForm();
			},

			// 重置表单
			resetForm() {
				this.$refs["roadForm"].resetFields();
			},

			// 关闭div
			closeDiv() {
				Bus.$emit("RouteAnalysisComp-CloseComp");
			},
		},
		beforeDestroy() {
			this.clear();
		}
	}
</script>

<style scoped="true">
	#routeAnalysisCompId {}

	.positionClass {
		position: relative;
		left: 10px;
		cursor: pointer;
	}

	#roadStepDescId {
		margin-top: 10px;
		max-height: 500px;
		overflow-y: auto;
	}

	#routeAnalysisCompId ::-webkit-scrollbar {
		width: 8px;
		background-color: #181c32;
	}

	#routeAnalysisCompId ::-webkit-scrollbar-thumb {
		background-color: #409eff;
	}
</style>
