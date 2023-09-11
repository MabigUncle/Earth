<template>
	<div id="commonEditPlot">
		<PointEditTab :selectedEntityId="selectedEntityId" v-if="pointEditTabShow"></PointEditTab>
		<ModelEditTab :selectedEntityId="selectedEntityId" v-if="modelEditTabShow"></ModelEditTab>
		<PolylineEditTab :selectedEntityId="selectedEntityId" v-if="polylineEditTabShow"></PolylineEditTab>
		<PolygonEditTab :selectedEntityId="selectedEntityId" v-if="polygonEditTabShow"></PolygonEditTab>
		<RectangleEditTab :selectedEntityId="selectedEntityId" v-if="rectangleEditTabShow"></RectangleEditTab>
		<CircleEditTab :selectedEntityId="selectedEntityId" v-if="circleEditTabShow"></CircleEditTab>
		<LabelEditTab :selectedEntityId="selectedEntityId" v-if="labelEditTabShow"></LabelEditTab>
		<SituationEditTab :selectedEntityId="selectedEntityId" :arrowType="arrowType" v-if="situationArrowEditTabShow"></SituationEditTab>
	</div>
</template>

<script>
	import PointEditTab from './PointEditTab.vue'
	import ModelEditTab from './ModelEditTab.vue'
	import PolylineEditTab from './PolylineEditTab.vue'
	import PolygonEditTab from './PolygonEditTab.vue'
	import RectangleEditTab from './RectangleEditTab.vue'
	import CircleEditTab from './CircleEditTab.vue'
	import LabelEditTab from './LabelEditTab.vue'
	import SituationEditTab from './SituationEditTab.vue'

	let selectedEntity = null;
	export default {
		name: 'CommonEditPlot',
		components: {
			PointEditTab,
			ModelEditTab,
			PolylineEditTab,
			PolygonEditTab,
			RectangleEditTab,
			CircleEditTab,
			LabelEditTab,
			SituationEditTab
		},
		data() {
			return {
				commonEditPlotShow: false,
				arrowType: '',
				editPlotComponentName: '',
				selectedEntityId: '',

				pointEditTabShow: false,
				modelEditTabShow: false,
				polylineEditTabShow: false,
				polygonEditTabShow: false,
				rectangleEditTabShow: false,
				circleEditTabShow: false,
				labelEditTabShow: false,
				situationArrowEditTabShow: false,
			}
		},
		mounted() {
			// 删除单个实体
			PlotBus.$on("deleteNodeEntity", () => {
				this.destroyAllTab();
			});
			// 监听清除所有标绘实体事件
			PlotBus.$on('clearAllPlot', () => {
				this.destroyAllTab();
			});

			// 打开编辑面板
			PlotBus.$on('OpenEditTab', (selectedEntityId) => {
				this.selectedEntityId = selectedEntityId;
				selectedEntity = viewer.entities.getById(selectedEntityId);
				if (selectedEntity.name === 'Plot_StraightArrow' || selectedEntity.name === 'Plot_AttackArrow' || selectedEntity.name ===
					'Plot_PincerArrow') {
					this.arrowType = selectedEntity.type;
					this.situationArrowEditTabShow = true;
				} else {
					let tabShowName = selectedEntity.name.split("_")[1].toLowerCase() + "EditTabShow";
					this[tabShowName] = true;
				}
			});

			// 关闭编辑面板
			PlotBus.$on('CloseEditTab', () => {
				this.destroyAllTab();
			});
		},
		methods: {
			destroyAllTab() {
				this.pointEditTabShow = false;
				this.modelEditTabShow = false;
				this.polylineEditTabShow = false;
				this.polygonEditTabShow = false;
				this.rectangleEditTabShow = false;
				this.circleEditTabShow = false;
				this.labelEditTabShow = false;
				this.situationArrowEditTabShow = false;
			},
		}
	}
</script>

<style scoped="true">
	#commonEditPlot {
		position: absolute;
		right: 80px;
		bottom: 50px;
		background-color: rgba(24, 31, 40, .6);
		padding: 10px;
		width: 360px;
		color: #ffffff;
		z-index: 100;
	}
</style>
