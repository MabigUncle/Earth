<template>
    <div id="pointEditTab">
        <div class="head-class">
            <span class="title-class">编辑-点标</span>
            <span>
                <el-button type="primary" size="mini" @click="updatePlot">更新</el-button>
                <el-button type="primary" size="mini" @click="closePlot">关闭</el-button>
            </span>
        </div>
        <hr/>
        <el-form ref="form" label-width="80px" size="small">
            <!--<el-form-item label="选择图标">
                <img :src="pointImgSrc" @click="selectImgClick" style="cursor: pointer;width: 35px;height: 35px;"/>
            </el-form-item>-->
            <el-form-item label="图标宽度">
                <el-input v-model="imageWidth">
                    <template slot="append">px</template>
                </el-input>
            </el-form-item>
            <el-form-item label="图标高度">
                <el-input v-model="imageHeight">
                    <template slot="append">px</template>
                </el-input>
            </el-form-item>
            <el-form-item label="旋转角度">
                <el-input v-model="imageRotation">
                    <template slot="append">°</template>
                </el-input>
                <!--<el-input-number v-model="imageRotation" :step="5" :max="360" :min="0"></el-input-number>-->
            </el-form-item>
            <el-form-item label="缩放比例">
                <el-input v-model="imageScale"></el-input>
                <!--<el-input-number v-model="imageScale" :step="0.1" :min="0"></el-input-number>-->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	let selectedEntity = null;
    export default {
        name:'pointEditTab',
        props:['selectedEntityId'],
        data(){
            return{
                pointImgSrc:'',
                imageWidth:'',
                imageHeight:'',
                imageRotation: 0.0,
                imageScale: 1.0
            }
        },
        watch:{
            imageRotation(newVal){
                this.updatePlot();
            },
            imageScale(newVal){
                this.updatePlot();
            },
        },
        mounted(){
			selectedEntity = viewer.entities.getById(this.selectedEntityId);
            this.pointImgSrc = selectedEntity.billboard.image.getValue();
            this.imageWidth = selectedEntity.billboard.width.getValue();
            this.imageHeight = selectedEntity.billboard.height.getValue();
            this.imageRotation = Cesium.Math.toDegrees(selectedEntity.billboard.rotation.getValue());
            this.imageScale = selectedEntity.billboard.scale.getValue();

            PlotBus.$on("ChangeSelectedImgScale", (scale)=>{
                this.imageScale = scale;
            });
        },
        methods:{
            //点击选择图片
            selectImgClick(){
                PlotBus.$emit('EditTabShow', {
                    tabShowName: 'pointImageSelectShow',
                    tabShow: true
                });
            },
            //点击更新按钮
            updatePlot(){
                selectedEntity.billboard.image = this.pointImgSrc;
                selectedEntity.billboard.width = this.imageWidth;
                selectedEntity.billboard.height = this.imageHeight;
                selectedEntity.billboard.rotation = Cesium.Math.toRadians(this.imageRotation);
                selectedEntity.billboard.scale = this.imageScale;
            },
            //点击关闭按钮
            closePlot(){
                PlotBus.$emit('CloseEditTab');
            }
        }
    }
</script>

<style scoped="true">
    #pointEditTab{

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
	#pointEditTab .el-form {
		margin-top: 10px;
	}
</style>
