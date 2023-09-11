<template>
    <div id="situationEditTab">
        <div class="head-class">
            <span class="title-class">编辑-态势</span>
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
    export default {
        name:'situationEditTab',
        props: ['selectedEntity', 'arrowType'],
        data(){
            return{
                outlineShow: true,
                outlineWidth:'',
                outlineColor:'',
                fillShow:'',
                fillColor:''
            }
        },
        watch:{
            arrowType(){
                this.updateValue();
            }
        },
        mounted(){
            this.outlineShow = this.selectedEntity.polygon.outline === undefined ? false : this.selectedEntity.polygon.outline._value;
            this.outlineColor = this.selectedEntity.polygon.outlineColor === undefined ? 'rgb(255,255,255,0)' : this.selectedEntity.polygon.outlineColor._value.toCssColorString();
            this.fillShow = this.selectedEntity.polygon.fill === undefined ? true : this.selectedEntity.polygon.fill._value;
            this.fillColor = this.selectedEntity.polygon.material._color._value.toCssColorString();
        },
        methods:{
            updateValue(){
                this.outlineShow = this.selectedEntity.polygon.outline === undefined ? false : this.selectedEntity.polygon.outline._value;
                this.outlineColor = this.selectedEntity.polygon.outlineColor === undefined ? 'rgb(255,255,255,0)' : this.selectedEntity.polygon.outlineColor._value.toCssColorString();
                this.fillShow = this.selectedEntity.polygon.fill === undefined ? true : this.selectedEntity.polygon.fill._value;
                this.fillColor = this.selectedEntity.polygon.material._color._value.toCssColorString();
            },
            //点击更新按钮
            updatePlot(){
                this.selectedEntity.polygon.outline = this.outlineShow;
                this.selectedEntity.polygon.outlineColor = CesiumUtil.rgbaToColor(this.outlineColor);
                this.selectedEntity.polygon.fill = this.fillShow;
                this.selectedEntity.polygon.material = CesiumUtil.rgbaToColor(this.fillColor);
            },
            //点击关闭按钮
            closePlot(){
                PlotBus.$emit('CloseEditTab');
            }
        }
    }
</script>

<style scoped="true">
    #situationEditTab{

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
	#situationEditTab .el-form {
		margin-top: 10px;
	}
</style>