
import FileSaver from 'file-saver'
if(!window.FileSaver){
    window.FileSaver = FileSaver;
}

import thematicMap from './thematicMap.vue'

let thematicMapPlugin = {};

thematicMapPlugin.install = function(Vue, options){
	Vue.component(thematicMap.name, thematicMap);
};

export default thematicMapPlugin
