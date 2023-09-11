<template>
	<div id="atmosphereCompId" class="wrap2">
		<div class="wrap-title">
			<span class="wrap-title-text">气象可视化</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close"/>
		</div>
		<div class="container">
			<el-checkbox v-model="fengCheck" @change="fengChange">全球海洋风场</el-checkbox>
			<br />
			<el-checkbox v-model="wenduCheck" @change="wenduChange">全国温度</el-checkbox>
			<br />
			<el-checkbox v-model="yuCheck" @change="yuChange">全国降雨</el-checkbox>
		</div>
		<div v-show="jyInfoShow" id="jyInfoId">{{jyInfo}}</div>
		<div v-show="wdInfoShow" id="wdInfoId">{{wdInfo}}</div>
	</div>
</template>

<script>
	let billboards = null;
	let wdImageryLayer = null;
	let wdPointEntityArr = [];
	let wdPreEntity = '';
	let wdhandler = '';
	let jyImageryLayer = null;
	let jyPointEntityArr = [];
	let jyhandler = '';
	let jyPreEntity = '';
	export default {
		name: 'AtmosphereComp',
		data() {
			return {
				fengCheck: false,
				
				wenduCheck: false,
				
				wdInfo: '',
				wdInfoShow: false,
				
				yuCheck: false,
				
				jyInfoShow: false,
				jyInfo: '',
			}
		},
		mounted() {

		},
		methods: {
			fengChange() {
				if (this.fengCheck) {
					viewer.scene.mode = 2;
					viewer.camera.setView({
						destination: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
					});
					if(!billboards){
						billboards = viewer.scene.primitives.add(new Cesium.BillboardCollection());
					}
					axios.get("data/feng/feng.json").then((res) => {
						let response = res.data;
						for (let i = 0; i < response.length; i++) {
							billboards.add({
								position: Cesium.Cartesian3.fromDegrees(response[i].lon, response[i].lat),
								image: this.getArrowImage(response[i].wind_speed),
								rotation: -response[i].wind_dir
							})
						}
					})
				} else {
					viewer.scene.primitives.remove(billboards);
					billboards = null;
					viewer.scene.mode = 3;
				}
			},
			getArrowImage(wind_speed) {
				let speed = parseInt(wind_speed) + 1;
				return "image/arrow/" + speed + ".png";
			},
			
			wenduChange() {
				if (this.wenduCheck) {
					viewer.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(110, 35, 7000000)
					});
					//添加温度图片
					let wdImageryProvider = new Cesium.SingleTileImageryProvider({
						url: 'image/wendu/wendu.png',
						rectangle: Cesium.Rectangle.fromDegrees(72.8, 16, 136.5, 58.6)
					});
					wdImageryLayer = new Cesium.ImageryLayer(wdImageryProvider);
					viewer.imageryLayers.add(wdImageryLayer);
					//添加温度point
					axios.get('data/wendu/wendu.json').then((res) => {
						let response = res.data;
						for (let i = 0; i < response.list.length; i++) {
							let entity = viewer.entities.add({
								position: Cesium.Cartesian3.fromDegrees(response.list[i].j, response.list[i].w),
								point: {
									pixelSize: 3,
									color: Cesium.Color.YELLOW,
									outlineColor: Cesium.Color.GREEN,
									outlineWidth: 1
								},
								properties: {
									's': response.list[i].s,
									'm': response.list[i].m,
									't': response.list[i].t
								}
							});
							wdPointEntityArr.push(entity);
						}
						this.wdMousemoveAdd();
					})
				} else {
					this.wdInfoShow = false;
					viewer.imageryLayers.remove(wdImageryLayer);
					wdImageryLayer = null;
					for (let i = 0; i < wdPointEntityArr.length; i++) {
						viewer.entities.remove(wdPointEntityArr[i], true);
					}
					wdPointEntityArr = [];
					this.wdMousemoveRemove();
				}
			},
			yuChange() {
				if (this.yuCheck) {
					viewer.camera.flyTo({
						destination: Cesium.Cartesian3.fromDegrees(110, 35, 7000000)
					});
					//贴图
					let jyImageryProvider = new Cesium.SingleTileImageryProvider({
						url: 'image/jiangyu/jy2.png',
						rectangle: Cesium.Rectangle.fromDegrees(72.6, 15.8, 136.3, 58.70)
					});
					jyImageryLayer = new Cesium.ImageryLayer(jyImageryProvider);
					viewer.imageryLayers.add(jyImageryLayer);
					//添加降雨point
					axios.get('data/jiangyu/jiangyu.json').then((res) => {
						let response = res.data;
						for (let i = 0; i < response.list.length; i++) {
							let entity = viewer.entities.add({
								position: Cesium.Cartesian3.fromDegrees(response.list[i].j, response.list[i].w),
								point: {
									pixelSize: 3,
									color: Cesium.Color.WHITE,
									outlineColor: Cesium.Color.GREEN,
									outlineWidth: 1
								},
								properties: {
									's': response.list[i].s,
									'm': response.list[i].m,
									'r24': response.list[i].r24
								}
							});
							jyPointEntityArr.push(entity);
						}
						this.jyMousemoveAdd();
					})
				} else {
					this.jyInfoShow = false;
					viewer.imageryLayers.remove(jyImageryLayer);
					jyImageryLayer = null;
					for (let i = 0; i < jyPointEntityArr.length; i++) {
						viewer.entities.remove(jyPointEntityArr[i], true);
					}
					jyPointEntityArr = [];
					this.jyMousemoveRemove();
				}
			},

			//增加温度中的鼠标悬浮监听事件
			wdMousemoveAdd() {
				let _this = this;
				wdhandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				wdhandler.setInputAction(function(click) {
					if (wdPreEntity != '') {
						wdPreEntity.point.pixelSize = 3;
					}
					var pickedObject = viewer.scene.pick(click.endPosition);
					if (Cesium.defined(pickedObject) && pickedObject.id.properties.t != undefined) {
						wdPreEntity = pickedObject.id;
						pickedObject.id.point.pixelSize = 10;

						let s = pickedObject.id.properties.s._value;
						let m = pickedObject.id.properties.m._value;
						let t = pickedObject.id.properties.t._value;

						let wdInfoElem = document.getElementById("wdInfoId");
						wdInfoElem.style.position = "absolute";
						wdInfoElem.style.zIndex = "100";
						wdInfoElem.style.width = "200px";
						wdInfoElem.style.left = click.endPosition.x + 15 - 80 + "px";
						wdInfoElem.style.top = click.endPosition.y + 15 - 80 + "px";
						wdInfoElem.style.color = "#fff";
						wdInfoElem.style.backgroundColor = "#00000099";
						wdInfoElem.style.padding = "5px";
						wdInfoElem.style.borderRadius = "3px";
						_this.wdInfo = s + '-' + m + " : " + t + "℃";
						_this.wdInfoShow = true;
					} else {
						_this.wdInfoShow = false;
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			},
			//移除温度中的鼠标悬浮监听事件
			wdMousemoveRemove() {
				if(wdhandler != ''){
					wdhandler.destroy();
					wdPreEntity = '';
					wdhandler = '';
				}
			},

			//增加降雨中的鼠标悬浮监听事件
			jyMousemoveAdd() {
				let _this = this;
				jyhandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				jyhandler.setInputAction(function(click) {
					if (jyPreEntity != '') {
						jyPreEntity.point.pixelSize = 3;
					}
					var pickedObject = viewer.scene.pick(click.endPosition);
					if (Cesium.defined(pickedObject) && pickedObject.id.properties.r24 != undefined) {
						jyPreEntity = pickedObject.id;
						pickedObject.id.point.pixelSize = 10;

						let s = pickedObject.id.properties.s._value;
						let m = pickedObject.id.properties.m._value;
						let r24 = pickedObject.id.properties.r24._value;

						let jyInfoElem = document.getElementById("jyInfoId");
						jyInfoElem.style.position = "absolute";
						jyInfoElem.style.zIndex = "100";
						jyInfoElem.style.width = "200px";
						jyInfoElem.style.left = click.endPosition.x + 15 - 80 + "px";
						jyInfoElem.style.top = click.endPosition.y + 15 - 80 + "px";
						jyInfoElem.style.color = "#fff";
						jyInfoElem.style.backgroundColor = "#00000099";
						jyInfoElem.style.padding = "5px";
						jyInfoElem.style.borderRadius = "3px";
						_this.jyInfo = s + '-' + m + " : " + r24 + "mm";
						_this.jyInfoShow = true;
					} else {
						_this.jyInfoShow = false;
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			},
			//移除降雨中的鼠标悬浮监听事件
			jyMousemoveRemove() {
				if(jyhandler != ''){
					jyhandler.destroy();
					jyPreEntity = '';
					jyhandler = '';
				}
			},

			removeAllData(){
				viewer.scene.primitives.remove(billboards);
				billboards = null;
				viewer.scene.mode = 3;
				
				this.wdInfoShow = false;
				viewer.imageryLayers.remove(wdImageryLayer);
				wdImageryLayer = null;
				for (let i = 0; i < wdPointEntityArr.length; i++) {
					viewer.entities.remove(wdPointEntityArr[i], true);
				}
				wdPointEntityArr = [];
				this.wdMousemoveRemove();
				
				this.jyInfoShow = false;
				viewer.imageryLayers.remove(jyImageryLayer);
				jyImageryLayer = null;
				for (let i = 0; i < jyPointEntityArr.length; i++) {
					viewer.entities.remove(jyPointEntityArr[i], true);
				}
				jyPointEntityArr = [];
				this.jyMousemoveRemove();
			},
			// 关闭div
			closeDiv() {
				this.removeAllData();
				Bus.$emit("AtmosphereComp-CloseComp");
			}
		},
		beforeDestroy(){
			this.removeAllData();
		}
	}
</script>

<style scoped>

</style>



