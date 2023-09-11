<template>
	<div id="pointPlotTab">
		<el-form ref="form" label-width="80px" size="small">
			<el-form-item label="选择图标">
				<div v-if="currentSelectedType === 'image'">
					<img :src="pointImgSrc" @click="selectImgClick" style="cursor: pointer;width: 35px;height: 35px;" />
				</div>
				<div v-else-if="currentSelectedType === 'model'">
					<div @click="selectImgClick">GLTF：{{modelInfo.name}}.{{modelInfo.extension}}</div>
				</div>
			</el-form-item>
			<el-form-item label="绘制方式">
				<el-select v-model="plotType" placeholder="请选择绘制方式" @change="changePlotType">
					<el-option v-for="item in plotTypes" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="经度" v-show="lonlatFormShow">
				<el-input v-model="lon">
					<template slot="append">°</template>
				</el-input>
			</el-form-item>
			<el-form-item label="纬度" v-show="lonlatFormShow">
				<el-input v-model="lat">
					<template slot="append">°</template>
				</el-input>
			</el-form-item>

			<el-form-item label="经度" v-show="dmsFormShow">
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="d" placeholder="度"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="m" placeholder="分"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="s" placeholder="秒"></el-input>
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="纬度" v-show="dmsFormShow">
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="d2" placeholder="度"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="m2" placeholder="分"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="s2" placeholder="秒"></el-input>
					</el-form-item>
				</el-col>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="startPlot" size="small">开始绘制</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import DrawPoint from '../js/DrawPoint.js'
	import CreatePoint from '../js/CreatePoint.js'
	import DrawModel from '../js/DrawModel.js'
	import CreateModel from '../js/CreateModel.js'
	export default {
		name: 'PointPlotTab',
		data() {
			return {
				plotType: 'plotByMap',
				plotTypes: [{
					label: '图上绘制',
					value: 'plotByMap'
				}, {
					label: '经纬度绘制(十进制)',
					value: 'plotByLonlat'
				}, {
					label: '经纬度绘制(度分秒)',
					value: 'plotByDms'
				}],

				pointImgSrc: 'image/plot/DefaultPoint.png',
				lon: '',
				lat: '',
				lonlatFormShow: false,

				d: '',
				m: '',
				s: '',
				d2: '',
				m2: '',
				s2: '',
				dmsFormShow: false,

				currentSelectedType: 'image',
				modelInfo: '',
			}
		},
		mounted() {
			let _this = this;
			PlotBus.$on("selectedOneImage", (data) => {
				let type = data.imageInfo.type;
				_this.currentSelectedType = type;
				switch (type) {
					case 'image':
						_this.pointImgSrc = data.imageInfo.url;
						break;
					case 'model':
						_this.pointImgSrc = 'image/plot/gltf.png';
						_this.modelInfo = data.imageInfo;
						break;
				}
			});
		},
		methods: {
			//点击选择图片
			selectImgClick() {
				PlotBus.$emit('OpenPointImageTabShow', true);
			},
			//改变绘制方式
			changePlotType(plotType) {
				this.lonlatFormShow = false;
				this.dmsFormShow = false;
				if (plotType === 'plotByLonlat') {
					this.lon = '';
					this.lat = '';
					this.lonlatFormShow = true;
				} else if (plotType === 'plotByDms') {
					this.d = '';
					this.m = '';
					this.s = '';
					this.d2 = '';
					this.m2 = '';
					this.s2 = '';
					this.dmsFormShow = true;
				}
			},
			//开始绘制
			startPlot() {
				switch (this.plotType) {
					case 'plotByMap':
						if (this.currentSelectedType === 'image') {
							new DrawPoint({
								'billboardImage': this.pointImgSrc
							});
						} else if (this.currentSelectedType === 'model') {
							new DrawModel({
								'modelUrl': this.modelInfo.url
							});
						}
						break;
					case 'plotByLonlat':
						if (this.currentSelectedType === 'image') {
							let lon = Number(this.lon);
							let lat = Number(this.lat);
							let createPoint = new CreatePoint(lon, lat, {
								'billboardImage': this.pointImgSrc
							});
							PlotBus.$emit("addEntityPlot", {
								plotType: 'Plot_Point',
								entityId: createPoint.finalEntityId
							});
						} else if (this.currentSelectedType === 'model') {
							let lon = Number(this.lon);
							let lat = Number(this.lat);
							let createModel = new CreateModel(lon, lat, {
								'modelUrl': this.modelInfo.url
							});
							PlotBus.$emit("addEntityPlot", {
								plotType: 'Plot_Model',
								entityId: createModel.finalEntityId
							});
						}
						this.lon = '';
						this.lat = '';
						break;
					case 'plotByDms':
						let lon = CesiumUtil.dmsToDegree(this.d, this.m, this.s);
						let lat = CesiumUtil.dmsToDegree(this.d2, this.m2, this.s2);
						if (this.currentSelectedType === 'image') {
							let createPoint = new CreatePoint(lon, lat, {
								'billboardImage': this.pointImgSrc
							});
							PlotBus.$emit("addEntityPlot", {
								plotType: 'Plot_Point',
								entityId: createPoint.finalEntityId
							});
						} else if (this.currentSelectedType === 'model') {
							let createModel = new CreateModel(lon, lat, {
								'modelUrl': this.modelInfo.url
							});
							PlotBus.$emit("addEntityPlot", {
								plotType: 'Plot_Model',
								entityId: createModel.finalEntityId
							});
						}
						this.d = '';
						this.m = '';
						this.s = '';
						this.d2 = '';
						this.m2 = '';
						this.s2 = '';
						break;
				}
			}
		}
	}
</script>

<style scoped="true">
	#pointPlotTab {}
</style>
