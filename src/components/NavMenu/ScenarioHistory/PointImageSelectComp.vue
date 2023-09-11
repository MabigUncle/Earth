<template>
    <div id="pointImageSelect">
        <img src="image/plot/close.png" @click="closeImageSelect" class="close-btn-class"/>
        <div class="title">选择图标</div>
        <div class="body">
            <div class="left_slid">
                <el-tree
                        ref="tree"
                        :data="treeData"
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        :default-expanded-keys="['1']"
                        node-key="id"
                        @node-click="nodeClick">
                    <span slot-scope="{ node, data }" style="width:100%;" :title="node.label">
                        <span>{{ node.label }}</span>
                    </span>
                </el-tree>
            </div>
            <div class="right_slid">
                <div v-for="(item,index) in imageList" class="imgItemClass" @click="imgItemClick(item)">
                    <div v-if="item.type === 'image'">
                        <img :src="item.url" :title="item.name" class="imgClass"/>
                        <div :title="item.name" style="text-align: center">{{item.name}}</div>
                    </div>
                    <div v-else-if="item.type === 'model'">
                        <img src="image/plot/gltf.png" :title="item.name" class="imgClass"/>
                        <div :title="item.name" style="text-align: center">{{item.name}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PointImageSelectComp',
        props: ['imageUrl'],
        data() {
            return {
                pointImageSelectShow: false,
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },

                imageList: []
            }
        },
        mounted() {
            this.getTreeNode();
        },
        methods: {
            // 关闭图片选择框
            closeImageSelect(){
                Bus.$emit("PointImageSelectComp-closeImageSelect");
            },
            //单击选中某张图片
            imgItemClick(item){
                Bus.$emit("PointImageSelectComp-selectedOneImage",{imageInfo: item});
            },
            //获取树形结构
            getTreeNode() {
                let _this = this;
                axios.get(this.imageUrl+"/cms/image/getTreeNode").then((response) => {
                    _this.treeData = _this.assembleTree({
                        data: response.data,
                        parent: "parentId",
                        id: "id",
                        child: "children"
                    });
                    _this.imageList = [];
                });
            },
            //点击树节点
            nodeClick(obj, node, self) {
                let _this = this;
                axios.get(this.imageUrl + "/cms/image/getImageById", {
                    params: {
                        id: obj.id
                    }
                }).then((response) => {
                    _this.imageList = response.data;
                });
            },
            //转换树结构
            assembleTree(params) {
                let options = {
                    data: params.data,
                    parent: params.parent,
                    id: params.id,
                    child: params.child
                };
                let tree = options.data.filter(function (parent) {
                    let item = options.data.filter(function (child) {
                        return parent[options.id] == child[options.parent];
                    });
                    if (item.length > 0) {
                        parent[options.child] = item;
                    }
                    return parent[options.parent] == 0;
                });
                return tree;
            }
        }
    }
</script>

<style scoped="true">
    #pointImageSelect {
        position: absolute;
        left: 28%;
        top: 15%;
        width: 44%;
        height: 50%;
        background-color: rgba(24, 31, 40, .6);
		color: #ffffff;
        z-index: 9999;
    }
    .title{
        text-align: center;
        background-color: #0000004d;
        font-size: 18px;
        line-height: 40px;
    }
    .body {
        display: flex;
        width: 100%;
        height: calc(100% - 40px);
    }
    .left_slid {
        padding: 10px;
        width: 30%;
        border: 1px solid #cccccc;
        max-height: 100%;
        overflow-y: auto;
    }
    .right_slid {
        display: flex;
        flex-wrap: wrap;
        width: 70%;
        border: 1px solid #cccccc;
        padding: 10px;
        align-content: flex-start;
        max-height: 100%;
        overflow-y: auto;
    }
    .imgItemClass {
        position: relative;
        border: 1px solid #000000;
        width: 96px;
        height: 96px;
        margin: 5px;
    }
    .imgItemClass:hover {
        border: 1px solid #409EFF;
        cursor: pointer;
    }
    .imgClass {
        width: 50px;
        height: 50px;
        margin: 5px 23px;
    }
    .close-btn-class{
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
    }
</style>
<style>


    /*修改el-tree的默认node节点样式*/
    #pointImageSelect .el-tree-node__label {
        font-size: 16px !important;
        margin-left: 5px;
    }
    #pointImageSelect .el-tree-node__content{
        height:30px !important;
    }
    #pointImageSelect .el-tree-node__content:hover {
        background-color: #cccccc88 !important;
    }
    #pointImageSelect .el-tree-node:focus > .el-tree-node__content {
        background-color: #cccccc !important;
    }

    /*修改el-tree的默认三角形图标样式*/
    #pointImageSelect .el-tree-node__expand-icon {
        font-size: 18px !important;
    }
    #pointImageSelect .el-tree .el-tree-node__expand-icon.expanded {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    #pointImageSelect .el-tree .el-icon-caret-right:before {
        content: "\e6e0";

    }
    #pointImageSelect .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
        content: "\e6df";

    }
    #pointImageSelect .el-tree-node .el-tree-node__expand-icon.is-leaf:before {
  
    }
</style>

