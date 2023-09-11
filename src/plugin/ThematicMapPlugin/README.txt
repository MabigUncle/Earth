插件名称：专题图插件 ThematicMap
插件版本：V 2.0
基础环境版本：Vue 2.6.11、Vue-cli 3.X、Cesium 1.73
公司：GEOVIS 中科星图
作者：王照方
功能说明：
    1、支持Cesium canvas截图。
    2、支持文字、比例尺、指北针、图例(颜色-文字、图标-文字)的增加、移动、删除。
    3、支持经纬度刻度线(十进制度)。
    4、支持专题图的下载保存(png格式)。

操作说明：
    1、在Vue项目的main.js中引用专题图插件。
    2、点击"制作专题图"按钮，在专题图制作面板中，加入文字、比例尺、指北针、图例(颜色-文字、图标-文字)等内容。
	3、点击保存按钮，即可下载保存到本地。

API参数说明：
    无

API方法说明：
    1、获取标绘场景序列化Json字符串：this.$refs.CommonPlot.$refs.PlotListTab.plotTransToJson()
	
API事件说明：
    1、closeZtMap：专题图插件的销毁事件

