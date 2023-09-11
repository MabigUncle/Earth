<template>
	<div id="labelPlotTab">
		<el-form ref="form" label-width="80px" size="small">
			<el-form-item label="文字">
				<el-input v-model="inputText"></el-input>
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
	import DrawLabel from '../js/DrawLabel'
	import CreateLabel from '../js/CreateLabel'
	export default {
		name: 'LabelPlotTab',
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

				inputText: '',
			}
		},
		mounted() {

		},
		methods: {
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
						new DrawLabel(this.inputText);
						break;
					case 'plotByLonlat':
						let createLabel = new CreateLabel({
							lon: this.lon,
							lat: this.lat,
							text: this.inputText
						});
						PlotBus.$emit("addEntityPlot", {
							plotType: 'Plot_Label',
							entityId: createLabel.finalEntityId
						});
						this.lon = '';
						this.lat = '';
						this.inputText = '';
						break;
					case 'plotByDms':
						let lon = CesiumUtil.dmsToDegree(this.d, this.m, this.s);
						let lat = CesiumUtil.dmsToDegree(this.d2, this.m2, this.s2);
						let createLabel2 = new CreateLabel({
							lon: lon,
							lat: lat,
							text: this.inputText
						});
						PlotBus.$emit("addEntityPlot", {
							plotType: 'Plot_Label',
							entityId: createLabel2.finalEntityId
						});
						this.d = '';
						this.m = '';
						this.s = '';
						this.d2 = '';
						this.m2 = '';
						this.s2 = '';
						this.inputText = '';
						break;
				}
			}
		}
	}
</script>

<style scoped="true">
	#labelPlotTab {}
</style>
