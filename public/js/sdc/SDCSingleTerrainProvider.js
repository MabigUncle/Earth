/**
 * 名称:GEOVIS-SDC regular grid terrain
 * 开发者:wangmeng
 * 单位:西安中科星图空间数据技术有限公司交付中心
 */
(function() {
	var SDCSingleTerrainProvider = function(options) {
		options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
		if (!Cesium.defined(options.url)) {
			throw new Cesium.DeveloperError('options.url is required.');
		}
		this._resource = Cesium.Resource.createIfNeeded(options.url);
		this._errorEvent = new Cesium.Event();
		this._ready = false;
		this._readyPromise = Cesium.when.defer();
		this._terrainDataStructure = {
			heightScale: 1.0,
			heightOffset: 0.0,
			elementsPerHeight: 1,
			stride: 1,
			elementMultiplier: 256.0,
			isBigEndian: false
			//lowestEncodedHeight : 0,
			//highestEncodedHeight : 10000
		};
		this._maxLevel = 0;
		var credit = options.credit;
		if (typeof credit === 'string') {
			credit = new Cesium.Credit(credit);
		}
		this._credit = credit;

		this._heightmapWidth = 65;
		this._tilingScheme = new Cesium.GeographicTilingScheme();
		this._levelZeroMaximumGeometricError = Cesium.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(this
			._tilingScheme.ellipsoid, this._heightmapWidth, this._tilingScheme.getNumberOfXTilesAtLevel(0));
		this._rectangle = undefined;

		var that = this;
		var metadataError;

		function metadataSuccess(data) {
			//that._maxLevel = Cesium.Math.max(that._maxLevel,data.maxLevel);
			that._maxLevel = data.maxLevel;
			that._rectangle = Cesium.Rectangle.fromDegrees(data.minX, data.minY, data.maxX, data.maxY);

			that._resource.appendForwardSlash();
			that._ready = true;
			that._readyPromise.resolve(true);
		}

		function metadataFailure(e) {
			var message = Cesium.defaultValue(e, 'An error occurred while accessing ' + that._resource.url + '.');
			metadataError = Cesium.TileProviderError.handleError(metadataError, that, that._errorEvent, message, undefined,
				undefined, undefined, requestMetadata);
		}

		function requestMetadata() {
			Cesium.when(that._resource.fetchJson(), metadataSuccess, metadataFailure);
		}

		requestMetadata();
	}
	Object.defineProperties(SDCSingleTerrainProvider.prototype, {
		errorEvent: {
			get: function() {
				return this._errorEvent;
			}
		},
		credit: {
			get: function() {
				return this._credit;
			}
		},
		tilingScheme: {
			get: function() {
				if (!this.ready) {
					throw new DeveloperError('requestTileGeometry must not be called before ready returns true.');
				}
				return this._tilingScheme;
			}
		},
		ready: {
			get: function() {
				return this._ready;
			}
		},
		readyPromise: {
			get: function() {
				return this._readyPromise.promise;
			}
		},
		hasWaterMask: {
			get: function() {
				return false;
			}
		},
		hasVertexNormals: {
			get: function() {
				return false;
			}
		}
	});
	SDCSingleTerrainProvider.prototype.requestTileGeometry = function(x, y, level, request) {
		if (!this.ready) {
			throw new Cesium.DeveloperError('requestTileGeometry must not be called before ready returns true.');
		}
		var resource = this._resource.getDerivedResource({
			url: level + '/' + x + '/' + y + '.raw',
			request: request
		});
		var promise = resource.fetchArrayBuffer();
		if (!Cesium.defined(promise)) {
			return undefined;
		}

		var that = this;
		return Cesium.when(promise)
			.then(function(arrayBuffer) {
				return new Cesium.HeightmapTerrainData({
					buffer: arrayBufferToHeightmapTerrainData(that, arrayBuffer),
					width: that._heightmapWidth,
					height: that._heightmapWidth,
					childTileMask: getChildMask(that, x, y, level),
					structure: that._terrainDataStructure
				});
			});
	};

	function getChildMask(provider, x, y, level) {
		var childMask = 0;
		return childMask;
	}

	function arrayBufferToHeightmapTerrainData(provider, arrayBuffer) {
		var result;
		if (arrayBuffer.byteLength == 0) {
			result = new Int16Array(provider._heightmapWidth * provider._heightmapWidth);
		} else {
			result = new Int16Array(arrayBuffer);
		}
		return result;
	}
	SDCSingleTerrainProvider.prototype.getLevelMaximumGeometricError = function(level) {
		if (!this.ready) {
			throw new Cesium.DeveloperError('requestTileGeometry must not be called before ready returns true.');
		}
		return this._levelZeroMaximumGeometricError / (1 << level);
	};
	SDCSingleTerrainProvider.prototype.getTileDataAvailable = function(x, y, level) {
		var available = false;
		if (level < 1)
			available = true;
		else {
			if (level <= this._maxLevel) {
				var currentRectangle = this._tilingScheme.tileXYToRectangle(x, y, level);
				var intersectRect = Cesium.Rectangle.intersection(this._rectangle, currentRectangle);
				if (Cesium.defined(intersectRect)) {
					available = true;
				}
			}
		}
		return available;
	};

	Cesium.SDCSingleTerrainProvider = SDCSingleTerrainProvider;
})();
