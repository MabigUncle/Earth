 // primitive-webgl方式绘制大量点, 线, 三角形, 矩形(2个三角形组成)
(function() {
	//画点(componentsPerPositionAttribute必须为3)
	function addPrimitivePoints(viewer, pointPositionArr, componentsPerPositionAttribute, pointColorArr, componentsPerColorAttribute) {
		// 着色器代码
		let vertexShader = getVS();
		let fragmentShader = getFS();

		//顶点索引（坐标点下标的连接顺序）
		let indicesTesm = [];
		let pointNum = (pointPositionArr.length) / componentsPerPositionAttribute;
		for (let i = 0; i < pointNum; i++) {
			indicesTesm.push(i);
		}

		let positionArr = new Float64Array(pointPositionArr);
		let colorArr = new Float32Array(pointColorArr);
		let indiceArr = new Uint32Array(indicesTesm);
		let geometry = createGeometry(Cesium.PrimitiveType.POINTS, positionArr,
			componentsPerPositionAttribute, colorArr, componentsPerColorAttribute, indiceArr);
		let appearance = createAppearence(fragmentShader, vertexShader);

		let primitive = new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: geometry
			}),
			appearance: appearance,
			asynchronous: false
		});
		return viewer.scene.primitives.add(primitive);
	}

	//画线(每2个顶点相连组成一条线)
	function addPrimitiveLines(viewer, pointPositionArr, componentsPerPositionAttribute, pointColorArr,
		componentsPerColorAttribute) {
		let vertexShader = getVS();
		let fragmentShader = getFS();
		//顶点索引（坐标点下标的连接顺序）
		let indicesTesm = [];
		let pointNum = (pointPositionArr.length) / componentsPerPositionAttribute;
		for (let i = 0; i < pointNum; i++) {
			indicesTesm.push(i);
		}

		let positionArr = new Float64Array(pointPositionArr);
		let colorArr = new Float32Array(pointColorArr);
		let indiceArr = new Uint32Array(indicesTesm);

		let geometry = createGeometry(Cesium.PrimitiveType.LINES, positionArr,
			componentsPerPositionAttribute, colorArr, componentsPerColorAttribute, indiceArr);
		let appearance = createAppearence(fragmentShader, vertexShader);

		let primitive = new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: geometry
			}),
			appearance: appearance
		})
		return viewer.scene.primitives.add(primitive);
	}

	//画线(所有的顶点前后相连组成一条线)
	function addPrimitiveLinesStrip(viewer, pointPositionArr, componentsPerPositionAttribute, pointColorArr,
		componentsPerColorAttribute) {
		let vertexShader = getVS();
		let fragmentShader = getFS();
		//顶点索引（坐标点下标的连接顺序）
		let indicesTesm = [];
		let pointNum = (pointPositionArr.length) / componentsPerPositionAttribute;
		for (let i = 0; i < pointNum; i++) {
			indicesTesm.push(i);
		}

		let positionArr = new Float64Array(pointPositionArr);
		let colorArr = new Float32Array(pointColorArr);
		let indiceArr = new Uint32Array(indicesTesm);

		let geometry = createGeometry(Cesium.PrimitiveType.LINE_STRIP, positionArr,
			componentsPerPositionAttribute, colorArr, componentsPerColorAttribute, indiceArr);
		let appearance = createAppearence(fragmentShader, vertexShader);

		let primitive = new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: geometry
			}),
			appearance: appearance
		})
		return viewer.scene.primitives.add(primitive);
	}

	//画线(所有的顶点前后相连组成一条闭合的线)
	function addPrimitiveLinesLoop(viewer, pointPositionArr, componentsPerPositionAttribute, pointColorArr,
		componentsPerColorAttribute) {
		let vertexShader = getVS();
		let fragmentShader = getFS();
		//顶点索引（坐标点下标的连接顺序）
		let indicesTesm = [];
		let pointNum = (pointPositionArr.length) / componentsPerPositionAttribute;
		for (let i = 0; i < pointNum; i++) {
			indicesTesm.push(i);
		}

		let positionArr = new Float64Array(pointPositionArr);
		let colorArr = new Float32Array(pointColorArr);
		let indiceArr = new Uint32Array(indicesTesm);

		let geometry = createGeometry(Cesium.PrimitiveType.LINE_LOOP, positionArr,
			componentsPerPositionAttribute, colorArr, componentsPerColorAttribute, indiceArr);
		let appearance = createAppearence(fragmentShader, vertexShader);

		let primitive = new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: geometry
			}),
			appearance: appearance
		})
		return viewer.scene.primitives.add(primitive);
	}

	//画三角形(每3个顶点相连组成一个三角形)
	function addPrimitiveTriangles(viewer, pointPositionArr, componentsPerPositionAttribute, pointColorArr, componentsPerColorAttribute) {
		let vertexShader = getVS();
		let fragmentShader = getFS();
		//顶点索引（坐标点下标的连接顺序）
		let indicesTesm = [];
		let pointNum = (pointPositionArr.length) / componentsPerPositionAttribute;
		for (let i = 0; i < pointNum; i++) {
			indicesTesm.push(i);
		}

		let positionArr = new Float64Array(pointPositionArr);
		let colorArr = new Float32Array(pointColorArr);
		let indiceArr = new Uint32Array(indicesTesm);

		let geometry = createGeometry(Cesium.PrimitiveType.TRIANGLES, positionArr,
			componentsPerPositionAttribute, colorArr, componentsPerColorAttribute, indiceArr);
		let appearance = createAppearence(fragmentShader, vertexShader);

		let primitive = new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: geometry
			}),
			appearance: appearance
		})
		return viewer.scene.primitives.add(primitive);
	}

	// 画三角形(从第三个顶点开始,每个顶点和它前面的一个顶点以及第一个顶点相连组成一个三角形: 圆 圆锥体)
	function addPrimitiveTrianglesFan(viewer, pointPositionArr, componentsPerPositionAttribute, pointColorArr,
		componentsPerColorAttribute) {
		let vertexShader = getVS();
		let fragmentShader = getFS();
		//顶点索引（坐标点下标的连接顺序）
		let indicesTesm = [];
		let pointNum = (pointPositionArr.length)/componentsPerPositionAttribute;
		for (let i = 2; i < pointNum; i++) {
			indicesTesm.push(0);
			indicesTesm.push(i-1);
			indicesTesm.push(i);
		}

		let positionArr = new Float64Array(pointPositionArr);
		let colorArr = new Float32Array(pointColorArr);
		let indiceArr = new Uint32Array(indicesTesm);

		let geometry = createGeometry(Cesium.PrimitiveType.TRIANGLE_FAN, positionArr,
			componentsPerPositionAttribute, colorArr, componentsPerColorAttribute, indiceArr);
		let appearance = createAppearence(fragmentShader, vertexShader);

		let primitive = new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: geometry
			}),
			appearance: appearance
		})
		return viewer.scene.primitives.add(primitive);
	}

	//画三角形(从第三个顶点开始,每个顶点和它前面的两个顶点相连组成一个三角形: wall墙)
	function addPrimitiveTrianglesStrip(viewer, pointPositionArr, componentsPerPositionAttribute, pointColorArr,
		componentsPerColorAttribute) {
		let vertexShader = getVS();
		let fragmentShader = getFS();
		//顶点索引（坐标点下标的连接顺序）
		let indicesTesm = [];
		let pointNum = (pointPositionArr.length)/componentsPerPositionAttribute;
		for (let i = 2; i < pointNum; i++) {
			indicesTesm.push(i-2);
			indicesTesm.push(i-1);
			indicesTesm.push(i);
		}

		let positionArr = new Float32Array(pointPositionArr);
		let colorArr = new Float32Array(pointColorArr);
		let indiceArr = new Uint32Array(indicesTesm);

		let geometry = createGeometry(Cesium.PrimitiveType.TRIANGLE_STRIP, positionArr,
			componentsPerPositionAttribute, colorArr, componentsPerColorAttribute, indiceArr);
		let appearance = createAppearence(fragmentShader, vertexShader);

		let primitive = new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: geometry
			}),
			appearance: appearance
		})
		return viewer.scene.primitives.add(primitive);
	}
	
	// 画矩形(每4个顶点一组,绘制2个三角形,组成一个矩形)
	function addPrimitiveRect(viewer, pointPositionArr, componentsPerPositionAttribute, pointColorArr,
		componentsPerColorAttribute) {
		let vertexShader = getVS();
		let fragmentShader = getFS();
		//顶点索引（坐标点下标的连接顺序）
		let indicesTesm = [];
		let pointNum = (pointPositionArr.length)/componentsPerPositionAttribute;
		for (let i = 0; i < pointNum; i+=4) {
			indicesTesm.push(i);
			indicesTesm.push(i+1);
			indicesTesm.push(i+2);
			indicesTesm.push(i);
			indicesTesm.push(i+2);
			indicesTesm.push(i+3);
		}
	
		let positionArr = new Float32Array(pointPositionArr);
		let colorArr = new Float32Array(pointColorArr);
		let indiceArr = new Uint32Array(indicesTesm);
	
		let geometry = createGeometry(Cesium.PrimitiveType.TRIANGLES, positionArr,
			componentsPerPositionAttribute, colorArr, componentsPerColorAttribute, indiceArr);
		let appearance = createAppearence(fragmentShader, vertexShader);
	
		let primitive = new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: geometry
			}),
			appearance: appearance
		})
		return viewer.scene.primitives.add(primitive);
	}
	
	//创建Geometry
	function createGeometry(primitiveType, positions, componentsPerPositionAttribute, colors, componentsPerColorAttribute, indices) {
		return new Cesium.Geometry({
			attributes: {
				position: new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.DOUBLE,
					componentsPerAttribute: componentsPerPositionAttribute,
					values: positions
				}),
				color: new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.FLOAT,
					componentsPerAttribute: componentsPerColorAttribute,
					values: colors
				})
			},
			indices: indices,
			primitiveType: primitiveType,
			boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
		});
	}

	//创建Appearence
	function createAppearence(fs, vs) {
		return new Cesium.Appearance({
			renderState: {
				blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
				depthTest: {
					enabled: true
				},
				depthMask: true
			},
			fragmentShaderSource: fs,
			vertexShaderSource: vs
		});
	}

	//顶点着色器源码
	function getVS() {
		return "attribute vec3 position3DHigh;\
		            attribute vec3 position3DLow;\
		            attribute vec4 color;\
		            varying vec4 v_color;\
		            attribute float batchId;\
		            void main()\
		            {\
						vec4 p = czm_computePosition();\
		                gl_Position = czm_modelViewProjectionRelativeToEye * p;\
		                gl_PointSize = 5.0;\
						v_color = color;\
		            }\
		            ";
	}

	//片源着色器源码(圆形的点)
	function getFS() {
		return "varying vec4 v_color;\
		            void main()\
		            {\
		                 float d = distance(gl_PointCoord, vec2(0.5,0.5));\
		                 if(d < 0.5){\
		                    gl_FragColor = v_color;\
		                 }else{\
		                    discard;\
		                 }\
		            }\
		            ";
	}
	
	//片源着色器源码(方形的点)
	/* function getFS() {
		return "varying vec4 v_color;\
		            void main()\
		            {\
		                 gl_FragColor = v_color;\
		            }\
		            ";
	} */

	let PrimitiveUtil = {
		addPrimitivePoints,
		addPrimitiveLines,
		addPrimitiveLinesStrip,
		addPrimitiveLinesLoop,
		addPrimitiveTriangles,
		addPrimitiveTrianglesFan,
		addPrimitiveTrianglesStrip,
		addPrimitiveRect
	}
	Cesium.PrimitiveUtil = PrimitiveUtil;
})()


/* 
 示例代码
 绘制点
 let pointArr2 = [];
 let colorArr = [];
 for (let lon = -180.0; lon < 180.0; lon += 0.5) {
 	for (let lat = -90.0; lat < 90.0; lat += 0.5) {
 		// let rand = Math.random();
 		// let rand = 0.5;
 		let point = Cesium.Cartesian3.fromDegrees(lon, lat, 0);
 		pointArr2.push(point.x);
 		pointArr2.push(point.y);
 		pointArr2.push(point.z);
 		let color = Cesium.Color.fromRandom();
 		colorArr.push(color.red);
 		colorArr.push(color.green);
 		colorArr.push(color.blue);
 		colorArr.push(color.alpha);
 	}
 }
 console.log(pointArr2.length / 3);
 Cesium.PrimitiveUtil.addPrimitivePoints(viewer, pointArr2, 3, colorArr, 4);
 
 绘制三角形
 let p1 = Cesium.Cartesian3.fromDegrees(100, 30, 0);
 let p2 = Cesium.Cartesian3.fromDegrees(110, 30, 0);
 let p3 = Cesium.Cartesian3.fromDegrees(110, 35, 0);
 let arr = []
 arr.push(p1.x);
 arr.push(p1.y);
 arr.push(p1.z);
 arr.push(p2.x);
 arr.push(p2.y);
 arr.push(p2.z);
 arr.push(p3.x);
 arr.push(p3.y);
 arr.push(p3.z);
 let color = [1.0,0.0,0.0,0.3,  0.0,1.0,0.0,0.3,  0.0,0.0,1.0,0.3];
 Cesium.PrimitiveUtil.addPrimitiveTriangles(viewer, arr, 3, color, 4)
 */
