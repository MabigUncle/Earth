// 绘制多个矩形,并为每个矩形设置纹理贴图
(function() {
	// 矩形纹理贴图
	function addPrimitiveRectTexture(viewer, pointPositionArr, componentsPerPositionAttribute, imageArr) {
		let vertexShader = getVS();
		let fragmentShader = getFS();
		let materialShader = getMS();
		
		// 单个加载
		let primitiveArr = [];
		let pointNum = (pointPositionArr.length) / componentsPerPositionAttribute;
		let geometryInstances = [];
		for (let i = 0; i < pointNum; i += 4) {
			let indicesTesm = [0, 1, 2, 3];
			let stsTemp = [0, 1, 0, 0, 1, 1, 1, 0];
			let position = pointPositionArr.slice(i * componentsPerPositionAttribute, (i + 4) * componentsPerPositionAttribute);
			let positionArr = new Float64Array(position);
			let indiceArr = new Uint32Array(indicesTesm);
			let sts = new Uint32Array(stsTemp);
			let geometry = createGeometry(positionArr, componentsPerPositionAttribute, sts, indiceArr);
			let appearance = createAppearence(fragmentShader, vertexShader, materialShader, imageArr[i / 4]);
			let primitive = new Cesium.Primitive({
				geometryInstances: new Cesium.GeometryInstance({
					geometry: geometry
				}),
				appearance: appearance,
				asynchronous: false
			});
			viewer.scene.primitives.add(primitive);
			primitiveArr.push(primitive)
		}
		return primitiveArr;

		// 下面的写法不知道有什么问题. 
		/* let vertexShader2 = getVS2();
		let fragmentShader2 = getFS2();
		let materialShader2 = getMS2();
		let pointNum = (pointPositionArr.length) / componentsPerPositionAttribute;
		let indicesTesm = [0, 1, 2, 3];
		// 纹理坐标顺序: 左上,左下,右上,右下
		let stsTemp = [0, 1, 0, 0, 1, 1, 1, 0];
		let geometryInstances = [];
		for (let i = 0; i < pointNum; i += 4) {
			let position = pointPositionArr.slice(i * componentsPerPositionAttribute, (i + 4) * componentsPerPositionAttribute);
			let positionArr = new Float64Array(position);
			let indiceArr = new Uint32Array(indicesTesm);
			let sts = new Uint32Array(stsTemp);
			let image = new Image();
			image.src = imageArr[i/4];
			let geometry = createGeometry(positionArr, componentsPerPositionAttribute, sts, indiceArr);
			geometryInstances.push(new Cesium.GeometryInstance({
				geometry: geometry,
				attributes: {
					image: image
				}
			}));
		}
		let appearance = createAppearence2(fragmentShader2, vertexShader2, materialShader2);
		let primitive = new Cesium.Primitive({
			geometryInstances: geometryInstances,
			appearance: appearance,
			asynchronous: false
		});
		return viewer.scene.primitives.add(primitive); */
	}

	// 矩形纹理贴图(设置旋转角度)
	/* function addPrimitiveRectTexture2(viewer, pointPositionArr, componentsPerPositionAttribute, angleArr, image) {
		let vertexShader = getVS();
		let fragmentShader = getFS();
		let materialShader = getMS();

		let primitiveArr = [];
		let pointNum = (pointPositionArr.length) / componentsPerPositionAttribute;
		let geometryInstances = [];
		for (let i = 0; i < pointNum; i += 4) {
			let indicesTesm = [0, 1, 2, 3];
			let stsTemp = [0, 1, 0, 0, 1, 1, 1, 0];
			let position = pointPositionArr.slice(i * componentsPerPositionAttribute, (i + 4) * componentsPerPositionAttribute);
			
			let x = (position[0+i*4] + position[6+i*4]) / 2;
			let y = (position[1+i*4] + position[4+i*4]) / 2;
			let z = position[2];
			let angle = Cesium.Math.toRadians(angleArr[i/4]);
			let trs = new Cesium.TranslationRotationScale(Cesium.Cartesian3.ZERO, new Cesium.Quaternion(0,0,angle,0), new Cesium.Cartesian3(1,1,1));
			let matrix4 = Cesium.Matrix4.fromTranslationRotationScale(trs);
			
			let hprRollZero = new Cesium.HeadingPitchRoll(0, 0, angle);
			let origin = new Cesium.Cartesian3(position[0+i*4], position[1+i*4], position[2+i*4]);
			let converter = Cesium.Transforms.eastNorthUpToFixedFrame;
			let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin, hprRollZero, Cesium.Ellipsoid.WGS84, converter);
			
			let positionArr = new Float64Array(position);
			let indiceArr = new Uint32Array(indicesTesm);
			let sts = new Uint32Array(stsTemp);
			let geometry = createGeometry(positionArr, componentsPerPositionAttribute, sts, indiceArr);
			let appearance = createAppearence(fragmentShader, vertexShader, materialShader, image);
			let primitive = new Cesium.Primitive({
				geometryInstances: new Cesium.GeometryInstance({
					geometry: geometry,
					modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
						new Cesium.Cartesian3(x, y, z)), matrix4, new Cesium.Matrix4()),
					// modelMatrix: modelMatrix
				}),
				appearance: appearance,
				asynchronous: false
			});
			viewer.scene.primitives.add(primitive);
			primitiveArr.push(primitive)
		}
		let hprRollZero = new Cesium.HeadingPitchRoll(0, 0, 0);
		let position = Cesium.Cartesian3.fromDegrees(120, 30, 5000);
		let converter = Cesium.Transforms.eastNorthUpToFixedFrame;
		let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, hprRollZero, Cesium.Ellipsoid.WGS84, converter);
		let axes = new Cesium.DebugModelMatrixPrimitive({
			length: 10000000,
			width: 3,
			modelMatrix: primitiveArr[0].geometryInstances.modelMatrix
		})
		viewer.scene.primitives.add(axes);
		return primitiveArr;
	} */

	function createGeometry(positions, componentsPerPositionAttribute, sts, indices) {
		return new Cesium.Geometry({
			attributes: {
				position: new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.DOUBLE,
					componentsPerAttribute: componentsPerPositionAttribute,
					values: positions
				}),
				st: new Cesium.GeometryAttribute({
					componentDatatype: Cesium.ComponentDatatype.FLOAT,
					componentsPerAttribute: 2,
					values: sts
				})
			},
			indices: indices,
			primitiveType: Cesium.PrimitiveType.TRIANGLE_STRIP,
			boundingSphere: Cesium.BoundingSphere.fromVertices(positions)
		});
	}

	function createAppearence(fs, vs, ms, url) {
		return new Cesium.Appearance({
			material: new Cesium.Material({
				fabric: {
					uniforms: {
						image: url
					},
					source: ms
				}
			}),
			aboveGround: true,
			faceForward: true,
			flat: true,
			translucent: false,
			renderState: {
				blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
				depthTest: {
					enabled: true
				},
				depthMask: true,
			},
			fragmentShaderSource: fs,
			vertexShaderSource: vs
		});
	}

	function getVS() {
		return "attribute vec3 position3DHigh;\
			attribute vec3 position3DLow;\
			attribute vec2 st;\
			attribute float batchId;\
			varying vec2 v_st;\
			void main()\
			{\
				vec4 p = czm_computePosition();\
				v_st=st;\
				p = czm_modelViewProjectionRelativeToEye * p;\
				gl_Position = p;\
			}\
			";
	}

	function getFS() {
		return "varying vec2 v_st;\
			void main()\
			{\
				czm_materialInput materialInput;\
				czm_material material = czm_getMaterial(materialInput, v_st);\
				vec4 color=vec4(material.diffuse + material.emission,material.alpha);\
				if(color.x==1.0&&color.y==1.0&&color.z==1.0&&color.w==1.0)\
				color=vec4(vec3(0.0,0.0,0.0),0.0);\
				gl_FragColor =color;\
			}\
			";
	}

	function getMS() {
		return "czm_material czm_getMaterial(czm_materialInput materialInput,vec2 v_st)\
	    {\
			vec4 color = texture2D(image, v_st);\
			czm_material material = czm_getDefaultMaterial(materialInput);\
			material.diffuse= color.rgb;\
			material.alpha=color.a;\
			return material;\
	    }\
	    ";
	}

	Cesium.addPrimitiveRectTexture = addPrimitiveRectTexture;
	// Cesium.addPrimitiveRectTexture2 = addPrimitiveRectTexture2;


	function createAppearence2(fs, vs, ms) {
		return new Cesium.Appearance({
			material: new Cesium.Material({
				fabric: {
					source: ms
				}
			}),
			renderState: {
				blending: Cesium.BlendingState.PRE_MULTIPLIED_ALPHA_BLEND,
				depthTest: {
					enabled: true
				},
				depthMask: true,
			},
			fragmentShaderSource: fs,
			vertexShaderSource: vs
		});
	}

	function getVS2() {
		return "attribute vec3 position3DHigh;\
				attribute vec3 position3DLow;\
				attribute vec2 st;\
				attribute sampler2D image;\
				attribute float batchId;\
				varying vec2 v_st;\
				varying sampler2D v_sampler;\
				void main()\
				{\
					vec4 p = czm_computePosition();\
					v_sampler = image;\
					v_st = st;\
					p = czm_modelViewProjectionRelativeToEye * p;\
					gl_Position = p;\
				}\
				";
	}

	function getFS2() {
		return "varying sampler2D v_sampler;\
				varying vec2 v_st;\
				void main()\
				{\
					vec4 color = texture2D(v_sampler, v_st);\
					gl_FragColor =color;\
				}\
				";
	}

	function getMS2() {
		return "czm_material czm_getMaterial(czm_materialInput materialInput,vec2 v_st)\
		    {\
				return czm_getDefaultMaterial(materialInput);\
		    }\
		    ";
	}
})()

/* 
示例
	let p1 = Cesium.Cartesian3.fromDegrees(110, 40, 0);
	let p2 = Cesium.Cartesian3.fromDegrees(110, 30, 0);
	let p3 = Cesium.Cartesian3.fromDegrees(115, 40, 0);
	let p4 = Cesium.Cartesian3.fromDegrees(115, 30, 0);
	let arr = [];
	arr.push(p1.x, p1.y, p1.z);
	arr.push(p2.x, p2.y, p2.z);
	arr.push(p3.x, p3.y, p3.z);
	arr.push(p4.x, p4.y, p4.z);
	Cesium.addPrimitiveRectTexture(viewer, arr, 3, 'image/common/home.png');
 */
