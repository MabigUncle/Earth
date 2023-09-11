<template>
    <div id="modelEditTab">
        <div class="head-class">
            <span class="title-class">编辑-模型</span>
            <span>
                <el-button type="primary" size="mini" @click="updatePlot">更新</el-button>
                <el-button type="primary" size="mini" @click="closePlot">关闭</el-button>
            </span>
        </div>
        <hr/>
        <el-form ref="form" label-width="80px" size="small">
            <el-form-item label="缩放比例">
                <el-input v-model="modelScale"></el-input>
                <!--<el-input-number v-model="modelScale" :step="0.1" :min="0" @change="updatePlot"></el-input-number>-->
            </el-form-item>
            <el-form-item label="模型颜色">
                <el-color-picker v-model="modelColor" color-format="rgb" show-alpha></el-color-picker>
            </el-form-item>
            <el-form-item label="偏航角">
                <el-slider v-model="heading" :min="0" :max="360" :format-tooltip="formatTooltip" @change="updatePlot"></el-slider>
            </el-form-item>
            <el-form-item label="俯仰角">
                <el-slider v-model="pitch" :min="0" :max="360" :format-tooltip="formatTooltip" @change="updatePlot"></el-slider>
            </el-form-item>
            <el-form-item label="翻滚角">
                <el-slider v-model="roll" :min="0" :max="360" :format-tooltip="formatTooltip" @change="updatePlot"></el-slider>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	let selectedEntity = null;
    export default {
        name:'modelEditTab',
        props:['selectedEntityId'],
        data(){
            return{
                modelScale: 1.0,
                modelColor: '',
                heading: 0,
                pitch: 0,
                roll: 0
            }
        },
        mounted(){
			selectedEntity = viewer.entities.getById(this.selectedEntityId);
            // 鼠标滚轮放大缩小事件
            PlotBus.$on("ChangeSelectedModelScale", (scale)=>{
                this.modelScale = scale;
                this.updatePlot();
            });

            this.modelScale = selectedEntity.model.scale.getValue();
            this.modelColor = selectedEntity.model.color.getValue().toCssColorString();
            this.heading = selectedEntity.properties.getValue().heading;
            this.pitch = selectedEntity.properties.getValue().pitch;
            this.roll = selectedEntity.properties.getValue().roll;

        },
        watch:{
            modelScale(newVal){
                this.updatePlot();
            }
        },
        methods:{
            //点击更新按钮
            updatePlot(){
                selectedEntity.model.scale = this.modelScale;
                selectedEntity.model.color = CesiumUtil.rgbaToColor(this.modelColor);
                let position = selectedEntity.position.getValue();
                let hpr = Cesium.HeadingPitchRoll.fromDegrees(this.heading, this.pitch, this.roll);
                selectedEntity.orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
                selectedEntity.properties.heading = this.heading;
                selectedEntity.properties.pitch = this.pitch;
                selectedEntity.properties.roll = this.roll;
            },
            //点击关闭按钮
            closePlot(){
                PlotBus.$emit('CloseEditTab');
            },

            formatTooltip(val) {
                return val+"°";
            },
        },
        beforeDestroy(){
            PlotBus.$off("ChangeSelectedModelScale");
        }
    }
</script>

<style scoped="true">
    #modelEditTab{
 
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
	#modelEditTab .el-form {
		margin-top: 10px;
	}
</style>

