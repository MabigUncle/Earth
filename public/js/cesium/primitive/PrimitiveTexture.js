// 将一个图片作为三角形的纹理贴图(废弃)

(function() {
	// 三角形贴图
	function addPrimitiveTexture(viewer, pointPositionArr, componentsPerPositionAttribute, image) {
		let vertexShader = getVS();
		let fragmentShader = getFS();
		let materialShader = getMS();

		let stsTemp = [];
		let indicesTesm = [];
		let pointNum = (pointPositionArr.length) / componentsPerPositionAttribute;
		for (let i = 0; i < pointNum; i++) {
			indicesTesm.push(i);
		}
		for (let i = 0; i < pointNum; i+=3) {
			// stsTemp.push(0, 1);
			// stsTemp.push(1, 1);
			// stsTemp.push(1, 0);
			stsTemp.push(0, 0);
			stsTemp.push(1, 0);
			stsTemp.push(0, 1);
		}
		let positionArr = new Float64Array(pointPositionArr);
		let indiceArr = new Uint32Array(indicesTesm);
		let sts = new Uint32Array(stsTemp);
		
		let geometry = createGeometry(positionArr, componentsPerPositionAttribute, sts, indiceArr);
		let appearance = createAppearence(fragmentShader, vertexShader, materialShader, image);
		let primitive = new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: geometry
			}),
			appearance: appearance,
			asynchronous: false
		});
		return viewer.scene.primitives.add(primitive);
	}

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
			primitiveType: Cesium.PrimitiveType.TRIANGLES,
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
				czm_material material=czm_getMaterial(materialInput,v_st);\
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

	Cesium.addPrimitiveTexture = addPrimitiveTexture;
})()

/* 
示例
 let p1 = Cesium.Cartesian3.fromDegrees(110, 35, 0);
 let p2 = Cesium.Cartesian3.fromDegrees(110, 30, 0);
 let p3 = Cesium.Cartesian3.fromDegrees(115, 35, 0);
 let p4 = Cesium.Cartesian3.fromDegrees(115, 30, 0);
 let arr = [];
 arr.push(p1.x, p1.y, p1.z);
 arr.push(p2.x, p2.y, p2.z);
 arr.push(p3.x, p3.y, p3.z);
 arr.push(p3.x, p3.y, p3.z);
 Cesium.addPrimitiveTexture(viewer, arr, 3, ['image/header/tw2.png']);
 */