<template>
	<div id="scenarioHistoryCompId" class="wrap2">
		<div class="wrap-title">
			<span class="wrap-title-text">方案想定与历史复盘</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close" />
		</div>
		<div class="container">
			<el-tree ref="tree" :data="treeData" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span :title="node.label" class="tree-label">{{ node.label }}</span>
					<span v-if="data.id === 'root'">
						<el-button type="primary" size="mini" @click="addPlan">
							创建方案
						</el-button>
						<!-- 	<el-upload action="" :limit="1" :auto-upload="false" :show-file-list="false" class="el-upload-class" :on-change="fileChange"
									 :on-exceed="fileExceed">
										<el-button size="mini" type="primary">导入方案</el-button>
									</el-upload> -->
					</span>
					<span v-if="data.type === 'plan'">
						<el-button type="primary" size="mini" @click="addAction(data.id)">
							创建行动
						</el-button>
						<el-button type="primary" size="mini" @click="playPlan(data.id, data)">
							{{data.playText}}
						</el-button>
						<!-- <el-button type="primary" size="mini" @click="savePlan(data.id)">
										导出
									</el-button> -->
						<el-button type="primary" size="mini" @click="deletePlan(data.id)">
							删除
						</el-button>
					</span>
					<span v-if="data.type === 'action'">
						<el-button type="primary" size="mini" @click="playAction(data.id, data)">
							{{data.playText}}
						</el-button>
						<!-- <el-button type="primary" size="mini" @click="saveAction(data.id)">
										导出
									</el-button> -->
						<el-button type="primary" size="mini" @click="deleteAction(data.id)">
							删除
						</el-button>
					</span>
				</span>
			</el-tree>
		</div>
		<AddPlanDialogComp v-show="addPlanDialogCompShow"></AddPlanDialogComp>
		<AddActionDialogComp v-show="addActionDialogCompShow"></AddActionDialogComp>
		<PointImageSelectComp v-if="pointImageSelectCompShow" :imageUrl="pointImageUrl"></PointImageSelectComp>
	</div>
</template>

<script>
	import {
		getAllPlanAndActionApi,
		deletePlanByIdApi,
		getActionInfoByIdApi,
		deleteActionByIdApi,
		getAllActionByPlanId,
		randarAnalyApi
	} from '@/api/ScenarioHistoryApi.js'
	import FileSaver from 'file-saver'
	import AddPlanDialogComp from './AddPlanDialogComp.vue'
	import AddActionDialogComp from './AddActionDialogComp.vue'
	import PointImageSelectComp from './PointImageSelectComp.vue'

	export default {
		name: "ScenarioHistoryComp",
		components: {
			AddPlanDialogComp,
			AddActionDialogComp,
			PointImageSelectComp
		},
		computed: {
			pointImageUrl() {
				return window.GlobalConfig.PLOT_CMS_URL;
			}
		},
		data() {
			return {
				pointImageSelectCompShow: false,
				treeData: [{
					id: 'root',
					label: '方案列表',
					type: 'node',
					playText: '播放',
					children: []
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				},

				randarArr: [],
				addPlanDialogCompShow: false,
				addActionDialogCompShow: false,
				// 播放的行动entity实体
				addedPlayActionEntity: [],
				minTime: null,
				maxTime: null,

				timelineVisible: false,
			}
		},
		mounted() {
			this.addBusEvent();
		},
		methods: {
			addBusEvent() {
				// 方案组件的事件
				Bus.$on('AddPlanDialogComp-RefreshPlanList', () => {
					this.addPlanDialogCompShow = false;
					this.getAllPlanAndActionList();
				});
				Bus.$on('AddPlanDialogComp-CloseComp', () => {
					this.addPlanDialogCompShow = false;
				});
				// 行动组件的事件
				Bus.$on('AddActionDialogComp-RefreshActionList', () => {
					this.addActionDialogCompShow = false;
					this.getAllPlanAndActionList();
				});
				Bus.$on('AddActionDialogComp-CloseComp', () => {
					this.addActionDialogCompShow = false;
				});
				Bus.$on('AddActionDialogComp-ShowComp', () => {
					this.addActionDialogCompShow = true;
				});
				Bus.$on("AddActionDialogComp-OpenPointImageSelectComp", () => {
					this.pointImageSelectCompShow = true;
				})
				// 选择图标组件的事件
				Bus.$on("PointImageSelectComp-closeImageSelect", () => {
					this.pointImageSelectCompShow = false;
				})
			},
			// 切换时间轴的显隐性
			toggleTimeline() {
				this.timelineVisible = !this.timelineVisible;
				if (this.timelineVisible) {
					viewer.timeline.container.style.display = "block";
					viewer.animation.container.style.display = "block";
					viewer.timeline.container.style.bottom = "45px";
					viewer.animation.container.style.bottom = "45px";
					viewer.timeline.container.style.zIndex = "9999";
					viewer.animation.container.style.zIndex = "9999";
				} else {
					viewer.timeline.container.style.display = "none";
					viewer.animation.container.style.display = "none";
				}
			},

			// 获取所有的方案(包含行动)列表
			getAllPlanAndActionList() {
				this.removeAllAddedActionEntity();
				getAllPlanAndActionApi().then((response) => {
					this.treeData[0].children = [];
					for (let i = 0; i < response.data.data.length; i++) {
						let plan = response.data.data[i];
						let children = [];
						for (let j = 0; j < plan.actions.length; j++) {
							let action = plan.actions[j];
							children.push({
								id: action.id,
								label: action.actionName,
								type: 'action',
								playText: '播放',
								actionDesc: action.actionDesc,
								planId: action.planId
							})
						}
						this.treeData[0].children.push({
							id: plan.id,
							label: plan.planName,
							planDesc: plan.planDesc,
							type: 'plan',
							playText: '播放',
							children: children
						})
					}
				})
			},
			// 点击增加方案按钮
			addPlan() {
				this.addPlanDialogCompShow = true;
			},
			// 点击导入方案按钮，上传文件
			fileChange(file, fileList) {
				let fs = document.getElementsByName('file');
				if (fs.length > 0) {
					fs.value = null
				}
				this.analysisFile(file.raw);
			},
			// 选择的文件发生改变。files:选择的具体文件，类型为File
			fileExceed(files, fileList) {
				let fs = document.getElementsByName('file');
				if (fs.length > 0) {
					fs.value = null
				}
				this.analysisFile(files[0]);
			},
			analysisFile(file) {
				let _this = this;
				let reader = new FileReader();
				reader.readAsText(file, "UTF-8");
				reader.onload = function(evt) {
					let fileString = evt.target.result;
					let plan = JSON.parse(fileString);
					let actions = plan.actions;
					let children = [];
					for (let j = 0; j < actions.length; j++) {
						let action = actions[j];
						children.push({
							id: action.id,
							label: action.actionName,
							type: 'action',
							playText: '播放',
							actionDesc: action.actionDesc,
							planId: action.planId
						})
					}
					_this.treeData[0].children.push({
						id: plan.id,
						label: plan.planName,
						planDesc: plan.planDesc,
						type: 'plan',
						playText: '播放',
						children: children
					})
				}
			},
			// 点击播放方案按钮
			playPlan(planId, data) {
				this.removeAllAddedActionEntity();
				this.resetChildrenNodePlayText(planId, data.playText);
				let playText = data.playText == "播放" ? "停止" : "播放";
				data.playText = playText;
				let planNode = this.$refs.tree.getNode(planId);
				let actionChildren = planNode.childNodes;
				for (let i = 0; i < actionChildren.length; i++) {
					this.playAction(actionChildren[i].data.id, actionChildren[i].data);
				}

				if (data.playText == "播放") {
					this.removeAllRandar(planId);
				} else {
					this.compRandar(planId);
				}
			},
			// 分析雷达
			compRandar(planId) {
				randarAnalyApi(planId).then((response) => {
					let arr = response.data.data;
					let ids = [];
					for (let i = 0; i < arr.length; i++) {
						this.addOneRandar(arr[i]);
						ids.push(arr[i].id);
					}
					this.randarArr.push({
						planId: planId,
						randarsId: ids
					})
				})
			},
			removeAllRandar(planId) {
				for (let i = 0; i < this.randarArr.length; i++) {
					if (this.randarArr[i].planId == planId) {
						let item = this.randarArr[i].randarsId;
						for (let j = 0; j < item.length; j++) {
							viewer.entities.removeById(item[j]);
						}
						this.randarArr.splice(i, 1);
					}
				}
			},
			addOneRandar(item) {
				viewer.entities.add({
					id: item.id,
					position: Cesium.Cartesian3.fromDegrees(item.radarLon, item.radarLat),
					ellipsoid: {
						radii: new Cesium.Cartesian3(item.radarRange, item.radarRange, 50000.0),
						maximumCone: Cesium.Math.PI_OVER_TWO,
						material: Cesium.Color.RED.withAlpha(0.6),
						outline: true
					},
				})
			},

			// 点击保存方案按钮
			savePlan(planId) {
				getAllActionByPlanId(planId).then((response) => {
					let plan = response.data.data;
					let name = plan.planName + '.json';
					let blob = new Blob([JSON.stringify(plan)], {
						type: "text/json;charset=utf-8"
					});
					FileSaver.saveAs(blob, name);
				})
			},
			// 删除方案
			deletePlan(planId) {
				this.$confirm('确定删除该方案及其下所有的行动?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deletePlanByIdApi(planId).then((response) => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.getAllPlanAndActionList();
					})
				});
			},
			// 点击创建行动按钮
			addAction(planId) {
				this.addActionDialogCompShow = true;
				Bus.$emit("HistoryPlugin-tranPlanId", planId);
			},
			// 点击播放行动按钮
			playAction(actionId, data) {
				let playText = data.playText == "播放" ? "停止" : "播放";
				data.playText = playText;
				if (playText == "播放") {
					for (let i = 0; i < this.addedPlayActionEntity.length; i++) {
						if (this.addedPlayActionEntity[i].id == actionId) {
							viewer.entities.remove(this.addedPlayActionEntity[i].entity);
							this.addedPlayActionEntity.splice(i, 1);
							break;
						}
					}
				} else {
					getActionInfoByIdApi(actionId).then((response) => {
						let action = response.data.data;
						let actionId = action.id;
						let actionEntity = action.actionEntity;
						// let actionRoad = JSON.parse(action.actionRoad);
						let actionRoad = this.degreeToCartesian(JSON.parse(action.actionRoad));
						let actionStartTime = action.actionStartTime;
						let actionEndTime = action.actionEndTime;
						this.playOneAction(actionId, actionEntity, actionRoad, actionStartTime, actionEndTime);
					})
				}
			},
			degreeToCartesian(actionRoad) {
				let arr = [];
				for (let i = 0; i < actionRoad.length; i++) {
					let cartesian3 = Cesium.Cartesian3.fromDegrees(actionRoad[i].lon, actionRoad[i].lat, 0);
					arr.push(cartesian3);
				}
				return arr;
			},
			// 播放某个行动
			playOneAction(actionId, actionEntity, actionRoad, start, stop) {
				// 初始化时间轴范围
				let s = Cesium.JulianDate.fromDate(new Date(start));
				let e = Cesium.JulianDate.fromDate(new Date(stop));
				let start1 = Cesium.JulianDate.addHours(s, 8, new Cesium.JulianDate());
				let stop1 = Cesium.JulianDate.addHours(e, 8, new Cesium.JulianDate())
				if (!this.minTime || !this.maxTime || this.addedPlayActionEntity.length == 0) {
					this.minTime = start1.clone();
					this.maxTime = stop1.clone();
				} else {
					if (Cesium.JulianDate.lessThan(start1, this.minTime)) {
						this.minTime = start1.clone();
					}
					if (Cesium.JulianDate.greaterThan(stop1, this.maxTime)) {
						this.maxTime = stop1.clone();
					}
				}
				this.initTimeline(this.minTime, this.maxTime);
				// 实例化entity
				let property = new Cesium.SampledPositionProperty();
				property.setInterpolationOptions({
					interpolationDegree: 2,
					interpolationAlgorithm: Cesium.HermitePolynomialApproximation
				});
				let timeRange = Cesium.JulianDate.secondsDifference(stop1, start1);
				let step = timeRange / (actionRoad.length - 1);
				for (let i = 0; i < actionRoad.length; i++) {
					let t = Cesium.JulianDate.addSeconds(start1, step * i, new Cesium.JulianDate());
					let p = new Cesium.Cartesian3(actionRoad[i].x, actionRoad[i].y, actionRoad[i].z);
					property.addSample(t, p);
				}
				let entity = null;
				if (actionEntity.indexOf("gltf") != -1 || actionEntity.indexOf("glb") != -1) {
					entity = viewer.entities.add({
						id: actionId,
						availability: new Cesium.TimeIntervalCollection([
							new Cesium.TimeInterval({
								start: start1,
								stop: stop1
							}),
						]),
						position: property,
						orientation: new Cesium.VelocityOrientationProperty(property),
						model: {
							uri: actionEntity,
							minimumPixelSize: 128
						},
						path: {
							resolution: 1,
							material: new Cesium.PolylineDashMaterialProperty({
								color: Cesium.Color.SPRINGGREEN,
								dashLength: 10
							}),
							width: 2
						}
					})
				} else {
					entity = viewer.entities.add({
						id: actionId,
						availability: new Cesium.TimeIntervalCollection([
							new Cesium.TimeInterval({
								start: start1,
								stop: stop1
							}),
						]),
						position: property,
						orientation: new Cesium.VelocityOrientationProperty(property),
						billboard: {
							image: actionEntity,
							width: 100,
							height: 100
						},
						path: {
							resolution: 1,
							material: new Cesium.PolylineDashMaterialProperty({
								color: Cesium.Color.SPRINGGREEN,
								dashLength: 10
							}),
							width: 2
						}
					})
				}
				this.addedPlayActionEntity.push({
					id: actionId,
					entity: entity
				})
			},
			// 导出行动
			saveAction(actionId) {
				getActionInfoByIdApi(actionId).then((response) => {
					let data = response.data.data;
					let name = data.actionName + '.json';
					let blob = new Blob([JSON.stringify(data)], {
						type: "text/json;charset=utf-8"
					});
					FileSaver.saveAs(blob, name);
				})
			},
			// 删除行动
			deleteAction(actionId) {
				this.$confirm('确定删除该行动?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteActionByIdApi(actionId).then((response) => {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.getAllPlanAndActionList();
					})
				});
			},
			// 移除所有的action行动实体
			removeAllAddedActionEntity() {
				for (let i = 0; i < this.addedPlayActionEntity.length; i++) {
					viewer.entities.remove(this.addedPlayActionEntity[i].entity);
				}
				this.addedPlayActionEntity = [];
			},
			resetChildrenNodePlayText(parentNodeId, playText) {
				let planNode = this.$refs.tree.getNode(parentNodeId);
				let actionChildren = planNode.childNodes;
				for (let i = 0; i < actionChildren.length; i++) {
					actionChildren[i].data.playText = playText;
				}
			},

			// 初始化时间轴
			initTimeline(start, stop) {
				viewer.clock.startTime = start.clone();
				viewer.clock.stopTime = stop.clone();
				viewer.clock.currentTime = start.clone();
				viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
				viewer.clock.multiplier = 10; // 时间轴的转速
				viewer.timeline.zoomTo(start, stop);
			},
			// 格式化时钟 clock
			formatClock() {
				let date = new Date();
				//可返回格林威治时间和本地时间之间的时差
				let h = 0 - date.getTimezoneOffset();
				// 设置时间
				viewer.animation.viewModel.timeFormatter = function(date, viewModel) {
					//重新构造一个当前系统时间的儒略日
					let dateZone = Cesium.JulianDate.addMinutes(date, h, new Cesium.JulianDate());
					let gregorianDate = Cesium.JulianDate.toGregorianDate(dateZone);
					let millisecond = Math.round(gregorianDate.millisecond); //倍速是否小于1，小于1则显示毫秒级
					/* if (Math.abs(viewModel._clockViewModel.multiplier) < 1) {
						return Cesium.sprintf("%02d:%02d:%02d.%03d", gregorianDate.hour, gregorianDate.minute, gregorianDate.second,
							gregorianDate.millisecond);
					} */
					return Cesium.sprintf("%02d:%02d:%02d", gregorianDate.hour, gregorianDate.minute, gregorianDate.second);
				};
				//设置日期
				viewer.animation.viewModel.dateFormatter = function(date, viewModel) {
					let dateZone = Cesium.JulianDate.addMinutes(date, h, new Cesium.JulianDate());
					let gregorianDate = Cesium.JulianDate.toGregorianDate(dateZone); //设置格式为xx/xx/xx，格式可自定义为任意你想要的
					return Cesium.sprintf("%4d-%02d-%02d", gregorianDate.year, gregorianDate.month, gregorianDate.day);
				};
				/* // 设置时间轴
				viewer.timeline.makeLabel = function(date, viewModel) {
					let dateZone = Cesium.JulianDate.addMinutes(date, h, new Cesium.JulianDate());
					let gregorianDate = Cesium.JulianDate.toGregorianDate(dateZone);
					return Cesium.sprintf("%4d-%02d-%02d %02d:%02d:%02d", gregorianDate.year, gregorianDate.month, gregorianDate.day,
						gregorianDate.hour, gregorianDate.minute, gregorianDate.second);
				} */
			},
			// 关闭div
			closeDiv() {
				Bus.$emit("ScenarioHistoryComp-CloseComp");
			}
		},
		beforeDestroy() {
			this.removeData();
		}
	}
</script>

<style scoped>
	.custom-tree-node {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 8px;
		}
	
		.tree-label {
			max-width: 150px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	
		.el-upload-class {
			display: inline-block;
			margin-left: 10px;
		}
</style>
