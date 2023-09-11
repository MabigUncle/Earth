<template>
	<div id="commonPlotCompId" class="wrap">
		<div class="wrap-title">
			<span class="wrap-title-text">基础标绘</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close" />
		</div>
		<div class="container">
			<CommonPlot ref="CommonPlot"></CommonPlot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'CommonPlotComp',
		data() {
			return {
				
			}
		},
		methods:{
			closeDiv(){
				this.$refs.CommonPlot.$refs.PlotListTab.clearAllPlot()
				Bus.$emit("CommonPlotComp-CloseComp");
			},
		},
		beforeDestroy(){
			this.$refs.CommonPlot.$refs.PlotListTab.clearAllPlot()
		}
	}
</script>

<style scoped>
	#commonPlotCompId{
		width: 450px;
	}
</style>

