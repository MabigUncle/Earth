// 可视域阴影分析(还有问题)
(function() {
	// 观察点
	let viewPoint = Cesium.Cartesian3.fromDegrees(120, 35);
	// 目标点
	let targetPoint = Cesium.Cartesian3.fromDegrees(120, 36);
	// 观察距离
	// Cesium.Cartesian3.distance(viewPoint, targetPoint)
	let viewDistance = 500000;
	// 水平视角
	let horizontalViewAngle = 90;
	// 垂直视角
	let verticalViewAngle = 60;

	let width = viewDistance * Math.tan(Cesium.Math.toRadians(horizontalViewAngle) / 2) * 2;
	let height = viewDistance * Math.tan(Cesium.Math.toRadians(verticalViewAngle) / 2) * 2;
	let aspectRatio = width / height;
	let fov = horizontalViewAngle >= verticalViewAngle ? Cesium.Math.toRadians(horizontalViewAngle) : Cesium.Math.toRadians(
		verticalViewAngle);
	let frustum = new Cesium.PerspectiveFrustum({
		fov: fov,
		aspectRatio: aspectRatio,
		near: 1.0,
		far: viewDistance
	})

	// 创建相机
	function createLightCamera(scene) {
		let lightCamera = new Cesium.Camera(scene);
		lightCamera.position = viewPoint;
		lightCamera.frustum = frustum;
		lightCamera.setView({
			destination: viewPoint,
			orientation: {
				heading: Cesium.Math.toRadians(getHeading(viewPoint, targetPoint) || 0),
				pitch: Cesium.Math.toRadians(getPitch(viewPoint, targetPoint) || 0),
				roll: 0
			}
		});
	}
	
	// 创建视锥体的轮廓线
	function createFrustumOutline(){
		let geometry = new Cesium.FrustumOutlineGeometry({
			frustum: frustum,
			origin: viewPoint,
			orientation: new Cesium.Quaternion(0.0001, 0.0, 0.0, 0.0)
		})
		let geometryInstance = new Cesium.GeometryInstance({
			geometry: geometry,
			attributes: {
				color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA)
			}
		})
		let primitive = new Cesium.Primitive({
			geometryInstances: geometryInstance,
			appearance: new Cesium.PerInstanceColorAppearance({
				flat: true,
				translucent: false
			})
		})
		viewer.scene.primitives.add(primitive);
		return primitive;
	}
	
	// 创建阴影贴图
	createShadowMap() {
	    let shadowMap = new Cesium.ShadowMap({
	        context: viewer.scene.context,
	        lightCamera: this.lightCamera,
	        enabled: true,
	        isPointLight: true,
	        pointLightRadius: viewDistance,
	        cascadesEnabled: false,
	        size: this.size,
	        softShadows: this.softShadows,
	        normalOffset: false,
	        fromLightSource: false
	    });
	    viewer.scene.shadowMap = shadowMap;
	}

	getHeading(fromPosition, toPosition) {
		let finalPosition = new Cesium.Cartesian3();
		let matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(fromPosition);
		Cesium.Matrix4.inverse(matrix4, matrix4);
		Cesium.Matrix4.multiplyByPoint(matrix4, toPosition, finalPosition);
		Cesium.Cartesian3.normalize(finalPosition, finalPosition);
		return Cesium.Math.toDegrees(Math.atan2(finalPosition.x, finalPosition.y));
	}

	getPitch(fromPosition, toPosition) {
		let finalPosition = new Cesium.Cartesian3();
		let matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(fromPosition);
		Cesium.Matrix4.inverse(matrix4, matrix4);
		Cesium.Matrix4.multiplyByPoint(matrix4, toPosition, finalPosition);
		Cesium.Cartesian3.normalize(finalPosition, finalPosition);
		return Cesium.Math.toDegrees(Math.asin(finalPosition.z));
	}
})()
