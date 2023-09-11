<template>
	<div>
		<el-dialog title="创建方案" width="25%" :modal="modal" :show-close="showClose" 
		:close-on-click-modal="closeOnClickModal" :visible.sync="visible" center>
			<el-form ref="form" :model="form" label-width="80px" label-position="right" size="small">
				<el-form-item label="方案名称" prop="planName">
					<el-input v-model="form.planName"></el-input>
				</el-form-item>
				<el-form-item label="方案描述" prop="planDesc">
					<el-input type="textarea" v-model="form.planDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="info" size="small" @click="cancleAddPlan">取 消</el-button>
				<el-button type="primary" size="small" @click="okAddPlan">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {addPlanApi} from '@/api/ScenarioHistoryApi.js'
	export default {
		name: 'AddPlanDialogComp',
		data() {
			return {
				form:{
					planName: '',
					planDesc: ''
				},
				visible: true,
				modal: false,
				showClose: false,
				closeOnClickModal: false,
			}
		},
		methods: {
			okAddPlan() {
				addPlanApi(this.form).then((response) => {
					Bus.$emit('AddPlanDialogComp-RefreshPlanList');
				})
			},
			cancleAddPlan() {
				Bus.$emit('AddPlanDialogComp-CloseComp');
				this.resetForm();
			},
			resetForm() {
				this.$refs['form'].resetFields();
			}
		}
	}
</script>

<style>
</style>
