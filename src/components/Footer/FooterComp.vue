<template>
	<div id="footerId">
		<MousePositionComp></MousePositionComp>
		<WidgetComp></WidgetComp>
	</div>
</template>


<script>
	import MousePositionComp from './MousePositionComp.vue'
	import WidgetComp from './WidgetComp.vue'
	export default {
		name: 'FooterComp',
		components: {
			MousePositionComp, WidgetComp
		},
		data() {
			return {

			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>


<style scoped="true">
	#footerId {
		position: absolute;
		left: 0px;
		bottom: 0px;
		z-index: 100;
		background-color: #11171db3;
		width: 100%;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		user-select: none;
	}
</style>
