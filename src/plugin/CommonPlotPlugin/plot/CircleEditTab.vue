<template>
	<div id="circleEditTab">
		<div class="head-class">
			<span class="title-class">编辑-圆</span>
			<span>
				<el-button type="primary" size="mini" @click="updatePlot">更新</el-button>
				<el-button type="primary" size="mini" @click="closePlot">关闭</el-button>
			</span>
		</div>
		<hr />
		<el-form ref="form" label-width="100px" size="small">
			<el-form-item label="轮廓线">
				<el-switch v-model="outlineShow"></el-switch>
			</el-form-item>
			<el-form-item label="轮廓线颜色">
				<el-color-picker v-model="outlineColor" color-format="rgb" show-alpha></el-color-picker>
			</el-form-item>
			<el-form-item label="填充">
				<el-switch v-model="fillShow"></el-switch>
			</el-form-item>
			<el-form-item label="填充颜色">
				<el-color-picker v-model="fillColor" color-format="rgb" show-alpha></el-color-picker>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	let selectedEntity = null;
	export default {
		name: 'circleEditTab',
		props: ['selectedEntityId'],
		data() {
			return {
				outlineShow: true,
				outlineWidth: '',
				outlineColor: '',
				fillShow: '',
				fillColor: ''
			}
		},
		mounted() {
			selectedEntity = viewer.entities.getById(this.selectedEntityId);
			this.outlineShow = selectedEntity.ellipse.outline === undefined ? true : selectedEntity.ellipse.outline._value;
			this.outlineColor = selectedEntity.ellipse.outlineColor.getValue().toCssColorString();
			this.fillShow = selectedEntity.ellipse.fill === undefined ? true : selectedEntity.ellipse.fill._value;
			this.fillColor = selectedEntity.ellipse.material._color._value.toCssColorString();
		},
		methods: {
			//点击更新按钮
			updatePlot() {
				selectedEntity.ellipse.outline = this.outlineShow;
				selectedEntity.ellipse.outlineColor = CesiumUtil.rgbaToColor(this.outlineColor);
				selectedEntity.ellipse.fill = this.fillShow;
				selectedEntity.ellipse.material = CesiumUtil.rgbaToColor(this.fillColor);
			},

			// 点击关闭按钮
			closePlot() {
				PlotBus.$emit('CloseEditTab');
			}
		}
	}
</script>

<style scoped="true">
	#circleEditTab {}

	.head-class {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5px;
	}

	.title-class {
		font-size: 16px;
		font-weight: bold;
	}
</style>

<style>
	#circleEditTab .el-form {
		margin-top: 10px;
	}
</style>
