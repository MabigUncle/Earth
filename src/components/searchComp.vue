<template>
    <div id="searchComp">
        <div id="search">
            <div class="search-title">
                <el-radio-group v-model="searchType" @change="changeRadio">
                    <el-radio label="1">影像</el-radio>
                    <el-radio label="2">矢量</el-radio>
                    <el-radio label="3">地形</el-radio>
                    <el-radio label="7">控制点</el-radio>
                    <el-radio label="8">3DTiles</el-radio>
                </el-radio-group>
            </div>

            <!--查询条件-->
            <div id="filterId">
                <el-tabs v-model="activeName">
                    <el-tab-pane v-if="yingxiang" label="行政区" name="行政区" id="xingzhengquTab">
                        <el-form :mode="xingzhengquForm" label-position="right" label-width="70px">
                            <el-form-item label="行政区">
                                <el-col :span="7">
                                    <el-select v-model="xingzhengquForm.provinceSelect" @change="provinceChange" placeholder="省直辖市"
                                               size="mini">
                                        <el-option v-for="item in province" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col class="line" :span="1">-</el-col>
                                <el-col :span="7">
                                    <el-select v-model="xingzhengquForm.citySelect" @change="cityChange" placeholder="地级市州"
                                               size="mini">
                                        <el-option v-for="item in city" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col class="line" :span="1">-</el-col>
                                <el-col :span="7">
                                    <el-select v-model="xingzhengquForm.districtSelect" placeholder="区县旗" size="mini">
                                        <el-option v-for="item in district" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="上传时间">
                                <el-col :span="7">
                                    <el-date-picker size="mini"
                                                    :clearable=false
                                                    v-model="xingzhengquForm.startUploadDate"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="开始日期">
                                    </el-date-picker>
                                </el-col>
                                <el-col class="line" :span="2">-</el-col>
                                <el-col :span="7">
                                    <el-date-picker size="mini"
                                                    :clearable=false
                                                    v-model="xingzhengquForm.endUploadDate"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="结束日期">
                                    </el-date-picker>
                                </el-col>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="经纬度" name="经纬度" id="jingweiduTab">
                        <el-form :model="jingweiduForm" label-position="right" label-width="70px">
                            <el-form-item label="经度">
                                <el-col :span="8">
                                    <el-input v-model="jingweiduForm.minLon" type="number" size="mini"></el-input>
                                </el-col>
                                <el-col class="line" :span="2">至</el-col>
                                <el-col :span="8">
                                    <el-input v-model="jingweiduForm.maxLon" type="number" size="mini"></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="纬度">
                                <el-col :span="8">
                                    <el-input v-model="jingweiduForm.minLat" type="number" size="mini"></el-input>
                                </el-col>
                                <el-col class="line" :span="2">至</el-col>
                                <el-col :span="8">
                                    <el-input v-model="jingweiduForm.maxLat" type="number" size="mini"></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="上传时间">
                                <el-col :span="7">
                                    <el-date-picker size="mini"
                                                    :clearable=false
                                                    v-model="jingweiduForm.startUploadDate"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="开始日期">
                                    </el-date-picker>
                                </el-col>
                                <el-col class="line" :span="2">-</el-col>
                                <el-col :span="7">
                                    <el-date-picker size="mini"
                                                    :clearable=false
                                                    v-model="jingweiduForm.endUploadDate"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="结束日期">
                                    </el-date-picker>
                                </el-col>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="地图绘制" name="地图绘制" id="mapdrawTab">
                        <el-form :model="mapdrawForm" label-position="right" label-width="70px">
                            <el-form-item label="地图绘制">
                                <el-col :span="7">
                                    <el-form-item label="矩形">
                                        <div style="cursor: pointer;"><img src="image/search/rect.png" @click="juxing"/></div>
                                    </el-form-item>
                                </el-col>
                                <el-col class="line" :span="2"></el-col>
                                <el-col :span="7">
                                    <el-form-item label="多边形">
                                        <div style="cursor: pointer;"><img src="image/search/ploygon.png" @click="duobianxing"/></div>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="上传时间">
                                <el-col :span="7">
                                    <el-date-picker size="mini"
                                                    :clearable=false
                                                    v-model="mapdrawForm.startUploadDate"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="开始日期">
                                    </el-date-picker>
                                </el-col>
                                <el-col class="line" :span="2">-</el-col>
                                <el-col :span="7">
                                    <el-date-picker size="mini"
                                                    :clearable=false
                                                    v-model="mapdrawForm.endUploadDate"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="结束日期">
                                    </el-date-picker>
                                </el-col>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!--查询工具按钮-->
            <div id="toolsId" style="height: 30px">
                <div>
                    <el-button class="chongzhi" @click="queryReset" size="mini" type="primary">重置</el-button>
                </div>
                <div style="position: relative;top: -27px;left: 100px;">
                    <el-button class="queding" @click="queryStart" size="mini" type="primary">确定</el-button>
                </div>
                <div style="position: relative;top: -54px;left: 200px;">
                    <el-button @click="moreCondition" v-if="ifMoreCondition" size="mini" type="primary">更多</el-button>
                </div>
            </div>

            <!--查询结果-->
            <div id="queryResult" v-show="queryResultShow">
                <el-table
                        :data="queryResultFiles"
                        border
                        @row-dblclick="dingwei">
                    <el-table-column v-if="showImg" label='缩略图' width="80px" align="center">
                        <template slot-scope="scope">
                            <img id="tupian" style="width: 56px; height: 56px;"
                                 :src="sdcServiceUrl+'/manager/rest/file/thumb?id='+scope.row.id+'&fileType='+searchType">
                        </template>
                    </el-table-column>
                    <el-table-column label='名称'  align="left" v-if="showName">
                        <template slot-scope="scope">
                            <span :title="scope.row.name" style="white-space: nowrap;overflow: hidden;">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(tableItem, index) in tableListObj[searchType]"
                                     :width="tableItem.width"
                                     :label='tableItem.name'
                                     :key="index">
                        <template slot-scope="scope">
                            <span>{{scope.row[tableItem.id]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='操作' width="100px" align="center">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="['1','3','8'].includes(searchType) || (searchType === '2' && scope.row.serviceId)"
                                      id="browseBtn"
                                      title="预览"
                                      style="cursor: pointer;margin-right:10px;">
                                    <img :src="scope.row.yulanImgSrc" @click="yulan(scope.row)"
                                         style="width: 18px;height: 18px;"/>
                                </span>
                                <span v-if="searchType === '1' && scope.row.serviceId"
                                      id="browseBtn2"
                                      title="影像上球"
                                      style="cursor: pointer;margin-right:10px;">
                                    <img :src="scope.row.shangqiuImgSrc" @click="shangqiu(scope.row)"
                                         style="width: 18px;height: 18px;"/>
                                </span>
                                <span
                                      title="详情"
                                      style="cursor: pointer;">
                                    <img src="image/search/info.png" @click="xiangqing(scope.row)"
                                         style="width: 18px;height: 18px;"/>
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <div id="pageId">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 20, 50, 100]"
                            :page-size.sync="pagesize"
                            layout="total, sizes, prev, pager, next"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>

        <!--更多查询条件-->
        <el-dialog  title="更多查询条件" :visible.sync="moreSelection" width="590px">
            <el-form :model="moreConditionForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item :label-width="formLabelWidth" style="margin-bottom: 0px;text-align: left;margin-left: -80px;">
                            <label>成像时间：</label>
                            <el-date-picker size="mini"
                                            style="width: 170px;"
                                            :clearable=false
                                            v-model="moreConditionForm.startReceiveDate"
                                            type="datetime"
                                            placeholder="选择日期">
                            </el-date-picker>
                            <label>至</label>
                            <el-date-picker size="mini"
                                            style="width: 170px;"
                                            :clearable=false
                                            v-model="moreConditionForm.endReceiveDate"
                                            type="datetime"
                                            placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="卫星：" :label-width="formLabelWidth" style="width: 250px;margin-bottom: 0px;">
                            <el-select size="mini" v-model="moreConditionForm.sats">
                                <el-option v-for="item in satsOption" :label="item" :value="item" :key="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="影像级别：" :label-width="formLabelWidth" style="width: 250px;margin-bottom: 0px">
                            <el-select size="mini" v-model="moreConditionForm.levels">
                                <el-option v-for="item in levelsOption" :label="item" :value="item" :key="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="传感器：" :label-width="formLabelWidth" style="width: 250px;margin-bottom: 0px">
                            <el-select size="mini" v-model="moreConditionForm.sensors">
                                <el-option v-for="item in sensorsOption" :label="item" :value="item" :key="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" class="chongzhi"  @click="moreSelection = false">关 闭</el-button>
                <el-button size="mini" class="queding" @click="moreSelection = false">确 定</el-button>
            </div>
        </el-dialog>

        <!--查询结果中的详情-->
        <el-dialog :title="searchResultDataDetails.name+' 详情'" :visible.sync="searchResultDataDetailsShow" width="800px">
            <el-form :model="searchResultDataDetails">
                <el-row>
                    <el-col :span="12" v-for="(detailItem, index) in detailKey[searchType]" :key="index">
                        <el-form-item :label="detailItem.key" :label-width="'110px'">
                            <el-input size="mini" :value="searchResultDataDetails[detailItem.id]" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="queding" @click="xiazai" size="mini">下载</el-button>
                <el-button class="chongzhi" @click="searchResultDataDetailsShow = false" size="mini">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {searchData, getImageMapService, getShapeMapService, getTerrainMapService, get3DTilesMapService} from '../api/searchApi'
    import DrawPolygon from '../js/DrawPolygon'
    import DrawRectangle from '../js/DrawRectangle'
    let querystring = require('querystring');

    export default {
        name: "searchComp",
        data() {
            return {
                sdcServiceUrl: window.GlobalConfig.SDC_SERVER_URL,
                sdcGeoserverUrl: window.GlobalConfig.SDC_GEOSERVER_URL,
                sdcGisserverUrl: window.GlobalConfig.SDC_GISSERVER_URL,

                searchType: "1",
                searchDataType: 'imagemeta',
                activeName:'行政区',
                yingxiang: true,

                // 行政区范围筛选
                xingzhengqu: '',
                province: [],
                city: [],
                district: [],
                xingzhengquForm: {
                    provinceSelect: '',
                    citySelect: '',
                    districtSelect: '',
                    startUploadDate: '',
                    endUploadDate: ''
                },
                // 经纬度范围筛选
                jingweiduForm:{
                    minLon: -180,
                    maxLon: 180,
                    minLat: -90,
                    maxLat: 90,
                    startUploadDate: '',
                    endUploadDate: ''
                },
                // 地图绘制筛选
                mapdrawType: '',
                finalEntity: null,
                mapdrawForm:{
                    polygon:[],
                    startUploadDate: '',
                    endUploadDate: ''
                },

                // 更多查询条件
                ifMoreCondition: true,
                moreSelection: false,
                formLabelWidth: '100px',
                moreConditionForm: {
                    startReceiveDate: '',
                    endReceiveDate: '',
                    levels: '全部',
                    sats: '全部',
                    sensors: '全部'
                },
                levelsOption: [],
                satsOption: [],
                sensorsOption: [],

                // 数据查询结果
                queryResultShow: false,
                queryResultFiles:[],
                showImg: true,
                showName: true,
                tableListObj: {
                    "1": [
                        {
                            id: 'satellite',
                            name: '卫星',
                            width: '55px',
                        },
                        {
                            id: 'sensor',
                            name: '传感器',
                            width: '65px',
                        },
                        {
                            id: 'level',
                            name: '级别',
                            width: '65px',
                        }
                    ],
                    "2": [
                        {
                            id: 'type',
                            name: '类型',
                            width: '80px',
                        },
                        {
                            id: 'uploadTime',
                            name: '上传时间',
                            width: '170px',
                        }
                    ],
                    "3": [
                        {
                            id: 'resolution',
                            name: '分辨率',
                            width: '75px',
                        },
                        {
                            id: 'uploadTime',
                            name: '上传时间',
                            width: '170px',
                        }
                    ],
                    "7": [
                        {
                            id: 'featureId',
                            name: '点号',
                            width: '200px',
                        },
                        {
                            id: 'longitude',
                            name: '经度',
                            width: '65px',
                        },
                        {
                            id: 'latitude',
                            name: '纬度',
                            width: '65px',
                        },
                        {
                            id: 'height',
                            name: '大地高',
                            width: '65px',
                        }
                    ],
                    "8": [],
                },

                // 分页
                currentPage: 1,
                pagesize: 10,
                total: 0,

                // 查询结果详情
                searchResultDataDetailsShow: false,
                searchResultDataDetails: {},
                detailKey: {
                    "1": [
                        {
                            key: '卫星：',
                            id: 'satellite'
                        },
                        {
                            key: '传感器：',
                            id: 'sensor'
                        },
                        {
                            key: '成像时间：',
                            id: 'receiveTime'
                        },
                        {
                            key: '生产时间：',
                            id: 'produceTime'
                        },
                        {
                            key: '影像级别：',
                            id: 'level'
                        },
                        {
                            key: '分辨率：',
                            id: 'resolution'
                        },
                        {
                            key: '云量：',
                            id: 'cloudPercent'
                        },
                        {
                            key: '波段数：',
                            id: 'bandCount'
                        },
                        {
                            key: '行数：',
                            id: 'rasterRows'
                        },
                        {
                            key: '列数：',
                            id: 'rasterCols'
                        },
                        {
                            key: '中心X：',
                            id: 'centerX'
                        },
                        {
                            key: '中心Y：',
                            id: 'centerY'
                        },
                        {
                            key: '格式：',
                            id: 'format'
                        },
                        {
                            key: '坐标系：',
                            id: 'epsgv'
                        },
                    ],
                    "2": [
                        {
                            key: '类型：',
                            id: 'type'
                        },
                        {
                            key: '字符集：',
                            id: 'charset'
                        },
                        {
                            key: '坐标系：',
                            id: 'epsgv'
                        },
                        {
                            key: '上传时间：',
                            id: 'uploadTime'
                        },
                        {
                            key: '最小X：',
                            id: 'minX'
                        },
                        {
                            key: '最小Y：',
                            id: 'minY'
                        },
                        {
                            key: '最大X：',
                            id: 'maxX'
                        },
                        {
                            key: '最大Y：',
                            id: 'maxY'
                        },
                    ],
                    "3": [
                        {
                            key: '坐标系：',
                            id: 'epsgv'
                        },
                        {
                            key: '上传时间：',
                            id: 'uploadTime'
                        },
                        {
                            key: '格式：',
                            id: 'format'
                        },
                        {
                            key: '分辨率：',
                            id: 'resolution'
                        },
                        {
                            key: '行数：',
                            id: 'rasterRows'
                        },
                        {
                            key: '列数：',
                            id: 'rasterCols'
                        },
                        {
                            key: '最小X：',
                            id: 'minX'
                        },
                        {
                            key: '最小Y：',
                            id: 'minY'
                        },
                        {
                            key: '最大X：',
                            id: 'maxX'
                        },
                        {
                            key: '最大Y：',
                            id: 'maxY'
                        },
                    ],
                    "7": [
                        {
                            key: '点号：',
                            id: 'featureId'
                        },
                        {
                            key: '大地高：',
                            id: 'height'
                        },
                        {
                            key: '经度：',
                            id: 'longitude'
                        },
                        {
                            key: '纬度：',
                            id: 'latitude'
                        },
                        {
                            key: '平面坐标系统：',
                            id: 'planeCoordinateSystem'
                        },
                        {
                            key: '高程坐标系统：',
                            id: 'heightCoordinateSystem'
                        },
                        {
                            key: '测区名称：',
                            id: 'zoneName'
                        },
                        {
                            key: '比例尺：',
                            id: 'scale'
                        },
                        {
                            key: '规划方式：',
                            id: 'method'
                        },
                        {
                            key: '特征点类型：',
                            id: 'type'
                        },
                        {
                            key: '影像大小：',
                            id: 'size'
                        },
                        {
                            key: '影像格式：',
                            id: 'format'
                        },
                        {
                            key: '分辨率：',
                            id: 'resolution'
                        },
                        {
                            key: '生产时间：',
                            id: 'productionTime'
                        },
                        {
                            key: '生成单位：',
                            id: 'productionUnit'
                        },
                        {
                            key: '点位说明：',
                            id: 'description'
                        },
                    ],
                    "8": [
                        {
                            key: '名称：',
                            id: 'name'
                        },
                        {
                            key: '上传时间：',
                            id: 'uploadTime'
                        },
                        {
                            key: '最小X：',
                            id: 'minX'
                        },
                        {
                            key: '最小Y：',
                            id: 'minY'
                        },
                        {
                            key: '最大X：',
                            id: 'maxX'
                        },
                        {
                            key: '最大Y：',
                            id: 'maxY'
                        },
                    ],
                },

                // 已经加载的图层
                addedLayerIds:[],
            };
        },
        mounted() {
            this.init();
        },
        watch:{
            addedLayerIds(){
                if(this.addedLayerIds.length === 2){
                    Bus.$emit("splitImageryShow",{
                        show: true,
                        layer: this.addedLayerIds[1].imageryLayer
                    });
                }else{
                    Bus.$emit("splitImageryShow",{
                        show: false
                    });
                }
            }
        },
        methods: {
            init(){
                axios.get('json/District.json').then((response)=>{
                    this.xingzhengqu = response.data;
                    this.province.push({label: '省直辖市', value: ''});
                    this.city = [{label: '地级市州', value: ''}];
                    this.district = [{label: '区县旗', value: ''}];
                    for (let i in this.xingzhengqu[100000]) {
                        this.province.push({
                            label: this.xingzhengqu[100000][i],
                            value: i
                        });
                    }
                });
            },
            // 改变查询的数据类型
            changeRadio(val){
                this.queryReset();
                if (val === '1') {
                    this.yingxiang = true;
                    this.ifMoreCondition = true;
                    this.activeName = '行政区';
                } else {
                    this.yingxiang = false;
                    this.ifMoreCondition = false;
                    this.activeName = '经纬度';
                }
                switch (val) {
                    case '1':
                        this.searchDataType = 'imagemeta';
                        this.showImg = true;
                        this.showName = true;
                        break;
                    case '2':
                        this.searchDataType = 'shapemeta';
                        this.showImg = false;
                        this.showName = true;
                        break;
                    case '3':
                        this.searchDataType = 'terrainmeta';
                        this.showImg = true;
                        this.showName = true;
                        break;
                    case '7':
                        this.searchDataType = 'controlpoint';
                        this.showImg = true;
                        this.showName = false;
                        break;
                    case '8':
                        this.searchDataType = 'tilesetmeta';
                        this.showImg = false;
                        this.showName = true;
                        break;
                }
            },

            // 改变行政区-省
            provinceChange(val){
                this.xingzhengquForm.citySelect = '';
                this.xingzhengquForm.districtSelect = '';
                this.city = [{label: '地级市州', value: ''}];
                this.district = [{label: '区县旗', value: ''}];
                for (let i in this.xingzhengqu[val]) {
                    this.city.push({
                        label: this.xingzhengqu[val][i],
                        value: i
                    });
                }
            },
            // 改变行政区-市
            cityChange(val){
                this.xingzhengquForm.districtSelect = '';
                this.district = [{label: '区县旗', value: ''}];
                for (let i in this.xingzhengqu[val]) {
                    this.district.push({
                        label: this.xingzhengqu[val][i],
                        value: i
                    });
                }
            },

            // 绘制矩形
            juxing(){
                this.mapdrawType = 'rect';
                if(this.finalEntity){
                    viewer.entities.remove(this.finalEntity);
                    this.finalEntity = null;
                }
                let rect = new DrawRectangle();
                Bus.$on('DrawRectangle_finish',()=>{
                    this.finalEntity = rect.finalEntity;
                    let cartesian1 = rect.activeShapePoints[0];
                    let lonlat1 = this.cartesianToLonlat(cartesian1);
                    let minLon = lonlat1.lon;
                    let minLat = lonlat1.lat;
                    let maxLon = lonlat1.lon;
                    let maxLat = lonlat1.lat;
                    for(let i=1,len=rect.activeShapePoints.length; i<len; i++){
                        let cartesian3 = rect.activeShapePoints[i];
                        let lonlat = this.cartesianToLonlat(cartesian3);
                        if(lonlat.lon < minLon){
                            minLon = lonlat.lon;
                        }
                        if(lonlat.lon > maxLon){
                            maxLon = lonlat.lon;
                        }
                        if(lonlat.lat < minLat){
                            minLat = lonlat.lat;
                        }
                        if(lonlat.lat > maxLat){
                            maxLat = lonlat.lat;
                        }
                    }
                    this.mapdrawForm.polygon = {
                        "minLon": minLon,
                        "minLat": minLat,
                        "maxLon": maxLon,
                        "maxLat": maxLat
                    };
                })
            },
            // 绘制多边形
            duobianxing(){
                this.mapdrawType = 'polygon';
                if(this.finalEntity){
                    viewer.entities.remove(this.finalEntity);
                    this.finalEntity = null;
                }
                let polygon = new DrawPolygon();
                Bus.$on('DrawPolygon_finish',()=>{
                    this.finalEntity = polygon.finalEntity;
                    let arr = [];
                    for(let i=0,len=polygon.activeShapePoints.length; i<len; i++){
                        let cartesian3 = polygon.activeShapePoints[i];
                        let lonlat = this.cartesianToLonlat(cartesian3);
                        arr.push({
                            "lon": lonlat.lon,
                            "lat": lonlat.lat
                        })
                    }
                    this.mapdrawForm.polygon = arr;
                })
            },
            cartesianToLonlat(cartesianPoint){
                let cartographicPoint = Cesium.Cartographic.fromCartesian(cartesianPoint);
                let lon = Cesium.Math.toDegrees(cartographicPoint.longitude);
                let lat = Cesium.Math.toDegrees(cartographicPoint.latitude);
                let height = cartographicPoint.height;
                return {
                    lon: lon,
                    lat: lat,
                    height: height
                }
            },

            // 更多查询条件
            moreCondition(){

            },

            // 重置
            queryReset(){
                this.xingzhengquForm = {
                    provinceSelect: '',
                    citySelect: '',
                    districtSelect: '',
                    startUploadDate: '',
                    endUploadDate: ''
                };
                this.jingweiduForm = {
                    minLon: -180,
                    maxLon: 180,
                    minLat: -90,
                    maxLat: 90,
                    startUploadDate: '',
                    endUploadDate: ''
                };
                this.mapdrawForm = {
                    polygon: [],
                    startUploadDate: '',
                    endUploadDate: ''
                };

                this.queryResultShow = false;
                this.queryResultFiles = [];
                this.currentPage = 1;
                this.pagesize = 10;
                this.total = 0;

                // 删除绘制的筛选范围图形
                if(this.finalEntity){
                    viewer.entities.remove(this.finalEntity);
                    this.finalEntity = null;
                }

                // 删除已经加载的地图服务
                for(let i=0,len=this.addedLayerIds.length; i<len; i++){
                    let imageryLayer = this.addedLayerIds[i].imageryLayer;
                    let tileset = this.addedLayerIds[i].tileset;
                    if(imageryLayer){
                        viewer.imageryLayers.remove(imageryLayer);
                    }
                    if(tileset){
                        viewer.scene.primitives.remove(tileset);
                    }
                }
                this.addedLayerIds = [];

                // 回复默认地形
                if(viewer.scene.globe.depthTestAgainstTerrain){
                    let terrainProvider = new Cesium.EllipsoidTerrainProvider();
                    viewer.scene.globe.depthTestAgainstTerrain = false;
                    viewer.terrainProvider = terrainProvider;
                }
            },

            // 查询
            queryStart(){
                let parameter = new Object();
                switch(this.activeName){
                    case '行政区':
                        if (this.xingzhengquForm.districtSelect) {
                            parameter.code = this.xingzhengquForm.districtSelect;
                        } else if (this.xingzhengquForm.citySelect) {
                            parameter.code = this.xingzhengquForm.citySelect;
                        } else if (this.xingzhengquForm.provinceSelect) {
                            parameter.code = this.xingzhengquForm.provinceSelect;
                        }
                        if (this.xingzhengquForm.startUploadDate) {
                            parameter.startUploadDate = this.xingzhengquForm.startUploadDate;
                            parameter.startUploadDate += " 00:00:00";
                        }
                        if (this.xingzhengquForm.endUploadDate) {
                            parameter.endUploadDate = this.xingzhengquForm.endUploadDate;
                            parameter.endUploadDate += " 23:59:59";
                        }
                        break;
                    case '经纬度':
                        let extent = {};
                        if (this.jingweiduForm.minLon < -180) {
                            this.jingweiduForm.minLon = -180
                        }
                        if (this.jingweiduForm.minLat < -90) {
                            this.jingweiduForm.minLat = -90
                        }
                        if (this.jingweiduForm.maxLat > 90) {
                            this.jingweiduForm.maxLat = 90
                        }
                        if (this.jingweiduForm.maxLon > 180) {
                            this.jingweiduForm.maxLon = 180
                        }
                        extent.maxLon = this.jingweiduForm.maxLon;
                        extent.maxLat = this.jingweiduForm.maxLat;
                        extent.minLat = this.jingweiduForm.minLat;
                        extent.minLon = this.jingweiduForm.minLon;
                        parameter.extent = extent;
                        if (this.jingweiduForm.startUploadDate) {
                            parameter.startUploadDate = this.jingweiduForm.startUploadDate;
                            parameter.startUploadDate += " 00:00:00";
                        }
                        if (this.jingweiduForm.endUploadDate) {
                            parameter.endUploadDate = this.jingweiduForm.endUploadDate;
                            parameter.endUploadDate += " 23:59:59";
                        }
                        break;
                    case '地图绘制':
                        if(this.mapdrawType === 'rect'){
                            parameter.extent = this.mapdrawForm.polygon;
                        }else if(this.mapdrawType === 'polygon'){
                            parameter.polygon = this.mapdrawForm.polygon;
                        }
                        if (this.mapdrawForm.startUploadDate) {
                            parameter.startUploadDate = this.mapdrawForm.startUploadDate;
                            parameter.startUploadDate += " 00:00:00";
                        }
                        if (this.mapdrawForm.endUploadDate) {
                            parameter.endUploadDate = this.mapdrawForm.endUploadDate;
                            parameter.endUploadDate += " 23:59:59";
                        }
                        break;
                }
                let param = querystring.stringify({
                    params: JSON.stringify(parameter),
                    pageNumber: this.currentPage,
                    pageSize: this.pagesize,
                });
                if (JSON.stringify(parameter) === "{}") {
                    this.$alert('请输入查询条件！', '提示', {
                        type: 'warning',
                        confirmButtonText: '确定',
                    })
                } else {
                    searchData(this.searchDataType, param).then((response) => {
                        if (response.data.success) {
                            response.data.rows.map((item, index)=>{
                                item["yulanImgSrc"] =  "image/search/yulan-close.png";
                                item["shangqiuImgSrc"] =  "image/search/shangqiu-close.png";
                                return item;
                            });
                            this.queryResultFiles = response.data.rows;
                            this.total = response.data.total;
                            this.queryResultShow = true;
                            // 删除绘制的筛选多边形
                            if(this.finalEntity){
                                viewer.entities.remove(this.finalEntity);
                                this.finalEntity = null;
                            }
                        } else {
                            this.$alert('查询失败！', '提示', {
                                type: 'error',
                                confirmButtonText: '确定',
                            })
                        }
                    })
                }
            },

            // 定位
            dingwei(extent){
                let minX = Cesium.Math.toRadians(extent[0]);
                let minY = Cesium.Math.toRadians(extent[1]);
                let maxX = Cesium.Math.toRadians(extent[2]);
                let maxY = Cesium.Math.toRadians(extent[3]);
                let rect = new Cesium.Rectangle(minX, minY, maxX, maxY);
                viewer.camera.setView({
                    destination: rect,
                    orientation: {
                        heading: Cesium.Math.toRadians(0),
                        pitch: Cesium.Math.toRadians(-90),
                        roll: Cesium.Math.toRadians(0)
                    }
                });
            },
            // 预览(1-影像、2-矢量、3-地形、7-控制点、8-3DTiles)
            yulan(row){
                let params;
                if (row.yulanImgSrc.indexOf('image/search/yulan-close.png') > -1) {
                    row.yulanImgSrc = 'image/search/yulan-open.png';
                    switch (this.searchType) {
                        case '1':
                            const pointList = this.getPolygon(row);
                            let minX = Math.min(pointList[0], pointList[2], pointList[4], pointList[6]);
                            let minY = Math.min(pointList[1], pointList[3], pointList[5], pointList[7]);
                            let maxX = Math.max(pointList[0], pointList[2], pointList[4], pointList[6]);
                            let maxY = Math.max(pointList[1], pointList[3], pointList[5], pointList[7]);
                            const imageExtent = [minX, minY, maxX, maxY];
                            params = {
                                type: 'Image',
                                id: row.id,
                                url: this.sdcServiceUrl + "/manager/rest/file/browse?id=" + row.id + "&fileType=1",
                                imageExtent,
                            };
                            let imageryLayer = this.addSingleImage(params);
                            this.dingwei([minX, minY, maxX, maxY]);
                            this.addedLayerIds.push({
                                id: "yulan-" + row.id,
                                imageryLayer: imageryLayer
                            });
                            break;
                        case '2':
                            getShapeMapService(row.serviceId).then((response)=>{
                                if(response.data.tiled){
                                    // 如果切片，加载wmts服务
                                    params = {
                                        id: row.serviceId,
                                        type: "WMTS",
                                        url: this.sdcGeoserverUrl+'/gwc/service/wmts',
                                        layer: 'shp:' + row.serviceId,
                                        format: 'image/png',
                                        srs: 'EPSG:4326',
                                        minLevel: response.data.minLevel,
                                        maxLevel: response.data.maxLevel,
                                        minX: response.data.minX,
                                        minY: response.data.minY,
                                        maxX: response.data.maxX,
                                        maxY: response.data.maxY
                                    };
                                    this.dingwei([params.minX, params.minY, params.maxX, params.maxY]);
                                    let imageryLayer = this.addWMTSService(params);
                                    this.addedLayerIds.push({
                                        id: "yulan-" + row.id,
                                        imageryLayer: imageryLayer
                                    });
                                }else{
                                    // 未切片，加载wms服务
                                    params = {
                                        id: row.serviceId,
                                        type: "WMS",
                                        url: this.sdcGeoserverUrl+'/shp/wms',
                                        layer: 'shp:' + row.serviceId,
                                        format: 'image/png',
                                        srs: 'EPSG:4326',
                                        minX: response.data.minX,
                                        minY: response.data.minY,
                                        maxX: response.data.maxX,
                                        maxY: response.data.maxY
                                    };
                                    this.dingwei([params.minX, params.minY, params.maxX, params.maxY]);
                                    let imageryLayer = this.addWMSService(params);
                                    this.addedLayerIds.push({
                                        id: "yulan-" + row.id,
                                        imageryLayer: imageryLayer
                                    });
                                }
                            });
                            break;
                        case '3':
                            const pointList3 = this.getPolygon(row);
                            let minX3 = Math.min(pointList3[0], pointList3[2], pointList3[4], pointList3[6]);
                            let minY3 = Math.min(pointList3[1], pointList3[3], pointList3[5], pointList3[7]);
                            let maxX3 = Math.max(pointList3[0], pointList3[2], pointList3[4], pointList3[6]);
                            let maxY3 = Math.max(pointList3[1], pointList3[3], pointList3[5], pointList3[7]);
                            const extent3 = [minX3, minY3, maxX3, maxY3];
                            this.dingwei(extent3);
                            let terrainProvider = new Cesium.SDCSingleTerrainProvider({
                                url : this.sdcGisserverUrl + '/rest/terrainservice/' +row.serviceId
                            });
                            viewer.scene.globe.depthTestAgainstTerrain = true;
                            viewer.terrainProvider = terrainProvider;
                            break;
                        case '7':

                            break;
                        case '8':
                            params = {
                                minX: row.minX,
                                minY: row.minY,
                                maxX: row.maxX,
                                maxY: row.maxY
                            };
                            this.dingwei([params.minX, params.minY, params.maxX, params.maxY]);
                            let tileset = this.add3DTilesService({
                                url: this.sdcServiceUrl+`/manager/rest/tilesetmeta/tileset/${row.id}/tileset.json`
                            });
                            this.addedLayerIds.push({
                                id: "tileset-" + row.id,
                                tileset: tileset
                            });
                            break;
                    }
                } else {
                    let idx = -1;
                    row.yulanImgSrc = 'image/search/yulan-close.png';
                    switch (this.searchType) {
                        case '1':
                        case '2':
                            for(let i=0,len=this.addedLayerIds.length; i<len; i++){
                                if(this.addedLayerIds[i].id === "yulan-"+row.id){
                                    idx = i;
                                }
                            }
                            viewer.imageryLayers.remove(this.addedLayerIds[idx].imageryLayer);
                            this.addedLayerIds.splice(idx, 1);
                            break;
                        case '3':
                            let terrainProvider = new Cesium.EllipsoidTerrainProvider();
                            viewer.scene.globe.depthTestAgainstTerrain = false;
                            viewer.terrainProvider = terrainProvider;
                            break;
                        case '7':
                            break;
                        case '8':
                            for(let i=0,len=this.addedLayerIds.length; i<len; i++){
                                if(this.addedLayerIds[i].id === "tileset-"+row.id){
                                    idx = i;
                                }
                            }
                            viewer.scene.primitives.remove(this.addedLayerIds[idx].tileset);
                            this.addedLayerIds.splice(idx, 1);
                            break;
                    }
                }
            },
            // 上球(1-影像、2-矢量、3-地形、7-控制点、8-3DTiles。只有发布后的影像可以实现上球)
            shangqiu(row){
                if(row.shangqiuImgSrc.indexOf('image/search/shangqiu-open.png') > -1){
                    row.shangqiuImgSrc = "image/search/shangqiu-close.png";
                    switch (this.searchType) {
                        case '1':
                            let idx = -1;
                            for(let i=0,len=this.addedLayerIds.length; i<len; i++){
                                if(this.addedLayerIds[i].id === "shangqiu-"+row.serviceId){
                                    idx = i;
                                }
                            }
                            viewer.imageryLayers.remove(this.addedLayerIds[idx].imageryLayer);
                            this.addedLayerIds.splice(idx, 1);
                            break;
                        case '2':
                            break;
                        case '3':
                            break;
                        case '8':
                            break;
                    }
                }else{
                    row.shangqiuImgSrc = "image/search/shangqiu-open.png";
                    switch (this.searchType) {
                        case '1':
                            getImageMapService(row.serviceId).then((response)=>{
                                if(response.data.tiled){
                                    // 如果切片，加载wmts服务
                                    let params = {
                                        id: row.serviceId,
                                        type: "WMTS",
                                        url: this.sdcGeoserverUrl+'/gwc/service/wmts',
                                        layer: 'image:' + row.serviceId,
                                        format: 'image/png',
                                        srs: 'EPSG:4326',
                                        minLevel: response.data.minLevel,
                                        maxLevel: response.data.maxLevel,
                                        minX: response.data.minX,
                                        minY: response.data.minY,
                                        maxX: response.data.maxX,
                                        maxY: response.data.maxY
                                    };
                                    this.dingwei([params.minX, params.minY, params.maxX, params.maxY]);
                                    let imageryLayer = this.addWMTSService(params);
                                    this.addedLayerIds.push({
                                        id: "shangqiu-" + row.serviceId,
                                        imageryLayer: imageryLayer
                                    });
                                }else{
                                    // 未切片，加载wms服务
                                    let params = {
                                        id: row.serviceId,
                                        type: "WMS",
                                        url: this.sdcGeoserverUrl+'/image/wms',
                                        layer: 'image:' + row.serviceId,
                                        format: 'image/png',
                                        srs: 'EPSG:4326',
                                        minX: response.data.minX,
                                        minY: response.data.minY,
                                        maxX: response.data.maxX,
                                        maxY: response.data.maxY
                                    };
                                    this.dingwei([params.minX, params.minY, params.maxX, params.maxY]);
                                    let imageryLayer = this.addWMSService(params);
                                    this.addedLayerIds.push({
                                        id: "shangqiu-" + row.serviceId,
                                        imageryLayer: imageryLayer
                                    });
                                }
                            });
                            break;
                        case '2':

                            break;
                        case '3':

                            break;
                        case '7':

                            break;
                        case '8':

                            break;
                    }
                }
            },
            // 详情
            xiangqing(row){
                this.searchResultDataDetails = row;
                this.searchResultDataDetailsShow = true;
                if (this.searchResultDataDetails.epsg) {
                    this.searchResultDataDetails.epsgv = 'EPSG:' + this.searchResultDataDetails.epsg;
                }
            },

            // 每页数量改变
            handleSizeChange(){
                // 删除已经加载的地图服务
                for(let i=0,len=this.addedLayerIds.length; i<len; i++){
                    viewer.imageryLayers.remove(this.addedLayerIds[i].imageryLayer);
                }
                this.addedLayerIds = [];
                this.currentPage = 1;
                this.queryStart();
            },
            // 当前页改变
            handleCurrentChange(){
                // 删除已经加载的地图服务
                for(let i=0,len=this.addedLayerIds.length; i<len; i++){
                    viewer.imageryLayers.remove(this.addedLayerIds[i].imageryLayer);
                }
                this.addedLayerIds = [];
                this.queryStart();
            },

            // 下载
            xiazai(){
                let aTag = document.createElement('a');
                aTag.href = window.GlobalConfig.SDC_SERVER_URL + '/manager/rest/file/downloadFile?id=' + this.searchResultDataDetails.fileId;
                aTag.click();
            },

            // 加载wmts地图服务
            addWMTSService(params){
                const matrixIds = [];
                for (let z = 0; z <= params.maxLevel; z += 1) {
                    matrixIds.push(`${params.srs}:${z}`);
                }
                let minX = Cesium.Math.toRadians(params.minX);
                let minY = Cesium.Math.toRadians(params.minY);
                let maxX = Cesium.Math.toRadians(params.maxX);
                let maxY = Cesium.Math.toRadians(params.maxY);
                let imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
                    url: params.url,
                    layer: params.layer,
                    style: '',
                    format: params.format,
                    tileMatrixSetID: params.srs,
                    tileMatrixLabels: matrixIds,
                    minimumLevel: params.minLevel,
                    maximumLevel: params.maxLevel,
                    tilingScheme: new Cesium.GeographicTilingScheme(),
                    rectangle: new Cesium.Rectangle(minX, minY, maxX, maxY)
                });
                let imageryLayer = new Cesium.ImageryLayer(imageryProvider);
                viewer.imageryLayers.add(imageryLayer);
                return imageryLayer;
            },

            // 加载wms地图服务
            addWMSService(params){
                let minX = Cesium.Math.toRadians(params.minX);
                let minY = Cesium.Math.toRadians(params.minY);
                let maxX = Cesium.Math.toRadians(params.maxX);
                let maxY = Cesium.Math.toRadians(params.maxY);
                let imageryProvider = new Cesium.WebMapServiceImageryProvider({
                    url: params.url,
                    layers: params.layer,
                    parameters:{
                        style: '',
                        format: params.format,
                        transparent: true
                    },
                    tilingScheme: new Cesium.GeographicTilingScheme(),
                    rectangle: new Cesium.Rectangle(minX, minY, maxX, maxY)
                });
                let imageryLayer = new Cesium.ImageryLayer(imageryProvider);
                viewer.imageryLayers.add(imageryLayer);
                return imageryLayer;
            },

            // 加载单张图片地图服务
            addSingleImage(params){
                let imageryProvider = new Cesium.SingleTileImageryProvider({
                    url: params.url,
                    rectangle: Cesium.Rectangle.fromDegrees(params.imageExtent[0], params.imageExtent[1], params.imageExtent[2], params.imageExtent[3])
                });
                let imageryLayer = new Cesium.ImageryLayer(imageryProvider);
                viewer.imageryLayers.add(imageryLayer);
                return imageryLayer;
            },

            // 加载3DTiles数据服务
            add3DTilesService(params){
                let tilesetPromise = new Cesium.Cesium3DTileset({
                    url: params.url
                });
                tilesetPromise.readyPromise.then((tileset) => {
                    viewer.scene.primitives.add(tileset);
                }).otherwise(function (error) {
                    console.log(error);
                });
                return tilesetPromise;
            },

            getPolygon(imgObj) {
                let vertices = [];
                let wkt = imgObj.geom || imgObj.geo;
                let coordStr = wkt.substring(wkt.indexOf("((") + 2, wkt.indexOf("))"));
                let coordParts = coordStr.replace(new RegExp(", ", "gm"), " ").split(" ");
                coordParts.forEach((item) => {
                    vertices.push(parseFloat(item));
                });
                return vertices;
            },
        }
    }
</script>
<style scoped="true">
    #search{
        position: absolute;
        left: 75px;
        top: 100px;
        background-color: #000000aa;
        padding: 10px;
        width: 500px;
    }
    .search-title{
        margin-bottom: 10px;
    }
    #queryResult{
        margin-top: 10px;
    }
    #pageId{
        margin-top: 10px;
    }
</style>
<style>
    #search .el-radio__label {
        color: #ffffff !important;
    }
    #search .el-radio__input.is-checked+.el-radio__label {
        color: #409EFF !important;
    }

    #search .el-tabs__item{
        color: #ffffff !important;
    }
    #search .el-tabs__item.is-active {
        color: #409EFF !important;
    }

    #search .el-form-item__label{
        color: #ffffff !important;
    }
    #search .el-date-editor.el-input{
        width:130px !important;
    }
    #search .el-form-item {
        margin-bottom: 5px !important;
    }

    #mapdrawTab .el-form-item__content{
        max-height:40px !important;
    }

    #queryResult .el-table, #queryResult .el-table__expanded-cell {
        background-color: transparent !important;
        color: #ffffff !important;
    }
    #queryResult .el-table th, .el-table tr {
        background-color: transparent !important;
        color: #ffffff !important;
    }
    #queryResult .el-table__body tr:hover > td{
        background-color:#000000bb !important;
    }
    #queryResult .el-table__body-wrapper{
        max-height: 415px !important;
        overflow-y: auto !important;
    }

    #pageId .el-input__inner{
        background-color: transparent !important;
        color: #ffffff !important;
    }
    #pageId .el-pagination__total{
        color: #ffffff !important;
    }
    #pageId .el-pager li.active, #pageId .el-pagination button{
        background: transparent !important;
    }

    #searchComp .el-input.is-disabled .el-input__inner{
        color: #000000 !important;
    }
</style>
