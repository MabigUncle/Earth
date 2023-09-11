/* 
 流动线效果,参考 MaterialProperty
 */

(function() {
	let defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAUCAYAAAA3IwABAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGumlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0xMi0wNVQxNzozMjo1MSswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDEtMDRUMTA6NDg6MjcrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDEtMDRUMTA6NDg6MjcrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NmU1MzRmODEtM2RkYy1jYjQzLTg4MGItNWFhMDA4ZWNmOTNjIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OWU3YTZlMzgtNTk2ZC1hNDRlLTgzNDUtNzQzZGFiYmEyODYxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NTM4YTBkNjktY2Q4ZS0wNjRjLWFjNDktNGQ2NThkMTkyODQ3Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1MzhhMGQ2OS1jZDhlLTA2NGMtYWM0OS00ZDY1OGQxOTI4NDciIHN0RXZ0OndoZW49IjIwMTgtMTItMDVUMTc6MzI6NTErMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmQxMWJhNzM0LTQ5ODItYmM0ZC1hYzFlLTIyYTkwMjhhYWNiMCIgc3RFdnQ6d2hlbj0iMjAyMS0wMS0wNFQxMDo0ODoyNyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2ZTUzNGY4MS0zZGRjLWNiNDMtODgwYi01YWEwMDhlY2Y5M2MiIHN0RXZ0OndoZW49IjIwMjEtMDEtMDRUMTA6NDg6MjcrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7+8844AAABuUlEQVR4nO2cwW7DMAiGcbrb3v9R19uaHbZqyAKDXTcS0vdJlh1s/hgScaSd5yki0uSfNjlrP+uMZ/POjN6X9bNGf09PL9pb0Vg5d5Xvofa9daS96udp7IrxULZ+re8bvVPHZcWZ1Zn9L6N8SGI9YxNnzqwtH29fHLuVE22/tw0FS8+HYcsEEyXce+5/kv7cyofXP3vkl9XvNXeMXVo3dX+r8GTvciz4efm+LWpYsYnS1+uZOPs79bnq9We/3chvZm/0z2Zso2cvTjHmt/GxWe/crBfx+Jt3f/gmv7FEfln953gkta4c3+r+rxSsFb/dGpamOOuZd/Xn+lz1+rNj5LeyZ9kzttFztO7naH/kJ4796xAAgCJQsACgDBQsACgDBQsAykDBAoAyULAAoAwULAAoAwULAMpAwQKAMlCwAKAMFCwAKAMFCwDKQMECgDJQsACgDBQsACjD7n5Yo/42q/12Rs808Ht90MAv921p4GfHKcb8Lj53FCzdtE831HvOVlCjhHhJsPxmG/h5+5Ff5uxIY+XcVb60SI7fqeOy4szqzP6XUT4ksZ6xiTNn1paPty+O3cqJtt9/APHeFamHg+/BAAAAAElFTkSuQmCC";
	let FlowLineMaterialProperty = function(color, duration) {
		this._definitionChanged = new Cesium.Event();
		this._color = color;
		this._colorSubscription = undefined;
		this.color = color;
		this.duration = duration;
		this.image = defaultImage;
		this._time = (new Date()).getTime();
	}

	Object.defineProperties(FlowLineMaterialProperty.prototype, {
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

	FlowLineMaterialProperty.prototype.getType = function(time) {
		return 'FlowLine';
	};

	FlowLineMaterialProperty.prototype.getValue = function(time, result) {
		if (!Cesium.defined(result)) {
			result = {};
		}
		result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
		result.image = this.image;
		result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
		return result;
	};

	FlowLineMaterialProperty.prototype.equals = function(other) {
		return this === other ||
			(other instanceof FlowLineMaterialProperty &&
				Property.equals(this._color, other._color))
	};

	Cesium.FlowLineMaterialProperty = FlowLineMaterialProperty;

	let source = "czm_material czm_getMaterial(czm_materialInput materialInput){" +
			"czm_material material = czm_getDefaultMaterial(materialInput);\n" +
			"vec2 st = materialInput.st;\n" +
			"vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n" +
			"material.alpha = colorImage.a * color.a;\n" +
			// "material.diffuse = (colorImage.rgb + color.rgb) / 2.0;\n" +
			"material.diffuse = color.rgb;\n" +
			"return material;\n" +
		"}";

	Cesium.Material._materialCache.addMaterial('FlowLine', {
		fabric: {
			type: "FlowLine",
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
		positions: Cesium.Cartesian3.fromDegreesArrayHeights([110, 30, 5000, 112, 30, 300000, 112, 33, 8000]),
		width: 3.0,
		material: new Cesium.FlowLineMaterialProperty(new Cesium.Color(1.0, 0.0, 0.0, 1.0), 500)
	}
 })
 */