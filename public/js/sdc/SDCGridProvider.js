/**
 * 名称:GEOVIS-SDC grid
 * 开发者:wangmeng
 * 单位:西安中科星图空间数据技术有限公司空天信息产品中心
 */
(function() {
	var SDCGridProvider = function(options){
		options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
        this._tilingScheme = Cesium.defined(options.tilingScheme) ? options.tilingScheme : new Cesium.GeographicTilingScheme({ ellipsoid : options.ellipsoid });
        this._color = Cesium.defaultValue(options.color, Cesium.Color.YELLOW);
        this._errorEvent = new Cesium.Event();
        this._tileWidth = Cesium.defaultValue(options.tileWidth, 256);
        this._tileHeight = Cesium.defaultValue(options.tileHeight, 256);
        this._readyPromise = Cesium.when.resolve(true);
	}
	Object.defineProperties(SDCGridProvider.prototype, {
        proxy : {
            get : function() {
                return undefined;
            }
        },
        tileWidth : {
            get : function() {
                return this._tileWidth;
            }
        },
        tileHeight: {
            get : function() {
                return this._tileHeight;
            }
        },
        maximumLevel : {
            get : function() {
                return undefined;
            }
        },
        minimumLevel : {
            get : function() {
                return undefined;
            }
        },
        tilingScheme : {
            get : function() {
                return this._tilingScheme;
            }
        },
        rectangle : {
            get : function() {
                return this._tilingScheme.rectangle;
            }
        },
        tileDiscardPolicy : {
            get : function() {
                return undefined;
            }
        },
        errorEvent : {
            get : function() {
                return this._errorEvent;
            }
        },
        ready : {
            get : function() {
                return true;
            }
        },
        readyPromise : {
            get : function() {
                return this._readyPromise;
            }
        },
        credit : {
            get : function() {
                return undefined;
            }
        },
        hasAlphaChannel : {
            get: function () {
                return true;
            }
        }
    });
    SDCGridProvider.prototype.getTileCredits = function(x, y, level) {
        return undefined;
    };
    SDCGridProvider.prototype.requestImage = function(x, y, level,request) {
        var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        if(level<12) {
            var context = canvas.getContext('2d');
            var cssColor = this._color.toCssColorString();
            context.strokeStyle = cssColor;
            context.lineWidth = 1;
            context.strokeRect(1, 1, 255, 255);
            context.fillStyle = cssColor;
            context.font = '18px Arial';
            /*var label = 'L' + level + 'X' + x + 'Y' + y;
            context.font = 'bold 25px Arial';
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText(label, 127, 127);
            context.fillStyle = cssColor;
            context.fillText(label, 124, 124);*/

            var lon = -180 + 360.0 / Math.pow(2, (level + 1)) * x;
            var lat = 90 - 180.0 / Math.pow(2, level) * (y + 1);
            if (Math.abs(lat) < 75) {
                if(level>4){
                    if(x%2+y%2==1){
                        drawContext(context,lon,lat);
                    }
                }
                else{
                    drawContext(context,lon,lat);
                }
            }
        }
        return canvas;
    };
    function drawContext(context,lon,lat) {
        context.textAlign = 'left';
        context.fillText(lon + "°", 5, 127);
        context.textAlign = 'center';
        context.fillText(lat + "°", 127, 250);
    }
    SDCGridProvider.prototype.pickFeatures = function(x, y, level, longitude, latitude) {
		return undefined;
    };

	Cesium.SDCGridProvider = SDCGridProvider;
})();