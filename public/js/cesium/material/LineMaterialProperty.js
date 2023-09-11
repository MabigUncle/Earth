/* 
 将图片贴在线条上效果,参考 MaterialProperty
 */

(function() {
	let defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEqElEQVR4nO3cS4hlRx3A4V/3dFQSTbLRGEQTA/GNGTU+EpgsgsbHGB0CbgVFEZW48AGjAcUHCCIqiAvduQgu1J0SX7hRhKCrqESCK5WI6DBGJSHGTLuoG/rS0887ffv24/ug6dOnTtUp+p7/qVPnVlUBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHCcLS+6AsfdiUVXgC19ozpV/bL634LrAgfKC6snqtXqweqWxVbneNKEH1xfrFYm28+oblhgXeBAeVuj5VitflVdtc3xJ6pvV6+Zc72OnaVFV4CLXFk9UF1XPVy9r/r3NnneVX2keqR6U/XreVbwOBEgB8tS9b3qrupco3O+E2+orpls/6u6o7p/z2sHC/axxmPVueqVO8zzsurxSb7fVG9s9FngSDndeJX7z+rVO8yz0mgpVht9kKfNp2qwWLdWj1Z/q167i3yfaATHF/K4zBH1iup89dvq+l3ke0n1n+oDWxyzXH2t0ToxA3edxTpZ/aTRh/hMo4O9Ux+v/lD9YItj7qzeXV2oPlR9c7ZqHl8CZHFeX91Xfav6evXT6vJGS3K++u8enOOm6ubJ9h8bb7vO7UG5MFdvrv5cnZnad9kcznO20Uc5X109h/KPvJXtD2EPLTUejW5rjK36y1TaE3M87+ONt2PskgDZX6erv1fvaNzZ94tR2zNaWd3fD+rQWJpP/2yrDvVV1Vv3+Hw3TX5veyN0HWxMC3JwPFLd2Og3PFD9abLvUjrr109++5xntOTOsbE5tSA7sdx4LbsXzjaGzT/WeEO2KdfBxswHOXj2KjimaUFmJECOBwEyIwFyPCzls56JO8vinao+P6eyXzC1faL5PL4daTrpm9jnTvr7q+c13l79ozEIcf3F/NLGcJHdfKH43uruyfbljc76hlwHHHYfbnzzfk/17B3mOdsYQv/ZPC1wRNxefbW6doO0uxt3+kerT7b9BKnrqqfvae1gwe5oBMFjjbkc16xLv6e1FU/ub+sAONuYL6L14NC6s3rL1N+3txYAP+/iUbgnql9MHXNqXfrp6jmT7ec3Vkb5XWMEMRwqS41WYDpATrV28W82RP2GRkf+yeq569Lubcw1ecqrJseuVt+tnnXJtYZ9cmvjwj05te+W1gLkmVvkPdOYJbje9xut0LS3T5X5+6zSyCFwRWOZntXWHolqzADcSYBs5sfVOzfYf+9UuffNUC7sm5XG0PenFqaedrJLC5AHG2+41ru2MTp4tTGtFw6kleo7rQXBl9alv7zZA2S58Qr4R5ukf3RS7gd3WS7sm/e0FgB/7eJO9oun0m/cZdm3TeU9s0H6cvW6LNaxY/5R++/q6tON1uErjaV7pl3ZeBSq+ln1ucbwk62GglxWvaj6cmuTpC40hqc8tBeVhoPkh621BLP8PFl9at9rfQRpQQ6mKxr9hJvb+XI9FxprXj3UWCF+fecfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI6D/wP2XNBDcsXVsQAAAABJRU5ErkJggg==";
	let LineMaterialProperty = function(color, duration) {
		this._definitionChanged = new Cesium.Event();
		this._color = color;
		this._colorSubscription = undefined;
		this.color = color;
		this.duration = duration;
		this.image = defaultImage;
		this._time = (new Date()).getTime();
	}

	Object.defineProperties(LineMaterialProperty.prototype, {
		isConstant: {
			get: function() {
				return false;
			}
		},
		definitionChanged: {
			get: function() {
				return this._definitionChanged;
			}
		},
		color: Cesium.createPropertyDescriptor('color')
	});

	LineMaterialProperty.prototype.getType = function(time) {
		return 'Line';
	};

	LineMaterialProperty.prototype.getValue = function(time, result) {
		if (!Cesium.defined(result)) {
			result = {};
		}
		result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
		result.image = this.image;
		result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
		return result;
	};

	LineMaterialProperty.prototype.equals = function(other) {
		return this === other ||
			(other instanceof LineMaterialProperty &&
				Property.equals(this._color, other._color))
	};

	Cesium.LineMaterialProperty = LineMaterialProperty;

	let source = "czm_material czm_getMaterial(czm_materialInput materialInput){" +
			"czm_material material = czm_getDefaultMaterial(materialInput);\n" +
			"vec2 st = materialInput.st;\n" +
			"vec4 colorImage = texture2D(image, vec2(st.s, st.t));\n" +
			"material.alpha = colorImage.a * color.a;\n" +
			// "material.diffuse = (colorImage.rgb + color.rgb) / 2.0;\n" +
			"material.diffuse = color.rgb;\n" +
			"return material;\n" +
		"}";

	Cesium.Material._materialCache.addMaterial('Line', {
		fabric: {
			type: "Line",
			// uniforms向着色器和czm_getMaterial函数传值
			uniforms: {
				color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
				image: defaultImage,
				time: 0
			},
			source: source
		},
		translucent: function(material) {
			return true;
		}
	});

})()


/* 
 示例:
 viewer.entities.add({
 	polyline: {
 		positions: Cesium.Cartesian3.fromDegreesArray([110, 30, 112, 30, 112, 33]),
 		width: 100.0,
 		material: new Cesium.LineMaterialProperty(new Cesium.Color(1.0, 0.0, 0.0, 1.0), 2000)
 	}
 })
 */