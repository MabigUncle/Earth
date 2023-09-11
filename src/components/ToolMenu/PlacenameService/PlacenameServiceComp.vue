<!-- 地名服务组件 -->
<template>
	<div id="spatialAnalysisCompId" class="wrap">
		<div class="wrap-title">
			<span class="wrap-title-text">地名服务</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close" />
		</div>
		<div class="container">
			<el-tabs v-model="activeName" @tab-click="tabClick">
				<el-tab-pane label="地名模糊查询" name="first">
					<el-input placeholder="请输入地名" v-model="keyword" size="mini">
						<el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
					</el-input>
					<div v-show="searchResultShow">
						<div v-for="(item, index) in searchResult" :key="item.gid" class="item">
							<span :title="item.name" @mouseenter="mouseenterItem(item.gid)" @mouseleave="mouseleaveItem(item.gid)">{{index+1}}、{{item.name}}</span>
						</div>
						<el-pagination small @current-change="handleCurrentChange" :page-size="pageSize" :current-page.sync="pageNum"
						 small :pager-count="5" layout="total, prev, pager, next" :total="totalRecord">
						</el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane label="经纬度查询" name="second">
					<div>
						<el-button type="primary" size="mini" @click="drawPoint">在球上选点</el-button>
						<el-button type="primary" size="mini" @click="clearPoint">清除</el-button>
					</div>
					<div v-show="placenameShow" class="placename-info">
						<div>经度：{{placename.lon}}</div>
						<div>纬度：{{placename.lat}}</div>
						<div>地名：{{placename.name}}</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
	<!-- <div id="placenameServiceCompId">
		<div class="header">
			<span>地名服务</span>
			<img src="image/PlacenameService/close.png" @click="closeDiv" class="closeImgClass" />
		</div>
		<div>
			<el-tabs v-model="activeName" @tab-click="tabClick">
				<el-tab-pane label="地名模糊查询" name="first">
					<el-input placeholder="请输入地名" v-model="keyword">
						<el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
					</el-input>
					<div v-show="searchResultShow">
						<div v-for="(item, index) in searchResult" :key="item.gid" class="item">
							<span :title="item.name" @mouseenter="mouseenterItem(item.gid)" @mouseleave="mouseleaveItem(item.gid)">{{index+1}}、{{item.name}}</span>
						</div>
						<el-pagination small @current-change="handleCurrentChange" :page-size="pageSize" :current-page.sync="pageNum"
						 small :pager-count="5" layout="total, prev, pager, next" :total="totalRecord">
						</el-pagination>
					</div>
				</el-tab-pane>
				<el-tab-pane label="经纬度查询" name="second">
					<div>
						<el-button type="primary" size="mini" @click="drawPoint">在球上选点</el-button>
						<el-button type="primary" size="mini" @click="clearPoint">清除</el-button>
					</div>
					<div v-show="placenameShow" class="placename-info">
						<div>经度：{{placename.lon}}</div>
						<div>纬度：{{placename.lat}}</div>
						<div>地名：{{placename.name}}</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div> -->
</template>

<script>
	import {
		seachPlacenameByKeyword,
		searchPlaceameByLnglat
	} from '@/api/PlacenameApi.js'

	export default {
		name: 'PlacenameServiceComp',
		data() {
			return {
				activeName: 'first',
				searchResultShow: false,
				keyword: '',
				searchResult: [],
				totalRecord: 0,
				pageNum: 1,
				pageSize: 15,

				addEntityIds: [],

				handler: null,
				positionEntityId: '',
				placenameShow: false,
				placename: {
					lon: '',
					lat: '',
					name: ''
				}
			}
		},
		methods: {
			// 点击搜索按钮
			searchBtn() {
				this.pageNum = 1;
				this.searchPlacename();
			},
			// 查询数据
			searchPlacename() {
				this.removeEntity();
				seachPlacenameByKeyword(this.keyword, this.pageNum, this.pageSize).then((res) => {
					if (res.status == 200) {
						this.searchResult = res.data.row;
						this.totalRecord = res.data.total;
						this.addEntity(this.searchResult);
						this.searchResultShow = true;
					}
				})
			},
			// 改变页码
			handleCurrentChange(val) {
				this.pageNum = val
				this.searchPlacename();
			},
			// 加载实体点
			addEntity(arr) {
				for (let i = 0, len = arr.length; i < len; i++) {
					let coord = arr[i].coord;
					let lon = Number(coord.substring(coord.indexOf("(") + 1, coord.indexOf(" ")));
					let lat = Number(coord.substring(coord.indexOf(" "), coord.indexOf(")")));
					let entity = new Cesium.Entity({
						id: arr[i].gid,
						position: Cesium.Cartesian3.fromDegrees(lon, lat),
						billboard: {
							image: 'image/PlacenameService/locat.png'
						}
					})
					viewer.entities.add(entity);
					this.addEntityIds.push(entity.id);
				}
			},
			// 清除实体点
			removeEntity() {
				for (let i = 0, len = this.addEntityIds.length; i < len; i++) {
					viewer.entities.removeById(this.addEntityIds[i]);
				}
				this.addEntityIds = [];
			},
			mouseenterItem(id){
				viewer.entities.getById(id).billboard.image = 'image/PlacenameService/locat2.png';
			},
			mouseleaveItem(id){
				viewer.entities.getById(id).billboard.image = 'image/PlacenameService/locat.png';
			},

			// 在球上画点
			drawPoint() {
				let _this = this;
				this.clearPoint();
				this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				this.handler.setInputAction(function(evt) {
					if (_this.positionEntityId != '') {
						viewer.entities.removeById(_this.positionEntityId);
						_this.positionEntityId = '';
					}
					let cartesian = viewer.camera.pickEllipsoid(evt.position);
					let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
					_this.placename.lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
					_this.placename.lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
					let entity = new Cesium.Entity({
						position: Cesium.Cartesian3.fromDegrees(_this.placename.lon, _this.placename.lat),
						billboard: {
							image: 'image/PlacenameService/locat.png'
						}
					});
					viewer.entities.add(entity);
					_this.positionEntityId = entity.id;
					_this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
					_this.handler = '';

					searchPlaceameByLnglat(_this.placename.lon, _this.placename.lat).then((res) => {
						if (res.status == 200) {
							_this.placename.name = res.data.name;
							_this.placenameShow = true;
						}
					})
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			},
			// 清除点
			clearPoint() {
				if (this.positionEntityId != '') {
					viewer.entities.removeById(this.positionEntityId);
					this.positionEntityId = '';
				}
				this.placenameShow = false;
			},

			// 切换标签页时，删除旧标签页的数据
			tabClick(tabName) {
				switch (tabName.name) {
					case 'first':
						this.clearPoint();
						this.placenameShow = false;
						this.placename.lon = '';
						this.placename.lat = '';
						this.placename.name = '';
						break;
					case 'second':
						this.removeEntity();
						this.searchResultShow = false;
						this.searchResult = [];
						this.keyword = '';
						this.totalRecord = 0;
						this.pageNum = 1;
						this.pageSize = 10;
						break;
				}
			},

			// 关闭div
			closeDiv() {
				Bus.$emit("PlacenameServiceComp-CloseComp");
			}
		},
		beforeDestroy() {
			this.removeEntity();
			this.clearPoint();
		}
	}
</script>

<style scoped="true">
	#placenameServiceCompId {
		/* position: absolute;
		right: 100px;
		top: 100px;
		z-index: 100;
		background-color: #ffffff;
		padding: 10px;
		width: 310px; */
	}

	.item {
		margin: 10px 0px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		cursor: pointer;
	}

	.placename {
		margin-top: 10px;
		font-size: 18px;
	}
</style>
