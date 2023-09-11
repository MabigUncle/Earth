<template>
	<div id="satelliteCompId" class="wrap2">
		<div class="wrap-title">
			<span class="wrap-title-text">卫星模拟</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close" />
		</div>
		<div class="container">
			<el-upload ref="legendUpload" action="" :auto-upload="false" :limit="1" :file-list="fileList" :on-change="fileChange"
			 :show-file-list="false" :on-exceed="fileExceed" class="inline-block">
				<el-button size="mini" type="primary">选择卫星星历TLE数据文件</el-button>
			</el-upload>
			<el-button type="primary" size="mini" @click="removeData">移除数据</el-button>
		</div>
	</div>
</template>

<script>
	import SatelliteTLE from '@/js/SatelliteTLE.js'
	let satelliteCzmlDatasource = [];
	export default {
		name: 'SatelliteComp',
		data() {
			return {
				fileList: []
			}
		},
		mounted() {

		},
		methods: {
			// 上传文件超出限制时，即文件发生改变。files:选择的具体文件，类型为File
			fileExceed(files, fileList) {
				this.fileList = [];
				this.fileList.push(files[0]);
			},
			// 上传文件
			fileChange(file, fileList) {
				let _this = this;
				let reader = new FileReader();
				reader.readAsText(file.raw);
				reader.onload = function(event) {
					_this.removeData();
					let tleStr = event.target.result;
					let satelliteTLE = new SatelliteTLE(tleStr, {
						/* 	start: this.start,
							stop: this.stop,
							currentTime: viewer.clock.currentTime,
							multiplier: 60,
							step: 100 */
						billboard: 'image/common/wx.png'
					});
					let czmlStrArr = satelliteTLE.analyTleFile();
					for (let i = 0, len = czmlStrArr.length; i < len; i++) {
						Cesium.CzmlDataSource.load(czmlStrArr[i]).then((dataSource) => {
							viewer.dataSources.add(dataSource);
							satelliteCzmlDatasource.push(dataSource);
							console.log("第" + (i + 1) + "个卫星轨道加载成功！");
						});
					}
				}
			},
			removeData() {
				for (let i = 0, len = satelliteCzmlDatasource.length; i < len; i++) {
					viewer.dataSources.remove(satelliteCzmlDatasource[i]);
				}
				satelliteCzmlDatasource = [];
				this.fileList = [];
			},
			// 关闭div
			closeDiv() {
				Bus.$emit("SatelliteComp-CloseComp");
			}
		},
		beforeDestroy() {
			this.removeData();
		}
	}
</script>

<style scoped>
	.inline-block {
		display: inline-block;
		margin-right: 15px;
	}
</style>
