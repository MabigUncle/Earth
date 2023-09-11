import Vue from 'vue'

// import ThematicMapPlugin from './ThematicMapPlugin.js'
// Vue.use(ThematicMapPlugin);

import ThematicMapPlugin from './ThematicMapPlugin/index.js'
Vue.use(ThematicMapPlugin);



// import PlotPlugin from './PlotPlugin.js';
// Vue.use(PlotPlugin);

import CommonPlotPlugin from './CommonPlotPlugin/main.js';
Vue.use(CommonPlotPlugin);
