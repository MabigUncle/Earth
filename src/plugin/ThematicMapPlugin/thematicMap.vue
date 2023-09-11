<template>
	<div id="ztMapDiv" v-show="ztMapVisible">
		<div class="title">专题图制作</div>
		<img src="image/ztMap/close2.png" @click="closeZtMap" class="closeZT" title="关闭" />
		<img src="image/ztMap/save.png" @click="saveZtMap" class="saveZT" title="保存" />
		<div id="mapTools">
			<el-tabs type="border-card">
				<el-tab-pane label="文字">
					<div id="wangEditorDiv"></div>
					<el-button type="primary" size="small" @click="addTextToCanvas">添加</el-button>
				</el-tab-pane>
				<el-tab-pane label="图例">
					<el-form ref="form" :model="form" label-width="80px">
						<el-form-item label="图例类型">
							<el-select v-model="form.type" placeholder="请选择图例类型">
								<el-option label="颜色-文字" value="color-text"></el-option>
								<el-option label="图标-文字" value="image-text"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="颜色" v-show="form.type==='color-text'">
							<el-color-picker v-model="form.color" size="medium"></el-color-picker>
						</el-form-item>
						<el-form-item label="图标" v-show="form.type==='image-text'">
							<el-upload ref="legendUpload" action="" :auto-upload="false" :limit="1" :file-list="form.fileList" :on-change="fileChange"
							 :on-exceed="fileExceed" accept="image/png, image/jpeg">
								<el-button size="small" type="primary">点击上传</el-button>
							</el-upload>
						</el-form-item>
						<el-form-item label="文字">
							<el-input v-model="form.label"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="addLegend" size="small">添加</el-button>
							<el-button type="primary" @click="exportLegend" size="small">导出</el-button>
							<el-upload ref="importLegendUpload" action="" :auto-upload="false" :limit="1" :on-change="importLegendChange"
							 :show-file-list="false" style="display: inline-block;margin-left: 10px;">
								<el-button type="primary" size="small">导入</el-button>
							</el-upload>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="比例尺">
					<div style="text-align: center;margin-bottom: 20px;">
						<div>
							<img src="image/ztMap/scale.png" style="width: 50px;height: 10px" />
						</div>
						<el-button type="primary" size="small" @click="addScale('image/ztMap/scale.png')">添加</el-button>
					</div>
				</el-tab-pane>
				<el-tab-pane label="指北针">
					<div style="text-align: center;margin-bottom: 20px;">
						<div>
							<img src="image/ztMap/north1.jpg" style="width: 100px;height: 100px" />
						</div>
						<el-button type="primary" size="small" @click="addNorth('image/ztMap/north1.jpg')">添加</el-button>
					</div>
					<div style="text-align: center;margin-bottom: 20px;">
						<div>
							<img src="image/ztMap/north2.jpg" style="width: 100px;height: 100px" />
						</div>
						<el-button type="primary" size="small" @click="addNorth('image/ztMap/north2.jpg')">添加</el-button>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<div id="mapDiv">
			<div id="canvasDiv">
				<img id="canvasImg" />
			</div>
		</div>

		<el-dialog title="请选择专题图输出格式" :modal="modal" :show-close="showClose" :close-on-click-modal="closeOnClickModal"
		 :visible.sync="dialogVisible" center width="30%">
			<el-select v-model="imgFormat" placeholder="请选择专题图输出格式">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" size="mini" @click="saveImg">保 存</el-button>
				<el-button type="primary" size="mini" @click="dialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'ThematicMap',
		data() {
			return {
				ztMapVisible: false,

				// 经纬度刻度标注份数
				degreeXMarkNum: 4,
				degreeYMarkNum: 3,
				// 刻度线的长度
				markPxLen: 10,
				// 刻度线距图片的距离
				markToImgPxLen: 2,
				// 标注距图片的距离
				locationToImgPxLen: 18,

				// 富文本编辑器实例
				editor: null,
				// 地图比例尺
				mapScale: '',
				// 图例表单
				form: {
					type: 'color-text',
					color: '#409EFF',
					fileList: [],
					label: '',
				},
				// 已经添加的图例元素
				addedLegendArr: [],

				dialogVisible: false,
				modal: false,
				showClose: false,
				closeOnClickModal: false,
				imgFormat: 'jpg',
				options: [{
					label: 'jpg',
					value: 'jpg'
				}, {
					label: 'png',
					value: 'png'
				}, {
					label: 'bmp',
					value: 'bmp'
				}, {
					label: 'tiff',
					value: 'tiff'
				}]
			}
		},
		mounted() {
			this.createEditor();
		},
		methods: {
			// 点击专题图按钮
			initZT() {
				if (!viewer) {
					this.$message({
						message: '请先初始化地球viewer，并放在window作用域中！',
						type: 'warning'
					});
					return;
				}
				let bound = this.getViewRectangle();
				if (bound.minLon === -180 || bound.minLat === -90 || bound.maxLon === 180 || bound.maxLat === 90) {
					this.$message({
						message: '当前相机视角太高，经纬度计算不准确，请放大地球！',
						type: 'warning'
					});
					return;
				}
				// 获取canvas，只需要定义图片的宽度（高度计算得到）
				let canvas = viewer.scene.canvas;
				let imageWidth = 800;
				let imageHeight = imageWidth * canvas.height / canvas.width;
				let genimg = Canvas2Image.convertToImage(canvas, imageWidth, imageHeight, 'jpg');
				let image = document.getElementById('canvasImg');
				image.style.width = imageWidth + "px";
				image.style.height = imageHeight + "px";
				image.src = genimg.src;
				this.ztMapVisible = true;
				this.$nextTick(() => {
					// 绘制刻度线
					this.degreeMark(bound);
					console.log("专题图插件加载完成");
				})
			},
			// 关闭专题图
			closeZtMap() {
				this.ztMapVisible = false;
				this.$emit("closeZtMap");
			},
			// 保存专题图
			saveZtMap() {
				this.dialogVisible = true;
			},
			saveImg() {
				let _this = this;
				this.dialogVisible = false;
				let mapDiv = document.getElementById("mapDiv");
				html2canvas(mapDiv).then(function(canvas) {
					let canvasWidth = canvas.width;
					let canvasHeight = canvas.height;
					let img = Canvas2Image.convertToImage(canvas, canvasWidth, canvasHeight);
					let filename = "专题图." + _this.imgFormat;
					_this.saveFile(img.src, filename);
				});
			},
			// 保存文件
			saveFile(data, filename) {
				let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
				save_link.href = data;
				save_link.download = filename;
				let event = document.createEvent('MouseEvents');
				event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				save_link.dispatchEvent(event);
			},

			// 经纬度刻度线
			degreeMark(bound) {
				let canvasImg = document.getElementById("canvasImg");
				let imgWidth = canvasImg.width;
				let imgHeight = canvasImg.height;
				let imgLeft = canvasImg.getBoundingClientRect().left;
				let imgTop = canvasImg.getBoundingClientRect().top;
				let divLeft = document.getElementById("canvasDiv").getBoundingClientRect().left;
				let divTop = document.getElementById("canvasDiv").getBoundingClientRect().top;
				console.log(imgWidth, imgHeight, imgLeft, imgTop, divLeft, divTop);
				// 计算像素和经纬度的步长
				let pxX = imgWidth / this.degreeXMarkNum;
				let pxY = imgHeight / this.degreeYMarkNum;
				let stepLon = (bound.maxLon - bound.minLon) / this.degreeXMarkNum;
				let stepLat = (bound.maxLat - bound.minLat) / this.degreeYMarkNum;
				// 绘制 top和bottom 的刻度线
				for (let i = 1; i <= this.degreeXMarkNum - 1; i++) {
					let x = (imgLeft - divLeft) + i * pxX;
					let y = (imgTop - divTop);
					let lon = bound.minLon + stepLon * i;
					this.createOneMark(x, y, "top", lon.toFixed(4), bound.maxLat.toFixed(4), "top-" + i);
					this.createOneMark(x, y + imgHeight, "bottom", lon.toFixed(4), bound.minLat.toFixed(4), "bottom-" + i);
				}
				// 绘制 left和right 的刻度线
				for (let j = 1; j <= this.degreeYMarkNum - 1; j++) {
					let x = (imgLeft - divLeft);
					let y = (imgTop - divTop) + j * pxY;
					let lat = bound.maxLat - j * stepLat;
					this.createOneMark(x, y, "left", bound.minLon.toFixed(4), lat.toFixed(4), "left-" + j);
					this.createOneMark(x + imgWidth, y, "right", bound.maxLon.toFixed(4), lat.toFixed(4), "right-" + j);
				}
			},
			// 创建单个刻度线和经纬度标注
			createOneMark(left, top, direction, lon, lat, divId) {
				let mark = document.createElement("div");
				mark.id = "mark-" + divId;
				mark.style.position = 'absolute';
				mark.style.zIndex = 100;
				mark.style.width = this.markPxLen + "px";
				mark.style.height = this.markPxLen + "px";
				mark.style.position = "absolute";
				let location = document.createElement("div");
				location.id = "location-" + divId;
				location.style.position = 'absolute';
				location.style.zIndex = 100;
				location.style.position = "absolute";
				switch (direction) {
					case 'top':
						mark.style.left = left + "px";
						mark.style.top = (top - (this.markPxLen + this.markToImgPxLen)) + "px";
						mark.style.borderLeft = "2px solid #000000";
						location.style.left = (left - 30) + "px";
						location.style.top = (top - this.locationToImgPxLen - 21) + "px";
						location.innerHTML = lon + "°";
						break;
					case 'bottom':
						mark.style.left = left + "px";
						mark.style.top = (top + this.markToImgPxLen) + "px";
						mark.style.borderLeft = "2px solid #000000";
						location.style.left = (left - 30) + "px";
						location.style.top = (top + this.locationToImgPxLen) + "px";
						location.innerHTML = lon + "°";
						break;
					case 'left':
						mark.style.left = (left - (this.markPxLen + this.markToImgPxLen)) + "px";
						mark.style.top = top + "px";
						mark.style.borderTop = "2px solid #000000";
						location.style.left = (left - 55) + "px";
						location.style.top = (top - 10) + "px";
						location.innerHTML = lat + "°";
						location.style.transform = "rotate(90deg)";
						break;
					case 'right':
						mark.style.left = (left + this.markToImgPxLen) + "px";
						mark.style.top = top + "px";
						mark.style.borderTop = "2px solid #000000";
						location.style.left = (left - 5) + "px";
						location.style.top = (top - 15) + "px";
						location.innerHTML = lat + "°";
						location.style.transform = "rotate(-90deg)";
						break;
				}
				document.getElementById("canvasDiv").appendChild(mark);
				document.getElementById("canvasDiv").appendChild(location);
			},
			// 获取当前视角的经纬度范围
			getViewRectangle() {
				let rect = viewer.camera.computeViewRectangle();
				let minLon = Cesium.Math.toDegrees(rect.west);
				let maxLon = Cesium.Math.toDegrees(rect.east);
				let minLat = Cesium.Math.toDegrees(rect.south);
				let maxLat = Cesium.Math.toDegrees(rect.north);
				return {
					minLon: minLon,
					maxLon: maxLon,
					minLat: minLat,
					maxLat: maxLat
				};
			},

			// 创建富文本编辑器
			createEditor() {
				const E = window.wangEditor;
				this.editor = new E('#wangEditorDiv');
				// 是否显示全屏按钮
				this.editor.config.showFullScreen = false;
				// 菜单栏提示为下标
				// editor.config.menuTooltipPosition = 'down'
				// 配置菜单栏，删减菜单，调整顺序
				this.editor.config.menus = [
					'bold',
					'fontSize',
					'fontName',
					'italic',
					'foreColor',
					'backColor',
				];
				this.editor.create();
			},
			// 增加文字元素
			addTextToCanvas() {
				let htmlStr = this.editor.txt.html();
				let textDivId = this.createDynamicTextMapItem(htmlStr);
				this.createTextDeleteMapItem(textDivId);
			},
			// 添加指北针元素
			addNorth(imgSrc) {
				let northDivId = this.createDynamicNorthMapItem(imgSrc);
				this.createNorthDeleteMapItem(northDivId);
			},
			// 添加比例尺(1cm = 25px)
			addScale(imgSrc) {
				let scaleDivId = this.createDynamicScaleMapItem(imgSrc);
				this.createScaleDeleteMapItem(scaleDivId);
			},
			// 计算比例尺(1px的实际距离km)
			calcScale(bound, mapWidth, mapHeight) {
				// 纬度 1度=111km
				return (bound.maxLat - bound.minLat) * 111 / mapHeight;
			},

			// 增加图例
			addLegend() {
				let _this = this;
				if (this.form.label.trim() === '') {
					this.$message({
						message: '请输入图例中的文字！',
						type: 'warning'
					});
					return;
				}
				switch (this.form.type) {
					case 'color-text':
						let divs = this.createDynamicLegendColorMapItem(this.form.color, this.form.label, 150);
						this.createLegendColorDeleteMapItem(divs.legendDiv, divs.colorDiv, divs.textDiv);
						break;
					case 'image-text':
						let reader = new FileReader();
						reader.readAsDataURL(_this.form.fileList[0]);
						reader.onload = function(event) {
							let divs = _this.createDynamicLegendIconMapItem(event.target.result, _this.form.label, 150);
							_this.createLegendIconDeleteMapItem(divs.legendDiv2, divs.iconImg, divs.textDiv2);
						}
						break;
				}
			},
			fileChange(file, fileList) {
				let fs = document.getElementsByName('file');
				if (fs.length > 0) {
					fs.value = null
				}
				this.form.fileList = [];
				this.form.fileList.push(file.raw);
			},
			// 图例图标上传文件超出限制时，即文件发生改变。files:选择的具体文件，类型为File
			fileExceed(files, fileList) {
				let fs = document.getElementsByName('file');
				if (fs.length > 0) {
					fs.value = null
				}
				this.form.fileList = [];
				this.form.fileList.push(files[0]);
			},

			// 导入图例
			importLegendChange(file, fileList) {
				let _this = this;
				let reader = new FileReader();
				reader.readAsText(file.raw);
				reader.onload = function(event) {
					_this.$refs.importLegendUpload.clearFiles();
					let jsonArr = JSON.parse(event.target.result);
					for (let i = 0; i < jsonArr.length; i++) {
						let item = jsonArr[i];
						switch (item.type) {
							case 'color-text':
								_this.addedLegendArr.push({
									type: item.type,
									color: item.color,
									text: item.text
								})
								let divs = _this.createDynamicLegendColorMapItem(item.color, item.text, i * 55 + 150);
								_this.createLegendColorDeleteMapItem(divs.legendDiv, divs.colorDiv, divs.textDiv);
								break;
							case 'image-text':
								_this.addedLegendArr.push({
									type: item.type,
									image: item.image,
									text: item.text
								})
								let divs2 = _this.createDynamicLegendIconMapItem(item.image, item.text, i * 55 + 150);
								_this.createLegendIconDeleteMapItem(divs2.legendDiv2, divs2.iconImg, divs2.textDiv2);
								break;
						}
					}
				}
			},
			// 导出图例
			exportLegend() {
				let jsonStr = JSON.stringify(this.addedLegendArr);
				console.log(jsonStr);
				let blob = new Blob([jsonStr], {
					type: "text/json;charset=utf-8"
				});
				FileSaver.saveAs(blob, "图例.json");
			},


			// 创建可移动的文本div
			createDynamicTextMapItem(text) {
				let mapItemDiv = document.createElement("div");
				mapItemDiv.id = this.generateUUID();
				mapItemDiv.innerHTML = text;
				mapItemDiv.style.position = "absolute";
				mapItemDiv.style.top = "10px";
				mapItemDiv.style.left = "10px";
				document.getElementById("mapDiv").appendChild(mapItemDiv);
				this.addMapItemEvent(mapItemDiv.id, "block");
				return mapItemDiv.id;
			},
			// 创建可移动的指北针div
			createDynamicNorthMapItem(imgSrc) {
				let mapItemDiv = document.createElement("div");
				mapItemDiv.id = this.generateUUID();
				mapItemDiv.style.position = "absolute";
				mapItemDiv.style.top = "10px";
				mapItemDiv.style.left = "10px";
				document.getElementById("mapDiv").appendChild(mapItemDiv);
				this.addMapItemEvent(mapItemDiv.id, "block");
				let northImgDiv = document.createElement("img");
				northImgDiv.style.position = "absolute";
				northImgDiv.style.top = "0px";
				northImgDiv.style.left = "0px";
				northImgDiv.src = imgSrc;
				northImgDiv.width = 100;
				northImgDiv.height = 100;
				mapItemDiv.appendChild(northImgDiv);
				return mapItemDiv.id;
			},
			// 创建可移动的比例尺div
			createDynamicScaleMapItem(imgSrc) {
				let bound = this.getViewRectangle();
				let imgWidth = document.getElementById("canvasImg").width;
				let imgHeight = document.getElementById("canvasImg").height;
				let s = this.calcScale(bound, imgWidth, imgHeight);
				// 比例尺的固定宽高为 100*20
				console.log("比例尺为：100px - " + parseInt(s * 100) + "KM");
				// 创建比例尺 DOM元素
				let scaleDiv = document.createElement("div");
				scaleDiv.id = this.generateUUID();
				scaleDiv.style.position = "absolute";
				scaleDiv.style.bottom = "30px";
				scaleDiv.style.left = "30px";
				let scaleImgDiv = document.createElement("img");
				scaleImgDiv.style.position = "absolute";
				scaleImgDiv.style.top = "0px";
				scaleImgDiv.style.left = "0px";
				scaleImgDiv.src = imgSrc;
				scaleImgDiv.width = 100;
				scaleImgDiv.height = 20;
				scaleDiv.appendChild(scaleImgDiv);
				document.getElementById("mapDiv").appendChild(scaleDiv);
				this.addMapItemEvent(scaleDiv.id, "inline");
				// 创建比例尺文字 DOM元素
				let textDiv = document.createElement("span");
				textDiv.style.position = "relative";
				textDiv.style.bottom = "15px";
				textDiv.style.left = "20px";
				textDiv.innerHTML = parseInt(s * 100) + "KM";
				scaleDiv.appendChild(textDiv);
				return scaleDiv.id;
			},
			// 创建可移动的 颜色-文本 图例
			createDynamicLegendColorMapItem(color, text, topStyle) {
				let legendDiv = document.createElement("div");
				legendDiv.id = this.generateUUID();
				legendDiv.style.position = "absolute";
				legendDiv.style.top = topStyle + "px";
				legendDiv.style.left = "1000px";
				this.addedLegendArr.push({
					type: 'color-text',
					color: color,
					text: text
				})
				let colorDiv = document.createElement("div");
				colorDiv.style.position = "absolute";
				colorDiv.style.top = "0px";
				colorDiv.style.left = "0px";
				colorDiv.style.backgroundColor = color;
				colorDiv.style.border = "1px solid #000000";
				colorDiv.style.width = "50px";
				colorDiv.style.height = "20px";
				legendDiv.appendChild(colorDiv);
				document.getElementById("mapDiv").appendChild(legendDiv);
				this.addMapItemEvent(legendDiv.id, "inline");
				// 创建图例文字 DOM元素
				let textDiv = document.createElement("div");
				textDiv.style.position = "relative";
				textDiv.style.bottom = "0px";
				textDiv.style.left = "60px";
				textDiv.innerHTML = text;
				legendDiv.appendChild(textDiv);
				return {
					legendDiv,
					colorDiv,
					textDiv
				}
			},
			// 创建可移动的 图标-文本 图例
			createDynamicLegendIconMapItem(iconSrc, text, topStyle) {
				let legendDiv2 = document.createElement("div");
				legendDiv2.style.position = "absolute";
				legendDiv2.style.top = topStyle + "px";
				legendDiv2.style.left = "1000px";
				legendDiv2.id = this.generateUUID();
				this.addedLegendArr.push({
					type: 'image-text',
					image: iconSrc,
					text: text
				})
				let iconImg = document.createElement("img");
				iconImg.src = iconSrc;
				iconImg.style.position = "absolute";
				iconImg.style.top = "0px";
				iconImg.style.left = "0px";
				iconImg.style.width = "50px";
				iconImg.style.height = "50px";
				legendDiv2.appendChild(iconImg);
				document.getElementById("mapDiv").appendChild(legendDiv2);
				this.addMapItemEvent(legendDiv2.id, "inline");
				// 创建图例文字 DOM元素
				let textDiv2 = document.createElement("div");
				textDiv2.style.position = "relative";
				textDiv2.style.top = "12px";
				textDiv2.style.left = "60px";
				textDiv2.innerHTML = text;
				legendDiv2.appendChild(textDiv2);
				return {
					legendDiv2,
					iconImg,
					textDiv2
				}
			},

			// 创建文本删除按钮，以及绑定删除事件
			createTextDeleteMapItem(parentDivId) {
				let imgDiv = document.createElement("img");
				imgDiv.id = "closeImg-" + parentDivId;
				imgDiv.style.position = "absolute";
				imgDiv.style.top = "0px";
				imgDiv.style.right = "-16px";
				imgDiv.style.display = "none";
				imgDiv.title = "删除";
				imgDiv.src = "image/ztMap/close3.png";
				imgDiv.width = 20;
				imgDiv.height = 20;
				let parentDiv = document.getElementById(parentDivId);
				parentDiv.appendChild(imgDiv);
				imgDiv.onclick = function(e) {
					parentDiv.remove();
				}
			},
			// 创建指北针删除按钮，以及绑定删除事件
			createNorthDeleteMapItem(parentDivId) {
				let imgDiv = document.createElement("img");
				imgDiv.id = "closeImg-" + parentDivId;
				imgDiv.style.position = "absolute";
				imgDiv.style.top = "0px";
				imgDiv.style.left = "80px";
				imgDiv.style.display = "none";
				imgDiv.title = "删除";
				imgDiv.src = "image/ztMap/close3.png";
				imgDiv.width = 20;
				imgDiv.height = 20;
				let parentDiv = document.getElementById(parentDivId);
				parentDiv.appendChild(imgDiv);
				imgDiv.onclick = function(e) {
					parentDiv.remove();
				}
			},
			// 创建比例尺删除按钮，以及绑定删除事件
			createScaleDeleteMapItem(parentDivId) {
				let imgDiv = document.createElement("img");
				imgDiv.id = "closeImg-" + parentDivId;
				imgDiv.style.position = "relative";
				imgDiv.style.top = "-15px";
				imgDiv.style.left = "25px";
				imgDiv.style.display = "none";
				imgDiv.title = "删除";
				imgDiv.src = "image/ztMap/close3.png";
				imgDiv.width = 20;
				imgDiv.height = 20;
				let parentDiv = document.getElementById(parentDivId);
				parentDiv.appendChild(imgDiv);
				imgDiv.onclick = function(e) {
					parentDiv.remove();
				}
			},
			// 创建 颜色-文本 删除按钮，以及绑定删除事件
			createLegendColorDeleteMapItem(legendDiv, colorDiv, textDiv) {
				let imgDiv = document.createElement("img");
				imgDiv.style.position = "relative";
				imgDiv.style.bottom = "30px";
				imgDiv.style.left = colorDiv.offsetWidth + textDiv.offsetWidth + "px";
				imgDiv.style.display = "none";
				imgDiv.title = "删除";
				imgDiv.src = "image/ztMap/close3.png";
				imgDiv.width = 20;
				imgDiv.height = 20;
				imgDiv.id = "closeImg-" + legendDiv.id;
				legendDiv.appendChild(imgDiv);
				imgDiv.onclick = function(e) {
					legendDiv.remove();
				}
			},
			// 创建 图片-文本 删除按钮，以及绑定删除事件
			createLegendIconDeleteMapItem(legendDiv2, iconImg, textDiv2) {
				let imgDiv2 = document.createElement("img");
				imgDiv2.style.position = "relative";
				imgDiv2.style.bottom = "20px";
				imgDiv2.style.left = iconImg.offsetWidth + textDiv2.offsetWidth + "px";
				imgDiv2.style.display = "none";
				imgDiv2.title = "删除";
				imgDiv2.src = "image/ztMap/close3.png";
				imgDiv2.width = 20;
				imgDiv2.height = 20;
				imgDiv2.id = "closeImg-" + legendDiv2.id;
				legendDiv2.appendChild(imgDiv2);
				imgDiv2.onclick = function(e) {
					legendDiv2.remove();
				}
			},
			// 专题图元素增加鼠标事件
			addMapItemEvent(mapItemDivId, display) {
				let mapItemDiv = document.getElementById(mapItemDivId);
				mapItemDiv.onmouseover = function(e) {
					document.getElementById("closeImg-" + mapItemDivId).style.display = display;
				};
				mapItemDiv.onmouseleave = function(e) {
					document.getElementById("closeImg-" + mapItemDivId).style.display = "none";
				};
				mapItemDiv.onmousedown = function(e) {
					e.preventDefault();
					let x = e.clientX;
					let y = e.clientY;
					let l = mapItemDiv.offsetLeft;
					let t = mapItemDiv.offsetTop;
					let isDown = true;
					mapItemDiv.style.cursor = "move";
					document.onmousemove = function(e2) {
						e2.preventDefault();
						if (isDown) {
							let nx = e2.clientX;
							let ny = e2.clientY;
							let nl = nx - (x - l);
							let nt = ny - (y - t);
							mapItemDiv.style.left = nl + 'px';
							mapItemDiv.style.top = nt + 'px';
							document.onmouseup = function(e3) {
								e3.preventDefault();
								isDown = false;
								mapItemDiv.style.cursor = "default";
							}
						}
					}
				}
			},

			// 创建UUID
			generateUUID() {
				let d = new Date().getTime();
				if (window.performance && typeof window.performance.now === "function") {
					d += window.performance.now();
				}
				let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					let r = (d + Math.random() * 16) % 16 | 0;
					d = Math.floor(d / 16);
					return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
				});
				return uuid;
			}
		}
	}
</script>

<style scoped>
	#ztMapDiv {
		position: fixed;
		left: 10%;
		top: 10%;
		width: 1550px;
		height: 670px;
		padding: 10px;
		z-index: 100;
		background-color: #ffffff;
		border: 2px solid #000000;
		user-select: none;
	}

	#mapDiv {
		position: absolute;
		width: 1160px;
		height: 600px;
		left: 25px;
		top: 70px;
		border: 1px solid #000000;
	}

	#mapTools {
		position: absolute;
		right: 15px;
		top: 70px;
	}

	.title {
		text-align: center;
		font-size: 20px;
		font-weight: bold;
	}

	#canvasDiv {
		position: absolute;
		width: 800px;
		height: 390px;
		left: 50px;
		top: 110px;
	}

	#wangEditorDiv {
		margin-top: 20px;
		margin-bottom: 20px;
		width: 300px;
	}

	.closeZT {
		position: absolute;
		right: 10px;
		top: 10px;
		z-index: 100;
		cursor: pointer;
		width: 20px;
		height: 20px;
	}

	.saveZT {
		position: absolute;
		right: 50px;
		top: 10px;
		z-index: 100;
		cursor: pointer;
		width: 20px;
		height: 20px;
	}
</style>

<style>
	#ztMapDiv .el-form-item__label {
		color: #000000 !important;
	}
</style>
