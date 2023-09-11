<template>
	<div id="commonPlot">
		<el-tabs v-model="activeName">
			<el-tab-pane label="点标" name="point">
				<PointPlotTab></PointPlotTab>
			</el-tab-pane>
			<el-tab-pane label="折线" name="polyline">
				<PolylinePlotTab></PolylinePlotTab>
			</el-tab-pane>
			<el-tab-pane label="多边形" name="polygon">
				<PolygonPlotTab></PolygonPlotTab>
			</el-tab-pane>
			<el-tab-pane label="矩形" name="rectangle">
				<RectanglePlotTab></RectanglePlotTab>
			</el-tab-pane>
			<el-tab-pane label="圆" name="circle">
				<CirclePlotTab></CirclePlotTab>
			</el-tab-pane>
			<el-tab-pane label="文字" name="label">
				<LabelPlotTab></LabelPlotTab>
			</el-tab-pane>
			<!-- <el-tab-pane label="态势" name="situation">
				<SituationPlotTab></SituationPlotTab>
			</el-tab-pane> -->
			<el-tab-pane label="清单" name="list">
				<PlotListTab ref="PlotListTab"></PlotListTab>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import PointPlotTab from './PointPlotTab.vue'
	import PolylinePlotTab from './PolylinePlotTab.vue'
	import PolygonPlotTab from './PolygonPlotTab.vue'
	import RectanglePlotTab from './RectanglePlotTab.vue'
	import CirclePlotTab from './CirclePlotTab.vue'
	import LabelPlotTab from './LabelPlotTab.vue'
	import SituationPlotTab from './SituationPlotTab.vue'
	import PlotListTab from './PlotListTab.vue'
	import CesiumUtil from "../js/CesiumUtil";

	// 当前被双击选中的entity实体
	let currentSelectedEntity = '';
	// 要编辑的EntityEdit实体对象
	let edittingEntity = '';
	// 鼠标单击的实时坐标
	let currentMouseClickPosition = '';
	// 复制的实体
	let copiedEntity = '';

	export default {
		name: 'CommonPlot',
		components: {
			PointPlotTab,
			PolylinePlotTab,
			PolygonPlotTab,
			RectanglePlotTab,
			CirclePlotTab,
			LabelPlotTab,
			SituationPlotTab,
			PlotListTab
		},
		props:['keydownListen'],
		data() {
			return {
				activeName: 'point',
			}
		},
		mounted() {
			// 关闭编辑面板，取消正在编辑的实体
			PlotBus.$on('CloseEditTab', () => {
				this.cancelSelected();
			});
			// 监听清除所有标绘实体事件
			PlotBus.$on('clearAllPlot', () => {
				this.cancelSelected();
			});
			// 在树节点上点击删除按钮，删除某个实体后，同步删除正在实体编辑的折点
			PlotBus.$on("deleteNodeEntity", (entityId) => {
				if (edittingEntity != '' && edittingEntity.editEntity && entityId === edittingEntity.editEntity.id) {
					edittingEntity.removeEntityEditListener(edittingEntity.editEntity.name);
					edittingEntity.removeAllEditPoint();
					edittingEntity.removeCameraLock();
					edittingEntity.currentEditPoint = undefined;
				}
			});

			let timer = setInterval(() => {
				if (viewer) {
					clearInterval(timer);
					this.mouseClickListener();
					this.mouseDoubleClickListener();
					this.mouseScrollListener();
					if(this.keydownListen){
						this.deleteKeyListener();
						this.ctrlKeyListener();
					}
				}
			}, 300);
		},
		methods: {
			// 监听鼠标双击事件，选中要编辑或复制的entity实体
			mouseDoubleClickListener() {
				let _this = this;
				let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				handler.setInputAction(function(event) {
					// 若已存在正在编辑的实体，则取消选中并关闭编辑面板
					// _this.cancelSelected();
					PlotBus.$emit('CloseEditTab');
					// 打开选中实体的编辑面板
					_this.$nextTick(() => {
						let pickedObject = viewer.scene.pick(event.position);
						if (Cesium.defined(pickedObject) && CesiumUtil.isPlotEntity(pickedObject.id)) {
							currentSelectedEntity = pickedObject.id;
							_this.selectedEditEntity(pickedObject.id.id);
						}
					})
				}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
			},
			// 实体被取消选中编辑
			cancelSelected() {
				if (edittingEntity != '' && edittingEntity.editEntity) {
					edittingEntity.isEditting = false;
					edittingEntity.removeEntityEditListener(edittingEntity.editEntity.name);
					edittingEntity.removeAllEditPoint();
					edittingEntity.removeCameraLock();
					edittingEntity.currentEditPoint = undefined;
				}
				currentSelectedEntity = '';
				edittingEntity = '';
			},

			// 监听鼠标单击事件，获取鼠标单击的位置，为后面的图形复制粘贴提供位置坐标
			mouseClickListener() {
				let _this = this;
				let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				handler.setInputAction(function(event) {
					let earthPosition = viewer.camera.pickEllipsoid(event.position);
					if (_this.ctrlCKeyDown && Cesium.defined(earthPosition)) {
						currentMouseClickPosition = earthPosition;
					}
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			},

			// 选中要编辑的实体后：1、创建实体编辑类对象；2、打开entity实体属性编辑面板
			selectedEditEntity(entityId) {
				PlotBus.$emit('OpenEditTab', entityId);
				edittingEntity = new EntityEdit(entityId);
			},

			// 监听键盘按下delete键,删除选中的entity实体
			deleteKeyListener() {
				let _this = this;
				document.addEventListener('keydown', function(e) {
					if (e.keyCode == 46 && currentSelectedEntity != '') {
						_this.$confirm('此操作将永久删除该图形, 是否继续?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							let deleteEntityId = currentSelectedEntity.id;
							viewer.entities.removeById(deleteEntityId);
							_this.cancelSelected();
							PlotBus.$emit("deleteKeyEntity", deleteEntityId);
							PlotBus.$emit('CloseEditTab');
							_this.$message({
								type: 'success',
								message: '删除成功!'
							});
						});
					}
				})
			},

			// 监听键盘ctrl+c、crl+v事件：复制粘贴entity实体
			ctrlKeyListener() {
				let _this = this;
				document.addEventListener('keydown', function(e) {
					let cKey = 67,
						vKey = 86;
					if (e.ctrlKey && e.keyCode === cKey && currentSelectedEntity != '') {
						_this.ctrlCKeyDown = true;
						copiedEntity = currentSelectedEntity;
						_this.$message({
							type: 'success',
							message: '成功复制图形!'
						});
					}
					if (e.ctrlKey && e.keyCode === vKey && _this.ctrlCKeyDown) {
						let entity = CesiumUtil.copyEntity(copiedEntity, currentMouseClickPosition);
						if (!entity) {
							return;
						}
						PlotBus.$emit("addEntityPlot", {
							plotType: entity.name,
							entityId: entity.id
						});
						_this.$message({
							type: 'success',
							message: '成功粘贴图形!'
						});
					}
				});
			},

			// 鼠标滚轮事件：改变图标的大小和比例尺
			mouseScrollListener() {
				let _this = this;
				document.onmousewheel = function(e) {
					if (currentSelectedEntity != '') {
						switch (currentSelectedEntity.name) {
							case 'Plot_Point':
								let scale = currentSelectedEntity.billboard.scale.getValue();
								scale = Number(scale);
								if (e.wheelDelta < 0) {
									scale -= 0.1;
									if (scale < 0) {
										scale = 0;
									}
								} else {
									scale += 0.1;
								}
								PlotBus.$emit("ChangeSelectedImgScale", scale.toFixed(1));
								break;
							case 'Plot_Model':
								let scale2 = currentSelectedEntity.model.scale.getValue();
								scale2 = Number(scale2);
								if (e.wheelDelta < 0.1) {
									scale2 -= 0.1;
									if (scale2 < 0) {
										scale2 = 0;
									}
								} else {
									scale2 += 0.1;
								}
								PlotBus.$emit("ChangeSelectedModelScale", scale2.toFixed(1));
								break;
						}
					}
				}
			},

			closeCommonPlotTab() {
				console.log('关闭标绘面板！');
				// 若已存在正在编辑的实体，则取消选中并关闭编辑面板
				this.cancelSelected();
				this.$refs.PlotListTab.clearAllPlotEntity();
				this.$refs.PlotListTab.clearAllTreeNode();
				PlotBus.$emit('CloseEditTab');
				PlotBus.$emit('CloseCommonPlotTab');
			},
			
			
		},
		
	}
</script>

<style scoped="true">
	#commonPlot {
		    
	}

</style>
