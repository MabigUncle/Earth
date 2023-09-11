<template>
	<div id="circlePlotTab">
		<el-form ref="form" label-width="80px" size="small">
			<el-form-item label="绘制方式">
				<el-select v-model="plotType" placeholder="请选择绘制方式" @change="changePlotType">
					<el-option v-for="item in plotTypes" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="圆心坐标" v-show="lonlatFormShow">
				<el-col :span="11">
					<el-form-item>
						<el-input v-model="centerLon" style="width: 95%;" placeholder="请输入经度">
							<template slot="append">°</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="line" :span="2"></el-col>
				<el-col :span="11">
					<el-form-item>
						<el-input v-model="centerLat" style="width: 95%;" placeholder="请输入纬度">
							<template slot="append">°</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="半径" v-show="lonlatFormShow">
				<el-input v-model="circleRadius">
					<template slot="append">KM</template>
				</el-input>
			</el-form-item>

			<el-form-item label="圆心经度" v-show="dmsFormShow">
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
			<el-form-item label="圆心纬度" v-show="dmsFormShow">
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
			<el-form-item label="半径" v-show="dmsFormShow">
				<el-input v-model="circleRadius2">
					<template slot="append">KM</template>
				</el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" size="small" @click="startPlot">开始绘制</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import DrawCircle from '../js/DrawCircle'
	import CreateCircle from '../js/CreateCircle'
	export default {
		name: 'CirclePlotTab',
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
				centerLon: '',
				centerLat: '',
				circleRadius: '',

				dmsFormShow: false,
				d: '',
				m: '',
				s: '',
				d2: '',
				m2: '',
				s2: '',
				circleRadius2: '',
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
					this.circleRadius = '';
					this.lonlatFormShow = true;
				} else if (plotType === 'plotByDms') {
					this.d = '';
					this.m = '';
					this.s = '';
					this.d2 = '';
					this.m2 = '';
					this.s2 = '';
					this.circleRadius2 = '';
					this.dmsFormShow = true;
				}
			},
			//开始绘制
			startPlot() {
				switch (this.plotType) {
					case 'plotByMap':
						new DrawCircle();
						break;
					case 'plotByLonlat':
						let createCircle = new CreateCircle({
							lon: this.centerLon,
							lat: this.centerLat,
							radius: this.circleRadius
						});
						PlotBus.$emit("addEntityPlot", {
							plotType: 'Plot_Circle',
							entityId: createCircle.finalEntityId
						});
						this.lon = '';
						this.lat = '';
						this.circleRadius = '';
						break;
					case 'plotByDms':
						let lon = CesiumUtil.dmsToDegree(this.d, this.m, this.s);
						let lat = CesiumUtil.dmsToDegree(this.d2, this.m2, this.s2);
						let createCircle2 = new CreateCircle({
							lon: lon,
							lat: lat,
							radius: this.circleRadius2
						});
						PlotBus.$emit("addEntityPlot", {
							plotType: 'Plot_Circle',
							entityId: createCircle2.finalEntityId
						});
						this.d = '';
						this.m = '';
						this.s = '';
						this.d2 = '';
						this.m2 = '';
						this.s2 = '';
						this.circleRadius2 = '';
						break;
				}
			}
		}
	}
</script>

<style scoped="true">
	#circlePlotTab {}
</style>
