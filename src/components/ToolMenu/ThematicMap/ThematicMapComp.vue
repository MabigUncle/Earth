<template>
	<div id="thematicMapCompId" class="wrap">
		<div class="wrap-title">
			<span class="wrap-title-text">专题图</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close" />
		</div>
		<div class="container">
			<el-button @click="makeZtMap" type="primary" size="mini">制作专题图</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'ThematicMapComp',
		mounted() {
		},
		methods: {
			makeZtMap(){
				Bus.$emit("ThematicMapComp-makeZtMap")
			},
			closeDiv(){
				Bus.$emit("ThematicMapComp-closeDiv")
				Bus.$emit("ThematicMapComp-CloseComp")
			},
		},
		beforeDestroy(){
			Bus.$emit("ThematicMapComp-closeDiv")
		}
	}
</script>

<style scoped="true">

</style>
