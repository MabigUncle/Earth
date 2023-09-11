<!-- 淹没分析 -->
<template>
	<div id="floodId">
		<el-input v-model="floodHeight" placeholder="高程"></el-input>
		<el-button @click="drawPolygon" size="mini">绘制范围</el-button>
		<el-button @click="startFx" size="mini">淹没分析</el-button>
		<el-button @click="clear" size="mini">清除</el-button>
	</div>
</template>

<script>
	export default {
		name: 'FloodComp',
		data() {
			return {
				floodHeight: 0,
				activeShapePoints: [],
				activeShape: null,
				floatingPoint: null,
				finalEntity: null,
				floodEntity: null,
				timer: null,
			}
		},
		mounted() {
			// this.addTerrain();
		},
		methods: {
			addTerrain() {
				this.terrainProvider = new Cesium.CesiumTerrainProvider({
					url: window.GlobalConfig.BASE_TERRAIN_URL
				});
				viewer.terrainProvider = this.terrainProvider;
				viewer.scene.globe.depthTestAgainstTerrain = true;
			},
			// 淹没分析
			startFx() {
				let _this = this;
				this.clearResult();
				let waterHeight = 0;
				this.floodEntity = viewer.entities.add({
					polygon: {
						// hierarchy: this.activeShapePoints,
						hierarchy: _this.activeShapePoints,
						fill: true,
						material: Cesium.Color.RED.withAlpha(0.5),
						perPositionHeight: true,
						extrudedHeight: new Cesium.CallbackProperty(function(time) {
							return waterHeight;
						}, false)
					}
				});
				this.timer = setInterval(() => {
					waterHeight += 10;

					let a = [];
					let len = this.floodEntity.polygon.hierarchy.getValue().positions.length;
					for (let i = 0; i < len; i++) {
						let r = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.floodEntity.polygon.hierarchy.getValue().positions[i]);
						let o = {
							lon: Cesium.Math.toDegrees(r.longitude),
							lat: Cesium.Math.toDegrees(r.latitude),
							hgt: waterHeight
						};
						let s = [o.lon, o.lat, o.hgt];
						a = a.concat(s)
					}
					this.floodEntity.polygon.hierarchy = new Cesium.CallbackProperty(function(e) {
						return Cesium.Cartesian3.fromDegreesArrayHeights(a);
					}, false);

					if (waterHeight >= this.floodHeight) {
						//当水的高度大于或等于最大指定的高度时，清除定时器
						clearInterval(this.timer);
					}
				}, 100);
			},

			drawPolygon() {
				let _this = this;
				let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
				handler.setInputAction(function(event) {
					if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
						console.log('This browser does not support polylgons on terrain.');
						return;
					}
					// let earthPosition = viewer.camera.pickEllipsoid(event.position);
					//在地形上绘制时
					let earthPosition = viewer.scene.pickPosition(event.position);
					if (Cesium.defined(earthPosition)) {
						if (_this.activeShapePoints.length === 0) {
							_this.floatingPoint = _this.createPoint(earthPosition);
							_this.activeShapePoints.push(earthPosition);
							let dynamicPositions = new Cesium.CallbackProperty(function() {
								return new Cesium.PolygonHierarchy(_this.activeShapePoints)
							}, false);
							_this.activeShape = _this.createPolygon(dynamicPositions);
						}
						_this.activeShapePoints.push(earthPosition);
						// _this.createPoint(earthPosition);
					}
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

				handler.setInputAction(function(event) {
					if (Cesium.defined(_this.floatingPoint)) {
						// let newPosition = viewer.camera.pickEllipsoid(event.endPosition);
						//在地形上绘制时
						let newPosition = viewer.scene.pickPosition(event.endPosition);
						if (Cesium.defined(newPosition)) {
							_this.floatingPoint.position.setValue(newPosition);
							_this.activeShapePoints.pop();
							_this.activeShapePoints.push(newPosition);
						}
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

				handler.setInputAction(function(event) {
					_this.terminatePolygon();
					handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
					handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
					handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
				}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
			},


			//创建点
			createPoint(worldPosition) {
				let point = viewer.entities.add({
					position: worldPosition,
					point: {
						color: Cesium.Color.WHITE,
						pixelSize: 5,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
					}
				});
				return point;
			},

			//创建面
			createPolygon(positionData) {
				let shape = viewer.entities.add({
					polygon: {
						hierarchy: positionData,
						fill: true,
						material: Cesium.Color.YELLOW.withAlpha(0.3),
						/* outline: true,
						outlineWidth: 2,
						outlineColor: Cesium.Color.YELLOW, */
						// heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
					}
				});
				return shape;
			},

			//鼠标右击结束绘制
			terminatePolygon() {
				this.activeShapePoints.pop();
				this.finalEntity = this.createPolygon(this.activeShapePoints);
				viewer.entities.remove(this.floatingPoint);
				viewer.entities.remove(this.activeShape);
				this.floatingPoint = undefined;
				this.activeShape = undefined;
				// this.activeShapePoints = [];
			},

			computePolygonHeightRange(e) {
				var t = []
				for (var i = 0; i < e.length; i++) t.push(e[i].clone());
				var a, n, r, o, s, u, l, h = 0,
					g = 9999,
					c = Math.PI / Math.pow(2, 11) / 64,
					m = new Cesium.PolygonGeometry.fromPositions({
						positions: t,
						vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
						granularity: c
					}),
					d = new Cesium.PolygonGeometry.createGeometry(m);
				for (i = 0; i < d.indices.length; i += 3) a = d.indices[i],
					n = d.indices[i + 1],
					r = d.indices[i + 2],
					l = new Cesium.Cartesian3(d.attributes.position.values[3 * a], d.attributes.position.values[3 * a + 1], d.attributes
						.position.values[3 * a + 2]),
					(o = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = o),
					h < o && (h = o),
					l = new Cesium.Cartesian3(d.attributes.position.values[3 * n], d.attributes.position.values[3 * n + 1], d.attributes
						.position.values[3 * n + 2]),
					(s = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = s),
					h < s && (h = s),
					l = new Cesium.Cartesian3(d.attributes.position.values[3 * r], d.attributes.position.values[3 * r + 1], d.attributes
						.position.values[3 * r + 2]),
					(u = viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(l))) < g && (g = u),
					h < u && (h = u);
				return {
					maxHeight: h,
					minHeight: g
				}
			},

			clearResult() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
				if (this.finalEntity) {
					viewer.entities.remove(this.finalEntity);
					this.finalEntity = null;
				}
				if (this.floodEntity) {
					viewer.entities.remove(this.floodEntity);
					this.floodEntity = null;
				}
				viewer.entities.remove(this.floatingPoint);
				viewer.entities.remove(this.activeShape);
				this.floatingPoint = undefined;
				this.activeShape = undefined;
			},
			clear() {
				this.clearResult();
				this.activeShapePoints = [];
			}
		},
		beforeDestroy() {
			this.clear();
		}
	}
</script>

<style scoped="true">

</style>
