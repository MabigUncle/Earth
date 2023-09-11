<template>
	<div id="polylinePlotTab">
		<el-form ref="form" label-width="80px" size="small">
			<el-form-item label="绘制方式">
				<el-select v-model="plotType" placeholder="请选择绘制方式" @change="changePlotType">
					<el-option v-for="item in plotTypes" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item v-show="lonlatFormShow" v-for="(item, index) in lonlatFormArr" label="经纬度">
				<el-col :span="11">
					<el-form-item>
						<el-input v-model="item.lon" style="width: 95%;" placeholder="请输入经度">
							<template slot="append">°</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item>
						<el-input v-model="item.lat" style="width: 95%;" placeholder="请输入纬度">
							<template slot="append">°</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="line" :span="2" @click.native="deleteOneItem(index)" style="color: #FF0000;cursor: pointer;">删除</el-col>
			</el-form-item>

			<div v-show="dmsFormShow" v-for="(item, index) in dmsFormArr">
				<el-form-item label="经度">
					<el-col :span="7">
						<el-form-item>
							<el-input v-model="item.d" placeholder="度"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item>
							<el-input v-model="item.m" placeholder="分"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item>
							<el-input v-model="item.s" placeholder="秒"></el-input>
						</el-form-item>
					</el-col>
				</el-form-item>
				<el-form-item label="纬度">
					<el-col :span="7">
						<el-form-item>
							<el-input v-model="item.d2" placeholder="度"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item>
							<el-input v-model="item.m2" placeholder="分"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item>
							<el-input v-model="item.s2" placeholder="秒"></el-input>
						</el-form-item>
					</el-col>
					<el-col class="line" :span="2" @click.native="deleteOneItem2(index)" style="color: #FF0000;cursor: pointer;">删除</el-col>
				</el-form-item>
			</div>

			<el-form-item>
				<el-button type="primary" size="small" @click="addOneItem" v-show="lonlatFormShow">增加坐标点</el-button>
				<el-button type="primary" size="small" @click="addOneItem2" v-show="dmsFormShow">增加坐标点</el-button>
				<el-button type="primary" size="small" @click="startPlot">开始绘制</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import DrawPolyline from '../js/DrawPolyline.js'
	import CreatePolyline from '../js/CreatePolyline.js'
	export default {
		name: 'PolylinePlotTab',
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
				lonlatFormArr: [],

				dmsFormShow: false,
				dmsFormArr: [],
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
					this.lonlatFormArr = [];
					this.lonlatFormShow = true;
				} else if (plotType === 'plotByDms') {
					this.dmsFormArr = [];
					this.dmsFormShow = true;
				}
			},
			//开始绘制
			startPlot() {
				switch (this.plotType) {
					case 'plotByMap':
						new DrawPolyline();
						break;
					case 'plotByLonlat':
						let createPolyline = new CreatePolyline(this.lonlatFormArr);
						PlotBus.$emit("addEntityPlot", {
							plotType: 'Plot_Polyline',
							entityId: createPolyline.finalEntityId
						});
						this.lonlatFormArr = [];
						break;
					case 'plotByDms':
						let lonlatFormArr = CesiumUtil.dmsArrToDegreeArr(this.dmsFormArr);
						let createPolyline2 = new CreatePolyline(lonlatFormArr);
						PlotBus.$emit("addEntityPlot", {
							plotType: 'Plot_Polyline',
							entityId: createPolyline2.finalEntityId
						});
						this.dmsFormArr = [];
						break;
				}
			},

			// 增加一组坐标点输入框
			addOneItem() {
				this.lonlatFormArr.push({
					lon: '',
					lat: ''
				});
			},
			// 删除一组坐标点输入框
			deleteOneItem(index) {
				this.lonlatFormArr.splice(index, 1);
			},

			// 增加一组坐标点输入框
			addOneItem2() {
				this.dmsFormArr.push({
					d: '',
					m: '',
					s: '',
					d2: '',
					m2: '',
					s2: ''
				});
			},
			// 删除一组坐标点输入框
			deleteOneItem2(index) {
				this.dmsFormArr.splice(index, 1);
			}
		}
	}
</script>

<style scoped="true">
	#polylinePlotTab {
		max-height: 460px;
		overflow-y: auto;
	}
</style>
<style>
	
</style>
