<template>
    <div id="situationPlotTab">
        <el-form ref="form" label-width="80px" size="small">
            <el-form-item label="线型">
                <el-select v-model="plotType" placeholder="请选择绘制线型">
                    <el-option
                            v-for="item in plotTypes"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"size="small" @click="startPlot">开始绘制</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name:'SituationPlotTab',
        data(){
            return{
                plotType: '直线箭头',
                plotTypes:[{
                    label:'直线箭头',
                    value:'直线箭头'
                },{
                    label:'攻击箭头',
                    value:'攻击箭头'
                },{
                    label:'钳击箭头',
                    value:'钳击箭头'
                }],

                drawSituationArrow: '',
            }
        },
        mounted(){
			let timer = setInterval(() => {
				if (viewer) {
					clearInterval(timer);
					arrow.disable();
					arrow.init(viewer);
				}
			}, 300);
            
        },
        methods:{
            //开始绘制
            startPlot(){
                switch(this.plotType){
                    case '直线箭头':
                        this.drawSituationArrow = arrow.draw("straightArrow");
                        break;
                    case '攻击箭头':
                        this.drawSituationArrow = arrow.draw("attackArrow");
                        break;
                    case '钳击箭头':
                        this.drawSituationArrow = arrow.draw("pincerArrow");
                        break;
                }
            },
        }
    }
</script>

<style scoped="true">
    #situationPlotTab{

    }
</style>
<style>
    #situationPlotTab .el-tabs__content {
        max-height: 500px !important;
        overflow-y: auto;
    }
</style>