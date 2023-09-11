<template>
	<div id="profileId">
		<div class="tools">
		    <el-button @click="drawLine" type="primary" size="mini">绘制剖面</el-button>
			<el-button @click="profileAnalyse" type="primary" size="mini">分析</el-button>
		    <el-button @click="clear" type="primary" size="mini">清除</el-button>
		</div>
		<div id="echarts" v-show="echartsShow"></div>
	</div>
</template>

<script>
	import {calcProfileApi} from '@/api/SpatialAnalysisApi.js'
	export default {
		name: 'ProfileComp',
		data(){
			return{
				finalEntity: null,
				floatingPoint: null,
				activeShapePoints: [],
				activeShape: null,
				echartsShow: false,
			}
		},
		methods:{
			drawLine(){
			    let _this = this;
			    let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
			    handler.setInputAction(function(event) {
			        let earthPosition = viewer.camera.pickEllipsoid(event.position);
			        if (Cesium.defined(earthPosition)) {
			            if (_this.activeShapePoints.length === 0) {
			                _this.floatingPoint = _this.createPoint(earthPosition);
			                _this.activeShapePoints.push(earthPosition);
			                let dynamicPositions = new Cesium.CallbackProperty(function () {
			                    return _this.activeShapePoints;
			                }, false);
			                _this.activeShape = _this.createPolyline(dynamicPositions);
			                _this.activeShapePoints.push(earthPosition);
			            }else{
			                _this.finalEntity = _this.createPolyline(_this.activeShapePoints);
			                viewer.entities.remove(_this.floatingPoint);
			                viewer.entities.remove(_this.activeShape);
			                _this.floatingPoint = null;
			                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
			                handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
			            }
			        }
			    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			
			    handler.setInputAction(function(event) {
			        if (Cesium.defined(_this.floatingPoint)) {
			             let newPosition = viewer.camera.pickEllipsoid(event.endPosition);
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
			            color : Cesium.Color.RED,
			            pixelSize : 8,
			            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
			        }
			    });
			    return point;
			},
			//创建线
			createPolyline(positionData) {
			    let shape = viewer.entities.add({
			        polyline : {
			            positions : positionData,
			            material : Cesium.Color.RED,
			            width: 3,
			            clampToGround: true
			        }
			    });
			    return shape;
			},
			
			// 剖面分析
			profileAnalyse(){
				let cartographic1 = Cesium.Cartographic.fromCartesian(this.activeShapePoints[0]);
				let cartographic2 = Cesium.Cartographic.fromCartesian(this.activeShapePoints[1]);
				let lon1 = Cesium.Math.toDegrees(cartographic1.longitude);
				let lat1 = Cesium.Math.toDegrees(cartographic1.latitude);
				let lon2 = Cesium.Math.toDegrees(cartographic2.longitude);
				let lat2 = Cesium.Math.toDegrees(cartographic2.latitude);
			    calcProfileApi(lon1, lat1, lon2, lat2).then((response)=>{
					if(response.data.status === "success"){
						this.$message({
							message: '剖面计算成功！',
							type: 'success'
						});
						let xAxisData = [];
						let seriesHeightData = [];
						let grid = response.data.result.grid;
						for(let i=0; i<grid.length; i++){
							let lonlat = grid[i].lonlat;
							xAxisData.push(lonlat[0].toFixed(6)+","+lonlat[1].toFixed(6));
							seriesHeightData.push(grid[i].height);
						}
						this.initChart(xAxisData, seriesHeightData);
						this.echartsShow = true;
					}
				})
			},
			
			initChart(xAxisData, seriesHeightData) {
			    let myChart = echarts.init(document.getElementById('echarts'));
			    let option = {
			        title: {
			            text: '高程剖面图',
			            left: 'center',
			            textStyle:{
			                color: '#ffffff'
			            }
			        },
			        tooltip: {
			            trigger: 'axis'
			        },
			        toolbox: {
			            feature: {
			                saveAsImage: {}
			            }
			        },
			        grid: {
			            left: '3%',
			            right: '4%',
			            bottom: '3%',
			            containLabel: true
			        },
			        xAxis: [
			            {
			                type: 'category',
							data: xAxisData,
							show: false,
			                axisLabel:{
			                    color: '#ffffff'
			                }
			            }
			        ],
			        yAxis: [
			            {
			                type: 'value',
			                axisLabel:{
			                    color: '#ffffff'
			                }
			            }
			        ],
			        series: [
			            {
			                name: '高程',
			                type: 'line',
			                data: seriesHeightData
			            }
			        ]
			    };
			    myChart.setOption(option);
			},
			
			clear(){
			    if(this.finalEntity){
			        viewer.entities.remove(this.finalEntity);
			        this.finalEntity = null;
			    }
			    this.activeShapePoints = [];
			    this.echartsShow = false;
			}
		},
		beforeDestroy() {
			this.clear();
		}
	}
</script>

<style scoped="true">
	#echarts{
		position: relative;
		margin-top: 15px;
	    width: 350px;
	    height: 300px;
	    z-index: 100;
	    background-color: #000000aa;
	}
</style>
