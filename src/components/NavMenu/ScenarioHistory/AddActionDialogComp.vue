<template>
	<div>
		<el-dialog title="创建行动" width="30%" :modal="modal" :show-close="showClose" 
			:close-on-click-modal="closeOnClickModal" :visible.sync="visible" center>
			<el-form ref="form" :model="form" label-width="80px" label-position="right" size="small">
				<el-form-item label="行动名称" prop="actionName">
					<el-input v-model="form.actionName"></el-input>
				</el-form-item>
				<el-form-item label="行动描述" prop="actionDesc">
					<el-input v-model="form.actionDesc"></el-input>
				</el-form-item>
				<el-form-item label="行动单位" prop="actionEntity">
					<el-col :span="17">
						<el-input v-model="form.actionEntity"></el-input>
					</el-col>
					<el-col class="line" :span="1">-</el-col>
					<el-col :span="6">
						<el-button type="primary" size="mini" @click="selectActionEntity">选择行动单位</el-button>
					</el-col>
				</el-form-item>
				<el-form-item label="行动路线" prop="actionRoad">
					<el-button type="primary" size="mini" @click="drawRoad">绘制路线</el-button>
				</el-form-item>
				<el-form-item label="开始时间" prop="actionStartTime">
					<el-date-picker v-model="form.actionStartTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始日期时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" prop="actionEndTime">
					<el-date-picker v-model="form.actionEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期时间">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="info" @click="cancleAddAction">取 消</el-button>
				<el-button type="primary" @click="okAddAction">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		addActionApi
	} from '@/api/ScenarioHistoryApi.js'
	
	let finalEntity = null;
	let floatingPoint = null;
	let activeShapePoints = [];
	let activeShape = null;
	export default {
		name: 'AddActionDialogComp',
		data() {
			return {
				form: {
					planId: '',
					actionName: '',
					actionDesc: '',
					actionEntity: '',
					actionRoad: [],
					actionStartTime: '',
					actionEndTime: ''
				},

				visible: true,
				modal: false,
				showClose: false,
				closeOnClickModal: false,
			}
		},
		mounted() {
			this.addBusEvent();
		},
		methods: {
			addBusEvent() {
				Bus.$on("HistoryPlugin-tranPlanId", (planId)=>{
					this.form.planId = planId;
				});
				Bus.$on("PointImageSelectComp-selectedOneImage", (data) => {
					this.form.actionEntity = data.imageInfo.url;
				})
			},
			okAddAction() {
				let arr = [];
				let xyzArr = JSON.parse(this.form.actionRoad);
				for(let i=0; i<xyzArr.length; i++){
					let cartographic = Cesium.Cartographic.fromCartesian(xyzArr[i]);
					let lon = Cesium.Math.toDegrees(cartographic.longitude);
					let lat = Cesium.Math.toDegrees(cartographic.latitude);
					arr.push({lon, lat});
				}
				this.form.actionRoad = JSON.stringify(arr);
				addActionApi(this.form).then((response) => {
					Bus.$emit('AddActionDialogComp-RefreshActionList');
					this.resetForm();
				})
			},
			cancleAddAction() {
				Bus.$emit('AddActionDialogComp-CloseComp');
				this.resetForm();
			},

			// 点击选择行动单位按钮
			selectActionEntity() {
				Bus.$emit("AddActionDialogComp-OpenPointImageSelectComp")
			},

			// 绘制路线
			drawRoad() {
				Bus.$emit('AddActionDialogComp-CloseComp');
				let _this = this;
				let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				handler.setInputAction(function(event) {
					let earthPosition = viewer.camera.pickEllipsoid(event.position);
					if (Cesium.defined(earthPosition)) {
						if (activeShapePoints.length == 0) {
							floatingPoint = _this.createPoint(earthPosition);
							activeShapePoints.push(earthPosition);
							let dynamicPositions = new Cesium.CallbackProperty(function() {
								return activeShapePoints;
							}, false);
							activeShape = _this.createPolyline(dynamicPositions);
							activeShapePoints.push(earthPosition);
						} else {
							activeShapePoints.push(earthPosition);
						}
					}
				}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

				handler.setInputAction(function(event) {
					if (Cesium.defined(floatingPoint)) {
						let newPosition = viewer.camera.pickEllipsoid(event.endPosition);
						if (Cesium.defined(newPosition)) {
							floatingPoint.position.setValue(newPosition);
							activeShapePoints.pop();
							activeShapePoints.push(newPosition);
						}
					}
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

				handler.setInputAction(function(event) {
					// _this.finalEntity = _this.createPolyline(_this.activeShapePoints);
					viewer.entities.remove(floatingPoint);
					viewer.entities.remove(activeShape);
					floatingPoint = null;
					handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
					handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
					handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
					Bus.$emit('AddActionDialogComp-ShowComp');
					_this.form.actionRoad = JSON.stringify(activeShapePoints);
					activeShapePoints = [];
				}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
			},
			//创建点
			createPoint(worldPosition) {
				let point = viewer.entities.add({
					position: worldPosition,
					point: {
						color: Cesium.Color.RED,
						pixelSize: 5,
						heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
					}
				});
				return point;
			},
			//创建线
			createPolyline(positionData) {
				let shape = viewer.entities.add({
					polyline: {
						positions: positionData,
						material: Cesium.Color.RED,
						width: 3,
						clampToGround: true
					}
				});
				return shape;
			},
			resetForm() {
				this.$refs['form'].resetFields();
			}
		}
	}
</script>

<style>
</style>
