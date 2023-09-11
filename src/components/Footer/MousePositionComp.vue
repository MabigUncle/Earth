<template>
	<div id="mousePositionId">
		<div class="lon-class">
			<span class="lon-text-class">经度: </span>
			<span>{{mouseLon}}</span>
		</div>
		<div class="lat-class">
			<span class="lat-text-class">纬度: </span>
			<span>{{mouseLat}}</span>
		</div>
		<div class="height-class">
			<span class="height-text-class">相机高: </span>
			<span>{{cameraHeight}}KM</span>
		</div>
		<div class="level-class">
			<span class="level-text-class">地图层级: </span>
			<span>{{level}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'MousePositionComp',
		data() {
			return {
				mouseLon: '',
				mouseLat: '',
				cameraHeight: '',
				level: '',
			}
		},
		mounted() {
			this.getLngLat();
			this.viewerChange();
		},
		methods: {
			getLngLat() {
				let _this = this;
				let canvas = viewer.scene.canvas;
				let ellipsoid = viewer.scene.globe.ellipsoid;
				let handler = new Cesium.ScreenSpaceEventHandler(canvas);
				handler.setInputAction(function(movement) {
					let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
					if (cartesian) {
						//将笛卡尔三维坐标转为地图坐标（弧度）
						let cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
						//将地图坐标（弧度）转为十进制的度数
						_this.mouseLat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
						_this.mouseLon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
						_this.cameraHeight = (viewer.camera.positionCartographic.height / 1000).toFixed(1);
						/* let dfmLng = _this.ToDMS(lng);
						let dfmLat = _this.ToDMS(lat); */

					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
			},
			// ToDMS(val) {
			// 	if (typeof(val) == "undefined" || val == "") {
			// 		return "";
			// 	}
			// 	let i = val.indexOf('.');
			// 	let strDu = i < 0 ? val : val.substring(0, i); //获取度
			// 	let strFen = 0;
			// 	let strMiao = 0;
			// 	if (i > 0) {
			// 		let strFen2 = "0" + val.substring(i);
			// 		let strFen3 = Number(strFen2) * 60;
			// 		strFen = parseInt(strFen3);
			// 		i = strFen3.toString().indexOf('.');
			// 		if (i > 0) {
			// 			let strMiao2 = "0" + strFen3.toString().substring(i);
			// 			let strMiao3 = Number(strMiao2) * 60;
			// 			strMiao = parseInt(strMiao3);
			// 		}
			// 	}
			// 	return strDu + "°" + strFen + "′" + strMiao + "″";
			// },

			// 监听相机视角变化事件
			viewerChange() {
				this.level = this.getZoom();
				viewer.camera.changed.addEventListener(() => {
					this.level = this.getZoom();
				});
			},

			// 根据相机高度，计算地图层级
			getZoom() {
				const ellipsoid = window.viewer.scene.globe.ellipsoid;
				const cameraHeight = ellipsoid.cartesianToCartographic(window.viewer.camera.position).height;
				const moveRate = cameraHeight / 1000.0;
				if (moveRate > 10123) {
					return 2;
				} else if (moveRate > 7123) {
					return 3;
				} else if (moveRate > 6321) {
					return 4;
				} else if (moveRate > 5522) {
					return 5;
				} else if (moveRate > 3436) {
					return 6;
				} else if (moveRate > 539) {
					return 7;
				} else if (moveRate > 305) {
					return 8;
				} else if (moveRate > 180) {
					return 9;
				} else if (moveRate > 133) {
					return 10;
				} else if (moveRate > 100) {
					return 11;
				} else if (moveRate > 76.5) {
					return 12;
				} else if (moveRate > 58.2) {
					return 13;
				} else if (moveRate > 23.5) {
					return 14;
				} else if (moveRate > 9.6) {
					return 15;
				} else if (moveRate > 4) {
					return 16;
				} else if (moveRate > 2) {
					return 17;
				} else if (moveRate > 1.7) {
					return 18;
				} else {
					return 18;
				}
			},

		},
		destroyed() {

		}
	}
</script>

<style scoped>
	#mousePositionId {
		display: flex;
		justify-content: space-between;
		color: #ffffff;
		font-size: 20px;
		width: 40%;
		margin-left: 10px;
	}
	.lon-text-class{
		color: #4690eb;
	}
	.lat-text-class{
		color: #ed871e;
	}
	.height-text-class{
		color: #00ffff;
	}
	.level-text-class{
		color: #ffff00;
	}
</style>
