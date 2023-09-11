<template>
	<div id="cesiumViewerId">
		<HeaderComp></HeaderComp>
		<FooterComp v-if="viewerStatus"></FooterComp>
		<NavMenuComp></NavMenuComp>
		<ToolMenuComp v-if="viewerStatus"></ToolMenuComp>
		<div id="cesiumContainer">
			<div id="slider" style="display: none;"></div>
		</div>
		
		<thematic-map ref="thematicMap" @closeZtMap="closeZtMap" v-if="ztMapShow"></thematic-map>
		<CommonEditPlot v-show="commonEditPlotShow"></CommonEditPlot>
		<PointImageSelect :imageUrl="imageUrl" v-show="pointImageSelect"></PointImageSelect>
		
		<router-view v-if="viewerStatus" />
	</div>
</template>

<script>
	import HeaderComp from '../components/Header/HeaderComp.vue'
	import FooterComp from '../components/Footer/FooterComp.vue'
	import NavMenuComp from '../components/NavMenu/NavMenuComp.vue'
	import ToolMenuComp from '../components/ToolMenu/ToolMenuComp.vue'
	export default {
		name: 'CesiumViewer',
		components: {
			HeaderComp,
			FooterComp,
			NavMenuComp,
			ToolMenuComp
		},
		data() {
			return {
				viewerStatus: false,
				ztMapShow: false,
				
				commonEditPlotShow: false,
				pointImageSelect: false,
				imageUrl: window.GlobalConfig.PLOT_CMS_URL,
				
			}
		},
		mounted() {
			this.initViewer();
			this.addBusEvent();
		},
		methods: {
			// 初始化viewer对象
			initViewer() {
				//设置homebutton的位置
				Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(80, 20, 135, 60);
				window.viewer = new Cesium.Viewer('cesiumContainer', {
					// 控制视窗动画的播放速度
					animation: true,
					// 时间轴是否动态可变
					shouldAnimate: true,
					// 地球底图
					baseLayerPicker: false,
					// 全屏按钮
					fullscreenButton: false,
					// 地理位置搜索
					geocoder: false,
					// 首页位置
					homeButton: false,
					// 切换2D、3D
					sceneModePicker: false,
					// 实体选中框
					selectionIndicator: false,
					// 时间轴
					timeline: true,
					// 帮助按钮
					navigationHelpButton: false,
					// 信息展示框
					infoBox: false,
					navigationInstructionsInitiallyVisible: true,
					// 地球初始化模式：2D、3D
					sceneMode: Cesium.SceneMode.SCENE3D,
					imageryProvider: new Cesium.UrlTemplateImageryProvider({
						url: window.GlobalConfig.BASE_IMAGE_URL,
						//                        tilingScheme : new Cesium.GeographicTilingScheme()
					}),
					contextOptions: {
						webgl: {
							preserveDrawingBuffer: true
						}
					}
				});
				viewer.animation.container.style.display = "none";
				viewer.timeline.container.style.display = "none";
				this.viewerStatus = true;

				//去掉logo
				viewer._cesiumWidget._creditContainer.style.display = "none";
				//取消默认的双击追踪entity
				viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

				// 添加注记图层
				viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
					url: window.GlobalConfig.BASE_LABEL_URL
				}));
			},
			
			addBusEvent(){
				Bus.$on('CommonPlotComp-CloseComp',()=>{
					this.commonPlotCompShow = false;
					this.commonEditPlotShow = false;
					this.pointImageSelect = false;
				})
				PlotBus.$on('OpenEditTab', ()=>{
					this.commonEditPlotShow = true;
				});
				PlotBus.$on('OpenPointImageTabShow', (data)=>{
					this.pointImageSelect = data;
				});
				PlotBus.$on('OpenPointImageTabShow', (data)=>{
				    this.pointImageSelect = data;
				});
				Bus.$on('PointImageSelect-closeComp', ()=>{
					this.pointImageSelect = false
				})
				Bus.$on('ThematicMapComp-makeZtMap', ()=>{
					this.ztMapShow = true;
					this.$nextTick(()=>{
						this.$refs.thematicMap.initZT();
					})
				})
				Bus.$on('ThematicMapComp-closeDiv', ()=>{
					this.ztMapShow = false;
				})
				
				Bus.$on('splitImageryShow', (args) => {
					this.splitImageryShow = args.show;
					if (args.show) {
						this.splitImagery = args.layer;
					} else {
						if (this.splitImagery != '') {
							this.splitImagery.splitDirection = Cesium.ImagerySplitDirection.NONE;
							let slider = document.getElementById('slider');
							slider.style.display = "none";
							slider.style.left = '50%';
						}
					}
				})
			},
			
			closeZtMap() {
				this.ztMapShow = false;
			},

			// 卷帘分析
			toggleSplitImagery() {
				let slider = document.getElementById('slider');
				if (slider.style.display === "none") {
					slider.style.display = "block";
					this.splitImagery.splitDirection = Cesium.ImagerySplitDirection.LEFT;
					viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;
					let handler = new Cesium.ScreenSpaceEventHandler(slider);
					let moveActive = false;

					function move(movement) {
						if (!moveActive) {
							return;
						}
						let relativeOffset = movement.endPosition.x;
						let splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
						slider.style.left = 100.0 * splitPosition + '%';
						viewer.scene.imagerySplitPosition = splitPosition;
					}
					handler.setInputAction(function() {
						moveActive = true;
					}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
					handler.setInputAction(function() {
						moveActive = true;
					}, Cesium.ScreenSpaceEventType.PINCH_START);

					handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
					handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

					handler.setInputAction(function() {
						moveActive = false;
					}, Cesium.ScreenSpaceEventType.LEFT_UP);
					handler.setInputAction(function() {
						moveActive = false;
					}, Cesium.ScreenSpaceEventType.PINCH_END);
				} else {
					this.splitImagery.splitDirection = Cesium.ImagerySplitDirection.NONE;
					let slider = document.getElementById('slider');
					slider.style.display = "none";
					slider.style.left = '50%';
				}
			},

		}
	}
</script>

<style scoped>
	#cesiumViewerId {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	#cesiumContainer {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0px;
	}

	#slider {
		position: absolute;
		left: 50%;
		top: 90px;
		background-color: #ff0000;
		width: 5px;
		height: calc(100% - 90px);
		z-index: 9999;
	}

	#slider:hover {
		cursor: ew-resize;
	}
</style>
