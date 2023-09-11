<template>
	<div id="WidgetId">
		<!-- <el-tooltip effect="dark" placement="top">
			<h3 slot="content">测量</h3>
			<span class="icon icon-biaohui myicon"></span>
		</el-tooltip> -->
		
		<!-- <el-tooltip effect="dark" placement="top">
			<h3 slot="content">测量</h3>
			<img src="image/tool/MapMeasure.png" />
		</el-tooltip> -->
	</div>
</template>

<script>
	export default {
		name: 'WidgetComp',
		data() {
			return {
				
			} 
		},
		mounted() {
			
		},
		methods: {
			

		},
		destroyed() {

		}
	}
</script>

<style scoped>
	#widgetId {
		display: flex;
		justify-content: space-between;
	}
	.myicon{
		color: #1a8bed;
		font-size: 30px;
		margin-right: 20px;
		font-weight: 600;
		cursor: pointer;
	}
</style>
