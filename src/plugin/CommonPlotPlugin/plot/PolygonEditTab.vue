<template>
    <div id="polygonEditTab">
        <div class="head-class">
            <span class="title-class">编辑-多边形</span>
            <span>
                <el-button type="primary" size="mini" @click="updatePlot">更新</el-button>
                <el-button type="primary" size="mini" @click="closePlot">关闭</el-button>
            </span>
        </div>
        <hr/>
        <el-form ref="form" label-width="100px" size="small">
            <el-form-item label="轮廓线">
                <el-switch v-model="outlineShow"></el-switch>
            </el-form-item>
            <el-form-item label="轮廓线颜色">
                <el-color-picker v-model="outlineColor" color-format="rgb" show-alpha></el-color-picker>
            </el-form-item>
            <el-form-item label="填充">
                <el-switch v-model="fillShow"></el-switch>
            </el-form-item>
            <el-form-item label="填充颜色">
                <el-color-picker v-model="fillColor" color-format="rgb" show-alpha></el-color-picker>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	let selectedEntity = null;
    export default {
        name:'polygonEditTab',
        props:['selectedEntityId'],
        data(){
            return{
                outlineShow: true,
                outlineWidth:'',
                outlineColor:'',
                fillShow:'',
                fillColor:''
            }
        },
        mounted(){
			selectedEntity = viewer.entities.getById(this.selectedEntityId);
            this.outlineShow = selectedEntity.polygon.outline.getValue();
            this.outlineColor = selectedEntity.polygon.outlineColor.getValue().toCssColorString();
            this.fillShow = selectedEntity.polygon.fill.getValue();
            this.fillColor = selectedEntity.polygon.material.color.getValue().toCssColorString();
        },
        methods:{
            //点击更新按钮
            updatePlot(){
                selectedEntity.polygon.outline = this.outlineShow;
                selectedEntity.polygon.outlineColor = CesiumUtil.rgbaToColor(this.outlineColor);
                selectedEntity.polygon.fill = this.fillShow;
                selectedEntity.polygon.material = CesiumUtil.rgbaToColor(this.fillColor);
            },
            //点击关闭按钮
            closePlot(){
                PlotBus.$emit('CloseEditTab');
            }
        }
    }
</script>

<style scoped="true">
    #polygonEditTab{

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
	#polygonEditTab .el-form {
		margin-top: 10px;
	}
</style>