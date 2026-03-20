// ==UserScript==
// @name             tziakcha-player-insights
// @name:cn          雀渣用户高级分析工具
// @name:en          Tziakcha Player Insights
// @icon             https://cdn.jsdelivr.net/gh/Choimoe/chaga-reviewer-script/doc/img/icon.png
// @namespace        https://greasyfork.org/users/1543716
// @version          2.1.0
// @author           Choimoe <qwqshq@gmail.com>
// @source           https://github.com/tziakcha-stats/tziakcha-player-insights
// @license          MIT
// @description      适用于雀渣平台的个人信息分析工具
// @description:en   适用于雀渣平台的个人信息分析工具
// @match            *://tziakcha.net/*
// @match            *://tziakcha.net/record/*
// @match            *://tziakcha.net/user/tech/*
// @match            *://tziakcha.net/history/*
// @match            *://tc-api.pesiu.org/review/*
// @grant            GM.xmlHttpRequest
// @grant            unsafeWindow
// @connect          httpbin.org
// @run-at           document-start
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/features/record/reviewer/ui.less"
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.highlight-first-tile {
  box-shadow: 0 0 0 3px red, inset 0 0 0 3px red !important;
}
.tile-weight-bar {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 0;
  max-height: 50px;
  background: #ff4444;
  transition: height 0.3s ease;
  z-index: 10;
  pointer-events: none;
}
.review-container {
  position: relative;
  min-height: 128px;
}
.review-bg-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 128px;
  height: 128px;
  opacity: 0.5;
  z-index: 0;
  pointer-events: none;
}
#review {
  position: relative;
  z-index: 1;
  padding-right: 10px;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/features/tech/zumgze/index.less"
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `#reviewer-zumgze-wrap .zumgze-summary {
  font-weight: 600;
}
#reviewer-zumgze-wrap .zumgze-similarity {
  margin-top: 0.2em;
}
#reviewer-zumgze-wrap .zumgze-score-trigger {
  cursor: help;
  text-decoration: underline dotted;
  text-underline-offset: 2px;
}
#reviewer-zumgze-wrap .zumgze-score-help,
#reviewer-zumgze-wrap .zumgze-score-ci {
  margin-top: 0.15em;
  font-size: 12px;
  color: #6c757d;
}
#reviewer-zumgze-wrap .zumgze-col-name {
  width: 7em;
}
#reviewer-zumgze-wrap .zumgze-col-player,
#reviewer-zumgze-wrap .zumgze-col-ref {
  width: 6em;
}
#reviewer-zumgze-wrap .zumgze-bar-wrap {
  position: relative;
  width: 100%;
  height: 20px;
  border-radius: 3px;
  background: #f8f9fa;
  overflow: hidden;
}
#reviewer-zumgze-wrap .zumgze-bar-zero {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #6c757d;
  opacity: 0.6;
  z-index: 1;
}
#reviewer-zumgze-wrap .zumgze-bar-fill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  border-radius: 2px;
  z-index: 2;
}
#reviewer-zumgze-wrap .zumgze-bar-label {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 600;
  z-index: 3;
}
#reviewer-zumgze-wrap .zumgze-bar-label-left {
  right: auto;
  left: 6px;
}
#reviewer-zumgze-wrap .zumgze-ref-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5em;
  margin-bottom: 0.35em;
}
#reviewer-zumgze-wrap .zumgze-ref-toggle,
#reviewer-zumgze-wrap .zumgze-table-toggle {
  font-size: 12px;
  line-height: 1.2;
  padding: 0.2em 0.65em;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style/main.less"
(module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ``, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ },

/***/ "./node_modules/css-loader/dist/runtime/api.js"
(module) {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ },

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js"
(module) {



module.exports = function (i) {
  return i[1];
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"
(module) {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js"
(module) {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js"
(module) {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js"
(module, __unused_webpack_exports, __webpack_require__) {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js"
(module) {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ },

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js"
(module) {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js");
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js");
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js");
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js");
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style/main.less
var main = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style/main.less");
;// ./src/style/main.less

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(main/* default */.A, options);




       /* harmony default export */ const style_main = (main/* default */.A && main/* default */.A.locals ? main/* default */.A.locals : undefined);

;// ./src/shared/constants.ts
const DEBUG_STORAGE_KEY = "__reviewer_debug";

;// ./src/shared/env.ts
const w = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;

;// ./src/shared/storage.ts

function getLocalStorageItem(key) {
    try {
        return w.localStorage?.getItem(key) ?? null;
    }
    catch (_error) {
        return null;
    }
}
function setLocalStorageItem(key, value) {
    try {
        w.localStorage?.setItem(key, value);
    }
    catch (_error) {
        // noop
    }
}

;// ./src/features/debug/debug-state.ts



let debugEnabled = false;
function detectDebugEnabled() {
    try {
        if (/\?reviewer_debug=1(?:&|$)/.test(w.location.href)) {
            return true;
        }
        const query = new URLSearchParams(w.location.search);
        if (query.get("reviewer_debug") === "1") {
            return true;
        }
        return getLocalStorageItem(DEBUG_STORAGE_KEY) === "1";
    }
    catch (_error) {
        return false;
    }
}
function initDebugState() {
    debugEnabled = detectDebugEnabled();
    w.__reviewerDebug = {
        isEnabled: () => debugEnabled,
        setEnabled: (enabled) => {
            debugEnabled = Boolean(enabled);
            setLocalStorageItem(DEBUG_STORAGE_KEY, debugEnabled ? "1" : "0");
            console.log(`[Reviewer] Debug ${debugEnabled ? "enabled" : "disabled"}`);
            return debugEnabled;
        },
    };
}
function isDebugEnabled() {
    return debugEnabled;
}

;// ./src/shared/logger.ts

function debugLog(message, payload) {
    if (!isDebugEnabled()) {
        return;
    }
    if (typeof payload === "undefined") {
        console.log("[Reviewer][Debug]", message);
        return;
    }
    console.log("[Reviewer][Debug]", message, payload);
}
function infoLog(message, payload) {
    if (typeof payload === "undefined") {
        console.log("[Reviewer]", message);
        return;
    }
    console.log("[Reviewer]", message, payload);
}
function warnLog(message, payload) {
    if (typeof payload === "undefined") {
        console.warn("[Reviewer]", message);
        return;
    }
    console.warn("[Reviewer]", message, payload);
}

;// ./src/shared/url.ts



function bootstrapReviewerDebugQuery() {
    try {
        const href = window.location.href;
        const normalizedHref = href
            .replace(/？/g, "?")
            .replace(/＆/g, "&")
            .replace("?reviewer_debug=", "&reviewer_debug=");
        if (!/[?&]reviewer_debug=/.test(normalizedHref) &&
            normalizedHref === href) {
            return;
        }
        const url = new URL(normalizedHref);
        const debugParam = url.searchParams.get("reviewer_debug");
        if (debugParam === "1" || debugParam === "0") {
            setLocalStorageItem(DEBUG_STORAGE_KEY, debugParam);
        }
        url.searchParams.delete("reviewer_debug");
        const cleanedHref = `${url.origin}${url.pathname}${url.search}${url.hash}`;
        if (cleanedHref !== href) {
            window.history.replaceState(window.history.state, "", cleanedHref);
            warnLog("Normalized reviewer_debug query and removed it from URL to avoid record page parse errors");
        }
    }
    catch (error) {
        warnLog("Failed to normalize reviewer_debug query", error);
    }
}

;// ./src/app/route-watcher.ts


function installRouteWatcher(notifyRouteChanged) {
    const notify = () => setTimeout(notifyRouteChanged, 0);
    w.addEventListener("popstate", notify);
    w.addEventListener("hashchange", notify);
    w.addEventListener("urlchange", notify);
    const historyObj = w.history;
    if (!historyObj || historyObj.__reviewer_route_hooked) {
        return;
    }
    const originalPushState = historyObj.pushState;
    const originalReplaceState = historyObj.replaceState;
    historyObj.pushState = function (...args) {
        const result = originalPushState.apply(this, args);
        notify();
        return result;
    };
    historyObj.replaceState = function (...args) {
        const result = originalReplaceState.apply(this, args);
        notify();
        return result;
    };
    historyObj.__reviewer_route_hooked = true;
    debugLog("Route watcher installed", { hooked: true });
}

;// ./src/shared/cookie.ts

function logCurrentCookie() {
    try {
        const cookieText = document.cookie || "(empty)";
        infoLog("Current page cookie", cookieText);
    }
    catch (error) {
        warnLog("Failed to read cookie", error);
    }
}

;// ./src/shared/session-data.ts
function asNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}
function extractSessionPlayers(raw) {
    if (!Array.isArray(raw.players)) {
        return [];
    }
    return raw.players.map((item) => {
        const player = item;
        return {
            name: player.n || player.name || "",
            id: player.i || player.id,
        };
    });
}
function extractSessionRecords(raw) {
    if (!Array.isArray(raw.records)) {
        return [];
    }
    return raw.records
        .map((item) => {
        const record = item;
        const id = record.id || record.i;
        return id ? { id } : null;
    })
        .filter((item) => Boolean(item));
}
function isSessionFinished(raw, records) {
    const periods = asNumber(raw.periods);
    if (periods !== null && periods > 0) {
        return records.length === periods;
    }
    if (raw.finished === true || raw.isFinished === true) {
        return true;
    }
    const finishTime = asNumber(raw.finish_time ?? raw.finishTime);
    if (finishTime !== null && finishTime > 0) {
        return true;
    }
    const progress = asNumber(raw.progress);
    if (progress !== null && periods !== null && periods > 0) {
        return progress >= periods - 1;
    }
    return false;
}
async function fetchSessionData(sessionId) {
    const response = await fetch(`/_qry/game/?id=${encodeURIComponent(sessionId)}`, {
        method: "POST",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for /_qry/game/`);
    }
    const raw = (await response.json());
    const records = extractSessionRecords(raw);
    return {
        players: extractSessionPlayers(raw),
        records,
        isFinished: isSessionFinished(raw, records),
    };
}

;// ./src/features/game/chaga-score.ts
function bz2tc(tileCode) {
    if (!tileCode || tileCode.length < 2) {
        return -1;
    }
    const tileType = tileCode[0];
    const number = Number.parseInt(tileCode.slice(1), 10) - 1;
    if (Number.isNaN(number)) {
        return -1;
    }
    if (tileType === "W")
        return number;
    if (tileType === "T")
        return number + 9;
    if (tileType === "B")
        return number + 18;
    if (tileType === "F")
        return number + 27;
    if (tileType === "J")
        return number + 31;
    if (tileType === "H")
        return number + 34;
    return -1;
}
function normalizeAiAction(actionText) {
    const trimmed = actionText.trim();
    if (!trimmed) {
        return null;
    }
    if (trimmed.startsWith("Play ")) {
        const tileIndex = bz2tc(trimmed.split(/\s+/).at(-1) || "");
        return ["play", tileIndex >= 0 ? tileIndex : null];
    }
    if (trimmed.startsWith("Chi"))
        return ["chi", null];
    if (trimmed.startsWith("Peng"))
        return ["peng", null];
    if (trimmed.startsWith("Gang") || trimmed.startsWith("BuGang"))
        return ["gang", null];
    if (trimmed.startsWith("Hu"))
        return ["hu", null];
    if (trimmed.startsWith("Pass"))
        return ["pass", null];
    if (trimmed.startsWith("Abandon"))
        return ["abandon", null];
    return null;
}
function choiceMatchesAi(choice, row) {
    if (!row) {
        return true;
    }
    const candidates = row.extra?.candidates;
    if (!Array.isArray(candidates) || !candidates.length) {
        return true;
    }
    const top = candidates[0];
    if (!Array.isArray(top) || typeof top[1] !== "string") {
        return true;
    }
    const normalized = normalizeAiAction(top[1]);
    if (!normalized) {
        return true;
    }
    const [kind, value] = normalized;
    if (kind !== choice.kind) {
        return false;
    }
    if (kind === "play" && value !== choice.value) {
        return false;
    }
    return true;
}
function calcChagaScore(choice, row) {
    if (!row) {
        return 100;
    }
    const candidates = row.extra?.candidates;
    if (!Array.isArray(candidates) || !candidates.length) {
        return 100;
    }
    const parsed = [];
    candidates.forEach((item) => {
        if (!Array.isArray(item) || item.length < 2) {
            return;
        }
        const [weightRaw, actionRaw] = item;
        if (typeof weightRaw !== "number" || typeof actionRaw !== "string") {
            return;
        }
        const normalized = normalizeAiAction(actionRaw);
        if (!normalized) {
            return;
        }
        parsed.push({ weight: weightRaw, normalized });
    });
    if (!parsed.length) {
        return 100;
    }
    const topWeight = parsed[0].weight;
    let matchedWeight = null;
    parsed.forEach(({ weight, normalized }) => {
        const [kind, value] = normalized;
        if (kind !== choice.kind) {
            return;
        }
        if (kind === "play" && value !== choice.value) {
            return;
        }
        if (matchedWeight === null || weight > matchedWeight) {
            matchedWeight = weight;
        }
    });
    if (matchedWeight === null) {
        return 0;
    }
    return Math.exp(matchedWeight - topWeight) * 100;
}

;// ./src/shared/chaga-review.ts
function normalizeRows(payload) {
    return Array.isArray(payload)
        ? payload
        : Array.isArray(payload.data)
            ? payload
                .data
            : [];
}
function getApiErrorMessage(payload) {
    if (typeof payload !== "object" ||
        payload === null ||
        Array.isArray(payload)) {
        return undefined;
    }
    const codeValue = payload.code;
    if (codeValue === undefined || codeValue === null) {
        return undefined;
    }
    const numericCode = Number(codeValue);
    if (!Number.isFinite(numericCode) || numericCode === 0) {
        return undefined;
    }
    return payload.message || "未知错误";
}
/**
 * 读取 CHAGA 评测接口，并统一解析返回结果。
 */
async function fetchChagaReviewData(sessionId, seat) {
    const response = await fetch(`https://tc-api.pesiu.org/review/?id=${encodeURIComponent(sessionId)}&seat=${seat}`, { credentials: "omit" });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for CHAGA API`);
    }
    const payload = (await response.json());
    const errorMessage = getApiErrorMessage(payload);
    return {
        rows: normalizeRows(payload),
        errorMessage,
    };
}

;// ./src/features/game/chaga-data.ts

/**
 * 负责读取 CHAGA 评测数据
 */
async function fetchAiResponse(sessionId, seat) {
    const result = await fetchChagaReviewData(sessionId, seat);
    return result.rows;
}

;// ./src/features/game/win-info.ts
const FAN_NAMES = [
    "无",
    "大四喜",
    "大三元",
    "绿一色",
    "九莲宝灯",
    "四杠",
    "连七对",
    "十三幺",
    "清幺九",
    "小四喜",
    "小三元",
    "字一色",
    "四暗刻",
    "一色双龙会",
    "一色四同顺",
    "一色四节高",
    "一色四步高",
    "一色四连环",
    "三杠",
    "混幺九",
    "七对",
    "七星不靠",
    "全双刻",
    "清一色",
    "一色三同顺",
    "一色三节高",
    "全大",
    "全中",
    "全小",
    "清龙",
    "三色双龙会",
    "一色三步高",
    "一色三连环",
    "全带五",
    "三同刻",
    "三暗刻",
    "全不靠",
    "组合龙",
    "大于五",
    "小于五",
    "三风刻",
    "花龙",
    "推不倒",
    "三色三同顺",
    "三色三节高",
    "无番和",
    "妙手回春",
    "海底捞月",
    "杠上开花",
    "抢杠和",
    "碰碰和",
    "混一色",
    "三色三步高",
    "五门齐",
    "全求人",
    "双暗杠",
    "双箭刻",
    "全带幺",
    "不求人",
    "双明杠",
    "和绝张",
    "箭刻",
    "圈风刻",
    "门风刻",
    "门前清",
    "平和",
    "四归一",
    "双同刻",
    "双暗刻",
    "暗杠",
    "断幺",
    "一般高",
    "喜相逢",
    "连六",
    "老少副",
    "幺九刻",
    "明杠",
    "缺一门",
    "无字",
    "独听・边张",
    "独听・嵌张",
    "独听・单钓",
    "自摸",
    "花牌",
    "明暗杠",
    "※ 天和",
    "※ 地和",
    "※ 人和Ⅰ",
    "※ 人和Ⅱ",
];
function toNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}
function parseWinFanItems(rawT) {
    if (!rawT || typeof rawT !== "object") {
        return [];
    }
    return Object.entries(rawT)
        .map(([fanIndexRaw, encodedRaw]) => {
        const fanIndex = toNumber(fanIndexRaw);
        const encoded = toNumber(encodedRaw);
        if (fanIndex === null || encoded === null) {
            return null;
        }
        const fanIndexInt = Math.floor(fanIndex);
        const encodedInt = Math.floor(encoded);
        const unitFan = encodedInt & 0xff;
        const count = (encodedInt >> 8) + 1;
        const fanName = FAN_NAMES[fanIndexInt] || `番种${fanIndexInt}`;
        return {
            fanIndex: fanIndexInt,
            fanName,
            count,
            unitFan,
            totalFan: unitFan * count,
        };
    })
        .filter((item) => Boolean(item))
        .sort((left, right) => left.fanIndex - right.fanIndex);
}

;// ./src/features/game/step-simulator.ts
const CHOICE_ACTION_TYPES = new Set([2, 3, 4, 5, 6, 8, 9]);
function actionToChoice(actionIndex, combined, data) {
    const seat = (combined >> 4) & 3;
    const actionType = combined & 15;
    if (!CHOICE_ACTION_TYPES.has(actionType)) {
        return null;
    }
    if (actionType === 2) {
        const tileId = data & 0xff;
        return { seat, actionIndex, kind: "play", value: Math.floor(tileId / 4) };
    }
    if (actionType === 3) {
        return { seat, actionIndex, kind: "chi", value: null };
    }
    if (actionType === 4) {
        return { seat, actionIndex, kind: "peng", value: null };
    }
    if (actionType === 5) {
        return { seat, actionIndex, kind: "gang", value: null };
    }
    if (actionType === 6) {
        const isAutoHu = Boolean(data & 1);
        return isAutoHu ? null : { seat, actionIndex, kind: "hu", value: null };
    }
    if (actionType === 8) {
        const passMode = data & 3;
        return passMode !== 0
            ? null
            : { seat, actionIndex, kind: "pass", value: null };
    }
    if (actionType === 9) {
        return { seat, actionIndex, kind: "abandon", value: null };
    }
    return null;
}
/**
 * 将牌谱动作流解析为逐步可比对的选择序列
 */
function extractChoices(stepData) {
    if (!Array.isArray(stepData.a)) {
        return [];
    }
    const result = [];
    stepData.a.forEach((action, actionIndex) => {
        if (!Array.isArray(action) || action.length < 2) {
            return;
        }
        const [combined, data] = action;
        if (typeof combined !== "number" || typeof data !== "number") {
            return;
        }
        const choice = actionToChoice(actionIndex, combined, data);
        if (choice) {
            result.push(choice);
        }
    });
    return result;
}

;// ./src/features/game/step-data.ts

/**
 * base64 字符串转 Uint8Array
 */
function base64ToBytes(input) {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
}
/**
 * 解压 zlib+base64 编码的字符串
 */
async function decompressZlibBase64(input) {
    const streamCtor = w.DecompressionStream;
    if (!streamCtor) {
        throw new Error("当前浏览器不支持 DecompressionStream");
    }
    const bytes = base64ToBytes(input);
    const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    const source = new Blob([buffer]).stream();
    const decompressed = source.pipeThrough(new streamCtor("deflate"));
    return await new Response(decompressed).text();
}
/**
 * 读取单局牌谱数据
 */
async function fetchStepData(recordId) {
    const response = await fetch("/_qry/record/", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: new URLSearchParams({ id: recordId }).toString(),
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for /_qry/record/`);
    }
    const raw = await response.json();
    if (!raw.script) {
        throw new Error(`record ${recordId} 缺少 script`);
    }
    const jsonText = await decompressZlibBase64(raw.script);
    return JSON.parse(jsonText);
}

;// ./src/features/game/game-constants.ts
const FIXED_RI_OFFSET = -1;
const SESSION_NOT_FINISHED_ERROR = "SESSION_NOT_FINISHED";
const UI_RETRY_MAX_COUNT = 20;
const UI_RETRY_INTERVAL_MS = 200;
const S2O = [
    [0, 1, 2, 3],
    [1, 2, 3, 0],
    [2, 3, 0, 1],
    [3, 0, 1, 2],
    [1, 0, 3, 2],
    [0, 3, 2, 1],
    [3, 2, 1, 0],
    [2, 1, 0, 3],
    [2, 3, 1, 0],
    [3, 1, 0, 2],
    [1, 0, 2, 3],
    [0, 2, 3, 1],
    [3, 2, 0, 1],
    [2, 0, 1, 3],
    [0, 1, 3, 2],
    [1, 3, 2, 0],
];

;// ./src/features/game/data-metrics.ts







function buildResponseMap(responseRows, roundIndex) {
    const responseMap = new Map();
    responseRows.forEach((row) => {
        if (row.rr !== roundIndex || typeof row.ri !== "number") {
            return;
        }
        if (!responseMap.has(row.ri)) {
            responseMap.set(row.ri, row);
        }
    });
    return responseMap;
}
function getSeatToPlayerOrder(roundNo) {
    if (!S2O.length) {
        return [0, 1, 2, 3];
    }
    return (S2O[((roundNo % S2O.length) + S2O.length) % S2O.length] || [0, 1, 2, 3]);
}
async function prepareSessionData(sessionId) {
    const sessionData = await fetchSessionData(sessionId);
    if (!sessionData.isFinished) {
        throw new Error(SESSION_NOT_FINISHED_ERROR);
    }
    const sessionPlayerNames = sessionData.players.map((player, index) => player.name || `Seat ${index}`);
    const steps = await Promise.all(sessionData.records.map((record) => fetchStepData(record.id)));
    return { sessionPlayerNames, steps };
}
function computeRoundOutcomes(sessionPlayerNames, steps, playerMetrics) {
    const rounds = [];
    steps.forEach((stepData, roundNo) => {
        const seatToPlayerOrder = getSeatToPlayerOrder(roundNo);
        const resultBits = typeof stepData.b === "number" ? stepData.b : 0;
        const winnerMask = resultBits & 0x0f;
        const discarderMask = (resultBits >> 4) & 0x0f;
        if (!winnerMask) {
            return;
        }
        const winnerDetails = [];
        for (let stepSeat = 0; stepSeat < 4; stepSeat += 1) {
            if (((winnerMask >> stepSeat) & 1) === 0) {
                continue;
            }
            const aiSeat = seatToPlayerOrder[stepSeat] ?? -1;
            if (aiSeat < 0) {
                continue;
            }
            const seatY = Array.isArray(stepData.y) ? stepData.y[stepSeat] : null;
            const fanItems = parseWinFanItems(seatY?.t);
            const totalFan = typeof seatY?.f === "number"
                ? seatY.f
                : fanItems.reduce((sum, item) => sum + item.totalFan, 0);
            if (playerMetrics && playerMetrics[aiSeat]) {
                playerMetrics[aiSeat].winRounds.push({
                    roundNo: roundNo + 1,
                    totalFan,
                    fanItems,
                });
            }
            winnerDetails.push({
                playerName: sessionPlayerNames[aiSeat] || `Seat ${aiSeat}`,
                totalFan,
                fanItems,
            });
        }
        const discarderNames = [];
        for (let stepSeat = 0; stepSeat < 4; stepSeat += 1) {
            if (((discarderMask >> stepSeat) & 1) === 0) {
                continue;
            }
            const aiSeat = seatToPlayerOrder[stepSeat] ?? -1;
            if (aiSeat < 0) {
                continue;
            }
            discarderNames.push(sessionPlayerNames[aiSeat] || `Seat ${aiSeat}`);
        }
        rounds.push({
            roundNo: roundNo + 1,
            winners: winnerDetails,
            discarderNames,
            selfDraw: discarderNames.length === 0 ||
                discarderNames.every((name) => winnerDetails.some((winner) => winner.playerName === name)),
        });
    });
    return rounds;
}
async function computeMetrics(sessionId) {
    const prepared = await prepareSessionData(sessionId);
    const { sessionPlayerNames, steps } = prepared;
    const playerMetrics = sessionPlayerNames.map((playerName) => ({
        playerName,
        matched: 0,
        total: 0,
        ratio: 0,
        chagaSum: 0,
        chagaCount: 0,
        chagaAvg: 0,
        winRounds: [],
    }));
    const rounds = computeRoundOutcomes(sessionPlayerNames, steps, playerMetrics);
    const aiResponses = await Promise.all([0, 1, 2, 3].map((seat) => fetchAiResponse(sessionId, seat)));
    steps.forEach((stepData, roundNo) => {
        const seatToPlayerOrder = getSeatToPlayerOrder(roundNo);
        const aiToRoundSeat = [0, 1, 2, 3].map((playerOrder) => seatToPlayerOrder.findIndex((seatPlayerOrder) => seatPlayerOrder === playerOrder));
        const allChoices = extractChoices(stepData);
        for (let aiSeat = 0; aiSeat < 4; aiSeat += 1) {
            const stepSeat = aiToRoundSeat[aiSeat];
            if (stepSeat < 0) {
                continue;
            }
            const responseMap = buildResponseMap(aiResponses[aiSeat] || [], roundNo);
            const seatChoices = allChoices.filter((choice) => choice.seat === stepSeat);
            seatChoices.forEach((choice) => {
                const ri = choice.actionIndex + FIXED_RI_OFFSET;
                const row = responseMap.get(ri);
                const matched = choiceMatchesAi(choice, row);
                const chagaScore = calcChagaScore(choice, row);
                const metric = playerMetrics[aiSeat];
                metric.total += 1;
                if (matched) {
                    metric.matched += 1;
                }
                metric.chagaSum += chagaScore;
                metric.chagaCount += 1;
            });
        }
    });
    playerMetrics.forEach((metric) => {
        metric.ratio = metric.total ? metric.matched / metric.total : 0;
        metric.chagaAvg = metric.chagaCount
            ? metric.chagaSum / metric.chagaCount
            : 0;
    });
    const overallMatched = playerMetrics.reduce((sum, item) => sum + item.matched, 0);
    const overallTotal = playerMetrics.reduce((sum, item) => sum + item.total, 0);
    const overallChagaSum = playerMetrics.reduce((sum, item) => sum + item.chagaSum, 0);
    const overallChagaCount = playerMetrics.reduce((sum, item) => sum + item.chagaCount, 0);
    return {
        players: playerMetrics,
        rounds,
        overall: {
            matched: overallMatched,
            total: overallTotal,
            ratio: overallTotal ? overallMatched / overallTotal : 0,
            chagaAvg: overallChagaCount ? overallChagaSum / overallChagaCount : 0,
        },
    };
}

;// ./src/features/game/ui-render.ts


function findStandardScoreRow() {
    const selectors = ["table.table tr", "table tr"];
    for (const selector of selectors) {
        const found = Array.from(document.querySelectorAll(selector)).find((row) => (row.querySelector("th")?.textContent || "").includes("标准分"));
        if (found) {
            return found;
        }
    }
    return null;
}
function parseRoundNoFromRow(row) {
    const cells = Array.from(row.children);
    for (const cell of cells) {
        const text = (cell.textContent || "").trim();
        if (!text || !/^\d{1,3}$/.test(text)) {
            continue;
        }
        const value = Number(text);
        if (Number.isFinite(value) && value > 0 && value <= 128) {
            return value;
        }
    }
    return null;
}
function findRoundTable() {
    const tables = Array.from(document.querySelectorAll("table"));
    let best = null;
    for (const table of tables) {
        const rows = Array.from(table.querySelectorAll("tr"));
        const hasRoundHeader = rows.some((row) => Array.from(row.children).some((cell) => (cell.textContent || "").trim().includes("盘序") ||
            (cell.textContent || "").trim().includes("序")));
        const numericRows = rows.filter((row) => parseRoundNoFromRow(row) !== null).length;
        const score = (hasRoundHeader ? 1000 : 0) + numericRows;
        if (!best || score > best.score) {
            best = { table, score };
        }
    }
    if (!best || best.score <= 0) {
        return null;
    }
    return best.table;
}
function clearInsertedRows() {
    document.getElementById("reviewer-game-ratio-row")?.remove();
    document.getElementById("reviewer-game-chaga-row")?.remove();
    document.getElementById("reviewer-game-pending-row")?.remove();
    document
        .querySelectorAll(".reviewer-game-round-toggle, .reviewer-game-round-separator, .reviewer-game-detail-row")
        .forEach((element) => element.remove());
}
function withAnchorRow(callback, retryInterval = UI_RETRY_INTERVAL_MS) {
    const anchor = findStandardScoreRow();
    if (!anchor || !anchor.parentElement) {
        setTimeout(() => withAnchorRow(callback, retryInterval), retryInterval);
        return;
    }
    callback(anchor);
}
function createMetricRow(label, values, rowId) {
    const row = document.createElement("tr");
    row.id = rowId;
    const header = document.createElement("th");
    header.className = "bg-secondary text-light";
    header.textContent = label;
    row.appendChild(header);
    values.forEach((value) => {
        const cell = document.createElement("td");
        cell.className = "bg-secondary text-light";
        cell.colSpan = 2;
        cell.textContent = value;
        row.appendChild(cell);
    });
    return row;
}
function closeDetailRow(detailRow) {
    const content = detailRow.querySelector(".reviewer-game-detail-content");
    if (!content) {
        detailRow.remove();
        return;
    }
    content.style.maxHeight = `${content.scrollHeight}px`;
    content.style.opacity = "1";
    content.style.transform = "translateY(0)";
    requestAnimationFrame(() => {
        content.style.maxHeight = "0px";
        content.style.opacity = "0";
        content.style.transform = "translateY(-4px)";
    });
    setTimeout(() => detailRow.remove(), 220);
}
function createRoundDetailRow(targetRow, round) {
    const detailRow = document.createElement("tr");
    detailRow.className = "reviewer-game-detail-row";
    detailRow.id = `reviewer-game-detail-row-${round.roundNo}`;
    const cell = document.createElement("td");
    cell.colSpan = Math.max(targetRow.children.length, 1);
    cell.className = "bg-secondary text-light";
    const content = document.createElement("div");
    content.className = "reviewer-game-detail-content";
    content.style.overflow = "hidden";
    content.style.maxHeight = "0px";
    content.style.opacity = "0";
    content.style.transform = "translateY(-4px)";
    content.style.transition =
        "max-height 0.24s ease, opacity 0.2s ease, transform 0.2s ease";
    content.style.padding = "4px 6px";
    if (!round.winners.length) {
        const empty = document.createElement("div");
        empty.textContent = "本盘无和牌";
        content.appendChild(empty);
    }
    else {
        const winnerNames = round.winners.map((item) => item.playerName).join("、");
        const baseInfo = document.createElement("div");
        const losePart = round.selfDraw
            ? "自摸"
            : `放铳：${round.discarderNames.join("、") || "未知"}`;
        baseInfo.textContent = `和牌：${winnerNames}；${losePart}`;
        content.appendChild(baseInfo);
        round.winners.forEach((winner) => {
            const line = document.createElement("div");
            const fanText = winner.fanItems.length
                ? winner.fanItems
                    .map((fan) => fan.count > 1 ? `${fan.fanName}×${fan.count}` : fan.fanName)
                    .join("、")
                : "番种未知";
            line.textContent = `${winner.playerName}：${winner.totalFan}番（${fanText}）`;
            content.appendChild(line);
        });
    }
    cell.appendChild(content);
    detailRow.appendChild(cell);
    return detailRow;
}
function installRoundToggleButtons(rounds, retryCount = 0) {
    const table = findRoundTable();
    if (!table) {
        if (retryCount < UI_RETRY_MAX_COUNT) {
            setTimeout(() => installRoundToggleButtons(rounds, retryCount + 1), UI_RETRY_INTERVAL_MS);
        }
        return;
    }
    const roundMap = new Map();
    rounds.forEach((round) => {
        roundMap.set(round.roundNo, round);
    });
    const rdtrRows = Array.from(table.querySelectorAll("tr[name='rdtr']"));
    const rows = rdtrRows.length
        ? rdtrRows
        : Array.from(table.querySelectorAll("tr"));
    let installedCount = 0;
    rows.forEach((row, rowIndex) => {
        if (row.querySelector(".reviewer-game-round-toggle")) {
            return;
        }
        const roundNo = rdtrRows.length ? rowIndex + 1 : parseRoundNoFromRow(row);
        if (!roundNo) {
            return;
        }
        const firstCell = row.children[0];
        if (!firstCell) {
            return;
        }
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reviewer-game-round-toggle";
        button.textContent = "▸";
        button.style.border = "1px solid rgba(255,255,255,0.35)";
        button.style.borderRadius = "4px";
        button.style.background = "rgba(0,0,0,0.15)";
        button.style.cursor = "pointer";
        button.style.padding = "0";
        button.style.width = "18px";
        button.style.height = "18px";
        button.style.lineHeight = "16px";
        button.style.marginRight = "8px";
        button.style.color = "inherit";
        button.style.verticalAlign = "middle";
        button.setAttribute("aria-label", `查看第${roundNo}局和牌详情`);
        const separator = document.createElement("span");
        separator.className = "reviewer-game-round-separator";
        separator.textContent = "|";
        separator.style.opacity = "0.5";
        separator.style.marginRight = "8px";
        separator.style.verticalAlign = "middle";
        button.addEventListener("click", () => {
            const existing = document.getElementById(`reviewer-game-detail-row-${roundNo}`);
            if (existing) {
                closeDetailRow(existing);
                button.textContent = "▸";
                return;
            }
            const roundInfo = roundMap.get(roundNo) || {
                roundNo,
                winners: [],
                discarderNames: [],
                selfDraw: false,
            };
            const detailRow = createRoundDetailRow(row, roundInfo);
            row.insertAdjacentElement("afterend", detailRow);
            const content = detailRow.querySelector(".reviewer-game-detail-content");
            if (content) {
                requestAnimationFrame(() => {
                    content.style.maxHeight = `${content.scrollHeight}px`;
                    content.style.opacity = "1";
                    content.style.transform = "translateY(0)";
                });
            }
            button.textContent = "▾";
        });
        firstCell.insertBefore(separator, firstCell.firstChild);
        firstCell.insertBefore(button, separator);
        installedCount += 1;
    });
    if (installedCount === 0 && retryCount < UI_RETRY_MAX_COUNT) {
        setTimeout(() => installRoundToggleButtons(rounds, retryCount + 1), UI_RETRY_INTERVAL_MS);
    }
}
function upsertMetricsRows(metrics) {
    withAnchorRow((anchor) => {
        clearInsertedRows();
        const ratioRow = createMetricRow("一致率", metrics.players.map((item) => `${(item.ratio * 100).toFixed(2)}%`), "reviewer-game-ratio-row");
        const chagaRow = createMetricRow("CHAGA度", metrics.players.map((item) => item.chagaAvg.toFixed(2)), "reviewer-game-chaga-row");
        anchor.insertAdjacentElement("afterend", chagaRow);
        anchor.insertAdjacentElement("afterend", ratioRow);
        infoLog("Game overview metrics updated", metrics.overall);
    });
}
function upsertMetricsMessageRows(message) {
    withAnchorRow((anchor) => {
        clearInsertedRows();
        const cells = Array.from(anchor.children).slice(1);
        const totalColSpan = cells.reduce((sum, cell) => {
            return sum + (cell.colSpan || 1);
        }, 0);
        const ratioRow = document.createElement("tr");
        ratioRow.id = "reviewer-game-ratio-row";
        const ratioHeader = document.createElement("th");
        ratioHeader.className = "bg-secondary text-light";
        ratioHeader.textContent = "一致率";
        ratioRow.appendChild(ratioHeader);
        const cell = document.createElement("td");
        cell.className = "bg-secondary text-light";
        cell.colSpan = Math.max(totalColSpan, 1);
        cell.rowSpan = 2;
        cell.textContent = message;
        ratioRow.appendChild(cell);
        const chagaRow = document.createElement("tr");
        chagaRow.id = "reviewer-game-chaga-row";
        const chagaHeader = document.createElement("th");
        chagaHeader.className = "bg-secondary text-light";
        chagaHeader.textContent = "CHAGA度";
        chagaRow.appendChild(chagaHeader);
        anchor.insertAdjacentElement("afterend", chagaRow);
        anchor.insertAdjacentElement("afterend", ratioRow);
    });
}
function upsertLoadingRows(message) {
    withAnchorRow((anchor) => {
        clearInsertedRows();
        const ratioRow = createMetricRow("一致率", [message, message, message, message], "reviewer-game-ratio-row");
        const chagaRow = createMetricRow("CHAGA度", [message, message, message, message], "reviewer-game-chaga-row");
        anchor.insertAdjacentElement("afterend", chagaRow);
        anchor.insertAdjacentElement("afterend", ratioRow);
    });
}

;// ./src/features/game/index.ts





let startedGameHref = "";
function getGameIdFromUrl() {
    const url = new URL(w.location.href);
    return url.searchParams.get("id");
}
function initGameFeature(href) {
    if (startedGameHref === href) {
        return false;
    }
    startedGameHref = href;
    const sessionId = getGameIdFromUrl();
    if (!sessionId) {
        warnLog("Game feature init skipped: missing session id");
        return false;
    }
    infoLog("Game feature init started", { sessionId });
    upsertLoadingRows("计算中...");
    const preparedPromise = prepareSessionData(sessionId);
    void preparedPromise
        .then((prepared) => {
        const rounds = computeRoundOutcomes(prepared.sessionPlayerNames, prepared.steps);
        installRoundToggleButtons(rounds);
    })
        .catch((error) => {
        if (error?.message === SESSION_NOT_FINISHED_ERROR) {
            upsertMetricsMessageRows("请等待牌局完成");
            return;
        }
        warnLog("Game rounds preview failed", error);
    });
    void computeMetrics(sessionId)
        .then((metrics) => {
        upsertMetricsRows(metrics);
        installRoundToggleButtons(metrics.rounds);
    })
        .catch((error) => {
        if (error?.message === SESSION_NOT_FINISHED_ERROR) {
            upsertMetricsMessageRows("请等待牌局完成");
            return;
        }
        warnLog("Game overview metrics failed", error);
        upsertMetricsMessageRows("AI 评分加载失败");
    });
    return true;
}

;// ./src/features/history/visit-linker.ts

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
function initHistoryVisit(isUserGamePage) {
    const refreshLink = document.getElementById("rfrsh");
    const tbody = document.querySelector("table tbody");
    if (!refreshLink || !tbody) {
        setTimeout(() => initHistoryVisit(isUserGamePage), 100);
        return;
    }
    if (document.getElementById("reviewer-history-visit-btn")) {
        return;
    }
    const nameCellIndexes = isUserGamePage ? [2, 4, 6, 8] : [1, 3, 5, 7];
    const extractNameFromCell = (cell) => {
        const raw = (cell.textContent || "").replace(/\s+/g, " ").trim();
        if (!raw) {
            return "";
        }
        return raw.replace(/^★\s*/, "").trim();
    };
    const getNameCells = () => {
        const rows = Array.from(tbody.querySelectorAll("tr"));
        const cells = [];
        rows.forEach((row) => {
            const tds = row.querySelectorAll("td");
            nameCellIndexes.forEach((idx) => {
                if (tds[idx]) {
                    cells.push(tds[idx]);
                }
            });
        });
        return cells;
    };
    const renderLinkedCell = (cell, userName, userId) => {
        if (!userName || !userId) {
            return;
        }
        const raw = (cell.textContent || "").replace(/\s+/g, " ").trim();
        const hasStar = /^★\s*/.test(raw);
        const href = `/user/tech/?id=${encodeURIComponent(userId)}`;
        const currentA = cell.querySelector("a");
        if (currentA && currentA.getAttribute("href") === href) {
            return;
        }
        cell.innerHTML = `${hasStar ? "★ " : ""}<a href="${href}" target="_blank">${escapeHtml(userName)}</a>`;
    };
    const renderPlainCell = (cell) => {
        const raw = (cell.textContent || "").replace(/\s+/g, " ").trim();
        if (!raw) {
            return;
        }
        const hasStar = /^★\s*/.test(raw);
        const userName = raw.replace(/^★\s*/, "").trim();
        cell.textContent = `${hasStar ? "★ " : ""}${userName}`;
    };
    const nameToId = new Map();
    let enabled = false;
    let loading = false;
    const queryUserIdByName = async (name) => {
        const resp = await fetch(`/_qry/match/?kw=${encodeURIComponent(name)}`, {
            method: "POST",
            credentials: "include",
        });
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}`);
        }
        const json = (await resp.json());
        const items = Array.isArray(json)
            ? json
            : Array.isArray(json?.data)
                ? json.data
                : [];
        const exact = items.find((item) => item && item.n === name && item.i);
        return exact?.i || null;
    };
    const enrichCurrentRows = async () => {
        if (loading) {
            return undefined;
        }
        loading = true;
        try {
            const nameCells = getNameCells();
            const names = Array.from(new Set(nameCells.map(extractNameFromCell).filter(Boolean)));
            const pending = names.filter((name) => !nameToId.has(name));
            if (pending.length) {
                const results = await Promise.all(pending.map(async (name) => {
                    try {
                        return [name, await queryUserIdByName(name)];
                    }
                    catch (error) {
                        warnLog(`Failed to query user id: ${name}`, error);
                        return [name, null];
                    }
                }));
                results.forEach(([name, userId]) => nameToId.set(name, userId));
            }
            let linkedCount = 0;
            nameCells.forEach((cell) => {
                const name = extractNameFromCell(cell);
                const userId = nameToId.get(name);
                if (name && userId) {
                    renderLinkedCell(cell, name, userId);
                    linkedCount += 1;
                }
            });
            return linkedCount;
        }
        finally {
            loading = false;
        }
    };
    const visitBtn = document.createElement("a");
    visitBtn.id = "reviewer-history-visit-btn";
    visitBtn.href = "javascript:void(0)";
    visitBtn.className = "m-1 btn btn-outline-primary btn-sm";
    visitBtn.textContent = "家访（需要会员）";
    visitBtn.addEventListener("click", async () => {
        if (loading) {
            return;
        }
        if (enabled) {
            enabled = false;
            getNameCells().forEach(renderPlainCell);
            visitBtn.textContent = "家访（需要会员）";
            return;
        }
        const oldText = visitBtn.textContent;
        visitBtn.textContent = "家访中...";
        try {
            enabled = true;
            await enrichCurrentRows();
            visitBtn.textContent = "取消家访";
        }
        catch (error) {
            warnLog("家访失败", error);
        }
        finally {
            if (!enabled) {
                visitBtn.textContent = "家访（需要会员）";
            }
            else if (visitBtn.textContent === "家访中...") {
                visitBtn.textContent = oldText;
            }
        }
    });
    refreshLink.parentNode?.insertBefore(visitBtn, refreshLink);
    const observer = new MutationObserver(() => {
        if (enabled) {
            void enrichCurrentRows();
        }
    });
    observer.observe(tbody, { childList: true, subtree: true });
}

;// ./src/features/history/index.ts



let startedHistoryHref = "";
let startedUserGameHref = "";
function initHistoryFeature(href) {
    if (startedHistoryHref === href) {
        return false;
    }
    startedHistoryHref = href;
    infoLog("History feature init started");
    w.setTimeout(() => initHistoryVisit(false), 300);
    return true;
}
function initUserGameFeature(href) {
    if (startedUserGameHref === href) {
        return false;
    }
    startedUserGameHref = href;
    infoLog("User game feature init started");
    w.setTimeout(() => initHistoryVisit(true), 300);
    return true;
}

;// ./src/shared/route.ts

function isRecordPage() {
    return /^\/record(?:\/|$)/.test(w.location.pathname);
}
function isGamePage() {
    return /^\/game(?:\/|$)/.test(w.location.pathname);
}
function isTechPage() {
    return /^\/user\/tech(?:\/|$)/.test(w.location.pathname);
}
function isHistoryPage() {
    return /^\/history(?:\/|$)/.test(w.location.pathname);
}
function isUserGamePage() {
    return /^\/user\/game(?:\/|$)/.test(w.location.pathname);
}

;// ./src/features/record/guards.ts


function installRecordJsonParseGuard() {
    if (!isRecordPage()) {
        return;
    }
    try {
        if (typeof JSON.parse !== "function") {
            return;
        }
        const originalParse = JSON.parse;
        if (originalParse.__reviewer_guarded) {
            return;
        }
        const guardedParse = function (input, ...args) {
            if (typeof input !== "string") {
                if (input && typeof input === "object") {
                    return input;
                }
                if (input == null) {
                    return input;
                }
                return input;
            }
            return originalParse.call(this, input, ...args);
        };
        guardedParse.__reviewer_guarded = true;
        JSON.parse = guardedParse;
        warnLog("Installed JSON.parse compatibility guard for record page");
    }
    catch (error) {
        warnLog("Failed to install JSON.parse guard", error);
    }
}

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/features/record/reviewer/ui.less
var ui = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/features/record/reviewer/ui.less");
;// ./src/features/record/reviewer/ui.less

      
      
      
      
      
      
      
      
      

var ui_options = {};

ui_options.styleTagTransform = (styleTagTransform_default());
ui_options.setAttributes = (setAttributesWithoutAttributes_default());
ui_options.insert = insertBySelector_default().bind(null, "head");
ui_options.domAPI = (styleDomAPI_default());
ui_options.insertStyleElement = (insertStyleElement_default());

var ui_update = injectStylesIntoStyleTag_default()(ui/* default */.A, ui_options);




       /* harmony default export */ const reviewer_ui = (ui/* default */.A && ui/* default */.A.locals ? ui/* default */.A.locals : undefined);

;// ./src/features/record/reviewer/state.ts
/* unused harmony import specifier */ var state_w;

function ensureReviewStores() {
    if (!w.__reviews) {
        w.__reviews = {};
    }
    if (!w.__reviews_filled) {
        w.__reviews_filled = {};
    }
    if (!w.__reviews_seats) {
        w.__reviews_seats = [undefined, undefined, undefined, undefined];
    }
}
function resetReviewStores() {
    state_w.__reviews = {};
    state_w.__reviews_filled = {};
    state_w.__reviews_seats = [undefined, undefined, undefined, undefined];
}
function getReviews() {
    ensureReviewStores();
    return w.__reviews;
}
function getFilledReviews() {
    ensureReviewStores();
    return w.__reviews_filled;
}
function getReviewSeats() {
    ensureReviewStores();
    return w.__reviews_seats;
}
function setReviewError(message) {
    w.__review_error = message;
    const reviewEl = document.getElementById("review");
    if (reviewEl) {
        reviewEl.innerText = message;
    }
}
function clearReviewError() {
    setReviewError("");
}
function setTZInstance(instance) {
    w.__review_tz_instance = instance;
}
function getTZInstance() {
    return w.__review_tz_instance ?? null;
}

;// ./src/features/record/reviewer/render.ts



function render_bz2tc(s) {
    const type = s[0];
    const num = Number.parseInt(s.slice(1), 10) - 1;
    if (type === "W")
        return num;
    if (type === "T")
        return num + 9;
    if (type === "B")
        return num + 18;
    if (type === "F")
        return num + 27;
    if (type === "J")
        return num + 31;
    if (type === "H")
        return num + 34;
    warnLog("Unknown tile", s);
    return -1;
}
function tc2tile(tileCodes, i) {
    return tileCodes[i * 4] ?? "";
}
function act2str(act, tileCodes) {
    const normalized = act.trim();
    if (normalized.startsWith("Chi")) {
        const components = normalized.split(/\s+/);
        const last = components.at(-1);
        if (!last) {
            return normalized;
        }
        const tile = tc2tile(tileCodes, render_bz2tc(last));
        if (!tile) {
            return normalized;
        }
        const chi = `${Number(tile[0]) - 1}${tile[0]}${Number(tile[0]) + 1}${tile[1]}`;
        return [...components.slice(0, -1), chi].join(" ");
    }
    const lastChar = normalized.at(-1) ?? "";
    if (lastChar >= "1" && lastChar <= "9") {
        const components = normalized.split(/\s+/);
        const last = components.at(-1);
        if (!last) {
            return normalized;
        }
        return [...components.slice(0, -1), tc2tile(tileCodes, render_bz2tc(last))].join(" ");
    }
    return normalized;
}
function fmtLoad(i) {
    switch (i) {
        case 0:
            return "✗";
        case 1:
            return "·";
        case 2:
            return "✓";
        default:
            return "_";
    }
}
function parseRound(roundStr, wind) {
    const trimmed = roundStr.trim();
    if (/^\d/.test(trimmed)) {
        return Number.parseInt(trimmed, 10) - 1;
    }
    if (wind.some((item) => trimmed.startsWith(`${item} `))) {
        const currentWind = wind.find((item) => trimmed.startsWith(`${item} `));
        if (!currentWind) {
            return 0;
        }
        const num = Number.parseInt(trimmed.slice(currentWind.length).trim(), 10) - 1;
        return wind.findIndex((item) => item === currentWind) * 4 + num;
    }
    if (trimmed.length === 3 && trimmed[1] === "风") {
        return (wind.findIndex((item) => item === trimmed[0]) * 4 +
            wind.findIndex((item) => item === trimmed[2]));
    }
    warnLog("Unknown round format", trimmed);
    return (wind.findIndex((item) => item === trimmed[0]) * 4 +
        wind.findIndex((item) => item === trimmed[2]));
}
function softmax(weights) {
    const maxWeight = Math.max(...weights);
    const expWeights = weights.map((weight) => Math.exp(weight - maxWeight));
    const sumExp = expWeights.reduce((a, b) => a + b, 0);
    return expWeights.map((value) => value / sumExp);
}
function clearWeightBars() {
    document.querySelectorAll(".tile-weight-bar").forEach((el) => el.remove());
}
function clearHighlightTiles() {
    document.querySelectorAll(".tl.highlight-first-tile").forEach((el) => {
        el.classList.remove("highlight-first-tile");
    });
}
function getPlayerStep() {
    const tz = getTZInstance();
    if (tz && typeof tz.stp === "number") {
        return tz.stp - 18;
    }
    return -18;
}
function showWeightVisualization(candidates, playerIndex, options) {
    if (playerIndex !== 0 || !options.showWeightBars) {
        return;
    }
    const handContainers = document.querySelectorAll(".hand");
    if (handContainers.length === 0) {
        return;
    }
    const currentHand = handContainers[0];
    const tiles = Array.from(currentHand.querySelectorAll(".tl"));
    const tileWeightMap = new Map();
    const probs = softmax(candidates.map(([weight]) => weight));
    candidates.forEach(([, act], idx) => {
        const actStr = act.trim();
        if (!actStr.startsWith("Play ")) {
            return;
        }
        const tileCode = actStr.slice(5);
        const tileIndex = render_bz2tc(tileCode);
        if (tileIndex >= 0 && tileIndex < 136 && !tileWeightMap.has(tileIndex)) {
            tileWeightMap.set(tileIndex, probs[idx] ?? 0);
        }
    });
    tiles.forEach((tileEl) => {
        const htmlTile = tileEl;
        const tileVal = Number.parseInt(htmlTile.dataset.val ?? "-1", 10);
        if (Number.isNaN(tileVal)) {
            return;
        }
        const tileIndex = Math.floor(tileVal / 4);
        const prob = tileWeightMap.get(tileIndex);
        if (typeof prob === "undefined") {
            return;
        }
        if (window.getComputedStyle(htmlTile).position === "static") {
            htmlTile.style.position = "relative";
        }
        const bar = document.createElement("div");
        bar.className = "tile-weight-bar";
        bar.style.height = `${prob * 50}px`;
        htmlTile.appendChild(bar);
    });
}
function highlightFirstCandidate(candidates) {
    const tz = getTZInstance();
    if (!tz || typeof tz.stp !== "number" || !tz.stat?.[tz.stp]) {
        return;
    }
    const first = candidates[0];
    if (!first?.[1]) {
        return;
    }
    const act = first[1].trim();
    if (!act.startsWith("Play ")) {
        return;
    }
    const tileCode = act.slice(5);
    const tileIndex = render_bz2tc(tileCode);
    if (tileIndex < 0 || tileIndex >= 136) {
        return;
    }
    const currentStat = tz.stat[tz.stp];
    let playerIndex = currentStat?.k;
    if (typeof playerIndex === "undefined") {
        playerIndex = 0;
    }
    const handContainers = document.querySelectorAll(".hand");
    if (handContainers.length <= playerIndex) {
        return;
    }
    const targetHand = handContainers[playerIndex];
    const tiles = targetHand.querySelectorAll(".tl");
    let highlighted = false;
    tiles.forEach((tileEl) => {
        if (highlighted) {
            return;
        }
        const htmlTile = tileEl;
        const tileVal = Number.parseInt(htmlTile.dataset.val ?? "-1", 10);
        if (Math.floor(tileVal / 4) === tileIndex) {
            htmlTile.classList.add("highlight-first-tile");
            highlighted = true;
            infoLog(`Highlighted tile DOM for player ${playerIndex}: ${tileCode}`);
        }
    });
}
function showCandidates(runtime) {
    const roundEl = document.getElementById("round");
    const reviewLogEl = document.getElementById("review-log");
    const reviewEl = document.getElementById("review");
    if (!roundEl || !reviewLogEl || !reviewEl) {
        return;
    }
    const round = parseRound(roundEl.innerHTML, runtime.wind);
    const ri = getPlayerStep();
    const tz = getTZInstance();
    if (tz && typeof tz.stp === "number") {
        runtime.setLastStep(tz.stp);
    }
    reviewLogEl.innerHTML = `CHAGA Reviewer [Step ${ri}] [Load ${getReviewSeats().map(fmtLoad).join(" ")}]`;
    if (w.__review_error) {
        reviewEl.innerText = w.__review_error;
        clearWeightBars();
        clearHighlightTiles();
        return;
    }
    if (tz && w.__review_error) {
        clearReviewError();
    }
    const key = `${round}-${ri}`;
    const resp = getFilledReviews()[key] || getReviews()[key];
    clearHighlightTiles();
    clearWeightBars();
    const candidates = resp?.extra?.candidates;
    if (!candidates || !candidates.length) {
        reviewEl.innerText = "";
        return;
    }
    reviewEl.innerHTML = candidates
        .map(([weight, act]) => `${act2str(act, runtime.tile)}&nbsp;&nbsp;-&nbsp;&nbsp;${weight.toFixed(2)}`)
        .join("<br>");
    const hasPlay = candidates.some(([, act]) => act.trim().startsWith("Play "));
    if (hasPlay && tz && typeof tz.stp === "number") {
        const currentStat = tz.stat?.[tz.stp];
        const playerIndex = currentStat?.k ?? 0;
        showWeightVisualization(candidates, playerIndex, runtime.options);
    }
    if (hasPlay && runtime.options.highlightFirstTile) {
        highlightFirstCandidate(candidates);
    }
}
function startStepWatcher(runtime) {
    const poll = () => {
        const stp = getTZInstance()?.stp;
        if (typeof stp === "number" && stp !== runtime.getLastStep()) {
            runtime.setLastStep(stp);
            showCandidates(runtime);
        }
    };
    w.setInterval(poll, 200);
}

;// ./src/features/record/reviewer/ui.ts




function toggleUserInfo(hide) {
    const nameElements = document.querySelectorAll(".name");
    const eloElements = document.querySelectorAll(".elo");
    if (hide) {
        nameElements.forEach((el, index) => {
            const htmlEl = el;
            const currentText = htmlEl.textContent?.trim() ?? "";
            if (!/^用户\d+$/.test(currentText)) {
                htmlEl.dataset.originalName = currentText;
            }
            htmlEl.textContent = `用户${index + 1}`;
        });
        eloElements.forEach((el) => {
            const htmlEl = el;
            const eloValSpan = htmlEl.querySelector(".elo-val");
            if (eloValSpan) {
                htmlEl.dataset.originalElo =
                    eloValSpan.textContent ?? "";
            }
            htmlEl.style.display = "none";
        });
        return;
    }
    nameElements.forEach((el) => {
        const htmlEl = el;
        const currentText = htmlEl.textContent?.trim() ?? "";
        if (/^用户\d+$/.test(currentText) && htmlEl.dataset.originalName) {
            htmlEl.textContent = htmlEl.dataset.originalName;
        }
        delete htmlEl.dataset.originalName;
    });
    eloElements.forEach((el) => {
        const htmlEl = el;
        htmlEl.style.display = "";
        const eloValSpan = htmlEl.querySelector(".elo-val");
        if (eloValSpan && htmlEl.dataset.originalElo) {
            eloValSpan.textContent = htmlEl.dataset.originalElo;
        }
        delete htmlEl.dataset.originalElo;
    });
}
function clearUserInfoCache() {
    document.querySelectorAll(".name").forEach((el) => {
        delete el.dataset.originalName;
    });
}
function createReviewerUI(runtime) {
    const ctrl = document.getElementById("ctrl");
    if (!ctrl) {
        setTimeout(() => createReviewerUI(runtime), 100);
        return;
    }
    if (document.getElementById("review")) {
        return;
    }
    let hideUserInfo = false;
    const ctrlRtDiv = document.createElement("div");
    ctrlRtDiv.classList.add("ctrl-rt", "fs-sm");
    const buildCheckbox = (id, label, checked, onChange) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("ctrl-e", "no-sel");
        const checkboxLabel = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;
        checkbox.checked = checked;
        checkbox.addEventListener("change", (event) => {
            onChange(event.target.checked);
        });
        const labelText = document.createElement("span");
        labelText.classList.add("ml-02em");
        labelText.innerText = label;
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(labelText);
        wrapper.appendChild(checkboxLabel);
        return wrapper;
    };
    ctrlRtDiv.appendChild(buildCheckbox("cb-highlight-first-tile", "高亮首选牌", runtime.options.highlightFirstTile, (checked) => {
        runtime.options.highlightFirstTile = checked;
        showCandidates(runtime);
    }));
    ctrlRtDiv.appendChild(buildCheckbox("cb-show-weight-bars", "显示权重条", runtime.options.showWeightBars, (checked) => {
        runtime.options.showWeightBars = checked;
        showCandidates(runtime);
    }));
    ctrlRtDiv.appendChild(buildCheckbox("cb-hide-user-info", "隐藏用户信息", hideUserInfo, (checked) => {
        hideUserInfo = checked;
        toggleUserInfo(hideUserInfo);
    }));
    const logDiv = document.createElement("div");
    logDiv.classList.add("fs-sm");
    const logSpan = document.createElement("span");
    logSpan.id = "review-log";
    logDiv.appendChild(logSpan);
    ctrlRtDiv.appendChild(logDiv);
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("fs-sm", "review-container");
    const bgImage = document.createElement("img");
    bgImage.className = "review-bg-image";
    bgImage.src =
        "https://cdn.jsdelivr.net/gh/Choimoe/chaga-reviewer-script/doc/img/icon.png";
    bgImage.onerror = function onError() {
        const img = this;
        img.onerror = null;
        img.src = "https://s2.loli.net/2026/01/12/JV3yI89rnRzO1E4.png";
    };
    reviewDiv.appendChild(bgImage);
    const reviewSpan = document.createElement("span");
    reviewSpan.id = "review";
    reviewDiv.appendChild(reviewSpan);
    ctrlRtDiv.appendChild(reviewDiv);
    ctrl.appendChild(ctrlRtDiv);
    const resetHideUserInfo = () => {
        if (!hideUserInfo) {
            return;
        }
        const hideInfoCheckbox = document.getElementById("cb-hide-user-info");
        if (hideInfoCheckbox) {
            hideInfoCheckbox.checked = false;
        }
        hideUserInfo = false;
        toggleUserInfo(false);
        clearUserInfoCache();
    };
    const hookViewChange = () => {
        const viewSelect = document.getElementById("view");
        if (!viewSelect) {
            return;
        }
        const originalOnChange = viewSelect.onchange;
        viewSelect.onchange = function onViewChange(event) {
            resetHideUserInfo();
            if (originalOnChange) {
                return originalOnChange.call(this, event);
            }
            return undefined;
        };
    };
    const hookButtons = () => {
        const buttonIds = ["nextstp", "prevstp", "ffstp", "frstp", "next", "prev"];
        buttonIds.forEach((id) => {
            const btn = document.getElementById(id);
            if (!btn) {
                return;
            }
            if (btn.onclick) {
                const original = btn.onclick;
                btn.onclick = function patchedClick(event) {
                    if (id === "next" || id === "prev") {
                        resetHideUserInfo();
                    }
                    const result = original.call(this, event);
                    w.setTimeout(() => showCandidates(runtime), 50);
                    return result;
                };
            }
            btn.addEventListener("click", () => {
                if (id === "next" || id === "prev") {
                    resetHideUserInfo();
                }
                w.setTimeout(() => showCandidates(runtime), 50);
            }, { passive: true });
        });
    };
    w.setTimeout(hookViewChange, 500);
    w.setTimeout(hookButtons, 500);
    startStepWatcher(runtime);
    infoLog("UI elements created");
}

;// ./src/features/record/reviewer/data.ts





function fillEmptyValues() {
    const reviews = getReviews();
    const filled = getFilledReviews();
    Object.keys(reviews).forEach((key) => {
        filled[key] = reviews[key];
    });
    const byRound = {};
    Object.keys(reviews).forEach((key) => {
        const [rr, ri] = key.split("-").map(Number);
        if (!byRound[rr]) {
            byRound[rr] = {};
        }
        byRound[rr][ri] = reviews[key];
    });
    Object.keys(byRound).forEach((roundKey) => {
        const round = Number(roundKey);
        const steps = byRound[round];
        const riValues = Object.keys(steps)
            .map(Number)
            .sort((a, b) => a - b);
        if (!riValues.length) {
            return;
        }
        const maxRi = Math.max(...riValues);
        let lastValue = null;
        for (let ri = Math.min(...riValues); ri <= maxRi; ri += 1) {
            if (steps[ri]) {
                lastValue = steps[ri];
            }
            else if (lastValue) {
                filled[`${round}-${ri}`] = lastValue;
                lastValue = null;
            }
        }
    });
    infoLog("Empty values filled");
}
function loadReviewData(runtime) {
    const tiEl = document.getElementById("ti");
    if (!tiEl || !tiEl.children[0]) {
        setTimeout(() => loadReviewData(runtime), 100);
        return;
    }
    setReviewError("");
    const anchor = tiEl.children[0];
    const gameId = anchor.href.split("=").at(-1);
    const roundEl = document.getElementById("round");
    if (!roundEl || !gameId) {
        setTimeout(() => loadReviewData(runtime), 100);
        return;
    }
    const round = parseRound(roundEl.innerHTML, runtime.wind);
    infoLog(`Loading review data for game: ${gameId}, round: ${round}`);
    void fetchSessionData(gameId)
        .then((sessionData) => {
        if (!sessionData.isFinished) {
            setReviewError("等待对局完成后可查看AI评分");
            infoLog(`Review data skipped: game not finished (${gameId})`);
            return;
        }
        let loadedCount = 0;
        const seats = getReviewSeats();
        const reviews = getReviews();
        for (let seat = 0; seat <= 3; seat += 1) {
            if (seats[seat]) {
                continue;
            }
            seats[seat] = 1;
            fetchChagaReviewData(gameId, seat)
                .then(({ rows, errorMessage }) => {
                if (errorMessage) {
                    seats[seat] = 0;
                    setReviewError(`评测接口错误：seat ${seat} - ${errorMessage}`);
                    warnLog(`Error fetching review data for seat ${seat}`, errorMessage);
                    return;
                }
                rows.forEach((row) => {
                    if (row.ri) {
                        reviews[`${row.rr}-${row.ri}`] = row;
                    }
                });
                seats[seat] = 2;
                loadedCount += 1;
                infoLog(`Download finish for seat ${seat}`);
                if (loadedCount === 4) {
                    fillEmptyValues();
                }
                showCandidates(runtime);
            })
                .catch((error) => {
                seats[seat] = 0;
                setReviewError(`评测接口连接失败：seat ${seat}`);
                warnLog(`Download failed for seat ${seat}`, error);
            });
        }
        showCandidates(runtime);
    })
        .catch((error) => {
        setReviewError("对局状态读取失败，请稍后重试");
        warnLog("Failed to load game session status", error);
    });
}

;// ./src/features/record/tz-interceptor.ts



const originalDefineProperty = Object.defineProperty;
const originalReflectDefineProperty = Reflect.defineProperty;
function wrapTZ(OriginalTZ) {
    const WrappedTZ = function (...args) {
        const instance = new OriginalTZ(...args);
        setTZInstance(instance);
        clearReviewError();
        infoLog("Captured TZ instance", instance);
        return instance;
    };
    WrappedTZ.prototype = OriginalTZ.prototype;
    Object.setPrototypeOf(WrappedTZ, OriginalTZ);
    const originalStatics = OriginalTZ;
    const wrappedStatics = WrappedTZ;
    for (const key in originalStatics) {
        if (Object.prototype.hasOwnProperty.call(originalStatics, key)) {
            wrappedStatics[key] = originalStatics[key];
        }
    }
    return WrappedTZ;
}
function installDefinePropertyHook() {
    const definePropertyRef = Object.defineProperty;
    if (definePropertyRef._tz_hooked) {
        return;
    }
    const hook = function (target, prop, descriptor) {
        if (target === w &&
            prop === "TZ" &&
            descriptor &&
            typeof descriptor.value === "function" &&
            !descriptor._tz_wrapped) {
            descriptor = {
                ...descriptor,
                value: wrapTZ(descriptor.value),
                _tz_wrapped: true,
            };
            infoLog("Wrapped TZ via defineProperty hook");
        }
        return originalDefineProperty(target, prop, descriptor);
    };
    hook._tz_hooked = true;
    Object.defineProperty = hook;
    if (typeof originalReflectDefineProperty === "function") {
        const reflectHook = function (target, prop, descriptor) {
            if (target === w &&
                prop === "TZ" &&
                descriptor &&
                typeof descriptor.value === "function" &&
                !descriptor._tz_wrapped) {
                descriptor = {
                    ...descriptor,
                    value: wrapTZ(descriptor.value),
                    _tz_wrapped: true,
                };
                infoLog("Wrapped TZ via Reflect.defineProperty hook");
            }
            return originalReflectDefineProperty(target, prop, descriptor);
        };
        reflectHook._tz_hooked = true;
        Reflect.defineProperty = reflectHook;
    }
}
function tryForceCreateTZ() {
    try {
        if (w.__review_tz_instance || typeof w.TZ !== "function") {
            return false;
        }
        const searchParams = new URLSearchParams(w.location.search);
        const id = searchParams.get("id");
        const v = searchParams.get("v");
        const cy = searchParams.get("cy");
        const tz = new w.TZ();
        setTZInstance(tz);
        clearReviewError();
        infoLog("Force-created TZ instance");
        if (typeof tz.adapt === "function") {
            tz.adapt();
        }
        if (id && typeof tz.fetch === "function") {
            tz.fetch(id, 0, v, cy);
        }
        return true;
    }
    catch (error) {
        warnLog("Force-create TZ failed", error);
        return false;
    }
}
function interceptTZ() {
    debugLog("Installing TZ interceptors for current route", w.location.pathname);
    installDefinePropertyHook();
    const existing = Object.getOwnPropertyDescriptor(w, "TZ");
    if (!existing || existing.configurable) {
        const descriptor = {
            configurable: true,
            enumerable: true,
            get() {
                return this._TZ;
            },
            set(value) {
                if (typeof value === "function" && !this._TZ_intercepted) {
                    this._TZ_intercepted = true;
                    this._TZ = wrapTZ(value);
                    infoLog("Intercepting TZ constructor");
                    return;
                }
                this._TZ = value;
            },
        };
        try {
            originalDefineProperty(w, "TZ", descriptor);
            infoLog("TZ interceptor installed (configurable path)");
            return;
        }
        catch (error) {
            warnLog("Failed to install TZ interceptor via defineProperty", error);
        }
    }
    if (existing && existing.writable === false) {
        setReviewError("TZ 属性不可拦截，无法捕获牌局");
        warnLog("TZ is non-configurable and non-writable; cannot intercept");
        return;
    }
    const tryPatch = () => {
        if (typeof w.TZ === "function" && !w._TZ_intercepted_direct) {
            w._TZ_intercepted_direct = true;
            w.TZ = wrapTZ(w.TZ);
            infoLog("TZ interceptor installed (fallback patch)");
            return true;
        }
        return false;
    };
    if (tryPatch()) {
        return;
    }
    let attempts = 0;
    const timer = w.setInterval(() => {
        attempts += 1;
        if (tryPatch() || attempts > 200) {
            if (attempts > 200) {
                warnLog("Gave up waiting for TZ to patch");
                setReviewError("未捕获牌局核心对象，尝试补建实例");
                tryForceCreateTZ();
            }
            w.clearInterval(timer);
        }
    }, 50);
}

;// ./src/features/record/reviewer/init.ts






function initReviewer() {
    const hasWind = Array.isArray(w.WIND);
    const hasTile = Array.isArray(w.TILE);
    if (!hasWind || !hasTile) {
        infoLog("Waiting for game constants...");
        setTimeout(initReviewer, 100);
        return;
    }
    ensureReviewStores();
    let lastStep = null;
    const runtime = {
        wind: w.WIND,
        tile: w.TILE,
        options: {
            highlightFirstTile: true,
            showWeightBars: true,
        },
        getLastStep: () => lastStep,
        setLastStep: (value) => {
            lastStep = value;
        },
    };
    createReviewerUI(runtime);
    loadReviewData(runtime);
    setTimeout(() => {
        const tz = getTZInstance();
        if (tz) {
            clearReviewError();
            return;
        }
        const created = tryForceCreateTZ();
        if (created) {
            clearReviewError();
            return;
        }
        setReviewError("未捕获牌局实例，可能浏览器或脚本管理器限制了注入");
    }, 1000);
}

;// ./src/features/record/index.ts






let startedRecordHref = "";
function initRecordFeature(href) {
    if (startedRecordHref === href) {
        return false;
    }
    startedRecordHref = href;
    infoLog("Record feature init started");
    installRecordJsonParseGuard();
    interceptTZ();
    if (typeof unsafeWindow === "undefined") {
        setReviewError("未能进入页面上下文，可能脚本被沙箱隔离");
    }
    w.setTimeout(initReviewer, 500);
    return true;
}

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/features/tech/zumgze/index.less
var zumgze = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/features/tech/zumgze/index.less");
;// ./src/features/tech/zumgze/index.less

      
      
      
      
      
      
      
      
      

var zumgze_options = {};

zumgze_options.styleTagTransform = (styleTagTransform_default());
zumgze_options.setAttributes = (setAttributesWithoutAttributes_default());
zumgze_options.insert = insertBySelector_default().bind(null, "head");
zumgze_options.domAPI = (styleDomAPI_default());
zumgze_options.insertStyleElement = (insertStyleElement_default());

var zumgze_update = injectStylesIntoStyleTag_default()(zumgze/* default */.A, zumgze_options);




       /* harmony default export */ const tech_zumgze = (zumgze/* default */.A && zumgze/* default */.A.locals ? zumgze/* default */.A.locals : undefined);

;// ./src/features/tech/refs.ts
const FAN_ITEMS = [
    { idx: 36, name: "全不靠" },
    { idx: 37, name: "组合龙" },
    { idx: 45, name: "无番和" },
    { idx: 51, name: "混一色" },
    { idx: 53, name: "五门齐" },
    { idx: 60, name: "和绝张" },
    { idx: 58, name: "不求人" },
    { idx: 57, name: "全带幺" },
    { idx: 52, name: "三色三步高" },
    { idx: 32, name: "一色三连环" },
    { idx: 20, name: "七对" },
    { idx: 43, name: "三色三同顺" },
    { idx: 41, name: "花龙" },
    { idx: 50, name: "碰碰和" },
    { idx: 29, name: "清龙" },
];
const REF_MAPS = {
    chaga: {
        label: "CHAGA均",
        values: {
            全不靠: 3.51,
            组合龙: 2.783,
            无番和: 2.158,
            混一色: 9.56,
            五门齐: 11.699,
            和绝张: 4.97,
            不求人: 7.288,
            全带幺: 3.168,
            三色三步高: 22.742,
            一色三连环: 3.275,
            七对: 3.036,
            三色三同顺: 8.387,
            花龙: 7.49,
            碰碰和: 4.473,
            清龙: 5.341,
        },
    },
    zha: {
        label: "渣均",
        values: {
            全不靠: 1.674,
            组合龙: 1.37,
            无番和: 1.518,
            混一色: 8.18,
            五门齐: 10.88,
            和绝张: 4.71,
            不求人: 7.21,
            全带幺: 3.137,
            三色三步高: 23.144,
            一色三连环: 3.428,
            七对: 3.329,
            三色三同顺: 9.788,
            花龙: 9.169,
            碰碰和: 5.695,
            清龙: 7.748,
        },
    },
};

;// ./src/features/tech/zumgze/calc.ts

// --- 相似度评分参数 ---
const CHAGA_SIMILARITY_D = 21;
const CHAGA_SIMILARITY_C = -0.23;
const CHAGA_SIMILARITY_A = 4;
// --- 置信区间参数 ---
const CHAGA_CI_Z95 = 1.96;
const CHAGA_REF_SAMPLE_SIZE = 3416686;
/**
 * 将 zumgze 距离映射为 CHAGA 度评分（0~100）。
 * 使用 Sigmoid 变换后开方缩放：score = sqrt(σ(c·(d-D))) × 100 + A
 */
function chagaScoreFromDistance(distance) {
    const h = 1 / (1 + Math.exp(-CHAGA_SIMILARITY_C * (distance - CHAGA_SIMILARITY_D)));
    const scoreRaw = Math.sqrt(h) * 100 + CHAGA_SIMILARITY_A;
    return Math.max(0, Math.min(100, scoreRaw));
}
/**
 * 根据玩家番种数据与参考分布，计算平均差、CHAGA 度及 95% 置信区间。
 *
 * @param fan       玩家番种计数，键格式为 `c{idx}` / `d{idx}`
 * @param refValues 参考分布，键为番种名，值为百分比（0~100）
 */
function computeZumgzeStats(fan, refValues) {
    const total = (fan.c0 || 0) + (fan.d0 || 0);
    let zumgze = 0;
    const rows = FAN_ITEMS.map(({ idx, name }) => {
        const count = (fan[`c${idx}`] || 0) + (fan[`d${idx}`] || 0);
        const playerPct = total ? (count / total) * 100 : 0;
        const refPct = refValues[name] ?? 0;
        const diff = playerPct - refPct;
        zumgze += Math.abs(diff);
        return { name, playerPct, refPct, diff };
    });
    // 概率空间下的总差值（用于置信区间计算）
    const dProb = rows.reduce((sum, row) => sum + Math.abs(row.playerPct / 100 - row.refPct / 100), 0);
    // 方差：参考样本方差 + 玩家样本方差
    const varD = rows.reduce((sum, row) => sum +
        ((row.playerPct / 100) * (1 - row.playerPct / 100)) /
            CHAGA_REF_SAMPLE_SIZE +
        ((row.refPct / 100) * (1 - row.refPct / 100)) / Math.max(total, 1), 0);
    const seProb = Math.sqrt(Math.max(0, varD));
    const ciLowerProb = Math.max(0, dProb - CHAGA_CI_Z95 * seProb);
    const ciUpperProb = dProb + CHAGA_CI_Z95 * seProb;
    const chagaSimilarity = chagaScoreFromDistance(zumgze);
    const chagaScoreLower = chagaScoreFromDistance(ciLowerProb * 100);
    const chagaScoreUpper = chagaScoreFromDistance(ciUpperProb * 100);
    return { rows, zumgze, chagaSimilarity, chagaScoreLower, chagaScoreUpper };
}

;// ./src/features/tech/zumgze/index.ts





let currentRefKey = "chaga";
let latestFanData = {};
function renderZumgze(fan = {}) {
    latestFanData = fan || {};
    const currentRef = REF_MAPS[currentRefKey].values;
    const { rows, zumgze, chagaSimilarity, chagaScoreLower, chagaScoreUpper } = computeZumgzeStats(fan, currentRef);
    const sortedRows = [...rows].sort((a, b) => {
        const aPositive = a.diff >= 0;
        const bPositive = b.diff >= 0;
        if (aPositive !== bPositive) {
            return Number(bPositive) - Number(aPositive);
        }
        return b.diff - a.diff;
    });
    const maxAbsDiff = Math.max(...sortedRows.map((item) => Math.abs(item.diff)), 1e-9);
    const rowsHtml = sortedRows
        .map((item) => {
        const widthPercent = (Math.abs(item.diff) / maxAbsDiff) * 50;
        const isPositive = item.diff >= 0;
        const fillStyle = isPositive
            ? `right:50%; width:${widthPercent.toFixed(2)}%; background:#dc3545;`
            : `left:50%; width:${widthPercent.toFixed(2)}%; background:#198754;`;
        const labelClass = isPositive
            ? "text-danger"
            : "text-success zumgze-bar-label-left";
        return `
        <tr>
          <td class="text-dark">${item.name}</td>
          <td class="text-end text-muted">${item.playerPct.toFixed(3)}</td>
          <td class="text-center">
            <div class="zumgze-bar-wrap" title="差值 ${item.diff.toFixed(3)}">
              <div class="zumgze-bar-zero"></div>
              <div class="zumgze-bar-fill" style="${fillStyle}"></div>
              <div class="zumgze-bar-label ${labelClass}">${item.diff.toFixed(3)}</div>
            </div>
          </td>
          <td class="text-start text-muted">${item.refPct.toFixed(3)}</td>
        </tr>
      `;
    })
        .join("");
    let wrap = document.getElementById("reviewer-zumgze-wrap");
    const basicTable = document.getElementById("basic");
    if (!wrap && basicTable) {
        wrap = document.createElement("div");
        wrap.id = "reviewer-zumgze-wrap";
        wrap.innerHTML = `
      <h4 style="margin-top:2em;">分析</h4>
      <div class="zumgze-ref-toolbar">
        <span id="reviewer-zumgze-ref-label" class="text-muted">当前参考：CHAGA均</span>
        <button id="reviewer-zumgze-ref-toggle" type="button" class="btn btn-outline-secondary btn-sm zumgze-ref-toggle">切换到渣均</button>
      </div>
      <button id="reviewer-zumgze-table-toggle" type="button" class="btn btn-outline-secondary btn-sm zumgze-table-toggle" data-bs-toggle="collapse" data-bs-target="#reviewer-zumgze-table-collapse" aria-expanded="false" aria-controls="reviewer-zumgze-table-collapse">展开表格</button>
      <div id="reviewer-zumgze-table-collapse" class="collapse">
        <table class="table table-hover table-sm" style="table-layout:fixed;">
          <thead class="table-dark"><tr><th class="zumgze-col-name">番种</th><th class="text-end zumgze-col-player">玩家</th><th></th><th class="text-start zumgze-col-ref">参考</th></tr></thead>
          <tbody id="reviewer-zumgze-tbody"></tbody>
        </table>
      </div>
      <div class="zumgze-summary text-dark"><span id="reviewer-zumgze-summary-label">CHAGA均平均差</span>：<span id="reviewer-zumgze-value">0.000</span></div>
      <div id="reviewer-zumgze-similarity" class="zumgze-similarity text-dark" style="display:none;">
        <span id="reviewer-zumgze-similarity-label" class="zumgze-score-trigger" title="由 zumgze 设计，用于评估打法和 CHAGA 牌风的相似度（仅供参考）">CHAGA度</span>：<span id="reviewer-zumgze-similarity-value">0.00 / 100</span>
        <div id="reviewer-zumgze-similarity-ci" class="zumgze-score-ci" style="display:none;">95% 置信区间：<span id="reviewer-zumgze-similarity-ci-value">0.00 / 100 ～ 0.00 / 100</span></div>
      </div>
    `;
        const basicHeading = basicTable.previousElementSibling;
        if (basicHeading && basicHeading.tagName === "H4") {
            basicHeading.parentNode?.insertBefore(wrap, basicHeading);
        }
        else {
            basicTable.parentNode?.insertBefore(wrap, basicTable);
        }
    }
    const tbody = document.getElementById("reviewer-zumgze-tbody");
    const valueEl = document.getElementById("reviewer-zumgze-value");
    const summaryLabelEl = document.getElementById("reviewer-zumgze-summary-label");
    const refLabelEl = document.getElementById("reviewer-zumgze-ref-label");
    const refToggleBtn = document.getElementById("reviewer-zumgze-ref-toggle");
    const similarityWrapEl = document.getElementById("reviewer-zumgze-similarity");
    const similarityValueEl = document.getElementById("reviewer-zumgze-similarity-value");
    const similarityCiEl = document.getElementById("reviewer-zumgze-similarity-ci");
    const similarityCiValueEl = document.getElementById("reviewer-zumgze-similarity-ci-value");
    if (tbody)
        tbody.innerHTML = rowsHtml;
    if (valueEl)
        valueEl.textContent = `${zumgze.toFixed(3)} / ${rows.length} 项番种`;
    if (summaryLabelEl)
        summaryLabelEl.textContent = `${REF_MAPS[currentRefKey].label}平均差`;
    if (refLabelEl)
        refLabelEl.textContent = `当前参考：${REF_MAPS[currentRefKey].label}`;
    if (similarityWrapEl && similarityValueEl) {
        if (currentRefKey === "chaga") {
            similarityWrapEl.style.display = "";
            similarityValueEl.textContent = `${chagaSimilarity.toFixed(2)} / 100`;
            if (similarityCiEl && similarityCiValueEl) {
                similarityCiEl.style.display = "";
                similarityCiValueEl.textContent = `${Math.min(chagaScoreLower, chagaScoreUpper).toFixed(2)} / 100 ～ ${Math.max(chagaScoreLower, chagaScoreUpper).toFixed(2)} / 100`;
            }
        }
        else {
            similarityWrapEl.style.display = "none";
            if (similarityCiEl)
                similarityCiEl.style.display = "none";
        }
    }
    if (refToggleBtn && !refToggleBtn.dataset.bound) {
        refToggleBtn.dataset.bound = "1";
        refToggleBtn.addEventListener("click", () => {
            currentRefKey = currentRefKey === "chaga" ? "zha" : "chaga";
            renderZumgze(latestFanData);
        });
    }
    if (refToggleBtn) {
        refToggleBtn.textContent =
            currentRefKey === "chaga" ? "切换到渣均" : "切换到CHAGA均";
    }
}
function initTechZumgze() {
    const basicTable = document.getElementById("basic");
    const eloTable = document.getElementById("elo");
    if (!basicTable || !eloTable) {
        w.setTimeout(initTechZumgze, 100);
        return;
    }
    fetch(`/_qry/user/tech/${w.location.search}`, {
        method: "POST",
        credentials: "include",
    })
        .then((resp) => resp.json())
        .then((json) => renderZumgze(json?.fan || {}))
        .catch((error) => {
        warnLog("Failed to load zumgze data", error);
    });
}

;// ./src/features/tech/index.ts



let startedTechHref = "";
function initTechFeature(href) {
    if (startedTechHref === href) {
        return false;
    }
    startedTechHref = href;
    infoLog("Tech feature init started");
    w.setTimeout(initTechZumgze, 300);
    return true;
}

;// ./src/app/route-runner.ts








const routeState = {
    lastHref: "",
};
function runOnRoute() {
    const href = w.location.href;
    if (routeState.lastHref === href) {
        return;
    }
    routeState.lastHref = href;
    const routeFlags = {
        game: isGamePage(),
        record: isRecordPage(),
        tech: isTechPage(),
        history: isHistoryPage(),
        userGame: isUserGamePage(),
    };
    debugLog("Route changed", {
        href,
        pathname: w.location.pathname,
        routeFlags,
    });
    logCurrentCookie();
    if (routeFlags.game) {
        if (initGameFeature(href)) {
            debugLog("Game route init dispatched");
        }
        return;
    }
    if (routeFlags.record) {
        if (initRecordFeature(href)) {
            debugLog("Record route init dispatched");
        }
        return;
    }
    if (routeFlags.tech) {
        if (initTechFeature(href)) {
            debugLog("Tech route init dispatched");
        }
        return;
    }
    if (routeFlags.history) {
        if (initHistoryFeature(href)) {
            debugLog("History route init dispatched");
        }
        return;
    }
    if (routeFlags.userGame) {
        if (initUserGameFeature(href)) {
            debugLog("User game route init dispatched");
        }
    }
}

;// ./src/app/bootstrap.ts




function bootstrap() {
    bootstrapReviewerDebugQuery();
    initDebugState();
    installRouteWatcher(runOnRoute);
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", runOnRoute, { once: true });
        return;
    }
    runOnRoute();
}

;// ./src/index.ts


//checkout homepage https://github.com/Trim21/gm-fetch for @trim21/gm-fetch
// import GM_fetch from "@trim21/gm-fetch";
async function src_main() {
    bootstrap();
    // cross domain requests
    // console.log(`uuid: ${await fetchExample()}`);
}
// async function fetchExample(): Promise<string> {
//   const res = await GM_fetch("https://httpbin.org/uuid");
//   const data = await res.json();
//   return data.uuid;
// }
src_main().catch((e) => {
    console.log(e);
});

/******/ })()
;