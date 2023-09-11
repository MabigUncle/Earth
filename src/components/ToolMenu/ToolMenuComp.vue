<template>
	<div id="toolMenuId">
		<div class="toolMenItemClass">
			<div class="imgItemDivClass" v-for="item in toolMenuArr" :class="{active: item.isActive}">
				<el-tooltip class="item" effect="dark" placement="left">
					<h3 slot="content">{{item.title}}</h3>
					<div style="text-align: center;color: #1296db;user-select: none;">
						<img :src="item.img" @click="toolImgClick(item)" class="imgItemClass" />
					</div>
				</el-tooltip>
			</div>
		</div>

		<CommonPlotComp v-if="commonPlotCompShow" v-show="commonPlotCompShow2"></CommonPlotComp>
		<ThematicMapComp v-if="thematicMapCompShow" v-show="thematicMapCompShow2"></ThematicMapComp>
		<RouteAnalysisComp v-if="routeAnalysisCompShow" v-show="routeAnalysisCompShow2"></RouteAnalysisComp>
		<MapMeasureComp v-if="mapMeasureCompShow" v-show="mapMeasureCompShow2"></MapMeasureComp>
		<PlacenameServiceComp v-if="placenameServiceCompShow" v-show="placenameServiceCompShow2"></PlacenameServiceComp>
		<SpatialAnalysisComp v-if="spatialAnalysisCompShow" v-show="spatialAnalysisCompShow2"></SpatialAnalysisComp>
		<SystemSettingComp v-show="systemSettingCompShow2"></SystemSettingComp>	
	</div>
</template>


<script>
	import CommonPlotComp from '@/components/ToolMenu/CommonPlot/CommonPlotComp.vue'
	import ThematicMapComp from '@/components/ToolMenu/ThematicMap/ThematicMapComp.vue'
	import RouteAnalysisComp from '@/components/ToolMenu/RouteAnalysis/RouteAnalysisComp.vue'
	import MapMeasureComp from '@/components/ToolMenu/MapMeasure/MapMeasureComp.vue'
	import PlacenameServiceComp from '@/components/ToolMenu/PlacenameService/PlacenameServiceComp.vue'
	import SystemSettingComp from '@/components/ToolMenu/SystemSetting/SystemSettingComp.vue'
	import SpatialAnalysisComp from '@/components/ToolMenu/SpatialAnalysis/SpatialAnalysisComp.vue'
	
	export default {
		name: 'ToolMenuComp',
		components: {
			CommonPlotComp,
			ThematicMapComp,
			RouteAnalysisComp,
			MapMeasureComp,
			PlacenameServiceComp,
			SystemSettingComp,
			SpatialAnalysisComp
		},
		data() {
			return {
				toolMenuArr: [{
					name: 'CommonPlot',
					title: '普通标绘',
					img: 'image/tool/CommonPlot.png',
					isActive: false
				}, {
					name: 'ThematicMap',
					title: '专题图',
					img: 'image/tool/ThematicMap.png',
					isActive: false
				}, {
					name: 'SpatialAnalysis',
					title: '空间分析',
					img: 'image/tool/SpatialAnalysis.png',
					isActive: false
				}, {
					name: 'RouteAnalysis',
					title: '路径分析',
					img: 'image/tool/RouteAnalysis.png',
					isActive: false
				}, {
					name: 'PlacenameService',
					title: '地名服务',
					img: 'image/tool/PlacenameService.png',
					isActive: false
				}, {
					name: 'MapMeasure',
					title: '地图量测',
					img: 'image/tool/MapMeasure.png',
					isActive: false
				}, {
					name: 'SystemSetting',
					title: '系统设置',
					img: 'image/tool/SystemSetting.png',
					isActive: false
				}],

				commonPlotCompShow: false,
				thematicMapCompShow: false,
				routeAnalysisCompShow: false,
				mapMeasureCompShow: false,
				placenameServiceCompShow: false,
				spatialAnalysisCompShow: false,
				
				commonPlotCompShow2: true,
				thematicMapCompShow2: true,
				routeAnalysisCompShow2: true,
				mapMeasureCompShow2: true,
				placenameServiceCompShow2:true,
				systemSettingCompShow2: false,
				spatialAnalysisCompShow2: true,
			}
		},
		mounted() {
			this.busEvent();
		},
		methods: {
			// 点击工具图标, 切换组件的显示与隐藏
			toolImgClick(item) {
				let toolName = item.name;
				let showName = toolName.replace(toolName[0], toolName[0].toLowerCase()) + 'CompShow';
				// 切换了新工具
				if(!item.isActive){
					this.hideAllToolComp();
					this[showName] = true;
					this[showName+"2"] = true;
					item.isActive = true;
				}else{
					item.isActive = false;
					this[showName+"2"] = false;
				}
			},
			
			// 改变某个组件的选中状态
			changeOneToolActive(toolName, isActive) {
				this.toolMenuArr.filter((tool)=>{
					if(toolName == tool.name){
						tool.isActive = isActive;
						return;
					}
				})
			},
			
			// 隐藏所有的工具组件
			hideAllToolComp() {
				this.commonPlotCompShow2 = false;
				this.thematicMapCompShow2 = false;
				this.routeAnalysisCompShow2 = false;
				this.mapMeasureCompShow2 = false;
				this.placenameServiceCompShow2 = false;
				this.systemSettingCompShow2 = false;
				this.spatialAnalysisCompShow2 = false;
				this.toolMenuArr.filter((tool)=>{
					tool.isActive = false;
				})
			},
			
			// 监听各工具组件的Bus事件
			busEvent(){
				Bus.$on('CommonPlotComp-CloseComp',()=>{
					this.commonPlotCompShow = false;
					this.changeOneToolActive("CommonPlot", false);
				})
				Bus.$on('RouteAnalysisComp-CloseComp', ()=>{
					this.routeAnalysisCompShow = false;
					this.changeOneToolActive("RouteAnalysis", false);
				})
				Bus.$on('MapMeasureComp-CloseComp', ()=>{
					this.mapMeasureCompShow = false;
					this.changeOneToolActive("MapMeasure", false);
				})
				Bus.$on('PlacenameServiceComp-CloseComp', ()=>{
					this.placenameServiceCompShow = false;
					this.changeOneToolActive("PlacenameService", false);
				})
				Bus.$on('SystemSettingComp-CloseComp', ()=>{
					this.systemSettingCompShow2 = false;
					this.changeOneToolActive("SystemSetting", false);
				})
				Bus.$on('SpatialAnalysisComp-CloseComp', ()=>{
					this.spatialAnalysisCompShow = false;
					this.changeOneToolActive("SpatialAnalysis", false);
				})
				Bus.$on('ThematicMapComp-CloseComp',()=>{
					this.thematicMapCompShow = false;
					this.changeOneToolActive("ThematicMap", false);
				})
			}
		}
	}
</script>


<style scoped="true">
	#toolMenuId {

	}

	.toolMenItemClass {
		position: absolute;
		top: 15%;
		right: 1px;
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
