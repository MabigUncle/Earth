<template>
	<div id="profileId">
		<div class="tools">
		    <el-button @click="drawLine" type="primary" size="mini">绘制剖面</el-button>
		    <el-button @click="clear" type="primary" size="mini">清除</el-button>
		</div>
		<div id="echarts" v-show="echartsShow"></div>
	</div>
</template>

<script>
	export default {
		name: 'ProfileComp',
		data(){
			return{
				terrainProvider: null,
				finalEntity: null,
				floatingPoint: null,
				activeShapePoints: [],
				activeShape: null,
				echartsShow: false,
			}
		},
		mounted(){
			this.addTerrain();
		},
		methods:{
			addTerrain(){
				this.terrainProvider = new Cesium.CesiumTerrainProvider({
				    url: window.GlobalConfig.BASE_TERRAIN_URL
				});
				// viewer.terrainProvider = this.terrainProvider;
				// viewer.scene.globe.depthTestAgainstTerrain = true;
			},
			
			drawLine(){
			    let _this = this;
			    let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
			    handler.setInputAction(function(event) {
			        let earthPosition = viewer.scene.pickPosition(event.position);
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
			                _this.profileAnalyse();
			            }
			        }
			    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			
			    handler.setInputAction(function(event) {
			        if (Cesium.defined(_this.floatingPoint)) {
			             let newPosition = viewer.scene.pickPosition(event.endPosition);
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
			
			clear(){
			    if(this.finalEntity){
			        viewer.entities.remove(this.finalEntity);
			        this.finalEntity = null;
			    }
			    this.activeShapePoints = [];
			    this.echartsShow = false;
			},
			
			profileAnalyse(){
			    let _this = this;
			    let count = 100;
			    let start = this.activeShapePoints[0];
			    let end = this.activeShapePoints[1];
			    let positions = [Cesium.Cartographic.fromCartesian(start)];
			    for (let i = 1; i < count; i++) {
			        let cart = Cesium.Cartesian3.lerp(start, end, i / count, new Cesium.Cartesian3());
			        positions.push(Cesium.Cartographic.fromCartesian(cart));
			    }
			    positions.push(Cesium.Cartographic.fromCartesian(end));
			
			    // 异步使用最精确的地形采样获取地形高度
			    let promise = Cesium.sampleTerrainMostDetailed(this.terrainProvider, positions);
			    Cesium.when(promise, function (updatedPositions) {
			        let height = [];
			        for (let i = 0; i < updatedPositions.length; i++) {
			            height.push(updatedPositions[i].height);
			        }
			        _this.initChart(height);
			        _this.echartsShow = true;
			    });
			},
			
			initChart(height) {
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
			            trigger: 'axis',
			            axisPointer: {
			                type: 'cross',
			                label: {
			                    backgroundColor: '#6a7985'
			                }
			            }
			        },
			        /* legend: {
			            top: '15',
			            right: '50',
			            textStyle:{
			                color: '#ffffff'
			            },
			            data: ['高程剖面图']
			        }, */
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
			                name: '高程剖面图',
			                type: 'line',
			                stack: '总量',
			                label: {
			                    show: true,
			                    position: 'top'
			                },
			                data: height
			            }
			        ]
			    };
			    myChart.setOption(option);
			},
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
