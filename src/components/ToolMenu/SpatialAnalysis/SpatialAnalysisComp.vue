<template>
	<div id="spatialAnalysisCompId" class="wrap">
		<div class="wrap-title">
			<span class="wrap-title-text">空间分析</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close"/>
		</div>
		<div class="container">
			<el-tabs v-model="activeName">
				<el-tab-pane label="点点通视" name="point-point">
					<PointPointComp></PointPointComp>
				</el-tab-pane>
				<el-tab-pane label="点面通视" name="point-polygon">
					<PointPolygonComp></PointPolygonComp>
				</el-tab-pane>
				<el-tab-pane label="剖面" name="profile">
					<ProfileComp></ProfileComp>
				</el-tab-pane>
				<!-- <el-tab-pane label="淹没" name="flood">
					<FloodComp></FloodComp>
				</el-tab-pane> -->
				<el-tab-pane label="挖填方" name="cut-fill">
					<CutFillComp></CutFillComp>
				</el-tab-pane>
				<el-tab-pane label="坡度坡向" name="slope-aspect">
					<SlopeAspectComp></SlopeAspectComp>
				</el-tab-pane>
				<el-tab-pane label="等高线" name="contour">
					<ContourComp></ContourComp>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import FloodComp from './FloodComp.vue'
	import PointPointComp from './PointPointComp.vue'
	import PointPolygonComp from './PointPolygonComp.vue'
	import ProfileComp from './ProfileComp.vue'
	import CutFillComp from './CutFillComp.vue'
	import ContourComp from './ContourComp.vue'
	import SlopeAspectComp from './SlopeAspectComp.vue'
	export default {
		name: 'SpatialAnalysisComp',
		components:{FloodComp, PointPointComp, PointPolygonComp, ProfileComp, CutFillComp, ContourComp, SlopeAspectComp},
		data() {
			return {
				activeName: 'point-point',
				
			}
		},
		methods: {
			// 关闭div
			closeDiv() {
				Bus.$emit("SpatialAnalysisComp-CloseComp");
			}
		},
		beforeDestroy() {

		}
	}
</script>

<style scoped="true">
	#spatialAnalysisCompId {
		
	}
</style>
