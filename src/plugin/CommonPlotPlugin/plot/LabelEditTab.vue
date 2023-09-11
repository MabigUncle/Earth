<template>
    <div id="labelEditTab">
        <div class="head-class">
            <span class="title-class">编辑-文字</span>
            <span>
                <el-button type="primary" size="mini" @click="updatePlot">更新</el-button>
                <el-button type="primary" size="mini" @click="closePlot">关闭</el-button>
            </span>
        </div>
        <hr/>
        <el-form ref="form" label-width="100px" size="small">
            <el-form-item label="文字">
                <el-input v-model="inputText"></el-input>
            </el-form-item>
            <el-form-item label="字体大小">
                <el-input v-model="fontSize">
                    <template slot="append">px</template>
                </el-input>
            </el-form-item>
            <el-form-item label="字体颜色">
                <el-color-picker v-model="fillColor" color-format="rgb" show-alpha></el-color-picker>
            </el-form-item>
            <el-form-item label="背景">
                <el-switch v-model="showBackground"></el-switch>
            </el-form-item>
            <el-form-item label="背景颜色">
                <el-color-picker v-model="backgroundColor" color-format="rgb" show-alpha></el-color-picker>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	let selectedEntity = null;
    export default {
        name:'LabelEditTab',
        props:['selectedEntityId'],
        data(){
            return{
                inputText:'',
                fontSize: '',
                fillColor:'',
                showBackground:'',
                backgroundColor:'',
            }
        },
        mounted(){
			selectedEntity = viewer.entities.getById(this.selectedEntityId);
            this.inputText = selectedEntity.label.text.getValue();
            this.fontSize = this.getFontSize(selectedEntity.label.font.getValue());
            this.fillColor = selectedEntity.label.fillColor._value.toCssColorString();
            this.showBackground = selectedEntity.label.showBackground.getValue();
            this.backgroundColor = selectedEntity.label.backgroundColor.getValue().toCssColorString();
        },
        methods:{
            //点击更新按钮
            updatePlot(){
                selectedEntity.label.text = this.inputText;
                selectedEntity.label.font = this.setFont(this.fontSize);
                selectedEntity.label.fillColor = CesiumUtil.rgbaToColor(this.fillColor);
                selectedEntity.label.showBackground = this.showBackground;
                selectedEntity.label.backgroundColor = CesiumUtil.rgbaToColor(this.backgroundColor);
            },
            //点击关闭按钮
            closePlot(){
                PlotBus.$emit('CloseEditTab');
            },
            getFontSize(fontStr){
                let arr = fontStr.split(" ");
                return arr[1].split("px")[0];
            },
            setFont(fontSize){
                let val = selectedEntity.label.font.getValue();
                let newVal = val.replace(val.split(" ")[1].split("px")[0], fontSize);
                return newVal;
            },
        }
    }
</script>

<style scoped="true">
    #labelEditTab{
        
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
	#labelEditTab .el-form {
		margin-top: 10px;
	}
</style>