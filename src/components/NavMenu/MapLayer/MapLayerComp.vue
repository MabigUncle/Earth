<template>
	<div id="mapLayerCompId" class="wrap2">
		<div class="wrap-title">
			<span class="wrap-title-text">图层列表</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close" />
		</div>
		<div class="container">
			<el-tree :data="layerTreeData" show-checkbox default-expand-all node-key="id" ref="mapLayerTree" highlight-current
			 :props="defaultProps" @check-change="treeChange">
			</el-tree>
		</div>
	</div>
</template>

<script>
	let addedLayers = [];
	export default {
		name: 'MapLayerComp',
		data() {
			return {
				layerTreeData: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},

				changeedNodes: [],
			}
		},
		mounted() {
			this.getLayerTree();
		},
		methods: {
			getLayerTree() {
				axios.get('data/LayerTree.json').then((response) => {
					this.layerTreeData = response.data;
					//console.log(response.data);
				})
			},
			// 树节点状态发生改变时（每个状态发生改变的节点都会触发此方法）
			treeChange(node, selfChecked, childrenChecked) {
				if (node.isLayer) {
					if (selfChecked) {
						// 增加图层
						let addedLayer = this.addLayer(node);
						addedLayers.push({
							nodeId: node.id,
							layer: addedLayer
						});
						//console.log(addedLayers);
					} else {
						// 删除图层
						for (let k = addedLayers.length - 1; k >= 0; k--) {
							let obj = addedLayers[k];
							if (obj.nodeId === node.id) {
								viewer.imageryLayers.remove(obj.layer);
								addedLayers.splice(k, 1)
							}
						}
						//console.log(addedLayers);
					}
				}
			},
			addLayer(node) {
				let layer = null;
				let tilingScheme = node.tilingScheme === "4326" ? new Cesium.GeographicTilingScheme() : new Cesium.WebMercatorTilingScheme();
				switch (node.layerServiceType) {
					case 'tms':
						let tmsProvider = new Cesium.UrlTemplateImageryProvider({
							url: node.tmsLayerService.url,
							tilingScheme: tilingScheme
						})
						let tmsLayer = new Cesium.ImageryLayer(tmsProvider);
						viewer.imageryLayers.add(tmsLayer);
						layer = tmsLayer;
						break;
					case 'wms':
						let wmsProvider = new Cesium.WebMapServiceImageryProvider({
							url: node.wmsLayerService.url,
							layers: node.wmsLayerService.layers,
							tilingScheme: tilingScheme,
							parameters: {
								styles: node.wmsLayerService.styles,
								format: node.wmsLayerService.format,
								transparent: node.wmsLayerService.transparent
							}
						})
						let wmsLayer = new Cesium.ImageryLayer(wmsProvider);
						viewer.imageryLayers.add(wmsLayer);
						layer = wmsLayer;
						break;
					case 'wmts':
						let wmtsProvider = new Cesium.WebMapTileServiceImageryProvider({
							url: node.wmtsLayerService.url,
							layer: node.wmtsLayerService.layer,
							tilingScheme: tilingScheme,
							style: node.wmtsLayerService.style,
							format: node.wmtsLayerService.format,
							tileMatrixSetID: node.wmtsLayerService.tileMatrixSetID
						});
						let wmtsLayer = new Cesium.ImageryLayer(wmtsProvider);
						viewer.imageryLayers.add(wmtsLayer);
						layer = wmtsLayer;
						break;
				}
				return layer;
			},
			// 关闭div
			closeDiv() {
				Bus.$emit("MapLayerComp-CloseComp");
			}
		},
		beforeDestroy() {

		}
	}
</script>

<style>
</style>
