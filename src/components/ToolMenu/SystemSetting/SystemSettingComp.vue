<template>
	<div id="systemSettingCompId" class="wrap">
		<div class="wrap-title">
			<span class="wrap-title-text">系统设置</span>
			<img src="image/common/close.png" @click="closeDiv" class="wrap-title-close"/>
		</div>
		<div class="container">
			<el-tabs v-model="activeName">
				<el-tab-pane label="环境设置" name="env">
					<div class="env-item">
						<el-checkbox v-model="twoThreeCheck" @change="checked=>checkChange('twoThreeCheck', checked)">二三维</el-checkbox>
					</div>
					<div class="env-item">
						<el-checkbox v-model="sunCheck" @change="checked=>checkChange('sunCheck', checked)">光照</el-checkbox>
					</div>
					<div class="env-item">
						<el-checkbox v-model="airCheck" @change="checked=>checkChange('airCheck', checked)">大气层</el-checkbox>
					</div>
					<div class="env-item">
						<el-checkbox v-model="skyboxCheck" @change="checked=>checkChange('skyboxCheck', checked)">天空盒子</el-checkbox>
					</div>
					<div class="env-item">
						<el-checkbox v-model="seaCheck" @change="checked=>checkChange('seaCheck', checked)">海面</el-checkbox>
					</div>
					<div class="env-item">
						<el-checkbox v-model="fpsCheck" @change="checked=>checkChange('fpsCheck', checked)">帧率</el-checkbox>
					</div>
					<div class="env-item">
						<el-checkbox v-model="lonLatGridCheck" @change="checked=>checkChange('lonLatGridCheck', checked)">经纬度格网</el-checkbox>
					</div>
					<div class="env-item">
						<el-checkbox v-model="tileGridCheck" @change="checked=>checkChange('tileGridCheck', checked)">瓦片格网</el-checkbox>
					</div>
					<div class="env-item">
						<el-checkbox v-model="northCheck" @change="checked=>checkChange('northCheck', checked)">指北针</el-checkbox>
					</div>
				</el-tab-pane>
				<el-tab-pane label="特效设置" name="second">
					<div class="env-item">
						<el-checkbox v-model="snowCheck" @change="checked=>checkChange('snowCheck', checked)">雪</el-checkbox>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	let tileCoordinatesImageryLayer = null;
	let gridImageryLayer = null;
	let snowSystem = null;
	let seaPrimitive = null;
	export default {
		name: 'SystemSettingComp',
		data() {
			return {
				activeName: 'env',
				twoThreeCheck: false,
				sunCheck: false,
				airCheck: true,
				skyboxCheck: false,
				seaCheck: false,
				fpsCheck: false,
				lonLatGridCheck: false,
				tileGridCheck: false,
				northCheck: false,
				snowCheck: false,
				rainCheck: false,
			}
		},
		methods: {
			checkChange(checkName, flag) {
				if (flag) {
					switch (checkName) {
						case 'twoThreeCheck':
							viewer.scene.mode = 2;
							break;
						case 'sunCheck':
							viewer.scene.globe.enableLighting = true;
							break;
						case 'airCheck':
							viewer.scene.globe.showGroundAtmosphere = true;
							break;
						case 'skyboxCheck':
							viewer.scene.skyBox = new Cesium.SkyBox({
								sources: {
									positiveX: 'image/skybox/theme2/px.jpg',
									negativeX: 'image/skybox/theme2/nx.jpg',
									positiveY: 'image/skybox/theme2/py.jpg',
									negativeY: 'image/skybox/theme2/ny.jpg',
									positiveZ: 'image/skybox/theme2/pz.jpg',
									negativeZ: 'image/skybox/theme2/nz.jpg'
								}
							});
							break;
						case 'seaCheck':
							seaPrimitive = this.createSeaPrimitive();
							break;
						case 'fpsCheck':
							viewer.scene.debugShowFramesPerSecond = true;
							break;
						case 'lonLatGridCheck':
							this.addGridImageryLayer();
							break;
						case 'tileGridCheck':
							this.addTileImageryLayer();
							break;
						case 'northCheck':
							let options = {};
							options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 20, 135, 60);
							options.enableCompass = true;
							options.enableZoomControls = true;
							options.enableDistanceLegend = false;
							options.enableCompassOuterRing = true;
							viewer.extend(Cesium.viewerCesiumNavigationMixin, options);
							break;
						case 'snowCheck':
							this.resetCamera();
							this.createSnow();
							break;
						case 'rainCheck':
							break;
					}
				} else {
					switch (checkName) {
						case 'twoThreeCheck':
							viewer.scene.mode = 3;
							break;
						case 'sunCheck':
							viewer.scene.globe.enableLighting = false;
							break;
						case 'airCheck':
							viewer.scene.globe.showGroundAtmosphere = false;
							break;
						case 'skyboxCheck':
							viewer.scene.skyBox = new Cesium.SkyBox({
								sources: {
									positiveX: 'Cesium/Assets/Textures/SkyBox/tycho2t3_80_px.jpg',
									negativeX: 'Cesium/Assets/Textures/SkyBox/tycho2t3_80_mx.jpg',
									positiveY: 'Cesium/Assets/Textures/SkyBox/tycho2t3_80_py.jpg',
									negativeY: 'Cesium/Assets/Textures/SkyBox/tycho2t3_80_my.jpg',
									positiveZ: 'Cesium/Assets/Textures/SkyBox/tycho2t3_80_pz.jpg',
									negativeZ: 'Cesium/Assets/Textures/SkyBox/tycho2t3_80_mz.jpg'
								}
							});
							break;
						case 'seaCheck':
							viewer.scene.primitives.remove(seaPrimitive);
							seaPrimitive = null;
							break;
						case 'fpsCheck':
							viewer.scene.debugShowFramesPerSecond = false;
							break;
						case 'lonLatGridCheck':
							this.removeGridImageryLayer();
							break;
						case 'tileGridCheck':
							this.removeTileImageryLayer();
							break;
						case 'northCheck':
							viewer.cesiumNavigation.destroy();
							break;
						case 'snowCheck':
							this.removeSnow();
							viewer.camera.flyTo({
								destination: Cesium.Rectangle.fromDegrees(80, 20, 135, 60),
								orientation: {
									heading: 0,
									pitch: Cesium.Math.toRadians(-90),
									roll: 0
								}
							})

							break;
						case 'rainCheck':
							break;
					}
				}
			},

			createSeaPrimitive() {
				let material = new Cesium.Material({
					fabric: {
						type: "Water",
						uniforms: {
							specularMap: "image/SystemSetting/earthspec1k.jpg",
							normalMap: "image/SystemSetting/waterNormals.jpg",
							frequency: 10000.0,
							animationSpeed: 0.01,
							amplitude: 1.0,
						},
					},
				});
				return viewer.scene.primitives.add(
					new Cesium.Primitive({
						geometryInstances: new Cesium.GeometryInstance({
							geometry: new Cesium.RectangleGeometry({
								rectangle: Cesium.Rectangle.fromDegrees(
									-180.0,
									-90.0,
									180.0,
									90.0
								),
								vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
							}),
						}),
						appearance: new Cesium.EllipsoidSurfaceAppearance({
							aboveGround: false,
							material: material
						})
					})
				);
			},

			// 经纬度格网
			addGridImageryLayer() {
				let gridProvider = new Cesium.TileLonlatsImageryProvider();
				gridImageryLayer = viewer.imageryLayers.addImageryProvider(gridProvider);
				viewer.imageryLayers.raiseToTop(gridImageryLayer);
			},
			removeGridImageryLayer() {
				if (gridImageryLayer) {
					viewer.imageryLayers.remove(gridImageryLayer);
					gridImageryLayer = null;
				}
			},

			// 切片格网
			addTileImageryLayer() {
				let tileCoordinatesProvider = new Cesium.TileCoordinatesImageryProvider();
				tileCoordinatesImageryLayer = viewer.imageryLayers.addImageryProvider(tileCoordinatesProvider);
				viewer.imageryLayers.raiseToTop(tileCoordinatesImageryLayer);
			},
			removeTileImageryLayer() {
				if (tileCoordinatesImageryLayer) {
					viewer.imageryLayers.remove(tileCoordinatesImageryLayer);
					tileCoordinatesImageryLayer = null;
				}
			},

			createSnow() {
				viewer.scene.globe.depthTestAgainstTerrain = true;
				let snowRadius = 100000.0;
				let snowGravityScratch = new Cesium.Cartesian3();
				snowSystem = new Cesium.ParticleSystem({
					modelMatrix: new Cesium.Matrix4.fromTranslation(
						viewer.scene.camera.position
					),
					minimumSpeed: -1.0,
					maximumSpeed: 0.0,
					lifetime: 15,
					emitter: new Cesium.SphereEmitter(snowRadius),
					startScale: 0.5,
					endScale: 1.0,
					image: "image/SystemSetting/snow.png",
					emissionRate: 1000,
					startColor: Cesium.Color.WHITE.withAlpha(0.0),
					endColor: Cesium.Color.WHITE.withAlpha(1.0),
					minimumImageSize: new Cesium.Cartesian2(12, 12),
					maximumImageSize: new Cesium.Cartesian2(24, 24),
					// 更新函数：控制粒子的分布、移动、可视化
					updateCallback: function(particle, dt) {
						// 归一化 (-1,1)
						snowGravityScratch = Cesium.Cartesian3.normalize(
							particle.position,
							snowGravityScratch
						);

						// 相乘 Multiplies the provided Cartesian componentwise by the provided scalar.
						Cesium.Cartesian3.multiplyByScalar(
							snowGravityScratch,
							Cesium.Math.randomBetween(-30.0, -300.0),
							snowGravityScratch
						);
						// 粒子速度矢量： 相加 Computes the componentwise sum of two Cartesians.
						particle.velocity = Cesium.Cartesian3.add(
							particle.velocity,
							snowGravityScratch,
							particle.velocity
						);

						let distance = Cesium.Cartesian3.distance(
							viewer.scene.camera.position,
							particle.position
						);
						if (distance > snowRadius) {
							particle.endColor.alpha = 0.0;
						} else {
							particle.endColor.alpha =
								snowSystem.endColor.alpha / (distance / snowRadius + 0.1);
						}
					}
				});
				viewer.scene.primitives.add(snowSystem);
			},
			removeSnow() {
				viewer.scene.primitives.remove(snowSystem);
				snowSystem = null;
			},
			resetCamera() {
				viewer.scene.camera.setView({
					destination: new Cesium.Cartesian3.fromDegrees(115, 35, 50000),
					orientation: {
						heading: 0,
						pitch: Cesium.Math.toRadians(-15),
						roll: 0
					}
				})
			},

			// 关闭div
			closeDiv() {
				Bus.$emit("SystemSettingComp-CloseComp");
			}
		},
		beforeDestroy() {

		}
	}
</script>

<style scoped="true">
	

</style>
