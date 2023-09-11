<!-- 坡度坡向分析 -->
<template>
	<div>
		<div class="tools">
			<el-button @click="drawRect" type="primary" size="mini">绘制区域</el-button>
			<el-button @click="analy" type="primary" size="mini">分析</el-button>
			<el-button @click="clear" type="primary" size="mini">清除</el-button>
		</div>
		<div class="result">
			<div class="slope-class">
				<div>坡度图例</div>
				<div>
					<span>80°-90°：</span>
					<span class="legend-item" style="background-color: #ff0000;"></span>
				</div>
				<div>
					<span>70°-80°：</span>
					<span class="legend-item" style="background-color: #ff6600;"></span>
				</div>
				<div>
					<span>60°-70°：</span>
					<span class="legend-item" style="background-color: #ff9900;"></span>
				</div>
				<div>
					<span>50°-60°：</span>
					<span class="legend-item" style="background-color: #ffff00;"></span>
				</div>
				<div>
					<span>40°-50°：</span>
					<span class="legend-item" style="background-color: #eeee11;"></span>
				</div>
				<div>
					<span>30°-40°：</span>
					<span class="legend-item" style="background-color: #cccc33;"></span>
				</div>
				<div>
					<span>20°-30°：</span>
					<span class="legend-item" style="background-color: #ccff00;"></span>
				</div>
				<div>
					<span>10°-20°：</span>
					<span class="legend-item" style="background-color: #99ff00;"></span>
				</div>
				<div>
					<span>00°-10°：</span>
					<span class="legend-item" style="background-color: #00ff00;"></span>
				</div>
			</div>
			<div class="aspect-class">
				<div>坡向图例</div>
				<div>(正东方向为0°，逆时针旋转)</div>
				<div>
					<span>285°-345°：</span>
					<img src="image/SlopeAspect/es.png" class="aspect-img-class"/>
				</div>
				<div>
					<span>255°-285°：</span>
					<img src="image/SlopeAspect/s.png" class="aspect-img-class"/>
				</div>
				<div>
					<span>195°-255°：</span>
					<img src="image/SlopeAspect/ws.png" class="aspect-img-class"/>
				</div>
				<div>
					<span>165°-195°：</span>
					<img src="image/SlopeAspect/w.png" class="aspect-img-class"/>
				</div>
				<div>
					<span>105°-165°：</span>
					<img src="image/SlopeAspect/wn.png" class="aspect-img-class"/>
				</div>
				<div>
					<span> 75°-105°：</span>
					<img src="image/SlopeAspect/n.png" class="aspect-img-class"/>
				</div>
				<div>
					<span> 15°-75°：</span>
					<img src="image/SlopeAspect/en.png" class="aspect-img-class"/>
				</div>
				<div>
					<span>345°-15°：</span>
					<img src="image/SlopeAspect/e.png" class="aspect-img-class"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		calcSlopeAspectApi
	} from '@/api/SpatialAnalysisApi.js'
	export default {
		name: 'SlopeAspectComp',
		data() {
			return {
				activeShapePoints: [],
				activeShape: undefined,
				floatingPoint: undefined,
				finalEntity: undefined,

				cutFillPrimitive: null,
				primitiveArr: null
			}
		},
		methods: {
			drawRect() {
				let _this = this;
				let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
				handler.setInputAction(function(event) {
					if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
						console.log('This browser does not support polylgons on terrain.');
						return;
					}
					let earthPosition = viewer.camera.pickEllipsoid(event.position);
					//在地形上绘制时
					// let earthPosition = viewer.scene.pickPosition(event.position);
					if (Cesium.defined(earthPosition)) {
						if (_this.activeShapePoints.length === 0) {
							_this.floatingPoint = _this.createPoint(earthPosition);
							_this.activeShapePoints.push(earthPosition);
							let dynamicPositions = new Cesium.CallbackProperty(function() {
								return Cesium.Rectangle.fromCartesianArray(_this.activeShapePoints);
							}, false);
							_this.activeShape = _this.createRectangle(dynamicPositions);
							_this.activeShapePoints.push(earthPosition);
							// _this.createPoint(earthPosition);
						} else {
							// _this.createPoint(earthPosition);
							_this.activeShapePoints.push(earthPosition);
							_this.terminateRectangle();
							handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
							handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
						}
					}
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

				handler.setInputAction(function(event) {
					if (Cesium.defined(_this.floatingPoint)) {
						let newPosition = viewer.camera.pickEllipsoid(event.endPosition);
						//在地形上绘制时
						// let newPosition = viewer.scene.pickPosition(event.endPosition);
						if (Cesium.defined(newPosition)) {
							_this.floatingPoint.position.setValue(newPosition);
							_this.activeShapePoints.pop();
							_this.activeShapePoints.push(newPosition);
						}
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
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

			//创建矩形
			createRectangle(positionData) {
				let shape = viewer.entities.add({
					rectangle: {
						coordinates: positionData,
						fill: true,
						material: Cesium.Color.RED.withAlpha(0.3),
						outline: true,
						outlineWidth: 1,
						outlineColor: Cesium.Color.RED,
						height: 0
					}
				});
				return shape;
			},

			//鼠标右击结束绘制
			terminateRectangle() {
				this.activeShapePoints.pop();
				this.finalEntity = this.createRectangle(Cesium.Rectangle.fromCartesianArray(this.activeShapePoints));
				viewer.entities.remove(this.floatingPoint);
				viewer.entities.remove(this.activeShape);
				this.floatingPoint = undefined;
				this.activeShape = undefined;
				// this.activeShapePoints = [];
			},

			analy() {
				viewer.entities.remove(this.finalEntity);
				let cartographic1 = Cesium.Cartographic.fromCartesian(this.activeShapePoints[0]);
				let cartographic2 = Cesium.Cartographic.fromCartesian(this.activeShapePoints[1]);
				let lon1 = Cesium.Math.toDegrees(cartographic1.longitude);
				let lat1 = Cesium.Math.toDegrees(cartographic1.latitude);
				let lon2 = Cesium.Math.toDegrees(cartographic2.longitude);
				let lat2 = Cesium.Math.toDegrees(cartographic2.latitude);
				let minLon = lon1 <= lon2 ? lon1 : lon2;
				let minLat = lat1 <= lat2 ? lat1 : lat2;
				let maxLon = lon1 >= lon2 ? lon1 : lon2;
				let maxLat = lat1 >= lat2 ? lat1 : lat2;
				calcSlopeAspectApi(minLon, minLat, maxLon, maxLat).then((response) => {
					if (response.data.status === "success") {
						this.$message({
							message: '坡度坡向计算成功！',
							type: 'success'
						});
						let result = response.data.result;
						let aspectTiffPath = result.aspectTiffPath;
						console.log("aspectTiffPath:" + aspectTiffPath);
						let slopeTiffPath = result.slopeTiffPath;
						console.log("slopeTiffPath:" + slopeTiffPath);
						let grid = result.grid;
						// 坡度可视化
						let pointPositionArr = [];
						let pointColorArr = [];
						for (let i = 0; i < grid.length; i++) {
							let slope = grid[i].slope;
							let lonlatArr = grid[i].lonlatGrid;
							let p1 = Cesium.Cartesian3.fromDegrees(lonlatArr[0], lonlatArr[3], 0);
							pointPositionArr.push(p1.x, p1.y, p1.z);
							let p2 = Cesium.Cartesian3.fromDegrees(lonlatArr[0], lonlatArr[1], 0);
							pointPositionArr.push(p2.x, p2.y, p2.z);
							let p3 = Cesium.Cartesian3.fromDegrees(lonlatArr[2], lonlatArr[1], 0);
							pointPositionArr.push(p3.x, p3.y, p3.z);
							let p4 = Cesium.Cartesian3.fromDegrees(lonlatArr[2], lonlatArr[3], 0);
							pointPositionArr.push(p4.x, p4.y, p4.z);
							let color = this.calcColor(slope);
							pointColorArr.push(color.r, color.g, color.b, 0.5);
							pointColorArr.push(color.r, color.g, color.b, 0.5);
							pointColorArr.push(color.r, color.g, color.b, 0.5);
							pointColorArr.push(color.r, color.g, color.b, 0.5);
						}
						this.cutFillPrimitive = Cesium.PrimitiveUtil.addPrimitiveRect(viewer, pointPositionArr, 3, pointColorArr, 4);
						
						// 坡向可视化
						let pointPositionArr2 = [];
						let imageArr = [];
						for (let i = 0; i < grid.length; i++) {
							let aspect = grid[i].aspect;
							let lonlatArr = grid[i].lonlatGrid;
							let image = this.calcImage(aspect);
							let p1 = Cesium.Cartesian3.fromDegrees(lonlatArr[0], lonlatArr[3], 0);
							pointPositionArr2.push(p1.x, p1.y, p1.z);
							let p2 = Cesium.Cartesian3.fromDegrees(lonlatArr[0], lonlatArr[1], 0);
							pointPositionArr2.push(p2.x, p2.y, p2.z);
							let p3 = Cesium.Cartesian3.fromDegrees(lonlatArr[2], lonlatArr[3], 0);
							pointPositionArr2.push(p3.x, p3.y, p3.z);
							let p4 = Cesium.Cartesian3.fromDegrees(lonlatArr[2], lonlatArr[1], 0);
							pointPositionArr2.push(p4.x, p4.y, p4.z);
							imageArr.push(image);
						}
						this.primitiveArr = Cesium.addPrimitiveRectTexture(viewer, pointPositionArr2, 3, imageArr);
						
						// 下面的代码有问题
						/* let pointPositionArr2 = [];
						let angleArr = [];
						for (let i = 0; i < grid.length; i++) {
							let aspect = grid[i].aspect;
							let lonlatArr = grid[i].lonlatGrid;
							let p1 = Cesium.Cartesian3.fromDegrees(lonlatArr[0], lonlatArr[3], 0);
							pointPositionArr2.push(p1.x, p1.y, p1.z);
							let p2 = Cesium.Cartesian3.fromDegrees(lonlatArr[0], lonlatArr[1], 0);
							pointPositionArr2.push(p2.x, p2.y, p2.z);
							let p3 = Cesium.Cartesian3.fromDegrees(lonlatArr[2], lonlatArr[3], 0);
							pointPositionArr2.push(p3.x, p3.y, p3.z);
							let p4 = Cesium.Cartesian3.fromDegrees(lonlatArr[2], lonlatArr[1], 0);
							pointPositionArr2.push(p4.x, p4.y, p4.z);
							angleArr.push(aspect);
						}
						this.primitiveArr = Cesium.addPrimitiveRectTexture2(viewer, pointPositionArr2, 3, angleArr, 'image/SlopeAspect/e.png'); */
					}
				})
			},
			// 坡度转颜色
			calcColor(slope) {
				if (slope >= 80) {
					return {
						r: 1.0,
						g: 0,
						b: 0
					}; // #ff0000
				} else if (slope >= 70) {
					return {
						r: 1.0,
						g: 0.4,
						b: 0
					}; // #ff6600
				} else if (slope >= 60) {
					return {
						r: 1.0,
						g: 0.6,
						b: 0
					}; // #ff9900
				} else if (slope >= 50) {
					return {
						r: 1.0,
						g: 1.0,
						b: 0
					}; // #ffff00
				} else if (slope >= 40) {
					return {
						r: 0.9,
						g: 0.9,
						b: 0.07
					}; // #eeee11
				} else if (slope >= 30) {
					return {
						r: 0.8,
						g: 0.8,
						b: 0.2
					}; // #cccc33
				} else if (slope >= 20) {
					return {
						r: 0.8,
						g: 1.0,
						b: 0
					}; // #ccff00
				} else if (slope >= 10) {
					return {
						r: 0.6,
						g: 1.0,
						b: 0
					}; // #99ff00
				} else {
					return {
						r: 0,
						g: 1.0,
						b: 0
					}; // #00ff00
				}
			},
			// 坡向转图标
			calcImage(aspect) {
				if (aspect < 15 || aspect >= 345) {
					return "image/SlopeAspect/e.png";
				}
				if (aspect >= 15 && aspect < 75) {
					return "image/SlopeAspect/en.png";
				}
				if (aspect >= 75 && aspect < 105) {
					return "image/SlopeAspect/n.png";
				}
				if (aspect >= 105 && aspect < 165) {
					return "image/SlopeAspect/wn.png";
				}
				if (aspect >= 165 && aspect < 195) {
					return "image/SlopeAspect/w.png";
				}
				if (aspect >= 195 && aspect < 255) {
					return "image/SlopeAspect/ws.png";
				}
				if (aspect >= 255 && aspect < 285) {
					return "image/SlopeAspect/s.png";
				}
				if (aspect >= 285 && aspect < 345) {
					return "image/SlopeAspect/es.png";
				}
			},
			clear() {
				viewer.entities.remove(this.finalEntity);
				this.finalEntity = null;
				this.activeShapePoints = [];
				viewer.scene.primitives.remove(this.cutFillPrimitive);
				this.cutFillPrimitive = null;
				for (let i = 0; i < this.primitiveArr.length; i++) {
					viewer.scene.primitives.remove(this.primitiveArr[i]);
				}
				this.primitiveArr = null;
			}
		}
	}
</script>

<style scoped="true">
	.legend-item {
		width: 16px;
		height: 16px;
		display: inline-block;
	}

	.result {
		position: relative;
	}

	.aspect-class {
		position: absolute;
		left: 35%;
		top: 0;
	}

	.aspect-img-class {
		width: 16px;
		height: 16px;
	}
</style>
