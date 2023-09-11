<template>
	<div id="mapMeasureCompId" class="wrap">
		<div class="wrap-title">
			<span class="wrap-title-text">地图量测</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close"/>
		</div>
		<div class="container">
			<div class="tools">
				<el-button type="primary" @click="ceJu" size="mini">测距</el-button>
				<el-button type="primary" @click="ceMian" size="mini">测面</el-button>
				<el-button type="primary" @click="clearAll" size="mini">清除</el-button>
			</div>
		</div>
		<!-- <div id="juTip" v-show="juTipShow">
			<div>总长：{{distanceTotal}}公里</div>
			<div>点击鼠标右键结束</div>
		</div> -->
	</div>
</template>

<script>
	export default {
		name: 'MapMeasureComp',
		data() {
			return {
				distanceArr: [],
				distanceTotal: 0,
				juTipShow: false,
				pointEntityIds: [],
				floatingPoint: null,
				activeShapePoints: [],
				activeShape: null,

				mianPointIds: [],
				mianAreaResultEntity: null,
				floatingPoint2: null,
				activeShapePoints2: [],
				activeShape2: null,
				mianAreaPosition: []
			}
		},
		methods: {
			ceJu() {
				let _this = this;
				this.juClear();

				let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				handler.setInputAction(function(evt) {
					let earthPosition = viewer.camera.pickEllipsoid(evt.position);
					if (Cesium.defined(earthPosition)) {
						if (_this.activeShapePoints.length === 0) {
							_this.floatingPoint = _this.createPoint(earthPosition);
							_this.activeShapePoints.push(earthPosition);
							let dynamicPositions = new Cesium.CallbackProperty(function() {
								return _this.activeShapePoints;
							}, false);
							_this.activeShape = _this.addPolyline(dynamicPositions);
							_this.activeShapePoints.push(earthPosition);

							_this.addPoint(earthPosition, "起点");
						} else {
							_this.activeShapePoints.push(earthPosition);

							let len = _this.activeShapePoints.length;
							let distance = _this.calcJuli(_this.activeShapePoints[len - 3], _this.activeShapePoints[len - 2]);
							_this.distanceArr.push(distance);
							_this.addPoint(earthPosition, _this.calcJuliTotal() + "公里");
						}
					}
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

				handler.setInputAction(function(evt) {
					if (Cesium.defined(_this.floatingPoint)) {
						let newPosition = viewer.camera.pickEllipsoid(evt.endPosition);
						if (Cesium.defined(newPosition)) {
							_this.floatingPoint.position.setValue(newPosition);
							_this.activeShapePoints.pop();
							_this.activeShapePoints.push(newPosition);

							let len = _this.activeShapePoints.length;
							let distance = _this.calcJuli(_this.activeShapePoints[len - 2], _this.activeShapePoints[len - 1]);
							_this.distanceTotal = Number(_this.calcJuliTotal() + distance).toFixed(1);

							let dom = document.getElementById('juTip');
							let dom2 = document.getElementById('cesiumContainer');
							let x = dom2.clientWidth - evt.endPosition.x <= 150 ? -150 : 10;
							let y = dom2.clientHeight - evt.endPosition.y <= 70 ? -70 : 0;
							dom.style.left = evt.endPosition.x + x + 'px';
							dom.style.top = evt.endPosition.y + y + 'px';
							// _this.juTipShow = true;
						}
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

				handler.setInputAction(function(evt) {
					let earthPosition = viewer.camera.pickEllipsoid(evt.position);
					if (Cesium.defined(earthPosition)) {
						if (_this.activeShapePoints.length === 0) {
							return;
						}
						handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
						handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
						handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
						viewer.entities.remove(_this.floatingPoint);

						// _this.juTipShow = false;

						let len = _this.activeShapePoints.length;
						let distance = _this.calcJuli(_this.activeShapePoints[len - 2], _this.activeShapePoints[len - 1]);
						_this.distanceArr.push(distance);
						_this.addPoint(earthPosition, "总长：" + _this.calcJuliTotal() + "公里");
					}
				}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
			},

			// 计算两点之间的距离
			calcJuli(firstPoint, secondPoint) {
				let distance = Cesium.Cartesian3.distance(firstPoint, secondPoint);
				let dist = Number((distance / 1000.0).toFixed(1));
				return dist;
			},

			// 计算线段的总距离
			calcJuliTotal() {
				let distanceTotal = 0;
				for (let i = 0, len = this.distanceArr.length; i < len; i++) {
					distanceTotal += this.distanceArr[i];
				}
				return Number(distanceTotal.toFixed(1));
			},

			//创建点
			createPoint(worldPosition) {
				let point = viewer.entities.add({
					position: worldPosition,
					point: {
						pixelSize: 5,
						color: Cesium.Color.RED,
						outlineColor: Cesium.Color.WHITE,
						outlineWidth: 2,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
					}
				});
				return point;
			},
			addPoint(cartesian3, text) {
				let entity = viewer.entities.add({
					position: cartesian3,
					point: {
						pixelSize: 5,
						color: Cesium.Color.RED,
						outlineColor: Cesium.Color.WHITE,
						outlineWidth: 2,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
					},
					label: {
						text: text,
						font: '18px sans-serif',
						fillColor: Cesium.Color.GOLD,
						style: Cesium.LabelStyle.FILL_AND_OUTLINE,
						outlineWidth: 2,
						verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
						pixelOffset: new Cesium.Cartesian2(0, -20)
					}
				});
				this.pointEntityIds.push(entity.id);
			},
			addPoint2(cartesian3, text) {
				let entity = viewer.entities.add({
					position: cartesian3,
					label: {
						text: text,
						font: '18px sans-serif',
						fillColor: Cesium.Color.GOLD
					}
				});
				return entity;
			},
			addPolyline(positions) {
				let entity = viewer.entities.add({
					polyline: {
						positions: positions,
						material: Cesium.Color.RED,
						width: 3,
						clampToGround: true
					}
				});
				return entity;
			},

			// 清除测距结果
			juClear() {
				for (let i = 0, len = this.pointEntityIds.length; i < len; i++) {
					viewer.entities.removeById(this.pointEntityIds[i]);
				}
				this.pointEntityIds = [];

				if (this.activeShape) {
					viewer.entities.remove(this.activeShape);
				}
				this.activeShape = null;

				this.distanceArr = [];
				this.distanceTotal = 0;
				this.floatingPoint = null;
				this.activeShapePoints = [];
			},

			// 测量面积
			ceMian() {
				let _this = this;
				this.mianClear();
				let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				handler.setInputAction(function(evt) {
					let earthPosition = viewer.camera.pickEllipsoid(evt.position);
					if (Cesium.defined(earthPosition)) {
						if (_this.activeShapePoints2.length === 0) {
							_this.floatingPoint2 = _this.createPoint(earthPosition);
							_this.activeShapePoints2.push(earthPosition);
							let dynamicPositions = new Cesium.CallbackProperty(function() {
								return new Cesium.PolygonHierarchy(_this.activeShapePoints2);
							}, false);
							_this.activeShape2 = _this.addPolygon(dynamicPositions);
						}
						let entity = _this.createPoint(earthPosition);
						_this.mianPointIds.push(entity.id);
						_this.activeShapePoints2.push(earthPosition);

						let cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
						let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
						let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
						let heightString = cartographic.height;
						_this.mianAreaPosition.push({
							lon: longitudeString,
							lat: latitudeString,
							hei: heightString
						});
					}
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

				handler.setInputAction(function(evt) {
					if (Cesium.defined(_this.floatingPoint2)) {
						let newPosition = viewer.camera.pickEllipsoid(evt.endPosition);
						if (Cesium.defined(newPosition)) {
							_this.floatingPoint2.position.setValue(newPosition);
							_this.activeShapePoints2.pop();
							_this.activeShapePoints2.push(newPosition);
						}
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

				handler.setInputAction(function(evt) {
					let earthPosition = viewer.camera.pickEllipsoid(evt.position);
					if (Cesium.defined(earthPosition)) {
						if (_this.activeShapePoints2.length === 0) {
							return;
						}
						handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
						handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
						handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
						viewer.entities.remove(_this.floatingPoint2);

						_this.activeShapePoints2.push(earthPosition);
						let entity = _this.createPoint(earthPosition);
						_this.mianPointIds.push(entity.id);

						let cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
						let longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
						let latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
						let heightString = cartographic.height;
						_this.mianAreaPosition.push({
							lon: longitudeString,
							lat: latitudeString,
							hei: heightString
						});

						let area = _this.getArea(_this.mianAreaPosition);
						let centerPoint = _this.getCenterOfGravityPoint(_this.activeShape2);
						_this.mianAreaResultEntity = _this.addPoint2(centerPoint, area + "平方公里");
					}
				}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
			},
			addPolygon(positions) {
				let entity = viewer.entities.add({
					polygon: {
						hierarchy: positions,
						material: Cesium.Color.RED.withAlpha(0.3),
						outline: true,
						outlineColor: Cesium.Color.YELLOW,
						outlineWidth: 2.0
					}
				});
				return entity;
			},
			//计算多边形面积
			getArea(points) {
				let res = 0;
				//拆分三角曲面
				for (let i = 0; i < points.length - 2; i++) {
					let j = (i + 1) % points.length;
					let k = (i + 2) % points.length;
					let totalAngle = this.Angle(points[i], points[j], points[k]);
					let dis_temp1 = this.distance(this.activeShapePoints2[i], this.activeShapePoints2[j]);
					let dis_temp2 = this.distance(this.activeShapePoints2[j], this.activeShapePoints2[k]);
					res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle));
				}
				return (res / 1000000.0).toFixed(2);
			},

			/*角度*/
			Angle(p1, p2, p3) {
				let bearing21 = this.Bearing(p2, p1);
				let bearing23 = this.Bearing(p2, p3);
				let angle = bearing21 - bearing23;
				if (angle < 0) {
					angle += 360;
				}
				return angle;
			},
			/*方向*/
			Bearing(from, to) {
				let radiansPerDegree = Math.PI / 180.0; //角度转化为弧度(rad)
				let degreesPerRadian = 180.0 / Math.PI; //弧度转化为角度
				let lat1 = from.lat * radiansPerDegree;
				let lon1 = from.lon * radiansPerDegree;
				let lat2 = to.lat * radiansPerDegree;
				let lon2 = to.lon * radiansPerDegree;
				let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) *
					Math.cos(lat2) * Math.cos(lon1 - lon2));
				if (angle < 0) {
					angle += Math.PI * 2.0;
				}
				angle = angle * degreesPerRadian; //角度
				return angle;
			},
			distance(point1, point2) {
				let point1cartographic = Cesium.Cartographic.fromCartesian(point1);
				let point2cartographic = Cesium.Cartographic.fromCartesian(point2);
				/**根据经纬度计算出距离**/
				let geodesic = new Cesium.EllipsoidGeodesic();
				geodesic.setEndPoints(point1cartographic, point2cartographic);
				let s = geodesic.surfaceDistance;
				//console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
				//返回两点之间的距离
				s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
				return s;
			},
			getCenterOfGravityPoint(entity) {
				let polygon_xSum = 0;
				let polygon_ySum = 0;
				let polygon_zSum = 0;
				let polygonPositions = entity.polygon.hierarchy.getValue().positions;
				let polygon_pNum = polygonPositions.length;
				for (let i = 0, len = polygon_pNum; i < len; i++) {
					polygon_xSum += polygonPositions[i].x;
					polygon_ySum += polygonPositions[i].y;
					polygon_zSum += polygonPositions[i].z;
				}
				let centerPosition = new Cesium.Cartesian3(polygon_xSum / polygon_pNum, polygon_ySum / polygon_pNum, polygon_zSum /
					polygon_pNum);
				return centerPosition;
			},

			// 清除面
			mianClear() {
				for (let i = 0, len = this.mianPointIds.length; i < len; i++) {
					viewer.entities.removeById(this.mianPointIds[i]);
				}
				this.mianPointIds = [];

				if (this.mianAreaResultEntity) {
					viewer.entities.remove(this.mianAreaResultEntity);
				}
				this.mianAreaResultEntity = null;

				if (this.activeShape2) {
					viewer.entities.remove(this.activeShape2);
				}
				this.activeShape2 = null;

				this.floatingPoint2 = null;
				this.activeShapePoints2 = [];
				this.mianAreaPosition = [];
			},
			
			// 清除
			clearAll(){
				this.juClear();
				this.mianClear();
			},
			// 关闭div
			closeDiv() {
				Bus.$emit("MapMeasureComp-CloseComp");
			}
		},
		beforeDestroy() {
			this.clearAll();
		}
	}
</script>

<style scoped="true">
	#mapMeasureCompId{}

	#juTip {
		position: absolute;
		z-index: 100;
		padding: 5px;
		border: 1px solid #000000;
		background-color: #ffffff;
		user-select: none;
	}
</style>
