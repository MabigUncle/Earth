<template>
	<div id="navMenuId">
		<div class="navMenItemClass">
			<div class="imgItemDivClass" v-for="item in navMenuArr" :class="{active: item.isActive}">
				<el-tooltip class="item" effect="dark" placement="right">
					<h3 slot="content">{{item.title}}</h3>
					<div style="text-align: center;color: #1296db;user-select: none;">
						<img :src="item.img" @click="menuImgClick(item)" class="imgItemClass" />
					</div>
				</el-tooltip>
			</div>
		</div>
		
		<MapLayerComp v-show="mapLayerCompShow2"></MapLayerComp>
		<SatelliteComp v-if="satelliteCompShow" v-show="satelliteCompShow2"></SatelliteComp>
		<AtmosphereComp v-if="atmosphereCompShow" v-show="atmosphereCompShow2"></AtmosphereComp>
		<ScenarioHistoryComp v-if="scenarioHistoryCompShow" v-show="scenarioHistoryCompShow2"></ScenarioHistoryComp>
		<ImageryLayerHandlerComp v-if="imageryLayerHandlerCompShow" v-show="imageryLayerHandlerCompShow2"></ImageryLayerHandlerComp>
	</div>
</template>


<script>
	import MapLayerComp from '@/components/NavMenu/MapLayer/MapLayerComp.vue'
	import SatelliteComp from '@/components/NavMenu/Satellite/SatelliteComp.vue'
	import AtmosphereComp from '@/components/NavMenu/Atmosphere/AtmosphereComp.vue'
	import ScenarioHistoryComp from '@/components/NavMenu/ScenarioHistory/ScenarioHistoryComp.vue'
	import ImageryLayerHandlerComp from '@/components/NavMenu/ImageryLayerHandler/ImageryLayerHandlerComp.vue'
	export default {
		name: 'NavMenuComp',
		components:{MapLayerComp, SatelliteComp, AtmosphereComp, ScenarioHistoryComp, ImageryLayerHandlerComp},
		data() {
			return {
				navMenuArr: [{
					name: 'MapLayer',
					title: '图层列表',
					img: 'image/tool/CommonPlot.png',
					isActive: false
				}, {
					name: 'Atmosphere',
					title: '气象可视化',
					img: 'image/tool/CommonPlot.png',
					isActive: false
				}, {
					name: 'Satellite',
					title: '卫星模拟',
					img: 'image/tool/CommonPlot.png',
					isActive: false
				}, {
					name: 'ScenarioHistory',
					title: '方案想定与历史复盘',
					img: 'image/tool/CommonPlot.png',
					isActive: false
				}, {
					name: 'ImageryLayerHandler',
					title: '影像处理',
					img: 'image/tool/CommonPlot.png',
					isActive: false
				}],
				
				// 组件的显隐
				satelliteCompShow: false,
				atmosphereCompShow: false,
				scenarioHistoryCompShow: false,
				imageryLayerHandlerCompShow: false,
				// 组件的创建与销毁
				mapLayerCompShow2: false,
				satelliteCompShow2: false,
				atmosphereCompShow2: false,
				scenarioHistoryCompShow2: false,
				imageryLayerHandlerCompShow2: false,
			}
		},
		mounted() {
			this.busEvent();
		},
		methods: {
			// 点击功能图标, 切换组件的显示与隐藏
			menuImgClick(item) {
				let menuName = item.name;
				let showName = menuName.replace(menuName[0], menuName[0].toLowerCase()) + 'CompShow';
				if(!item.isActive){
					this.hideAllMenuComp();
					this[showName] = true;
					this[showName+"2"] = true;
					item.isActive = true;
				}else{
					item.isActive = false;
					this[showName+"2"] = false;
				}
			},
			
			// 改变某个组件的选中状态
			changeOneMenuActive(menuName, isActive) {
				this.navMenuArr.filter((menu)=>{
					if(menuName == menu.name){
						menu.isActive = isActive;
						return;
					}
				})
			},
			
			// 隐藏所有的组件
			hideAllMenuComp() {
				this.mapLayerCompShow2 = false;
				this.satelliteCompShow2 = false;
				this.atmosphereCompShow2 = false;
				this.scenarioHistoryCompShow2 = false;
				this.imageryLayerHandlerCompShow2 = false;
				this.navMenuArr.filter((menu)=>{
					menu.isActive = false;
				})
			},
			
			// 监听各业务组件的Bus事件(比如：关闭销毁组件)
			busEvent(){
				Bus.$on('MapLayerComp-CloseComp', ()=>{
					this.mapLayerCompShow2 = false;
					this.changeOneMenuActive("MapLayer", false);
				})
				Bus.$on('SatelliteComp-CloseComp', ()=>{
					this.satelliteCompShow = false;
					this.changeOneMenuActive("Satellite", false);
				})
				Bus.$on('AtmosphereComp-CloseComp', ()=>{
					this.atmosphereCompShow = false;
					this.changeOneMenuActive("Atmosphere", false);
				})
				Bus.$on('ScenarioHistoryComp-CloseComp', ()=>{
					this.scenarioHistoryCompShow = false;
					this.changeOneMenuActive("ScenarioHistory", false);
				})
				Bus.$on('ImageryLayerHandlerComp-CloseComp', ()=>{
					this.imageryLayerHandlerCompShow = false;
					this.changeOneMenuActive("ImageryLayerHandler", false);
				})
			}
		}
	}
</script>


<style scoped="true">
	#navMenuId {}

	.navMenItemClass {
		position: absolute;
		top: 15%;
		left: 1px;
		z-index: 100;
		/* background-color: #000000b8; */
	}

	.imgItemDivClass {
		padding: 5px 5px;
	}

	.imgItemClass {
		width: 35px;
		height: 35px;
		cursor: pointer;
	}

	.active {
		background-color: #128bd2;
	}
</style>
