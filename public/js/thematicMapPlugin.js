module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "0c28":
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__("24fb");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "#ztMapDiv[data-v-354694fb]{position:absolute;left:10%;top:10%;width:1550px;height:670px;padding:10px;z-index:100;background-color:#fff;border:2px solid #000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}#mapDiv[data-v-354694fb]{width:1160px;height:600px;left:25px;border:1px solid #000}#mapDiv[data-v-354694fb],#mapTools[data-v-354694fb]{position:absolute;top:70px}#mapTools[data-v-354694fb]{right:15px}.title[data-v-354694fb]{text-align:center;font-size:20px;font-weight:700}#outputMap[data-v-354694fb]{position:absolute;width:800px;height:390px;left:50px;top:110px}#wangEditorDiv[data-v-354694fb]{margin-top:20px;margin-bottom:20px;width:300px}.closeZT[data-v-354694fb]{right:10px}.closeZT[data-v-354694fb],.saveZT[data-v-354694fb]{position:absolute;top:10px;z-index:100;cursor:pointer;width:20px;height:20px}.saveZT[data-v-354694fb]{right:50px}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "24fb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ "499e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ addStylesClient; });

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ "ce50":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_thematicMap_vue_vue_type_style_index_0_id_354694fb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("fe60");
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_thematicMap_vue_vue_type_style_index_0_id_354694fb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_thematicMap_vue_vue_type_style_index_0_id_354694fb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_vue_style_loader_index_js_ref_6_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_thematicMap_vue_vue_type_style_index_0_id_354694fb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"02a7868b-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./plugins/ThematicMap/thematicMap.vue?vue&type=template&id=354694fb&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.ztMapVisible),expression:"ztMapVisible"}],attrs:{"id":"ztMapDiv"}},[_c('div',{staticClass:"title"},[_vm._v("专题图制作")]),_c('img',{staticClass:"closeZT",attrs:{"src":"image/close2.png","title":"关闭"},on:{"click":_vm.closeZtMap}}),_c('img',{staticClass:"saveZT",attrs:{"src":"image/save.png","title":"保存"},on:{"click":_vm.saveZtMap}}),_c('div',{attrs:{"id":"mapTools"}},[_c('el-tabs',{attrs:{"type":"border-card"}},[_c('el-tab-pane',{attrs:{"label":"文字"}},[_c('div',{attrs:{"id":"wangEditorDiv"}}),_c('el-button',{attrs:{"type":"primary","size":"small"},on:{"click":_vm.addTextToImg}},[_vm._v("添加")])],1),_c('el-tab-pane',{attrs:{"label":"图例"}},[_c('el-form',{ref:"form",attrs:{"model":_vm.form,"label-width":"80px"}},[_c('el-form-item',{attrs:{"label":"图例类型"}},[_c('el-select',{attrs:{"placeholder":"请选择图例类型"},model:{value:(_vm.form.type),callback:function ($$v) {_vm.$set(_vm.form, "type", $$v)},expression:"form.type"}},[_c('el-option',{attrs:{"label":"颜色-文字","value":"color-text"}}),_c('el-option',{attrs:{"label":"图标-文字","value":"image-text"}})],1)],1),_c('el-form-item',{directives:[{name:"show",rawName:"v-show",value:(_vm.form.type==='color-text'),expression:"form.type==='color-text'"}],attrs:{"label":"颜色"}},[_c('el-color-picker',{attrs:{"size":"medium"},model:{value:(_vm.form.color),callback:function ($$v) {_vm.$set(_vm.form, "color", $$v)},expression:"form.color"}})],1),_c('el-form-item',{directives:[{name:"show",rawName:"v-show",value:(_vm.form.type==='image-text'),expression:"form.type==='image-text'"}],attrs:{"label":"图标"}},[_c('el-upload',{ref:"legendUpload",attrs:{"action":"","auto-upload":false,"limit":1,"file-list":_vm.form.fileList,"on-change":_vm.fileChange,"on-exceed":_vm.fileExceed,"accept":"image/png, image/jpeg"}},[_c('el-button',{attrs:{"size":"small","type":"primary"}},[_vm._v("点击上传")])],1)],1),_c('el-form-item',{attrs:{"label":"文字"}},[_c('el-input',{model:{value:(_vm.form.label),callback:function ($$v) {_vm.$set(_vm.form, "label", $$v)},expression:"form.label"}})],1),_c('el-form-item',[_c('el-button',{attrs:{"type":"primary"},on:{"click":_vm.addLegend}},[_vm._v("添加")])],1)],1)],1),_c('el-tab-pane',{attrs:{"label":"比例尺"}},[_c('div',{staticStyle:{"text-align":"center","margin-bottom":"20px"}},[_c('div',[_c('img',{staticStyle:{"width":"50px","height":"10px"},attrs:{"src":"image/scale.png"}})]),_c('el-button',{attrs:{"type":"primary","size":"small"},on:{"click":function($event){return _vm.addScale('image/scale.png')}}},[_vm._v("添加")])],1)]),_c('el-tab-pane',{attrs:{"label":"指北针"}},[_c('div',{staticStyle:{"text-align":"center","margin-bottom":"20px"}},[_c('div',[_c('img',{staticStyle:{"width":"100px","height":"100px"},attrs:{"src":"image/north1.jpg"}})]),_c('el-button',{attrs:{"type":"primary","size":"small"},on:{"click":function($event){return _vm.addNorth('image/north1.jpg')}}},[_vm._v("添加")])],1),_c('div',{staticStyle:{"text-align":"center","margin-bottom":"20px"}},[_c('div',[_c('img',{staticStyle:{"width":"100px","height":"100px"},attrs:{"src":"image/north2.jpg"}})]),_c('el-button',{attrs:{"type":"primary","size":"small"},on:{"click":function($event){return _vm.addNorth('image/north2.jpg')}}},[_vm._v("添加")])],1)])],1)],1),_vm._m(0)])}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"mapDiv"}},[_c('div',{attrs:{"id":"outputMap"}},[_c('img',{attrs:{"id":"ztMapImg"}})])])}]


// CONCATENATED MODULE: ./plugins/ThematicMap/thematicMap.vue?vue&type=template&id=354694fb&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./plugins/ThematicMap/thematicMap.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

	/* harmony default export */ var thematicMapvue_type_script_lang_js_ = ({
		name: 'thematicMap',
		data(){
			return{
                ztMapVisible: false,

                // 经纬度刻度标注份数
                degreeMarkNum: 4,
                // 刻度线的长度
                markPxLen: 10,
                // 刻度线距图片的距离
                markToImgPxLen: 2,
                // 标注距图片的距离
                locationToImgPxLen: 18,
                // 经纬度刻度线DOM元素集合
                markIds: [],
                // 经纬度文字标注DOM元素集合
                locationIds: [],
                // 富文本文字标注DOM元素集合
                textDivIds: [],
                // 指北针DOM元素集合
                northDivIds: [],
                // 比例尺DOM元素集合
                scaleDivIds: [],
                // 图例DOM元素集合
                legendDivIds: [],
                // 富文本编辑器实例
                editor: null,
                // 移动div
                x: 0,
                y: 0,
                l: 0,
                t: 0,
                isDown: false,
                // 地图比例尺
                mapScale: '',
                // 图例
                form: {
                    type: 'color-text',
                    color: '#409EFF',
                    fileList: [],
                    label: '',
                },
			}
		},
		mounted(){
			this.createEditor();
		},
        methods:{
		    // 点击专题图按钮
            initZT(){
                if(!viewer){
                    this.$message({
                        message: '请先初始化地球viewer，并放在window作用域中！',
                        type: 'error'
                    });
                    return;
                }
                let canvas = viewer.scene.canvas;
                //只需要定义图片的宽度（高度计算得到）
                let imageWidth = 800;
                let genimg = Canvas2Image.convertToImage(canvas, imageWidth, imageWidth * canvas.height / canvas.width,'jpg');
                let image = document.getElementById('ztMapImg');
                image.src = genimg.src;
                this.ztMapVisible = true;
                this.$nextTick(()=>{
                    this.degreeMark();
                })
            },
            // 关闭专题图
            closeZtMap(){
                this.ztMapVisible = false;
                for(let i=0; i<this.markIds.length; i++){
                    document.getElementById(this.markIds[i]).remove();
                }
                this.markIds = [];
                for(let i=0; i<this.locationIds.length; i++){
                    document.getElementById(this.locationIds[i]).remove();
                }
                this.locationIds = [];
                for(let i=0; i<this.textDivIds.length; i++){
                    document.getElementById(this.textDivIds[i]).remove();
                }
                this.textDivIds = [];
                for(let i=0; i<this.northDivIds.length; i++){
                    document.getElementById(this.northDivIds[i]).remove();
                }
                this.northDivIds = [];
                for(let i=0; i<this.scaleDivIds.length; i++){
                    document.getElementById(this.scaleDivIds[i]).remove();
                }
                this.scaleDivIds = [];
                for(let i=0; i<this.legendDivIds.length; i++){
                    document.getElementById(this.legendDivIds[i]).remove();
                }
                this.legendDivIds = [];
                this.editor.txt.html('');
                this.form = {
                    type: 'color-text',
                    color: '#409EFF',
                    fileList: [],
                    label: '',
                };
            },
            // 保存专题图
            saveZtMap(){
                let _this = this;
                html2canvas(document.getElementById("mapDiv")).then(function(canvas) {
                    let canvasWidth = canvas.width;
                    let canvasHeight = canvas.height;
                    let img = Canvas2Image.convertToImage(canvas, canvasWidth, canvasHeight);
                    _this.saveFile(img.src, "专题图.png")
                });
            },
            // 保存文件
            saveFile(data, filename){
                let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                save_link.href = data;
                save_link.download = filename;
                let event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                save_link.dispatchEvent(event);
            },

            // 经纬度刻度线
            degreeMark(){
                let bound = this.getViewRectangle();
                if(bound.minLon === -180 || bound.minLat === -90 || bound.maxLon === 180 || bound.maxLat === 90){
                    this.$message({
                        message: '当前相机视角太高，经纬度计算不准确，请放大地球！',
                        type: 'warning'
                    });
                    this.ztMapVisible = false;
                    return;
                }
                let imgWidth = document.getElementById("ztMapImg").width;
                let imgHeight = document.getElementById("ztMapImg").height;
                let imgLeft = document.getElementById("ztMapImg").getBoundingClientRect().left;
                let imgTop = document.getElementById("ztMapImg").getBoundingClientRect().top;
                let divLeft = document.getElementById("outputMap").getBoundingClientRect().left;
                let divTop = document.getElementById("outputMap").getBoundingClientRect().top;
                // 计算像素和经纬度的步长
                let pxX = imgWidth / this.degreeMarkNum;
                let pxY = imgHeight / this.degreeMarkNum;
                let stepLon = (bound.maxLon - bound.minLon) / this.degreeMarkNum;
                let stepLat = (bound.maxLat - bound.minLat) / this.degreeMarkNum;
                for(let i=1; i<=this.degreeMarkNum-1; i++){
                    let x = (imgLeft-divLeft) + i * pxX;
                    let y = (imgTop-divTop) + i * pxY;
                    let lon = bound.minLon + stepLon*i;
                    let lat = bound.maxLat - stepLat*i;
                    this.createOneMark(x, (imgTop-divTop), "top", lon.toFixed(4), bound.maxLat.toFixed(4), "top-"+i);
                    this.createOneMark(x, (imgTop-divTop+imgHeight), "bottom", lon.toFixed(4), bound.minLat.toFixed(4), "bottom-"+i);
                    this.createOneMark((imgLeft-divLeft), y, "left", bound.minLon.toFixed(4), lat.toFixed(4), "left-"+i);
                    this.createOneMark((imgLeft-divLeft+imgWidth), y, "right", bound.maxLon.toFixed(4), lat.toFixed(4), "right-"+i);
                }
            },
            // 创建单个刻度线和经纬度标注
            createOneMark(left, top, direction, lon, lat, divId){
                let mark = document.createElement("div");
                mark.id = "mark-"+divId;
                mark.style.zIndex = 100;
                mark.style.width = this.markPxLen + "px";
                mark.style.height = this.markPxLen + "px";
                mark.style.position = "absolute";
                let location = document.createElement("div");
                location.style.zIndex = 100;
                location.style.position = "absolute";
                location.id = "location-"+divId;
                switch(direction){
                    case 'top':
                        mark.style.left = left + "px";
                        mark.style.top = (top-(this.markPxLen+this.markToImgPxLen)) + "px";
                        mark.style.borderLeft = "2px solid #000000";
                        location.style.left = (left-30) + "px";
                        location.style.top = (top-this.locationToImgPxLen-21) + "px";
                        location.innerHTML = lon+"°";
                        break;
                    case 'bottom':
                        mark.style.left = left + "px";
                        mark.style.top = (top+this.markToImgPxLen) + "px";
                        mark.style.borderLeft = "2px solid #000000";
                        location.style.left = (left-30) + "px";
                        location.style.top = (top+this.locationToImgPxLen) + "px";
                        location.innerHTML = lon+"°";
                        break;
                    case 'left':
                        mark.style.left = (left-(this.markPxLen+this.markToImgPxLen)) + "px";
                        mark.style.top = top + "px";
                        mark.style.borderTop = "2px solid #000000";
                        location.style.left = (left-55) + "px";
                        location.style.top = (top-10) + "px";
                        location.innerHTML = lat+"°";
                        location.style.transform = "rotate(90deg)";
                        break;
                    case 'right':
                        mark.style.left = (left+this.markToImgPxLen) + "px";
                        mark.style.top = top + "px";
                        mark.style.borderTop = "2px solid #000000";
                        location.style.left = (left-5) + "px";
                        location.style.top = (top-15) + "px";
                        location.innerHTML = lat+"°";
                        location.style.transform = "rotate(-90deg)";
                        break;
                }
                document.getElementById("outputMap").appendChild(mark);
                document.getElementById("outputMap").appendChild(location);
                this.markIds.push(mark.id);
                this.locationIds.push(location.id);
            },
            // 获取当前视角的经纬度范围
            getViewRectangle(){
                let rect = viewer.camera.computeViewRectangle();
                let minLon = Cesium.Math.toDegrees(rect.west);
                let maxLon = Cesium.Math.toDegrees(rect.east);
                let minLat = Cesium.Math.toDegrees(rect.south);
                let maxLat = Cesium.Math.toDegrees(rect.north);
                return {
                    minLon: minLon,
                    maxLon: maxLon,
                    minLat: minLat,
                    maxLat: maxLat
                };
            },

            // 创建富文本编辑器
            createEditor(){
                const E = window.wangEditor;
                this.editor = new E('#wangEditorDiv');
                // 是否显示全屏按钮
                this.editor.config.showFullScreen = false;
                // 菜单栏提示为下标
                // editor.config.menuTooltipPosition = 'down'
                // 配置菜单栏，删减菜单，调整顺序
                this.editor.config.menus = [
                    'bold',
                    'fontSize',
                    'fontName',
                    'italic',
                    'foreColor',
                    'backColor',
                ];
                this.editor.create();
            },
            // 增加文字
            addTextToImg(){
                let _this = this;
                let htmlStr = this.editor.txt.html();
                console.log(htmlStr);
                // 创建文字DOM元素
                let textDiv = document.createElement("div");
                textDiv.id = this.generateUUID();
                this.textDivIds.push(textDiv.id);
                textDiv.innerHTML = htmlStr;
                textDiv.style.position = "absolute";
                textDiv.style.top = "10px";
                textDiv.style.left = "10px";
                document.getElementById("mapDiv").appendChild(textDiv);

                // 创建文字右上角的删除文字 DOM元素
                let imgDiv = document.createElement("img");
                imgDiv.style.position = "absolute";
                imgDiv.style.top = "0px";
                imgDiv.style.right = "-18px";
                imgDiv.style.display = "none";
                imgDiv.title = "删除";
                imgDiv.src = "image/close3.png";
                imgDiv.width = 20;
                imgDiv.height = 20;
                imgDiv.id = "closeImg-"+textDiv.id;
                textDiv.appendChild(imgDiv);

                // 鼠标悬浮显示或隐藏删除按钮
                textDiv.onmouseover = function(e){
                    textDiv.style.cursor = "default";
                    document.getElementById("closeImg-"+textDiv.id).style.display = "block";
                };
                textDiv.onmouseleave = function(e){
                    document.getElementById("closeImg-"+textDiv.id).style.display = "none";
                };

                // 删除文字按钮事件
                imgDiv.onclick = function (e) {
                    let textDivId = imgDiv.id.split("closeImg-")[1];
                    document.getElementById(textDivId).remove();
                };

                textDiv.onmousedown = function (e) {
                    _this.x = e.clientX;
                    _this.y = e.clientY;
                    //获取左部和顶部的偏移量
                    _this.l = textDiv.offsetLeft;
                    _this.t = textDiv.offsetTop;
                    //开关打开
                    _this.isDown = true;
                    // 设置鼠标样式
                    textDiv.style.cursor = "move";
                    document.onmousemove = function (e2) {
                        if(_this.isDown){
                            let nx = e2.clientX;
                            let ny = e2.clientY;
                            // 计算偏移量
                            let nl = nx - (_this.x - _this.l);
                            let nt = ny - (_this.y - _this.t);
                            textDiv.style.left = nl + 'px';
                            textDiv.style.top = nt + 'px';
                            document.onmouseup = function (e3) {
                                _this.x = 0;
                                _this.y = 0;
                                _this.l = 0;
                                _this.t = 0;
                                _this.isDown = false;
                                textDiv.style.cursor = "default";
                            };
                        }
                    };
                };
            },

            // 添加指北针
            addNorth(imgSrc){
                let _this = this;
                // 创建指北针 DOM元素
                let northDiv = document.createElement("div");
                northDiv.style.position = "absolute";
                northDiv.style.top = "10px";
                northDiv.style.right = "120px";
                northDiv.id = this.generateUUID();
                this.northDivIds.push(northDiv.id);
                let northImgDiv = document.createElement("img");
                northImgDiv.style.position = "absolute";
                northImgDiv.style.top = "0px";
                northImgDiv.style.left = "0px";
                northImgDiv.src = imgSrc;
                northImgDiv.width = 100;
                northImgDiv.height = 100;
                northDiv.appendChild(northImgDiv);
                document.getElementById("mapDiv").appendChild(northDiv);
                // 创建删除指北针 DOM元素
                let imgDiv = document.createElement("img");
                imgDiv.style.position = "relative";
                imgDiv.style.top = "0px";
                imgDiv.style.left = "80px";
                imgDiv.style.display = "none";
                imgDiv.title = "删除";
                imgDiv.src = "image/close3.png";
                imgDiv.width = 20;
                imgDiv.height = 20;
                imgDiv.id = "closeImg-"+northDiv.id;
                northDiv.appendChild(imgDiv);
                // 鼠标悬浮显示或隐藏删除按钮
                northDiv.onmouseover = function(e){
                    document.getElementById("closeImg-"+northDiv.id).style.display = "block";
                };
                northDiv.onmouseleave = function(e){
                    document.getElementById("closeImg-"+northDiv.id).style.display = "none";
                };
                // 删除指北针按钮事件
                imgDiv.onclick = function (e) {
                    let northDivId = imgDiv.id.split("closeImg-")[1];
                    document.getElementById(northDivId).remove();
                };
                northDiv.onmousedown = function (e) {
                    e.preventDefault();
                    _this.x = e.clientX;
                    _this.y = e.clientY;
                    //获取左部和顶部的偏移量
                    _this.l = northDiv.offsetLeft;
                    _this.t = northDiv.offsetTop;
                    //开关打开
                    _this.isDown = true;
                    // 设置鼠标样式
                    northDiv.style.cursor = "move";
                    document.onmousemove = function (e2) {
                        e2.preventDefault();
                        if(_this.isDown){
                            let nx = e2.clientX;
                            let ny = e2.clientY;
                            // 计算偏移量
                            let nl = nx - (_this.x - _this.l);
                            let nt = ny - (_this.y - _this.t);
                            northDiv.style.left = nl + 'px';
                            northDiv.style.top = nt + 'px';
                            document.onmouseup = function (e3) {
                                e3.preventDefault();
                                _this.x = 0;
                                _this.y = 0;
                                _this.l = 0;
                                _this.t = 0;
                                _this.isDown = false;
                                northDiv.style.cursor = "default";
                            };
                        }
                    };
                };
            },

            // 添加比例尺(1cm = 25px)
            addScale(imgSrc){
                let bound = this.getViewRectangle();
                let imgWidth = document.getElementById("ztMapImg").width;
                let imgHeight = document.getElementById("ztMapImg").height;
                let s = this.calcScale(bound, imgWidth, imgHeight);
                // 比例尺的固定宽高为 100*20
                console.log("比例尺为：100px:"+parseInt(s*100)+"KM");
                let _this = this;
                // 创建比例尺 DOM元素
                let scaleDiv = document.createElement("div");
                scaleDiv.style.position = "absolute";
                scaleDiv.style.bottom = "30px";
                scaleDiv.style.left = "30px";
                scaleDiv.id = this.generateUUID();
                this.scaleDivIds.push(scaleDiv.id);
                let scaleImgDiv = document.createElement("img");
                scaleImgDiv.style.position = "absolute";
                scaleImgDiv.style.top = "0px";
                scaleImgDiv.style.left = "0px";
                scaleImgDiv.src = imgSrc;
                scaleImgDiv.width = 100;
                scaleImgDiv.height = 20;
                scaleDiv.appendChild(scaleImgDiv);
                document.getElementById("mapDiv").appendChild(scaleDiv);
                // 创建比例尺文字 DOM元素
                let textDiv = document.createElement("span");
                textDiv.style.position = "relative";
                textDiv.style.bottom = "15px";
                textDiv.style.left = "20px";
                textDiv.innerHTML = parseInt(s*100)+"KM";
                scaleDiv.appendChild(textDiv);
                // 创建删除比例尺 DOM元素
                let imgDiv = document.createElement("img");
                imgDiv.style.position = "relative";
                imgDiv.style.top = "-15px";
                imgDiv.style.left = "25px";
                imgDiv.style.display = "none";
                imgDiv.title = "删除";
                imgDiv.src = "image/close3.png";
                imgDiv.width = 20;
                imgDiv.height = 20;
                imgDiv.id = "closeImg-"+scaleDiv.id;
                scaleDiv.appendChild(imgDiv);
                // 鼠标悬浮显示或隐藏删除按钮
                scaleDiv.onmouseover = function(e){
                    document.getElementById("closeImg-"+scaleDiv.id).style.display = "inline";
                };
                scaleDiv.onmouseleave = function(e){
                    document.getElementById("closeImg-"+scaleDiv.id).style.display = "none";
                };
                // 删除指北针按钮事件
                imgDiv.onclick = function (e) {
                    let scaleDivId = imgDiv.id.split("closeImg-")[1];
                    document.getElementById(scaleDivId).remove();
                };
                scaleDiv.onmousedown = function (e) {
                    e.preventDefault();
                    _this.x = e.clientX;
                    _this.y = e.clientY;
                    //获取左部和顶部的偏移量
                    _this.l = scaleDiv.offsetLeft;
                    _this.t = scaleDiv.offsetTop;
                    //开关打开
                    _this.isDown = true;
                    // 设置鼠标样式
                    scaleDiv.style.cursor = "move";
                    document.onmousemove = function (e2) {
                        e2.preventDefault();
                        if(_this.isDown){
                            let nx = e2.clientX;
                            let ny = e2.clientY;
                            // 计算偏移量
                            let nl = nx - (_this.x - _this.l);
                            let nt = ny - (_this.y - _this.t);
                            scaleDiv.style.left = nl + 'px';
                            scaleDiv.style.top = nt + 'px';
                            document.onmouseup = function (e3) {
                                e3.preventDefault();
                                _this.x = 0;
                                _this.y = 0;
                                _this.l = 0;
                                _this.t = 0;
                                _this.isDown = false;
                                scaleDiv.style.cursor = "default";
                            };
                        }
                    };
                };
            },
            // 计算比例尺(1px的实际距离km)
            calcScale(bound, mapWidth, mapHeight){
                // 纬度 1度=111km
                return (bound.maxLat-bound.minLat) * 111 / mapHeight;
            },

            // 增加图例
            addLegend(){
                let _this = this;
                if(this.form.label.trim() === ''){
                    this.$message({
                        message: '请输入图例中的文字！',
                        type: 'warning'
                    });
                    return;
                }
                switch(this.form.type){
                    case 'color-text':
                        // 创建图例 DOM元素
                        let legendDiv = document.createElement("div");
                        legendDiv.style.position = "absolute";
                        legendDiv.style.top = "150px";
                        legendDiv.style.right = "150px";
                        legendDiv.id = this.generateUUID();
                        this.legendDivIds.push(legendDiv.id);
                        let colorDiv = document.createElement("div");
                        colorDiv.style.position = "absolute";
                        colorDiv.style.top = "0px";
                        colorDiv.style.left = "0px";
                        colorDiv.style.backgroundColor = this.form.color;
                        colorDiv.style.border = "1px solid #000000";
                        colorDiv.style.width = "50px";
                        colorDiv.style.height = "20px";
                        legendDiv.appendChild(colorDiv);
                        document.getElementById("mapDiv").appendChild(legendDiv);
                        // 创建图例文字 DOM元素
                        let textDiv = document.createElement("div");
                        textDiv.style.position = "relative";
                        textDiv.style.bottom = "0px";
                        textDiv.style.left = "60px";
                        textDiv.innerHTML = this.form.label;
                        legendDiv.appendChild(textDiv);
                        // 创建删除图例 DOM元素
                        let imgDiv = document.createElement("img");
                        imgDiv.style.position = "relative";
                        imgDiv.style.bottom = "30px";
                        imgDiv.style.left = colorDiv.offsetWidth + textDiv.offsetWidth +"px";
                        imgDiv.style.display = "none";
                        imgDiv.title = "删除";
                        imgDiv.src = "image/close3.png";
                        imgDiv.width = 20;
                        imgDiv.height = 20;
                        imgDiv.id = "closeImg-"+legendDiv.id;
                        legendDiv.appendChild(imgDiv);
                        // 鼠标悬浮显示或隐藏删除按钮
                        legendDiv.onmouseover = function(e){
                            document.getElementById("closeImg-"+legendDiv.id).style.display = "inline";
                        };
                        legendDiv.onmouseleave = function(e){
                            document.getElementById("closeImg-"+legendDiv.id).style.display = "none";
                        };
                        // 删除图例按钮事件
                        imgDiv.onclick = function (e) {
                            let legendDivId = imgDiv.id.split("closeImg-")[1];
                            document.getElementById(legendDivId).remove();
                        };
                        legendDiv.onmousedown = function (e) {
                            e.preventDefault();
                            _this.x = e.clientX;
                            _this.y = e.clientY;
                            //获取左部和顶部的偏移量
                            _this.l = legendDiv.offsetLeft;
                            _this.t = legendDiv.offsetTop;
                            //开关打开
                            _this.isDown = true;
                            // 设置鼠标样式
                            legendDiv.style.cursor = "move";
                            document.onmousemove = function (e2) {
                                e2.preventDefault();
                                if(_this.isDown){
                                    let nx = e2.clientX;
                                    let ny = e2.clientY;
                                    // 计算偏移量
                                    let nl = nx - (_this.x - _this.l);
                                    let nt = ny - (_this.y - _this.t);
                                    legendDiv.style.left = nl + 'px';
                                    legendDiv.style.top = nt + 'px';
                                    document.onmouseup = function (e3) {
                                        e3.preventDefault();
                                        _this.x = 0;
                                        _this.y = 0;
                                        _this.l = 0;
                                        _this.t = 0;
                                        _this.isDown = false;
                                        legendDiv.style.cursor = "default";
                                    };
                                }
                            };
                        };
                        break;
                    case 'image-text':
                        let reader = new FileReader();
                        reader.readAsDataURL(_this.form.fileList[0]);
                        reader.onload = function(event){
                            // 创建图例 DOM元素
                            let legendDiv2 = document.createElement("div");
                            legendDiv2.style.position = "absolute";
                            legendDiv2.style.top = "150px";
                            legendDiv2.style.right = "150px";
                            legendDiv2.id = _this.generateUUID();
                            _this.legendDivIds.push(legendDiv2.id);
                            let iconImg = document.createElement("img");
                            iconImg.src = event.target.result;
                            iconImg.style.position = "absolute";
                            iconImg.style.top = "0px";
                            iconImg.style.left = "0px";
                            iconImg.style.width = "50px";
                            iconImg.style.height = "50px";
                            legendDiv2.appendChild(iconImg);
                            document.getElementById("mapDiv").appendChild(legendDiv2);
                            // 创建图例文字 DOM元素
                            let textDiv2 = document.createElement("div");
                            textDiv2.style.position = "relative";
                            textDiv2.style.top = "12px";
                            textDiv2.style.left = "60px";
                            textDiv2.innerHTML = _this.form.label;
                            legendDiv2.appendChild(textDiv2);
                            // 创建删除图例 DOM元素
                            let imgDiv2 = document.createElement("img");
                            imgDiv2.style.position = "relative";
                            imgDiv2.style.bottom = "20px";
                            imgDiv2.style.left = iconImg.offsetWidth + textDiv2.offsetWidth +"px";
                            imgDiv2.style.display = "none";
                            imgDiv2.title = "删除";
                            imgDiv2.src = "image/close3.png";
                            imgDiv2.width = 20;
                            imgDiv2.height = 20;
                            imgDiv2.id = "closeImg-"+legendDiv2.id;
                            legendDiv2.appendChild(imgDiv2);
                            // 鼠标悬浮显示或隐藏删除按钮
                            legendDiv2.onmouseover = function(e){
                                document.getElementById("closeImg-"+legendDiv2.id).style.display = "inline";
                            };
                            legendDiv2.onmouseleave = function(e){
                                document.getElementById("closeImg-"+legendDiv2.id).style.display = "none";
                            };
                            // 删除图例按钮事件
                            imgDiv2.onclick = function (e) {
                                let legendDivId2 = imgDiv2.id.split("closeImg-")[1];
                                document.getElementById(legendDivId2).remove();
                            };
                            legendDiv2.onmousedown = function (e) {
                                e.preventDefault();
                                _this.x = e.clientX;
                                _this.y = e.clientY;
                                //获取左部和顶部的偏移量
                                _this.l = legendDiv2.offsetLeft;
                                _this.t = legendDiv2.offsetTop;
                                //开关打开
                                _this.isDown = true;
                                // 设置鼠标样式
                                legendDiv2.style.cursor = "move";
                                document.onmousemove = function (e2) {
                                    e2.preventDefault();
                                    if(_this.isDown){
                                        let nx = e2.clientX;
                                        let ny = e2.clientY;
                                        // 计算偏移量
                                        let nl = nx - (_this.x - _this.l);
                                        let nt = ny - (_this.y - _this.t);
                                        legendDiv2.style.left = nl + 'px';
                                        legendDiv2.style.top = nt + 'px';
                                        document.onmouseup = function (e3) {
                                            e3.preventDefault();
                                            _this.x = 0;
                                            _this.y = 0;
                                            _this.l = 0;
                                            _this.t = 0;
                                            _this.isDown = false;
                                            legendDiv2.style.cursor = "default";
                                        };
                                    }
                                };
                            };
                        };
                        break;
                }
            },
            fileChange(file, fileList){
                let fs = document.getElementsByName('file');
                if(fs.length > 0) {
                    fs.value=null
                }
                this.form.fileList = [];
                this.form.fileList.push(file.raw);
            },
            // 图例图标上传文件超出限制时，即文件发生改变。files:选择的具体文件，类型为File
            fileExceed(files, fileList){
                let fs = document.getElementsByName('file');
                if(fs.length > 0) {
                    fs.value=null
                }
                this.form.fileList = [];
                this.form.fileList.push(files[0]);
            },

            generateUUID() {
                let d = new Date().getTime();
                if (window.performance && typeof window.performance.now === "function") {
                    d += window.performance.now();
                }
                let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    let r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            }
        }
	});

// CONCATENATED MODULE: ./plugins/ThematicMap/thematicMap.vue?vue&type=script&lang=js&
 /* harmony default export */ var ThematicMap_thematicMapvue_type_script_lang_js_ = (thematicMapvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./plugins/ThematicMap/thematicMap.vue?vue&type=style&index=0&id=354694fb&scoped=true&lang=css&
var thematicMapvue_type_style_index_0_id_354694fb_scoped_true_lang_css_ = __webpack_require__("ce50");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./plugins/ThematicMap/thematicMap.vue






/* normalize component */

var component = normalizeComponent(
  ThematicMap_thematicMapvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "354694fb",
  null
  
)

/* harmony default export */ var thematicMap = (component.exports);
// CONCATENATED MODULE: ./plugins/ThematicMap/index.js


let thematicMapPlugin = {}

thematicMapPlugin.install = function(Vue, options){
	Vue.component(thematicMap.name, thematicMap);
}

/* harmony default export */ var ThematicMap = (thematicMapPlugin);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (ThematicMap);



/***/ }),

/***/ "fe60":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("0c28");
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__("499e").default
var update = add("4a1cb646", content, true, {"sourceMap":false,"shadowMode":false});

/***/ })

/******/ });
//# sourceMappingURL=thematicMapPlugin.common.js.map