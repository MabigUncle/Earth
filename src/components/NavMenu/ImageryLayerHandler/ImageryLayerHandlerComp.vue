<template>
	<div id="imageryLayerHandlerCompId" class="wrap2">
		<div class="wrap-title">
			<span class="wrap-title-text">影像处理</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close"/>
		</div>
		<div class="container">
			<span style="color: #ffffff;margin: 10px;">请选择影像图层</span>
			<el-select v-model="value" @change="selectChange" placeholder="请选择影像图层" size="mini">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-form label-width="80px">
				<el-form-item label="透明度">
					<el-slider v-model="alpha" :step="0.01" :min="0" :max="1" @input="updateImageryLayer" :format-tooltip="formatTooltip"></el-slider>
				</el-form-item>
				<el-form-item label="亮度">
					<el-slider v-model="brightness" :step="0.01" :min="0" :max="3" @input="updateImageryLayer" :format-tooltip="formatTooltip"></el-slider>
				</el-form-item>
				<el-form-item label="对比度">
					<el-slider v-model="contrast" :step="0.01" :min="0" :max="3" @input="updateImageryLayer" :format-tooltip="formatTooltip"></el-slider>
				</el-form-item>
				<el-form-item label="色调">
					<el-slider v-model="hue" :step="0.01" :min="0" :max="3" @input="updateImageryLayer" :format-tooltip="formatTooltip"></el-slider>
				</el-form-item>
				<el-form-item label="饱和度">
					<el-slider v-model="saturation" :step="0.01" :min="0" :max="3" @input="updateImageryLayer" :format-tooltip="formatTooltip"></el-slider>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="mini" @click="resetValue">复原</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	let imageryLayer = '';
	export default {
		name: 'ImageryLayerHandlerComp',
		data() {
			return {
				value: 0,
				options: [],
				alpha: 1.0,
				brightness: 1.0,
				contrast: 1.0,
				hue: 0.0,
				saturation: 1.0
			}
		},
		mounted() {
			this.compOptions();
			this.compImageryLayer();
		},
		methods: {
			compOptions() {
				let len = viewer.imageryLayers.length;
				let arr = [];
				for (let i = 0; i < len; i++) {
					arr.push({
						label: i,
						value: i
					})
				}
				this.options = arr;
			},
			compImageryLayer() {
				imageryLayer = viewer.imageryLayers.get(Number(this.value));
			},
			selectChange(newVal) {
				imageryLayer = viewer.imageryLayers.get(Number(newVal));
			},
			// 影像处理(alpha:透明度、brightness：亮度、contrast：对比度、hue：色调、saturation：饱和度、gamma：伽马)
			updateImageryLayer() {
			    if (imageryLayer) {
			        imageryLayer.alpha = this.alpha;
			        imageryLayer.brightness = this.brightness;
			        imageryLayer.contrast = this.contrast;
			        imageryLayer.hue = this.hue;
			        imageryLayer.saturation = this.saturation;
			    } else {
			        console.warn("缺少imageryLayer！");
			    }
			},
			
			formatTooltip(val) {
				if(val){
					return val.toFixed(2);
				}
			    return 0;
			},
			
			resetValue(){
				this.alpha = 1.0;
				this.brightness = 1.0;
				this.contrast = 1.0;
				this.hue = 0;
				this.saturation = 1.0;
				this.updateImageryLayer();
			},
			// 关闭div
			closeDiv() {
				Bus.$emit("ImageryLayerHandlerComp-CloseComp");
			}
		},
		beforeDestroy() {
			this.resetValue();
		}
	}
</script>

<style scoped>
	#imageryLayerHandlerComp {
		
	}
</style>
