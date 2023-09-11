<template>
    <div id="plotListTab">
        <div class="tools-class">
            <el-button type="primary" size="small" @click="plotImportFromFile">导入</el-button>
            <el-button type="primary" size="small" @click="plotExportToFile">导出</el-button>
            <el-button type="primary" size="small" @click="clearAllPlot">清除所有</el-button>
            <input type="file" ref="refFile" @change="fileLoad" style="display: none">
        </div>
        <div id="treeId">
            <el-tree
                    ref="tree"
                    :data="treeData"
                    :props="defaultProps"
                    defaultExpandAll
                    node-key="id">
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                        <span v-show="!data.showInput">{{ data.label }}</span>
                        <el-input v-model="data.label" v-show="data.showInput"></el-input>
                        <span v-if="data.editImgSrc && data.eyeImgSrc && data.deleteImgSrc" style="margin-left: 10px;">
                            <img :src="data.editImgSrc" @click="editNodeName(data)" title="命名" style="width: 20px;height: 20px;margin-right: 15px;"/>
                            <img :src="data.locateImgSrc" @click="locateNodeEntity(data)" title="定位" style="width: 20px;height: 20px;margin-right: 15px;"/>
                            <img :src="data.eyeImgSrc" @click="eyeNodeEntity(data)" title="显隐" style="width: 20px;height: 20px;margin-right: 15px;"/>
                            <img :src="data.deleteImgSrc" @click="deleteNodeEntity(node, data)" title="删除" style="width: 20px;height: 20px;"/>
                        </span>
                    </span>
            </el-tree>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PlotListTab',
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                treeData: [{
                    id: "Plot",
                    label: "标绘清单",
                    showInput: false,
                    children:[{
                        id:'Plot_Point',
                        label:'点标',
                        showInput: false,
                        children:[]
                    },{
                        id:'Plot_Polyline',
                        label:'折线',
                        showInput: false,
                        children:[]
                    },{
                        id:'Plot_Polygon',
                        label:'多边形',
                        showInput: false,
                        children:[]
                    },{
                        id:'Plot_Rectangle',
                        label:'矩形',
                        showInput: false,
                        children:[]
                    },{
                        id:'Plot_Circle',
                        label:'圆',
                        showInput: false,
                        children:[]
                    },{
                        id:'Plot_Label',
                        label:'文字',
                        showInput: false,
                        children:[]
                    },{
                        id:'Plot_SituationArrow',
                        label:'态势',
                        showInput: false,
                        children:[]
                    }]
                }]
            }
        },
        mounted() {
            let _this = this;
            // 增加图形后，同步在树上增加树节点
            PlotBus.$on("addEntityPlot", (data)=>{
                // 模型放在点标树节点里面
                data.plotType = data.plotType === 'Plot_Model' ? 'Plot_Point':data.plotType;
                _this.addLeafNode(data.plotType, data.entityId);
            });

            // delete键删除entity实体后，同步删除树节点
            PlotBus.$on("deleteKeyEntity", (deleteEntityId)=>{
                let node = this.$refs.tree.getNode(deleteEntityId);
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === deleteEntityId);
                children.splice(index, 1);
            });
        },
        methods: {
            // 动态增加子节点
            addLeafNode(parentId, leafId, label){
                label = label || '未命名';
                let newChild = {
                    id: leafId,
                    label: label,
                    showInput: false,
                    editImgSrc: 'image/plot/edit.png',
                    locateImgSrc:'image/plot/locate.png',
                    eyeImgSrc: 'image/plot/eye-open.png',
                    deleteImgSrc: 'image/plot/delete.png'
                };
                if(this.$refs.tree){
                    let parentNode = this.$refs.tree.getNode(parentId);
                    parentNode.data.children.push(newChild);
                }
            },

            // 点击树节点后面的编辑按钮，编辑树节点名称
            editNodeName(data) {
                if(data.editImgSrc === 'image/plot/edit.png'){
                    data.showInput = true;
                    data.editImgSrc = 'image/plot/ok.png';
                }else{
                    data.editImgSrc = 'image/plot/edit.png';
                    data.showInput = false;
                }
            },

            // 点击树节点后面的定位按钮，实体entity定位
            locateNodeEntity(data){
                viewer.flyTo(viewer.entities.getById(data.id));
            },

            // 点击树节点后面的显隐按钮，实体entity显隐
            eyeNodeEntity(data) {
                if(data.eyeImgSrc === 'image/plot/eye-close.png'){
                    data.eyeImgSrc = 'image/plot/eye-open.png';
                    viewer.entities.getById(data.id).show = true;
                }else{
                    data.eyeImgSrc = 'image/plot/eye-close.png';
                    viewer.entities.getById(data.id).show = false;
                }
            },

            // 点击树节点后面的删除按钮，删除该树节点和对应的entity实体
            deleteNodeEntity(node, data) {
                this.$confirm('确定删除该图形?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除树节点
                    let parent = node.parent;
                    let children = parent.data.children || parent.data;
                    let index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);
                    // 删除实体
                    viewer.entities.removeById(data.id);
                    PlotBus.$emit("deleteNodeEntity", data.id);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            },

            // 标绘的所有entity实体转化成json对象
            plotTransToJson(){
                let plotListObj = {
                    "Plot_Point": [],
                    "Plot_Polyline": [],
                    "Plot_Polygon": [],
                    "Plot_Rectangle": [],
                    "Plot_Circle": [],
                    "Plot_Label": [],
                    "Plot_SituationArrow":{
                        "straightArrowData": [],
                        "attackArrowData": [],
                        "pincerArrowData": []
                    }
                };
                // 循环树节点，并将每个entity对象转化为json字符串
                let plotNode = this.$refs.tree.getNode("Plot");
                let plotChildNodeArr = plotNode.data.children;
                for(let i=0,len=plotChildNodeArr.length; i<len; i++){
                    let nodeId = plotChildNodeArr[i].id;
                    let childNodeArr = plotChildNodeArr[i].children;
                    if(nodeId != "Plot_SituationArrow"){
                        for(let k=0,len2=childNodeArr.length; k<len2; k++){
                            let jsonStr = CesiumUtil.entityTrantoJson(nodeId, childNodeArr[k].id);
                            plotListObj[nodeId].push({
                                nodeName: childNodeArr[k].label,
                                entityId: childNodeArr[k].id,
                                entityStr: jsonStr
                            });
                        }
                    }else{
                        for(let k=0,len2=childNodeArr.length; k<len2; k++){
                            let situationEntity = viewer.entities.getById(childNodeArr[k].id);
                            let jsonStr = CesiumUtil.entityTrantoJson(situationEntity.type, childNodeArr[k].id);
                            switch(situationEntity.type){
                                case 'StraightArrow':
                                    plotListObj[nodeId].straightArrowData.push({
                                        nodeName: childNodeArr[k].label,
                                        entityId: childNodeArr[k].id,
                                        entityStr: jsonStr
                                    });
                                    break;
                                case 'AttackArrow':
                                    plotListObj[nodeId].attackArrowData.push({
                                        nodeName: childNodeArr[k].label,
                                        entityId: childNodeArr[k].id,
                                        entityStr: jsonStr
                                    });
                                    break;
                                case 'PincerArrow':
                                    plotListObj[nodeId].pincerArrowData.push({
                                        nodeName: childNodeArr[k].label,
                                        entityId: childNodeArr[k].id,
                                        entityStr: jsonStr
                                    });
                                    break;
                            }
                        }
                    }
                }
                return JSON.stringify(plotListObj);
            },

            // 点击导出按钮，将标绘的所有entity实体导出成json文件，下载到本地
            plotExportToFile(){
                let str = this.plotTransToJson();
                JsUtil.downloadJson(str, "plot.json");
            },

            // 点击导入按钮，打开选择文件对话框
            plotImportFromFile(){
                this.$refs.refFile.dispatchEvent(new MouseEvent('click'));
            },

            // 用户选择json文件后，开始解析
            fileLoad() {
                let _this = this;
                let selectedFile = this.$refs.refFile.files[0];
                let reader = new FileReader();
                reader.readAsText(selectedFile);
                reader.onload = function(response) {
                    _this.jsonTransToPlot(this.result);
                }
            },

            // 将json对象转化为plot和树节点
            jsonTransToPlot(str){
                CesiumUtil.jsonToEntity(str);
                let jsonObj = JSON.parse(str);
                this.jsonTranstoTree(jsonObj);
            },

            // json数据转化到树节点
            jsonTranstoTree(jsonObj){
                for(let i=0,len=jsonObj.Plot_Point.length; i<len; i++){
                    this.addLeafNode("Plot_Point", jsonObj.Plot_Point[i].entityId, jsonObj.Plot_Point[i].nodeName);
                }
                for(let i=0,len=jsonObj.Plot_Polyline.length; i<len; i++){
                    this.addLeafNode("Plot_Polyline", jsonObj.Plot_Polyline[i].entityId, jsonObj.Plot_Polyline[i].nodeName);
                }
                for(let i=0,len=jsonObj.Plot_Polygon.length; i<len; i++){
                    this.addLeafNode("Plot_Polygon", jsonObj.Plot_Polygon[i].entityId, jsonObj.Plot_Polygon[i].nodeName);
                }
                for(let i=0,len=jsonObj.Plot_Rectangle.length; i<len; i++){
                    this.addLeafNode("Plot_Rectangle", jsonObj.Plot_Rectangle[i].entityId, jsonObj.Plot_Rectangle[i].nodeName);
                }
                for(let i=0,len=jsonObj.Plot_Circle.length; i<len; i++){
                    this.addLeafNode("Plot_Circle", jsonObj.Plot_Circle[i].entityId, jsonObj.Plot_Circle[i].nodeName);
                }
                for(let i=0,len=jsonObj.Plot_Label.length; i<len; i++){
                    this.addLeafNode("Plot_Label", jsonObj.Plot_Label[i].entityId, jsonObj.Plot_Label[i].nodeName);
                }
                for(let i=0,len=jsonObj.Plot_SituationArrow.straightArrowData.length; i<len; i++){
                    this.addLeafNode("Plot_SituationArrow", jsonObj.Plot_SituationArrow.straightArrowData[i].entityId, jsonObj.Plot_SituationArrow.straightArrowData[i].nodeName);
                }
                for(let i=0,len=jsonObj.Plot_SituationArrow.attackArrowData.length; i<len; i++){
                    this.addLeafNode("Plot_SituationArrow", jsonObj.Plot_SituationArrow.attackArrowData[i].entityId, jsonObj.Plot_SituationArrow.attackArrowData[i].nodeName);
                }
                for(let i=0,len=jsonObj.Plot_SituationArrow.pincerArrowData.length; i<len; i++){
                    this.addLeafNode("Plot_SituationArrow", jsonObj.Plot_SituationArrow.pincerArrowData[i].entityId, jsonObj.Plot_SituationArrow.pincerArrowData[i].nodeName);
                }
            },

            // 清除所有的树节点
            clearAllTreeNode(){
                for(let i=0,len=this.treeData[0].children.length; i<len; i++){
                    this.$set(this.treeData[0].children[i], 'children', []);
                }
            },

            // 清除所有的entity实体
            clearAllPlotEntity(){
                for(let i=0,len=this.treeData[0].children.length; i<len; i++){
                    let itemChildren = this.treeData[0].children[i];
                    for(let k=0,len2=itemChildren.children.length; k<len2; k++){
                        viewer.entities.removeById(itemChildren.children[k].id);
                    }
                }
            },

            // 清除所有标绘
            clearAllPlot(){
                this.clearAllPlotEntity();
                this.clearAllTreeNode();
                PlotBus.$emit('clearAllPlot');
            }
        },
        beforeDestroy(){

        }
    }
</script>

<style scoped="true">
    #plotListTab {

    }
    .tools-class{
        margin-bottom: 10px;
    }
</style>
<style>
    #plotListTab .el-tree {
        max-height: 450px !important;
        overflow-y: auto !important;
    }
    #plotListTab .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        padding-right: 8px;
        justify-content: space-between;
    }
    #plotListTab .el-input__inner{
        height:30px !important;
    }


    /*修改el-tree的默认node节点样式*/
    #plotListTab .el-tree-node__label {
        font-size: 16px !important;
        margin-left: 5px;
    }
    #plotListTab .el-tree-node__content{
        height:30px !important;
    }
    #plotListTab .el-tree-node__content:hover {
        background-color: #cccccc88 !important;
    }
    #plotListTab .el-tree-node:focus > .el-tree-node__content {
        background-color: #cccccc !important;
    }


    /*修改el-tree的默认三角形图标样式*/
    #plotListTab .el-tree-node__expand-icon {
        font-size: 18px !important;
    }
    #plotListTab .el-tree .el-tree-node__expand-icon.expanded {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    #plotListTab .el-tree .el-icon-caret-right:before {
        content: "\e6e0";
    }
    #plotListTab .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        content: "\e6df";
    }
</style>

