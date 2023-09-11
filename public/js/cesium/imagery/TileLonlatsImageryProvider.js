/* 
	参考文章:http://blog.sina.com.cn/s/blog_15e866bbe0102xxme.html 
 */

(function() {
	let TileLonlatsImageryProvider = function (options) {
		options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
		this._tilingScheme = Cesium.defined(options.tilingScheme) ? options.tilingScheme : new Cesium.GeographicTilingScheme({ ellipsoid : options.ellipsoid });
		this._color = Cesium.defaultValue(options.color, Cesium.Color.RED);
		this._errorEvent = new Cesium.Event();
		this._tileWidth = Cesium.defaultValue(options.tileWidth, 256);
		this._tileHeight = Cesium.defaultValue(options.tileHeight, 256);
		this._readyPromise = Cesium.when.resolve(true);
	}

	Object.defineProperties(TileLonlatsImageryProvider.prototype, {
		proxy: {
			get: function() {
				return undefined;
			}
		},
		tileWidth: {
			get: function() {
				return this._tileWidth;
			}
		},
		tileHeight: {
			get: function() {
				return this._tileHeight;
			}
		},
		maximumLevel: {
			get: function() {
				return undefined;
			}
		},
		minimumLevel: {
			get: function() {
				return undefined;
			}
		},
		tilingScheme: {
			get: function() {
				return this._tilingScheme;
			}
		},
		rectangle: {
			get: function() {
				return this._tilingScheme.rectangle;
			}
		},
		tileDiscardPolicy: {
			get: function() {
				return undefined;
			}
		},
		errorEvent: {
			get: function() {
				return this._errorEvent;
			}
		},
		ready: {
			get: function() {
				return true;
			}
		},
		readyPromise: {
			get: function() {
				return this._readyPromise;
			}
		},
		credit: {
			get: function() {
				return undefined;
			}
		},
		hasAlphaChannel: {
			get: function() {
				return true;
			}
		}
	});
	
	TileLonlatsImageryProvider.prototype.getTileCredits = function(x, y, level) {
		return undefined;
	};

	TileLonlatsImageryProvider.prototype.requestImage = function(x, y, level, request) {
		let canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		let context = canvas.getContext('2d');
		let cssColor = this._color.toCssColorString();
		context.strokeStyle = cssColor;
		context.fillStyle = cssColor;
		context.lineWidth = 1;
		context.strokeRect(1, 1, 255, 255);

		let interval = 180.0 / Math.pow(2, level);
		let lon = x * interval - 180;
		let lat = 90 - y * interval;
		if(level < 3){
			context.font = 'bold 20px Arial';
			lon = Number(lon).toFixed(0);
			lat = Number(lat).toFixed(0);
		}else if(level < 5){
			context.font = 'bold 20px Arial';
			lon = Number(lon).toFixed(2);
			lat = Number(lat).toFixed(2);
		}else if(level < 13){
			context.font = 'bold 18px Arial';
			lon = Number(lon).toFixed(5);
			lat = Number(lat).toFixed(5);
		}else{
			context.font = 'bold 16px Arial';
			lon = Number(lon).toFixed(7);
			lat = Number(lat).toFixed(7);
		}
		context.textAlign = 'left';
		context.fillText(lon + "°", 5, 127);
		context.textAlign = 'center';
		context.fillText(lat + "°", 127, 250);
		context.textAlign = "center";
		context.fillText("L"+level, 127, 127);
		return canvas;
	};

	TileLonlatsImageryProvider.prototype.pickFeatures = function(x,y,level,longitude,latitude) {
		return undefined;
	};
	
	Cesium.TileLonlatsImageryProvider = TileLonlatsImageryProvider;
})()
