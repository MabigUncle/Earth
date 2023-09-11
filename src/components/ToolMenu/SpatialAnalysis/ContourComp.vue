<!-- 等高线 -->
<template>
	<div id="contourId">
		<div class="tools">
		    <el-button @click="drawRect" type="primary" size="mini">绘制区域</el-button>
			<el-button @click="analy" type="primary" size="mini">分析</el-button>
		    <el-button @click="clear" type="primary" size="mini">清除</el-button>
		</div>
	</div>
</template>

<script>
	import {calcContourApi} from '@/api/SpatialAnalysisApi.js'
	export default{
		name:'ContourComp',
		data(){
			return{
				layer: null,
				
				activeShapePoints: [],
				activeShape: undefined,
				floatingPoint: undefined,
				finalEntity: undefined,
			}
		},
		methods:{
			drawRect(){
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
				            let dynamicPositions = new Cesium.CallbackProperty(function () {
				                return Cesium.Rectangle.fromCartesianArray(_this.activeShapePoints);
				            }, false);
				            _this.activeShape = _this.createRectangle(dynamicPositions);
				            _this.activeShapePoints.push(earthPosition);
				            // _this.createPoint(earthPosition);
				        }else{
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
			        position : worldPosition,
			        point : {
			            color : Cesium.Color.WHITE,
			            pixelSize : 5,
			            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
			        }
			    });
			    return point;
			},
			
			//创建矩形
			createRectangle(positionData) {
			    let shape = viewer.entities.add({
			        rectangle : {
			            coordinates : positionData,
			            fill: true,
			            material : Cesium.Color.RED.withAlpha(0.3),
			            outline : true,
			            outlineWidth: 1,
			            outlineColor: Cesium.Color.RED,
			            height:0
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
			
			analy(){
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
				calcContourApi(minLon, minLat, maxLon, maxLat).then((response)=>{
					if(response.data.status === "success"){
						this.$message({
							message: '等高线生成成功！',
							type: 'success'
						});
						let workspace = response.data.result.workspace;
						let datastore = response.data.result.datastore;
						let layername = response.data.result.layername;
						let contourShpPath = response.data.result.contourShpPath;
						let provider = new Cesium.WebMapServiceImageryProvider({
							url: window.GlobalConfig.Geoserver_SERVER_URL+`/${workspace}/wms`,
							layers: workspace+":"+datastore,
							srs: "EPSG:4326",
							parameters:{
								styles: workspace+":contour",
								format: "image/png",
								transparent: true
							}
						});
						this.layer = new Cesium.ImageryLayer(provider);
						viewer.imageryLayers.add(this.layer);
					}
				})
			},
			clear(){
				if(this.layer){
					viewer.imageryLayers.remove(this.layer);
					this.layer = null;
				}
				viewer.entities.remove(this.finalEntity);
				this.finalEntity = null;
				this.activeShapePoints = [];
			}
		}
	}
</script>

<style>
</style>
