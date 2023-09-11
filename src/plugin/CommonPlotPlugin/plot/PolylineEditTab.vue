<template>
    <div id="polylineEditTab">
        <div class="head-class">
            <span class="title-class">编辑-折线</span>
            <span>
                <el-button type="primary" size="mini" @click="updatePlot">更新</el-button>
                <el-button type="primary" size="mini" @click="closePlot">关闭</el-button>
            </span>
        </div>
        <hr/>
        <el-form ref="form" label-width="80px" size="small">
            <el-form-item label="线宽">
                <el-input v-model="polylineWidth">
                    <template slot="append">px</template>
                </el-input>
            </el-form-item>
            <el-form-item label="颜色">
                <el-color-picker v-model="polylineColor" color-format="rgb" show-alpha></el-color-picker>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	let selectedEntity = null;
    export default {
        name:'polylineEditTab',
        props:['selectedEntityId'],
        data(){
            return{
                polylineWidth:'',
                polylineColor:'#409EFF',
            }
        },
        mounted(){
			selectedEntity = viewer.entities.getById(this.selectedEntityId);
            this.polylineWidth = selectedEntity.polyline.width.getValue();
            this.polylineColor = selectedEntity.polyline.material.color.getValue().toCssColorString();
        },
        methods:{
            //点击更新按钮
            updatePlot(){
                selectedEntity.polyline.width = this.polylineWidth;
                selectedEntity.polyline.material = CesiumUtil.rgbaToColor(this.polylineColor);
            },
            //点击关闭按钮
            closePlot(){
                PlotBus.$emit('CloseEditTab');
            }
        }
    }
</script>

<style scoped="true">
    #polylineEditTab{

    }
    .head-class{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
    }
    .title-class{
        font-size: 16px;
        font-weight: bold;
    }
</style>

<style>
	#polylineEditTab .el-form {
		margin-top: 10px;
	}
</style>
