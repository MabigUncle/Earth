
// 引入vue事件总线
import PlotBus from './bus/Bus'
if(!window.PlotBus){
    window.PlotBus = PlotBus;
}else{
	console.log("PlotBus变量已经存在!");
}

// 引入CesiumUtil
import CesiumUtil from './js/CesiumUtil'
if(!window.CesiumUtil){
    window.CesiumUtil = CesiumUtil;
}

// 引入EntityEdit
import EntityEdit from './js/EntityEdit'
if(!window.EntityEdit){
    window.EntityEdit = EntityEdit;
}

// FileSaver
import FileSaver from 'file-saver'
if(!window.FileSaver){
    window.FileSaver = FileSaver;
}

// 引入JsUtil
import JsUtil from './js/JsUtil'
if(!window.JsUtil){
    window.JsUtil = JsUtil;
}

// 引入axios
import axios from 'axios';
if(!window.axios){
    window.axios = axios;
}

import CommonPlot from './plot/CommonPlot.vue'
import CommonEditPlot from './plot/CommonEditPlot.vue'
import PointImageSelect from './plot/PointImageSelect.vue'


let CommonPlotPlugin = {};
CommonPlotPlugin.install = function(Vue, options){
    Vue.component(CommonPlot.name, CommonPlot);
    Vue.component(CommonEditPlot.name, CommonEditPlot);
    Vue.component(PointImageSelect.name, PointImageSelect);
};

export default CommonPlotPlugin;