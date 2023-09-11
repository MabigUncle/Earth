<template>
	<div id="rectanglePlotTab">
		<el-form ref="form" label-width="80px" size="small">
			<el-form-item label="绘制方式">
				<el-select v-model="plotType" placeholder="请选择绘制方式" @change="changePlotType">
					<el-option v-for="item in plotTypes" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="经度范围" v-show="lonlatFormShow">
				<el-col :span="11">
					<el-form-item>
						<el-input v-model="minLon" style="width: 95%;" placeholder="最小经度">
							<template slot="append">°</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="line" :span="2">-</el-col>
				<el-col :span="11">
					<el-form-item>
						<el-input v-model="maxLon" style="width: 95%;" placeholder="最大经度">
							<template slot="append">°</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="纬度范围" v-show="lonlatFormShow">
				<el-col :span="11">
					<el-form-item>
						<el-input v-model="minLat" style="width: 95%;" placeholder="最小纬度">
							<template slot="append">°</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="line" :span="2">-</el-col>
				<el-col :span="11">
					<el-form-item>
						<el-input v-model="maxLat" style="width: 95%;" placeholder="最大纬度">
							<template slot="append">°</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-form-item>

			<el-form-item label="最小经度" v-show="dmsFormShow">
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="dMin" placeholder="度"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="mMin" placeholder="分"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="sMin" placeholder="秒"></el-input>
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="最大经度" v-show="dmsFormShow">
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="dMax" placeholder="度"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="mMax" placeholder="分"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="sMax" placeholder="秒"></el-input>
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="最小纬度" v-show="dmsFormShow">
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="d2Min" placeholder="度"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="m2Min" placeholder="分"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="s2Min" placeholder="秒"></el-input>
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="最大纬度" v-show="dmsFormShow">
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="d2Max" placeholder="度"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="m2Max" placeholder="分"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item>
						<el-input v-model="s2Max" placeholder="秒"></el-input>
					</el-form-item>
				</el-col>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" size="small" @click="startPlot">开始绘制</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import DrawRectangle from '../js/DrawRectangle'
	import CreateRectangle from '../js/CreateRectangle'
	export default {
		name: 'RectanglePlotTab',
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

				lonlatFormShow: false,
				minLon: '',
				maxLon: '',
				minLat: '',
				maxLat: '',

				dmsFormShow: false,
				dMin: '',
				mMin: '',
				sMin: '',
				d2Min: '',
				m2Min: '',
				s2Min: '',
				dMax: '',
				mMax: '',
				sMax: '',
				d2Max: '',
				m2Max: '',
				s2Max: '',
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
					this.minLon = '';
					this.maxLon = '';
					this.minLat = '';
					this.maxLat = '';
					this.lonlatFormShow = true;
				} else if (plotType === 'plotByDms') {
					this.dMin = '';
					this.mMin = '';
					this.sMin = '';
					this.d2Min = '';
					this.m2Min = '';
					this.s2Min = '';
					this.dMax = '';
					this.mMax = '';
					this.sMax = '';
					this.d2Max = '';
					this.m2Max = '';
					this.s2Max = '';
					this.dmsFormShow = true;
				}
			},
			//开始绘制
			startPlot() {
				switch (this.plotType) {
					case 'plotByMap':
						new DrawRectangle();
						break;
					case 'plotByLonlat':
						let createRectangle = new CreateRectangle({
							minLon: this.minLon,
							maxLon: this.maxLon,
							minLat: this.minLat,
							maxLat: this.maxLat
						});
						PlotBus.$emit("addEntityPlot", {
							plotType: 'Plot_Rectangle',
							entityId: createRectangle.finalEntityId
						});
						this.minLon = '';
						this.maxLon = '';
						this.minLat = '';
						this.maxLat = '';
						break
					case 'plotByDms':
						let createRectangle2 = new CreateRectangle({
							minLon: CesiumUtil.dmsToDegree(this.dMin, this.mMin, this.sMin),
							maxLon: CesiumUtil.dmsToDegree(this.dMax, this.mMax, this.sMax),
							minLat: CesiumUtil.dmsToDegree(this.d2Min, this.m2Min, this.s2Min),
							maxLat: CesiumUtil.dmsToDegree(this.d2Max, this.m2Max, this.s2Max)
						});
						PlotBus.$emit("addEntityPlot", {
							plotType: 'Plot_Rectangle',
							entityId: createRectangle2.finalEntityId
						});
						this.dMin = '';
						this.mMin = '';
						this.sMin = '';
						this.d2Min = '';
						this.m2Min = '';
						this.s2Min = '';
						this.dMax = '';
						this.mMax = '';
						this.sMax = '';
						this.d2Max = '';
						this.m2Max = '';
						this.s2Max = '';
						break;
				}
			}
		}
	}
</script>

<style scoped="true">
	#rectanglePlotTab {
		max-height: 460px;
		overflow-y: auto;
	}
</style>
