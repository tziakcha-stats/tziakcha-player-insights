// ==UserScript==
// @name             tziakcha-player-insights
// @name:cn          雀渣用户高级分析工具
// @name:en          Tziakcha Player Insights
// @icon             https://cdn.jsdelivr.net/gh/Choimoe/chaga-reviewer-script/doc/img/icon.png
// @namespace        https://greasyfork.org/users/1543716
// @version          2.2.2
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

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/features/tech/analysis/index.less"
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
___CSS_LOADER_EXPORT___.push([module.id, `#reviewer-tech-analysis-panel {
  margin-top: 1.2em;
}
#reviewer-tech-analysis-panel .reviewer-style-players {
  display: grid;
  gap: 0.75em;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin-bottom: 0.75em;
}
#reviewer-tech-analysis-panel .reviewer-style-player-card {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.55em;
  background: #f8f9fa;
}
#reviewer-tech-analysis-panel .reviewer-style-player-title {
  font-weight: 600;
  margin-bottom: 0.35em;
}
#reviewer-tech-analysis-panel .reviewer-style-player-card input,
#reviewer-tech-analysis-panel .reviewer-style-player-card select {
  margin-bottom: 0.4em;
}
#reviewer-tech-analysis-panel .reviewer-style-picked {
  font-size: 0.85rem;
}
#reviewer-tech-analysis-panel .reviewer-style-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  align-items: center;
  margin: 0.35em 0 0.65em;
}
#reviewer-tech-analysis-panel .reviewer-style-summary {
  font-weight: 600;
  margin-bottom: 0.35em;
}
#reviewer-tech-analysis-panel .reviewer-style-score-trigger {
  cursor: help;
  text-decoration: underline dotted;
  text-underline-offset: 2px;
}
#reviewer-tech-analysis-panel .reviewer-style-score-ci {
  margin-top: 0.15em;
  font-size: 12px;
  color: #6c757d;
}
#reviewer-tech-analysis-panel .reviewer-style-subtabs {
  margin: 0.4em 0 0.5em;
}
#reviewer-tech-analysis-panel .reviewer-style-fan-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45em;
  margin: 0.2em 0 0.55em;
}
#reviewer-tech-analysis-panel .reviewer-style-toggle-btn {
  border: 1px solid #adb5bd;
  border-radius: 999px;
  background: #ffffff;
  color: #495057;
  font-size: 0.8rem;
  line-height: 1.2;
  padding: 0.3em 0.8em;
  transition: all 0.15s ease;
}
#reviewer-tech-analysis-panel .reviewer-style-toggle-btn:hover {
  border-color: #198754;
  color: #198754;
}
#reviewer-tech-analysis-panel .reviewer-style-toggle-btn.is-active {
  border-color: #198754;
  background: #198754;
  color: #ffffff;
  box-shadow: 0 0 0 1px rgba(25, 135, 84, 0.12);
}
#reviewer-tech-analysis-panel .reviewer-style-subtabs .nav-link {
  padding: 0.2em 0.6em;
  font-size: 0.86rem;
}
#reviewer-tech-analysis-panel .reviewer-style-subtitle {
  margin: 0.75em 0 0.35em;
  font-size: 1rem;
}
#reviewer-tech-analysis-panel .reviewer-style-table {
  table-layout: fixed;
}
#reviewer-tech-analysis-panel .reviewer-style-fan-scroll {
  max-height: 42em;
  overflow-y: auto;
}
#reviewer-tech-analysis-panel .reviewer-style-metric-label {
  width: 9em;
}
#reviewer-tech-analysis-panel .reviewer-style-metric-value {
  width: 6em;
}
#reviewer-tech-analysis-panel .reviewer-style-metric-bar-cell {
  width: auto;
}
#reviewer-tech-analysis-panel .reviewer-style-bar-wrap {
  position: relative;
  width: 100%;
  height: 20px;
  border-radius: 3px;
  background: #f8f9fa;
  overflow: hidden;
}
#reviewer-tech-analysis-panel .reviewer-style-bar-zero {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #6c757d;
  opacity: 0.6;
  z-index: 1;
}
#reviewer-tech-analysis-panel .reviewer-style-bar-fill {
  position: absolute;
  top: 2px;
  bottom: 2px;
  border-radius: 2px;
  z-index: 2;
}
#reviewer-tech-analysis-panel .reviewer-style-bar-label {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 600;
  z-index: 3;
}
#reviewer-tech-analysis-panel .reviewer-style-bar-label-left {
  right: auto;
  left: 6px;
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

/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/core/config/actions.js"
(module) {



const ACTION_TYPES = {
  NONE: 0,
  FLOWER_REPLACE: 1,
  DISCARD: 2,
  CHI: 3,
  PENG: 4,
  GANG: 5,
  WIN: 6,
  DRAW: 7,
  PASS: 8,
  ABANDON: 9
};

const ACTION_TYPE_NAMES = {
  [ACTION_TYPES.NONE]: "none",
  [ACTION_TYPES.FLOWER_REPLACE]: "flowerReplace",
  [ACTION_TYPES.DISCARD]: "discard",
  [ACTION_TYPES.CHI]: "chi",
  [ACTION_TYPES.PENG]: "peng",
  [ACTION_TYPES.GANG]: "gang",
  [ACTION_TYPES.WIN]: "win",
  [ACTION_TYPES.DRAW]: "draw",
  [ACTION_TYPES.PASS]: "pass",
  [ACTION_TYPES.ABANDON]: "abandon"
};

module.exports = {
  ACTION_TYPES,
  ACTION_TYPE_NAMES
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/core/config/game.js"
(module) {



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
  "※ 人和Ⅱ"
];

const WINDS = ["E", "S", "W", "N"];

const SEAT_PLAYER_ORDERS = [
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
  [1, 3, 2, 0]
];

module.exports = {
  FAN_NAMES,
  SEAT_PLAYER_ORDERS,
  WINDS
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/core/network/index.js"
(module, __unused_webpack_exports, __webpack_require__) {



const DEFAULT_BASE_URL = "https://tziakcha.net";

function getFetch(options = {}) {
  const fetchImpl = options.fetch || __webpack_require__.g.fetch;
  if (typeof fetchImpl !== "function") {
    throw new Error("当前环境没有 fetch，请通过 options.fetch 注入");
  }

  return fetchImpl;
}

function buildUrl(path, options = {}) {
  return new URL(path, options.baseUrl || DEFAULT_BASE_URL).toString();
}

function mergeHeaders(options = {}, headers = {}) {
  return {
    ...(options.headers || {}),
    ...headers
  };
}

function assertOk(response, endpoint) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${endpoint}`);
  }
}

module.exports = {
  DEFAULT_BASE_URL,
  assertOk,
  buildUrl,
  getFetch,
  mergeHeaders
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/core/tiles/index.js"
(module) {



function decodeWallHex(wallHex) {
  if (typeof wallHex !== "string" || wallHex.length % 2 !== 0) {
    throw new Error("wall hex 必须是偶数长度字符串");
  }

  const result = [];
  for (let index = 0; index < wallHex.length; index += 2) {
    const hexPair = wallHex.slice(index, index + 2);
    if (!/^[\da-fA-F]{2}$/.test(hexPair)) {
      throw new Error("wall hex 包含非法十六进制字符");
    }

    const parsed = Number.parseInt(hexPair, 16);

    result.push(parsed);
  }

  return result;
}

function tileIdToBase(tileId) {
  return tileId >> 2;
}

function tileIdToGbTile(tileId) {
  if (tileId < 108) {
    return String((tileIdToBase(tileId) % 9) + 1);
  }

  if (tileId < 136) {
    return ["E", "S", "W", "N", "C", "F", "P"][(tileId - 108) >> 2];
  }

  return ["a", "b", "c", "d", "e", "f", "g", "h"][tileId - 136];
}

function groupHandToGbString(tileIds) {
  const groups = {
    m: [],
    p: [],
    s: [],
    z: []
  };

  for (const tileId of [...tileIds].sort((left, right) => left - right)) {
    if (tileId < 36) {
      groups.m.push(tileIdToGbTile(tileId));
    } else if (tileId < 72) {
      groups.s.push(tileIdToGbTile(tileId));
    } else if (tileId < 108) {
      groups.p.push(tileIdToGbTile(tileId));
    } else if (tileId < 136) {
      groups.z.push(tileIdToGbTile(tileId));
    }
  }

  return [
    groups.m.length ? `${groups.m.join("")}m` : "",
    groups.p.length ? `${groups.p.join("")}p` : "",
    groups.s.length ? `${groups.s.join("")}s` : "",
    groups.z.join("")
  ].join("");
}

module.exports = {
  decodeWallHex,
  groupHandToGbString,
  tileIdToBase,
  tileIdToGbTile
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/record/actions.js"
(module, __unused_webpack_exports, __webpack_require__) {



const { ACTION_TYPES, ACTION_TYPE_NAMES } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/core/config/actions.js");

function decodeDetail(type, data) {
  switch (type) {
    case ACTION_TYPES.FLOWER_REPLACE:
      return {
        drawnTileId: data & 0xff,
        flowerTileId: ((data >> 8) & 0x0f) + 136,
        auto: Boolean(data & 0x1000)
      };
    case ACTION_TYPES.DISCARD:
      return {
        tileId: data & 0xff,
        handPlayed: Boolean((data >> 8) & 1),
        playMode: (data >> 9) & 3
      };
    case ACTION_TYPES.CHI: {
      const tileBase = (data & 0x3f) << 2;
      const offsets = [(data >> 10) & 3, (data >> 12) & 3, (data >> 14) & 3];

      return {
        baseTileId: tileBase,
        tileBase,
        offerDirection: (data >> 6) & 3,
        offsets,
        candidateTileIds: [
          tileBase - 4 + offsets[0],
          tileBase + offsets[1],
          tileBase + 4 + offsets[2]
        ]
      };
    }

    case ACTION_TYPES.PENG: {
      const tileBase = (data & 0x3f) << 2;
      const offset = (data >> 10) & 3;

      return {
        baseTileId: tileBase,
        tileBase,
        offerDirection: (data >> 6) & 3,
        offset,
        actualTileId: tileBase + offset
      };
    }

    case ACTION_TYPES.GANG: {
      const tileBase = (data & 0x3f) << 2;
      const offerDirection = (data >> 6) & 3;
      const offset = (data >> 10) & 3;

      return {
        baseTileId: tileBase,
        tileBase,
        offerDirection,
        offset,
        actualTileId: tileBase + offset,
        promoted: (data & 0x0300) === 0x0300,
        concealed: offerDirection === 0
      };
    }

    case ACTION_TYPES.WIN:
      return {
        auto: Boolean(data & 1),
        fan: data >> 1
      };
    case ACTION_TYPES.DRAW:
      return {
        tileId: data & 0xff,
        backward: Boolean(data & 0x0100)
      };
    case ACTION_TYPES.PASS:
      return {
        mode: data & 3
      };
    default:
      return {};
  }
}

function decodeTziakchaAction(action) {
  if (!Array.isArray(action) || action.length < 3) {
    throw new Error("tziakcha action 必须是 [combined, data, time] 数组");
  }

  const [combined, data, time] = action;
  if (
    typeof combined !== "number" ||
    typeof data !== "number" ||
    typeof time !== "number"
  ) {
    throw new Error("tziakcha action combined/data/time 必须是数字");
  }

  const type = combined & 0x0f;

  return {
    playerIndex: (combined >> 4) & 3,
    type,
    typeName: ACTION_TYPE_NAMES[type] || `unknown(${type})`,
    data,
    time,
    detail: decodeDetail(type, data)
  };
}

module.exports = {
  ACTION_TYPES,
  decodeTziakchaAction
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/record/decompress-browser.js"
(module, __unused_webpack_exports, __webpack_require__) {


/* global self, window */

const root =
  (typeof __webpack_require__.g !== "undefined" && __webpack_require__.g) ||
  (typeof window !== "undefined" && window) ||
  (typeof self !== "undefined" && self) ||
  {};

function decodeBase64(input) {
  if (typeof Buffer !== "undefined") {
    return Uint8Array.from(Buffer.from(input, "base64"));
  }

  if (typeof root.atob !== "function") {
    throw new Error("当前环境不支持 base64 解码");
  }

  const binary = root.atob(input);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function decompressZlibBase64(input) {
  if (typeof root.DecompressionStream !== "function") {
    throw new Error('当前环境不支持 DecompressionStream("deflate")');
  }

  const stream = new root.Blob([decodeBase64(input)])
    .stream()
    .pipeThrough(new root.DecompressionStream("deflate"));
  const buffer = await new root.Response(stream).arrayBuffer();

  return new TextDecoder("utf-8").decode(buffer).replace(/\0/g, "");
}

module.exports = {
  decompressZlibBase64
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/record/fetch-browser.js"
(module, __unused_webpack_exports, __webpack_require__) {



const { createRecordFetchApi } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/shared-fetch.js");
const { decompressZlibBase64 } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/decompress-browser.js");

module.exports = createRecordFetchApi(decompressZlibBase64);


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/record/index.js"
(module, __unused_webpack_exports, __webpack_require__) {



const { decodeTziakchaAction } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/actions.js");
const {
  decompressZlibBase64,
  fetchTziakchaRecord,
  fetchTziakchaRecordStep
} = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/fetch-browser.js");
const { simulateTziakchaRecord } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/simulate.js");
const {
  extractTziakchaRoundWinInfos,
  parseTziakchaWinFanItems
} = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/win.js");

module.exports = {
  decodeAction: decodeTziakchaAction,
  decompress: decompressZlibBase64,
  extractWins: extractTziakchaRoundWinInfos,
  fetch: fetchTziakchaRecord,
  fetchStep: fetchTziakchaRecordStep,
  parseWinFanItems: parseTziakchaWinFanItems,
  simulate: simulateTziakchaRecord
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/record/shared-fetch.js"
(module, __unused_webpack_exports, __webpack_require__) {



const {
  assertOk,
  buildUrl,
  getFetch,
  mergeHeaders
} = __webpack_require__("./node_modules/tziakcha-fetcher/lib/core/network/index.js");

async function decodeRecordStep(recordId, raw, decompressZlibBase64, options) {
  const normalizedOptions = options || {};

  if (raw.script === "<Decoded>" && raw.step && typeof raw.step === "object") {
    return raw.step;
  }

  if (typeof raw.script !== "string" || !raw.script) {
    throw new Error(`record ${recordId} 缺少 script`);
  }

  const decode = normalizedOptions.decompressZlibBase64 || decompressZlibBase64;

  try {
    return JSON.parse(await decode(raw.script));
  } catch (error) {
    throw new Error(`record ${recordId} script 解码失败: ${error.message}`);
  }
}

function createRecordFetchApi(decompressZlibBase64) {
  async function fetchTziakchaRecord(recordId, options = {}) {
    const endpoint = "/_qry/record/";
    const response = await getFetch(options)(buildUrl(endpoint, options), {
      method: "POST",
      headers: mergeHeaders(options, {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      }),
      body: new URLSearchParams({ id: recordId }).toString()
    });
    assertOk(response, endpoint);

    const raw = await response.json();
    const step = await decodeRecordStep(
      recordId,
      raw,
      decompressZlibBase64,
      options
    );

    return {
      id: raw.id || recordId,
      belongs: raw.belongs,
      script: "<Decoded>",
      step,
      raw
    };
  }

  async function fetchTziakchaRecordStep(recordId, options = {}) {
    const record = await fetchTziakchaRecord(recordId, options);
    return record.step;
  }

  return {
    decompressZlibBase64,
    decodeRecordStep,
    fetchTziakchaRecord,
    fetchTziakchaRecordStep
  };
}

module.exports = {
  createRecordFetchApi,
  decodeRecordStep
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/record/simulate.js"
(module, __unused_webpack_exports, __webpack_require__) {



const { WINDS } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/core/config/game.js");
const { decodeWallHex, tileIdToBase } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/core/tiles/index.js");
const { ACTION_TYPES, decodeTziakchaAction } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/actions.js");
const {
  cloneGameState,
  createInitialGameState,
  setupWallAndDeal
} = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/state.js");

function getStep(record) {
  if (!record || !record.step || typeof record.step !== "object") {
    throw new Error("record 缺少 step");
  }

  return record.step;
}

function validateStep(step) {
  if (typeof step.w !== "string") {
    throw new Error("step.w 必须是牌墙十六进制字符串");
  }

  if (typeof step.d !== "number") {
    throw new Error("step.d 必须是数字");
  }

  if (!Array.isArray(step.a)) {
    throw new Error("step.a 必须是动作数组");
  }
}

function getDiceArray(encodedDice) {
  return [
    encodedDice & 0x0f,
    (encodedDice >> 4) & 0x0f,
    (encodedDice >> 8) & 0x0f,
    (encodedDice >> 12) & 0x0f
  ];
}

function setLastActionFlags(state, wasKong, wasAddedKong) {
  state.lastActionWasKong = wasKong;
  state.lastActionWasAddedKong = wasAddedKong;
}

function removeLastDiscard(state, playerIndex) {
  if (playerIndex === null || playerIndex === undefined) {
    return;
  }

  const discards = state.players[playerIndex].discards;
  if (discards.length === 0) {
    return;
  }

  discards.pop();
}

function removeTileFromHand(player, tileId, playerIndex) {
  const tileIndex = player.handTiles.indexOf(tileId);
  if (tileIndex >= 0) {
    player.handTiles.splice(tileIndex, 1);
    return tileId;
  }

  const tileBase = tileIdToBase(tileId);
  const sameBaseIndex = player.handTiles.findIndex(
    handTileId => tileIdToBase(handTileId) === tileBase
  );
  if (sameBaseIndex < 0) {
    throw new Error(`玩家 ${playerIndex} 手牌中不存在牌 ${tileId}`);
  }

  return player.handTiles.splice(sameBaseIndex, 1)[0];
}

function removeTileByBaseFromHand(player, tileBase, playerIndex) {
  const expectedBase = tileIdToBase(tileBase);
  const tileIndex = player.handTiles.findIndex(
    tileId => tileIdToBase(tileId) === expectedBase
  );
  if (tileIndex < 0) {
    throw new Error(`玩家 ${playerIndex} 手牌中不存在牌型 ${tileBase}`);
  }

  return player.handTiles.splice(tileIndex, 1)[0];
}

function removeTilesByBaseFromHand(player, tileBase, count, playerIndex) {
  const removed = [];
  for (let index = 0; index < count; index += 1) {
    removed.push(removeTileByBaseFromHand(player, tileBase, playerIndex));
  }

  return removed;
}

function resolveOfferPlayerIndex(state, action) {
  if (action.type === ACTION_TYPES.CHI) {
    return (action.playerIndex + 3) % 4;
  }

  return (action.playerIndex - action.detail.offerDirection + 4) % 4;
}

function applyDiscard(state, action, player) {
  removeTileFromHand(player, action.detail.tileId, action.playerIndex);
  player.discards.push(action.detail.tileId);
  state.lastDiscardTile = action.detail.tileId;
  state.lastDiscardPlayerIndex = action.playerIndex;
  setLastActionFlags(state, false, false);
}

function applyDraw(state, action, player) {
  player.handTiles.push(action.detail.tileId);
  player.handTiles.sort((left, right) => left - right);
  player.lastDrawTile = action.detail.tileId;
  state.currentPlayerIndex = action.playerIndex;

  if (action.detail.backward) {
    state.wallBackIndex -= 1;
  } else {
    state.wallFrontIndex += 1;
  }

  setLastActionFlags(state, false, false);
}

function applyFlowerReplacement(state, action, player) {
  const flowerTileId = action.detail.flowerTileId;
  removeTileFromHand(player, flowerTileId, action.playerIndex);
  player.flowerCount += 1;
  player.flowerTiles.push(flowerTileId);
  player.handTiles.push(action.detail.drawnTileId);
  player.handTiles.sort((left, right) => left - right);
  player.lastDrawTile = action.detail.drawnTileId;
  state.currentPlayerIndex = action.playerIndex;
  state.wallBackIndex -= 1;
  setLastActionFlags(state, false, false);
}

function applyChi(state, action, player) {
  if (action.data === 0) {
    state.currentPlayerIndex = action.playerIndex;
    setLastActionFlags(state, false, false);
    return;
  }

  const offeredTileId = state.lastDiscardTile;
  const offerPlayerIndex = resolveOfferPlayerIndex(state, action);

  removeLastDiscard(state, offerPlayerIndex);

  let candidateTileIds = [...action.detail.candidateTileIds];
  if (candidateTileIds[0] < 0) {
    const tileBase = offeredTileId;
    candidateTileIds = [
      tileBase - 4 + action.detail.offsets[0],
      tileBase + action.detail.offsets[1],
      tileBase + 4 + action.detail.offsets[2]
    ];
  }

  const consumedTileIds = [];
  for (const tileId of candidateTileIds) {
    if (tileIdToBase(tileId) !== tileIdToBase(offeredTileId)) {
      consumedTileIds.push(
        removeTileByBaseFromHand(player, tileId, action.playerIndex)
      );
    }
  }

  const tileIds = candidateTileIds;
  let offerSequence = tileIds.findIndex(
    tileId => tileIdToBase(tileId) === tileIdToBase(offeredTileId)
  );
  if (offerSequence < 0) {
    offerSequence = 0;
  }

  player.melds.push({
    type: "chi",
    tileIds,
    consumedTileIds,
    offerDirection: action.detail.offerDirection,
    offerSequence,
    offeredTileId
  });
  state.currentPlayerIndex = action.playerIndex;
  setLastActionFlags(state, false, false);
}

function applyPeng(state, action, player) {
  if (action.data === 0) {
    state.currentPlayerIndex = action.playerIndex;
    setLastActionFlags(state, false, false);
    return;
  }

  const offeredTileId = state.lastDiscardTile;
  const offerPlayerIndex = resolveOfferPlayerIndex(state, action);

  removeLastDiscard(state, offerPlayerIndex);
  const tileIds = removeTilesByBaseFromHand(
    player,
    action.detail.tileBase,
    2,
    action.playerIndex
  );
  tileIds.push(offeredTileId);
  tileIds.sort((left, right) => left - right);

  player.melds.push({
    type: "peng",
    tileBase: action.detail.tileBase,
    tileIds,
    offerDirection: action.detail.offerDirection,
    offerSequence: action.detail.offerDirection + 1,
    offeredTileId
  });
  state.currentPlayerIndex = action.playerIndex;
  setLastActionFlags(state, false, false);
}

function applyAddedKong(state, action, player) {
  let removedTileId;
  try {
    removedTileId = removeTileFromHand(
      player,
      action.detail.actualTileId,
      action.playerIndex
    );
  } catch {
    removedTileId = removeTileByBaseFromHand(
      player,
      action.detail.tileBase,
      action.playerIndex
    );
  }

  const meld = player.melds.find(
    item =>
      item.type === "peng" &&
      tileIdToBase(item.tileBase) === tileIdToBase(action.detail.tileBase)
  );

  if (!meld) {
    throw new Error(
      `玩家 ${action.playerIndex} 没有可升级为加杠的碰 ${action.detail.tileBase}`
    );
  }

  meld.type = "gang";
  meld.upgradedFromPeng = true;
  meld.added = true;
  meld.concealed = false;
  meld.tileIds = [...(meld.tileIds || []), removedTileId].sort(
    (left, right) => left - right
  );
  state.lastDiscardTile = removedTileId;
  state.lastDiscardPlayerIndex = action.playerIndex;
  state.currentPlayerIndex = action.playerIndex;
  setLastActionFlags(state, true, true);
}

function applyGang(state, action, player) {
  state.currentPlayerIndex = action.playerIndex;

  if (action.data === 0) {
    setLastActionFlags(state, false, false);
    return;
  }

  if (action.detail.promoted) {
    applyAddedKong(state, action, player);
    return;
  }

  let offeredTileId = null;
  let offerSequence = 0;
  let tileIds;

  if (action.detail.concealed) {
    tileIds = removeTilesByBaseFromHand(
      player,
      action.detail.tileBase,
      4,
      action.playerIndex
    );
  } else {
    offeredTileId = state.lastDiscardTile;
    const offerPlayerIndex = resolveOfferPlayerIndex(state, action);
    removeLastDiscard(state, offerPlayerIndex);
    tileIds = removeTilesByBaseFromHand(
      player,
      action.detail.tileBase,
      3,
      action.playerIndex
    );
    tileIds.push(offeredTileId);
    offerSequence = action.detail.offerDirection + 1;
  }

  tileIds.sort((left, right) => left - right);
  player.melds.push({
    type: "gang",
    tileBase: action.detail.tileBase,
    tileIds,
    offerDirection: action.detail.offerDirection,
    offerSequence,
    offeredTileId,
    concealed: action.detail.concealed,
    upgradedFromPeng: false,
    added: false
  });
  setLastActionFlags(state, true, false);
}

function applyAction(state, action) {
  const player = state.players[action.playerIndex];

  switch (action.type) {
    case ACTION_TYPES.DISCARD:
      applyDiscard(state, action, player);
      break;
    case ACTION_TYPES.DRAW:
      applyDraw(state, action, player);
      break;
    case ACTION_TYPES.FLOWER_REPLACE:
      applyFlowerReplacement(state, action, player);
      break;
    case ACTION_TYPES.CHI:
      applyChi(state, action, player);
      break;
    case ACTION_TYPES.PENG:
      applyPeng(state, action, player);
      break;
    case ACTION_TYPES.GANG:
      applyGang(state, action, player);
      break;
    default:
      setLastActionFlags(state, false, false);
      break;
  }

  player.handTiles.sort((left, right) => left - right);
}

function simulateTziakchaRecord(record) {
  const step = getStep(record);
  validateStep(step);

  const state = createInitialGameState();
  const roundWind = WINDS[Math.floor((step.i || 0) / 4) % 4];
  state.roundWind = roundWind;

  setupWallAndDeal(state, {
    wall: decodeWallHex(step.w),
    dice: getDiceArray(step.d),
    dealerIndex: 0
  });
  state.roundWind = roundWind;

  const steps = step.a.map((actionTuple, index) => {
    const action = decodeTziakchaAction(actionTuple);
    const before = cloneGameState(state);
    applyAction(state, action);

    return {
      index,
      action,
      before,
      after: cloneGameState(state)
    };
  });

  return {
    recordId: record.id,
    initialHands: state.initialHands.map(hand => [...hand]),
    roundWind,
    resultFlags: {
      winnerMask: (step.b || 0) & 0x0f,
      discarderMask: ((step.b || 0) >> 4) & 0x0f
    },
    state,
    steps
  };
}

module.exports = {
  simulateTziakchaRecord
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/record/state.js"
(module) {



function createPlayerState() {
  return {
    handTiles: [],
    melds: [],
    discards: [],
    flowerTiles: [],
    flowerCount: 0,
    initialHandTiles: [],
    lastDrawTile: null
  };
}

function createInitialGameState() {
  return {
    players: Array.from({ length: 4 }, () => createPlayerState()),
    initialHands: [[], [], [], []],
    wall: [],
    wallFrontIndex: 0,
    wallBackIndex: -1,
    dealerIndex: 0,
    currentPlayerIndex: -1,
    lastDiscardTile: null,
    lastDiscardPlayerIndex: null,
    lastActionWasKong: false,
    lastActionWasAddedKong: false,
    roundIndex: 0,
    roundWind: null
  };
}

function cloneGameState(state) {
  return JSON.parse(JSON.stringify(state));
}

function normalizeDice(dice) {
  if (!Array.isArray(dice) || dice.length !== 4) {
    return [0, 0, 0, 0];
  }

  return dice.map(value => (typeof value === "number" ? value : 0));
}

function setupWallAndDeal(state, { wall, dice, dealerIndex }) {
  const normalizedDice = normalizeDice(dice);
  const wallBreakPos =
    (dealerIndex - (normalizedDice[0] + normalizedDice[1] - 1) + 12) % 4;
  let startPos =
    wallBreakPos * 36 +
    (normalizedDice[0] +
      normalizedDice[1] +
      normalizedDice[2] +
      normalizedDice[3]) *
      2;
  startPos %= wall.length;

  state.wall = [...wall.slice(startPos), ...wall.slice(0, startPos)];
  state.wallFrontIndex = 0;
  state.wallBackIndex = state.wall.length - 1;
  state.dealerIndex = dealerIndex;
  state.currentPlayerIndex = dealerIndex;
  state.lastDiscardTile = null;
  state.lastDiscardPlayerIndex = null;
  state.lastActionWasKong = false;
  state.lastActionWasAddedKong = false;

  for (const player of state.players) {
    player.handTiles = [];
    player.melds = [];
    player.discards = [];
    player.flowerTiles = [];
    player.flowerCount = 0;
    player.initialHandTiles = [];
    player.lastDrawTile = null;
  }

  for (let round = 0; round < 3; round += 1) {
    for (let offset = 0; offset < 4; offset += 1) {
      const playerIndex = (dealerIndex + offset) % 4;
      for (let draw = 0; draw < 4; draw += 1) {
        state.players[playerIndex].handTiles.push(
          state.wall[state.wallFrontIndex]
        );
        state.wallFrontIndex += 1;
      }
    }
  }

  for (let offset = 0; offset < 4; offset += 1) {
    const playerIndex = (dealerIndex + offset) % 4;
    state.players[playerIndex].handTiles.push(state.wall[state.wallFrontIndex]);
    state.wallFrontIndex += 1;
  }

  state.players[dealerIndex].handTiles.push(state.wall[state.wallFrontIndex]);
  state.wallFrontIndex += 1;

  state.initialHands = state.players.map(player => {
    player.handTiles.sort((left, right) => left - right);
    player.initialHandTiles = [...player.handTiles];
    return [...player.initialHandTiles];
  });

  return state;
}

module.exports = {
  cloneGameState,
  createInitialGameState,
  setupWallAndDeal
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/record/win.js"
(module, __unused_webpack_exports, __webpack_require__) {



const { FAN_NAMES, SEAT_PLAYER_ORDERS } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/core/config/game.js");

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

function parseTziakchaWinFanItems(rawT) {
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

      return {
        fanIndex: fanIndexInt,
        fanName: FAN_NAMES[fanIndexInt] || `番种${fanIndexInt}`,
        count,
        unitFan,
        totalFan: unitFan * count
      };
    })
    .filter(Boolean)
    .sort((left, right) => left.fanIndex - right.fanIndex);
}

function getSeatToPlayerOrder(roundIndex) {
  const index =
    ((roundIndex % SEAT_PLAYER_ORDERS.length) + SEAT_PLAYER_ORDERS.length) %
    SEAT_PLAYER_ORDERS.length;
  return SEAT_PLAYER_ORDERS[index] || [0, 1, 2, 3];
}

function resolvePlayerIndexByName(session, seatPlayer) {
  const seatName = seatPlayer?.n || seatPlayer?.name;
  if (!seatName || !Array.isArray(session.players)) {
    return null;
  }

  const playerIndex = session.players.findIndex(
    player => (player?.name || player?.n) === seatName
  );
  return playerIndex >= 0 ? playerIndex : null;
}

function getSeatToPlayerOrderForRecord(session, record) {
  const stepPlayers = record?.step?.p;
  if (Array.isArray(stepPlayers) && stepPlayers.length === 4) {
    const resolved = stepPlayers.map(player =>
      resolvePlayerIndexByName(session, player)
    );

    if (resolved.every(index => Number.isInteger(index) && index >= 0)) {
      return resolved;
    }
  }

  return getSeatToPlayerOrder(record?.index || 0);
}

function getPlayerName(session, playerIndex) {
  return session.players[playerIndex]?.name || `Seat ${playerIndex}`;
}

function extractTziakchaRoundWinInfos(session) {
  const rounds = [];

  for (const record of session.records || []) {
    const stepData = record.step || {};
    const resultBits = typeof stepData.b === "number" ? stepData.b : 0;
    const winnerMask = resultBits & 0x0f;
    const discarderMask = (resultBits >> 4) & 0x0f;
    if (!winnerMask) {
      continue;
    }

    const seatToPlayerOrder = getSeatToPlayerOrderForRecord(session, record);
    const winners = [];

    for (let stepSeat = 0; stepSeat < 4; stepSeat += 1) {
      if (((winnerMask >> stepSeat) & 1) === 0) {
        continue;
      }

      const playerIndex = seatToPlayerOrder[stepSeat];
      const seatY = Array.isArray(stepData.y) ? stepData.y[stepSeat] : null;
      const fanItems = parseTziakchaWinFanItems(seatY?.t);
      const totalFan =
        typeof seatY?.f === "number"
          ? seatY.f
          : fanItems.reduce((sum, item) => sum + item.totalFan, 0);

      winners.push({
        playerName: getPlayerName(session, playerIndex),
        playerIndex,
        totalFan,
        fanItems
      });
    }

    const discarders = [];
    for (let stepSeat = 0; stepSeat < 4; stepSeat += 1) {
      if (((discarderMask >> stepSeat) & 1) === 0) {
        continue;
      }

      const playerIndex = seatToPlayerOrder[stepSeat];
      discarders.push({
        playerName: getPlayerName(session, playerIndex),
        playerIndex
      });
    }

    rounds.push({
      roundNo: record.index + 1,
      recordId: record.id,
      winners,
      discarders,
      selfDraw:
        discarders.length === 0 ||
        discarders.every(discarder =>
          winners.some(winner => winner.playerIndex === discarder.playerIndex)
        )
    });
  }

  return rounds;
}

module.exports = {
  FAN_NAMES,
  SEAT_PLAYER_ORDERS,
  extractTziakchaRoundWinInfos,
  parseTziakchaWinFanItems
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/session/fetch.js"
(module, __unused_webpack_exports, __webpack_require__) {



const {
  assertOk,
  buildUrl,
  getFetch,
  mergeHeaders
} = __webpack_require__("./node_modules/tziakcha-fetcher/lib/core/network/index.js");

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

function extractPlayers(raw) {
  if (!Array.isArray(raw.players)) {
    return [];
  }

  return raw.players.map(player => ({
    name: player.n || player.name || "",
    id: player.i || player.id
  }));
}

function extractRecords(raw) {
  if (!Array.isArray(raw.records)) {
    return [];
  }

  return raw.records
    .map((record, index) => {
      const id = record.i || record.id;
      return id ? { id, index } : null;
    })
    .filter(Boolean);
}

function getIsFinished(raw, records, periods) {
  if (periods !== null && periods > 0) {
    return records.length === periods;
  }

  if (raw.finished === true || raw.isFinished === true) {
    return true;
  }

  const finishTime = asNumber(raw.finish_time || raw.finishTime);
  if (finishTime !== null && finishTime > 0) {
    return true;
  }

  const progress = asNumber(raw.progress);
  if (progress !== null && periods !== null && periods > 0) {
    return progress >= periods - 1;
  }

  return false;
}

async function fetchTziakchaSession(sessionId, options = {}) {
  const endpoint = "/_qry/game/";
  const response = await getFetch(options)(
    buildUrl(`${endpoint}?id=${encodeURIComponent(sessionId)}`, options),
    {
      method: "POST",
      credentials: "include",
      headers: mergeHeaders(options)
    }
  );
  assertOk(response, endpoint);

  const raw = await response.json();
  const records = extractRecords(raw);
  const periods = asNumber(raw.periods);

  return {
    sessionId,
    players: extractPlayers(raw),
    records,
    periods,
    isFinished: getIsFinished(raw, records, periods),
    raw
  };
}

module.exports = {
  fetchTziakchaSession
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/session/index.js"
(module, __unused_webpack_exports, __webpack_require__) {



const { fetchTziakchaSession } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/session/fetch.js");
const { fetchTziakchaSessionRounds } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/session/rounds.js");

module.exports = {
  fetch: fetchTziakchaSession,
  fetchRounds: fetchTziakchaSessionRounds
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/session/rounds.js"
(module, __unused_webpack_exports, __webpack_require__) {



const { fetchTziakchaRecordStep } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/fetch-browser.js");
const { fetchTziakchaSession } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/session/fetch.js");
const { parseTziakchaSessionId } = __webpack_require__("./node_modules/tziakcha-fetcher/lib/url/index.js");

async function fetchTziakchaSessionRounds(inputUrlOrId, options = {}) {
  const sessionId = parseTziakchaSessionId(inputUrlOrId);
  if (!sessionId) {
    throw new Error("无法从输入中解析 tziakcha 对局 id");
  }

  const session = await fetchTziakchaSession(sessionId, options);
  const records = await Promise.all(
    session.records.map(async record => ({
      ...record,
      step: await fetchTziakchaRecordStep(record.id, options)
    }))
  );

  return {
    ...session,
    records
  };
}

module.exports = {
  fetchTziakchaSessionRounds
};


/***/ },

/***/ "./node_modules/tziakcha-fetcher/lib/url/index.js"
(module) {



function parseTziakchaSessionId(input) {
  const trimmed = String(input || "").trim();
  if (!trimmed) {
    return null;
  }

  if (!trimmed.includes("?") && !trimmed.includes("/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed, "https://tziakcha.net");
    return url.searchParams.get("id") || trimmed;
  } catch {
    return trimmed;
  }
}

module.exports = {
  parseTziakchaSessionId
};


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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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

;// ./src/features/favorites/route.ts

const FAVORITES_HASH = "#reviewer-favorites";
function isFavoritesHash(href) {
    try {
        return new URL(href).hash === FAVORITES_HASH;
    }
    catch (_error) {
        return false;
    }
}
function getFavoritesHref(href = w.location.href) {
    const url = new URL(href);
    return `${url.origin}/${FAVORITES_HASH}`;
}

;// ./src/features/favorites/nav.ts


const FAVORITES_NAV_ID = "reviewer-favorites-nav-item";
const NAV_RETRY_DELAY_MS = 100;
function findNavContainer() {
    const selectors = [".navbar-nav", "ul.navbar-nav", ".nav", "nav ul"];
    for (const selector of selectors) {
        const found = document.querySelector(selector);
        if (found instanceof HTMLElement) {
            return found;
        }
    }
    return null;
}
function ensureFavoritesNavItem() {
    if (document.getElementById(FAVORITES_NAV_ID)) {
        return false;
    }
    const container = findNavContainer();
    if (!container) {
        return false;
    }
    const item = document.createElement("li");
    item.id = FAVORITES_NAV_ID;
    item.className = "nav-item";
    const link = document.createElement("a");
    link.className = "nav-link";
    link.href = getFavoritesHref(w.location.href);
    link.textContent = "收藏";
    item.appendChild(link);
    container.appendChild(item);
    return true;
}
function installFavoritesNavItem(retryCount = 20) {
    if (ensureFavoritesNavItem()) {
        return true;
    }
    if (document.getElementById(FAVORITES_NAV_ID)) {
        return false;
    }
    if (retryCount > 0) {
        w.setTimeout(() => installFavoritesNavItem(retryCount - 1), NAV_RETRY_DELAY_MS);
        return true;
    }
    return false;
}

;// ./src/features/favorites/filter.ts
function collectFavoritesByTab(document, activeTab) {
    return activeTab === "game" ? [...document.games] : [...document.records];
}
function listTagsForTab(items) {
    return Array.from(new Set(items.flatMap((item) => item.tags))).sort((left, right) => left.localeCompare(right));
}
function filterFavorites(items, selectedTags, query) {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return items.filter((item) => {
        if (selectedTags.length > 0) {
            const hasAllTags = selectedTags.every((tag) => item.tags.includes(tag));
            if (!hasAllTags) {
                return false;
            }
        }
        if (!normalizedQuery) {
            return true;
        }
        const searchText = [item.title, item.summary, ...item.tags]
            .join(" ")
            .toLocaleLowerCase();
        return searchText.includes(normalizedQuery);
    });
}

;// ./src/features/favorites/storage.ts

const FAVORITES_STORAGE_KEY = "tzi-reviewer:favorites";
const MAX_TAG_LENGTH = 20;
const MAX_TAG_COUNT = 20;
function createEmptyDocument(now = new Date().toISOString()) {
    return {
        version: 1,
        updatedAt: now,
        ui: {
            activeTab: "game",
        },
        games: [],
        records: [],
    };
}
function isFavoriteType(value) {
    return value === "game" || value === "record";
}
function normalizeTags(tags) {
    return Array.from(new Set(tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .map((tag) => tag.slice(0, MAX_TAG_LENGTH))))
        .sort((left, right) => left.localeCompare(right))
        .slice(0, MAX_TAG_COUNT);
}
function pickLonger(localValue, importedValue) {
    if (!localValue) {
        return importedValue;
    }
    if (!importedValue) {
        return localValue;
    }
    if (importedValue.length > localValue.length) {
        return importedValue;
    }
    return localValue;
}
function sanitizeItem(value) {
    if (!value || typeof value !== "object") {
        return null;
    }
    const item = value;
    if (typeof item.id !== "string" ||
        !isFavoriteType(item.type) ||
        typeof item.sourceUrl !== "string" ||
        typeof item.title !== "string" ||
        typeof item.summary !== "string" ||
        !Array.isArray(item.tags) ||
        typeof item.createdAt !== "string" ||
        typeof item.updatedAt !== "string") {
        return null;
    }
    return {
        id: item.id,
        type: item.type,
        sourceUrl: item.sourceUrl,
        title: item.title,
        summary: item.summary,
        tags: normalizeTags(item.tags.filter((tag) => typeof tag === "string")),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
}
function sanitizeItems(values) {
    if (!Array.isArray(values)) {
        return {
            items: [],
            invalid: 0,
        };
    }
    return values.reduce((result, value) => {
        const item = sanitizeItem(value);
        if (!item) {
            result.invalid += 1;
            return result;
        }
        result.items.push(item);
        return result;
    }, {
        items: [],
        invalid: 0,
    });
}
function sanitizeDocument(value) {
    if (!value || typeof value !== "object") {
        return createEmptyDocument();
    }
    const raw = value;
    const games = sanitizeItems(raw.games).items;
    const records = sanitizeItems(raw.records).items;
    return {
        version: 1,
        updatedAt: typeof raw.updatedAt === "string"
            ? raw.updatedAt
            : new Date().toISOString(),
        ui: {
            activeTab: raw.ui?.activeTab === "record" ? "record" : "game",
        },
        games,
        records,
    };
}
function sanitizeImportDocument(value) {
    if (!value || typeof value !== "object") {
        return {
            document: createEmptyDocument(),
            invalid: 0,
        };
    }
    const raw = value;
    const games = sanitizeItems(raw.games);
    const records = sanitizeItems(raw.records);
    return {
        document: {
            version: 1,
            updatedAt: typeof raw.updatedAt === "string"
                ? raw.updatedAt
                : new Date().toISOString(),
            ui: {
                activeTab: raw.ui?.activeTab === "record" ? "record" : "game",
            },
            games: games.items,
            records: records.items,
        },
        invalid: games.invalid + records.invalid,
    };
}
function cloneDocument(document) {
    return {
        version: 1,
        updatedAt: document.updatedAt,
        ui: {
            activeTab: document.ui.activeTab,
        },
        games: document.games.map((item) => ({ ...item, tags: [...item.tags] })),
        records: document.records.map((item) => ({
            ...item,
            tags: [...item.tags],
        })),
    };
}
function getBucket(document, type) {
    return type === "game" ? document.games : document.records;
}
function upsertItem(document, draft, now) {
    const bucket = getBucket(document, draft.type);
    const existingIndex = bucket.findIndex((item) => item.id === draft.id);
    if (existingIndex >= 0) {
        const existing = bucket[existingIndex];
        const nextItem = {
            ...existing,
            sourceUrl: draft.sourceUrl,
            title: draft.title,
            summary: draft.summary,
            tags: normalizeTags(draft.tags),
            updatedAt: now,
        };
        bucket.splice(existingIndex, 1, nextItem);
        return nextItem;
    }
    const nextItem = {
        ...draft,
        tags: normalizeTags(draft.tags),
        createdAt: now,
        updatedAt: now,
    };
    bucket.push(nextItem);
    return nextItem;
}
function createFavoritesRepository(storage = w.localStorage) {
    let available = true;
    try {
        storage?.getItem(FAVORITES_STORAGE_KEY);
    }
    catch (_error) {
        available = false;
    }
    function read() {
        if (!available || !storage) {
            return createEmptyDocument();
        }
        try {
            const raw = storage.getItem(FAVORITES_STORAGE_KEY);
            if (!raw) {
                return createEmptyDocument();
            }
            return sanitizeDocument(JSON.parse(raw));
        }
        catch (_error) {
            return createEmptyDocument();
        }
    }
    function write(document) {
        if (!available || !storage) {
            return false;
        }
        try {
            storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(document));
            return true;
        }
        catch (_error) {
            available = false;
            return false;
        }
    }
    return {
        isAvailable() {
            return available;
        },
        read() {
            return cloneDocument(read());
        },
        get(type, id) {
            return (read()[type === "game" ? "games" : "records"].find((item) => item.id === id) ?? null);
        },
        save(draft, now = new Date().toISOString()) {
            const document = read();
            document.updatedAt = now;
            upsertItem(document, draft, now);
            return write(document);
        },
        remove(type, id, now = new Date().toISOString()) {
            const document = read();
            const bucket = getBucket(document, type);
            const nextBucket = bucket.filter((item) => item.id !== id);
            if (nextBucket.length === bucket.length) {
                return false;
            }
            document.updatedAt = now;
            if (type === "game") {
                document.games = nextBucket;
            }
            else {
                document.records = nextBucket;
            }
            return write(document);
        },
        importDocument(value, now = new Date().toISOString()) {
            const incoming = sanitizeImportDocument(value);
            const document = read();
            const result = {
                added: 0,
                merged: 0,
                invalid: incoming.invalid,
            };
            const mergeOne = (item) => {
                const bucket = getBucket(document, item.type);
                const existingIndex = bucket.findIndex((entry) => entry.id === item.id);
                if (existingIndex < 0) {
                    bucket.push({ ...item, tags: normalizeTags(item.tags) });
                    result.added += 1;
                    return;
                }
                const existing = bucket[existingIndex];
                bucket.splice(existingIndex, 1, {
                    ...existing,
                    sourceUrl: pickLonger(existing.sourceUrl, item.sourceUrl),
                    title: pickLonger(existing.title, item.title),
                    summary: pickLonger(existing.summary, item.summary),
                    tags: normalizeTags([...existing.tags, ...item.tags]),
                    createdAt: existing.createdAt && item.createdAt
                        ? existing.createdAt <= item.createdAt
                            ? existing.createdAt
                            : item.createdAt
                        : existing.createdAt || item.createdAt,
                    updatedAt: now,
                });
                result.merged += 1;
            };
            incoming.document.games.forEach(mergeOne);
            incoming.document.records.forEach(mergeOne);
            document.updatedAt = now;
            write(document);
            return result;
        },
        exportDocument() {
            return cloneDocument(read());
        },
        setActiveTab(tab) {
            const document = read();
            document.ui.activeTab = tab;
            document.updatedAt = new Date().toISOString();
            return write(document);
        },
    };
}

;// ./src/features/favorites/page.ts


const ROOT_ID = "reviewer-favorites-page";
let mountedTarget = null;
let previousNodes = null;
function getMountTarget() {
    const target = document.querySelector("main");
    if (target instanceof HTMLElement) {
        return target;
    }
    return document.body;
}
function createButton(id, text) {
    const button = document.createElement("button");
    button.id = id;
    button.type = "button";
    button.textContent = text;
    return button;
}
function getItemKey(item) {
    return `${item.type}:${item.id}`;
}
function buildFavoritesExportFilename(now = new Date()) {
    const pad2 = (value) => String(value).padStart(2, "0");
    return `favorites-${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}-${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}.json`;
}
function renderList(container, items, editingKey, showEditControls, showDeleteControls, onStartEdit, onCancelEdit, onSaveSummary, onRemove) {
    if (items.length === 0) {
        const empty = document.createElement("p");
        empty.className = "text-secondary mb-0";
        empty.textContent = "当前条件下没有收藏";
        container.appendChild(empty);
        return;
    }
    items.forEach((item) => {
        const card = document.createElement("tr");
        const itemKey = getItemKey(item);
        const link = document.createElement("a");
        link.href = item.sourceUrl;
        link.textContent = item.title;
        link.target = "_blank";
        const titleCell = document.createElement("td");
        titleCell.appendChild(link);
        const summaryCell = document.createElement("td");
        if (editingKey === itemKey) {
            const summaryEditor = document.createElement("textarea");
            summaryEditor.id = "reviewer-favorites-summary-editor";
            summaryEditor.className = "form-control form-control-sm";
            summaryEditor.rows = 2;
            summaryEditor.value = item.summary;
            summaryCell.appendChild(summaryEditor);
        }
        else {
            summaryCell.textContent = item.summary || "-";
        }
        const tagsCell = document.createElement("td");
        tagsCell.textContent = `标签：${item.tags.join("、") || "-"}`;
        const actionCell = document.createElement("td");
        if (editingKey === itemKey) {
            const saveButton = document.createElement("button");
            saveButton.type = "button";
            saveButton.id = "reviewer-favorites-summary-save";
            saveButton.className = "btn btn-outline-secondary btn-sm me-2";
            saveButton.textContent = "保存";
            saveButton.addEventListener("click", () => {
                const editor = summaryCell.querySelector("#reviewer-favorites-summary-editor");
                onSaveSummary(item, editor?.value ?? "");
            });
            const cancelButton = document.createElement("button");
            cancelButton.type = "button";
            cancelButton.className = "btn btn-outline-secondary btn-sm";
            cancelButton.textContent = "取消";
            cancelButton.addEventListener("click", onCancelEdit);
            actionCell.appendChild(saveButton);
            actionCell.appendChild(cancelButton);
        }
        else {
            if (showEditControls) {
                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.className = "btn btn-outline-secondary btn-sm me-2";
                editButton.dataset.editType = item.type;
                editButton.dataset.editId = item.id;
                editButton.textContent = "编辑";
                editButton.addEventListener("click", () => onStartEdit(item));
                actionCell.appendChild(editButton);
            }
            if (showDeleteControls) {
                const removeButton = document.createElement("button");
                removeButton.type = "button";
                removeButton.className = "btn btn-outline-danger btn-sm";
                removeButton.dataset.removeType = item.type;
                removeButton.dataset.removeId = item.id;
                removeButton.textContent = "删除";
                removeButton.addEventListener("click", () => onRemove(item));
                actionCell.appendChild(removeButton);
            }
        }
        card.appendChild(titleCell);
        card.appendChild(summaryCell);
        card.appendChild(tagsCell);
        card.appendChild(actionCell);
        container.appendChild(card);
    });
}
function snapshotTarget(target) {
    if (mountedTarget === target && previousNodes) {
        return;
    }
    mountedTarget = target;
    previousNodes = Array.from(target.childNodes);
}
function cleanupFavoritesPage() {
    const existing = document.getElementById(ROOT_ID);
    existing?.remove();
    if (mountedTarget && previousNodes) {
        mountedTarget.replaceChildren(...previousNodes);
    }
    mountedTarget = null;
    previousNodes = null;
}
async function readFileText(file) {
    if (typeof file.text === "function") {
        return file.text();
    }
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(String(reader.result ?? ""));
        };
        reader.onerror = () => {
            reject(reader.error ?? new Error("Failed to read file"));
        };
        reader.readAsText(file);
    });
}
function initFavoritesPageFeature(_href, repository = createFavoritesRepository()) {
    const mountTarget = getMountTarget();
    snapshotTarget(mountTarget);
    cleanupFavoritesPage();
    snapshotTarget(mountTarget);
    const root = document.createElement("section");
    root.id = ROOT_ID;
    const container = document.createElement("div");
    container.className = "container";
    container.style.minHeight = "50em";
    const spacer = document.createElement("div");
    spacer.style.height = "4em";
    container.appendChild(spacer);
    const card = document.createElement("div");
    card.className = "card";
    card.style.margin = "1em 0";
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    card.appendChild(cardBody);
    container.appendChild(card);
    root.appendChild(container);
    const heading = document.createElement("h3");
    heading.className = "text-center";
    heading.textContent = "收藏";
    cardBody.appendChild(heading);
    const notice = document.createElement("p");
    notice.className = "text-secondary text-center";
    notice.textContent =
        "提示：此收藏功能为非官方实现，数据仅保存在当前浏览器本地。";
    cardBody.appendChild(notice);
    if (!repository.isAvailable()) {
        const unavailable = document.createElement("p");
        unavailable.className = "text-center text-secondary";
        unavailable.textContent = "收藏功能当前不可用";
        cardBody.appendChild(unavailable);
        mountTarget.replaceChildren(root);
        return true;
    }
    const toolbar = document.createElement("div");
    toolbar.className = "d-flex flex-wrap gap-2 align-items-center mb-3";
    const backButton = createButton("reviewer-favorites-back", "返回主页");
    backButton.className = "btn btn-outline-secondary btn-sm";
    const gameTabButton = createButton("reviewer-favorites-tab-game", "对局收藏");
    gameTabButton.className = "btn btn-outline-secondary btn-sm";
    const recordTabButton = createButton("reviewer-favorites-tab-record", "小局收藏");
    recordTabButton.className = "btn btn-outline-secondary btn-sm";
    const toggleEditButton = createButton("reviewer-favorites-toggle-edit", "编辑");
    toggleEditButton.className = "btn btn-outline-secondary btn-sm";
    const toggleDeleteButton = createButton("reviewer-favorites-toggle-delete", "删除");
    toggleDeleteButton.className = "btn btn-outline-secondary btn-sm";
    const exportButton = createButton("reviewer-favorites-export", "导出");
    exportButton.className = "btn btn-outline-secondary btn-sm";
    const importButton = createButton("reviewer-favorites-import", "导入");
    importButton.className = "btn btn-outline-secondary btn-sm";
    const searchInput = document.createElement("input");
    searchInput.id = "reviewer-favorites-search";
    searchInput.type = "search";
    searchInput.placeholder = "搜索标题、摘要、标签";
    searchInput.className = "form-control form-control-sm";
    searchInput.style.maxWidth = "18em";
    const importInput = document.createElement("input");
    importInput.id = "reviewer-favorites-import-input";
    importInput.type = "file";
    importInput.accept = "application/json";
    importInput.style.display = "none";
    toolbar.appendChild(backButton);
    toolbar.appendChild(gameTabButton);
    toolbar.appendChild(recordTabButton);
    toolbar.appendChild(toggleEditButton);
    toolbar.appendChild(toggleDeleteButton);
    toolbar.appendChild(exportButton);
    toolbar.appendChild(importButton);
    toolbar.appendChild(searchInput);
    toolbar.appendChild(importInput);
    cardBody.appendChild(toolbar);
    const feedback = document.createElement("p");
    feedback.className = "text-secondary";
    cardBody.appendChild(feedback);
    const tagBar = document.createElement("div");
    tagBar.className = "d-flex flex-wrap gap-2 mb-3";
    cardBody.appendChild(tagBar);
    const tableWrap = document.createElement("div");
    tableWrap.className = "table-responsive";
    const table = document.createElement("table");
    table.className = "table table-sm table-hover";
    table.style.tableLayout = "fixed";
    const thead = document.createElement("thead");
    thead.className = "table-dark";
    thead.innerHTML =
        "<tr><th>标题</th><th>摘要</th><th>标签</th><th>操作</th></tr>";
    const list = document.createElement("tbody");
    table.appendChild(thead);
    table.appendChild(list);
    tableWrap.appendChild(table);
    cardBody.appendChild(tableWrap);
    const selectedTags = new Set();
    let searchQuery = "";
    let editingKey = null;
    let showEditControls = false;
    let showDeleteControls = false;
    const render = () => {
        const documentState = repository.read();
        const activeTab = documentState.ui.activeTab;
        const activeItems = collectFavoritesByTab(documentState, activeTab);
        const visibleTags = listTagsForTab(activeItems);
        const filtered = filterFavorites(activeItems, [...selectedTags], searchQuery);
        gameTabButton.disabled = activeTab === "game";
        recordTabButton.disabled = activeTab === "record";
        toggleEditButton.classList.toggle("active", showEditControls);
        toggleDeleteButton.classList.toggle("active", showDeleteControls);
        tagBar.replaceChildren();
        visibleTags.forEach((tag) => {
            const tagButton = document.createElement("button");
            tagButton.type = "button";
            tagButton.dataset.tag = tag;
            tagButton.textContent = tag;
            tagButton.className = "btn btn-outline-secondary btn-sm";
            tagButton.setAttribute("aria-pressed", selectedTags.has(tag) ? "true" : "false");
            tagButton.addEventListener("click", () => {
                if (selectedTags.has(tag)) {
                    selectedTags.delete(tag);
                }
                else {
                    selectedTags.add(tag);
                }
                render();
            });
            tagBar.appendChild(tagButton);
        });
        list.replaceChildren();
        renderList(list, filtered, editingKey, showEditControls, showDeleteControls, (item) => {
            editingKey = getItemKey(item);
            render();
        }, () => {
            editingKey = null;
            render();
        }, (item, summary) => {
            repository.save({
                id: item.id,
                type: item.type,
                sourceUrl: item.sourceUrl,
                title: item.title,
                summary: summary.trim(),
                tags: item.tags,
            });
            editingKey = null;
            render();
        }, (item) => {
            repository.remove(item.type, item.id);
            if (editingKey === getItemKey(item)) {
                editingKey = null;
            }
            render();
        });
    };
    backButton.addEventListener("click", () => {
        cleanupFavoritesPage();
        window.history.pushState(window.history.state, "", "/");
    });
    gameTabButton.addEventListener("click", () => {
        repository.setActiveTab("game");
        selectedTags.clear();
        editingKey = null;
        render();
    });
    recordTabButton.addEventListener("click", () => {
        repository.setActiveTab("record");
        selectedTags.clear();
        editingKey = null;
        render();
    });
    toggleEditButton.addEventListener("click", () => {
        showEditControls = !showEditControls;
        if (!showEditControls) {
            editingKey = null;
        }
        render();
    });
    toggleDeleteButton.addEventListener("click", () => {
        showDeleteControls = !showDeleteControls;
        render();
    });
    searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value;
        render();
    });
    exportButton.addEventListener("click", () => {
        const documentState = repository.exportDocument();
        const blob = new Blob([JSON.stringify(documentState, null, 2)], {
            type: "application/json",
        });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = buildFavoritesExportFilename();
        if (!window.navigator.userAgent.includes("jsdom")) {
            link.click();
        }
        URL.revokeObjectURL(href);
    });
    importButton.addEventListener("click", () => {
        importInput.click();
    });
    importInput.addEventListener("change", async () => {
        const file = importInput.files?.[0];
        if (!file) {
            return;
        }
        try {
            const parsed = JSON.parse(await readFileText(file));
            const result = repository.importDocument(parsed);
            feedback.textContent = `新增 ${result.added} 合并 ${result.merged} 失败 ${result.invalid}`;
            render();
        }
        catch (_error) {
            feedback.textContent = "导入失败";
        }
    });
    mountTarget.replaceChildren(root);
    render();
    return true;
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

;// ./src/features/favorites/entry-editor.ts
function normalizeTag(raw) {
    return raw.trim();
}
function createFavoriteEditor(prefix) {
    const editor = document.createElement("div");
    editor.style.display = "none";
    editor.style.width = "100%";
    editor.style.flexDirection = "column";
    editor.style.gap = "8px";
    const summaryInput = document.createElement("textarea");
    summaryInput.id = `reviewer-${prefix}-favorite-summary`;
    summaryInput.placeholder = "输入摘要";
    summaryInput.rows = 2;
    summaryInput.className = "form-control form-control-sm";
    const tagList = document.createElement("div");
    tagList.className = "d-flex flex-wrap gap-2";
    const tagInput = document.createElement("input");
    tagInput.id = `reviewer-${prefix}-favorite-tag-input`;
    tagInput.type = "text";
    tagInput.placeholder = "输入标签后按回车";
    tagInput.className = "form-control form-control-sm";
    const saveButton = document.createElement("button");
    saveButton.id = `reviewer-${prefix}-favorite-save`;
    saveButton.type = "button";
    saveButton.textContent = "保存";
    saveButton.className = "btn btn-outline-secondary btn-sm align-self-start";
    let tags = [];
    const renderTags = () => {
        tagList.replaceChildren();
        tags.forEach((tag) => {
            const tagButton = document.createElement("button");
            tagButton.type = "button";
            tagButton.className = "btn btn-outline-secondary btn-sm";
            tagButton.textContent = `${tag} ×`;
            tagButton.addEventListener("click", () => {
                tags = tags.filter((item) => item !== tag);
                renderTags();
            });
            tagList.appendChild(tagButton);
        });
    };
    const commitTag = () => {
        const tag = normalizeTag(tagInput.value);
        if (!tag || tags.includes(tag)) {
            tagInput.value = "";
            return;
        }
        tags = [...tags, tag];
        tagInput.value = "";
        renderTags();
    };
    tagInput.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== ",") {
            return;
        }
        event.preventDefault();
        commitTag();
    });
    tagInput.addEventListener("blur", () => {
        commitTag();
    });
    editor.appendChild(summaryInput);
    editor.appendChild(tagList);
    editor.appendChild(tagInput);
    editor.appendChild(saveButton);
    return {
        editor,
        summaryInput,
        tagInput,
        saveButton,
        getTags: () => [...tags],
        setValue: (summary, nextTags) => {
            summaryInput.value = summary;
            tags = [...nextTags];
            tagInput.value = "";
            renderTags();
        },
    };
}

;// ./src/features/favorites/game-entry.ts


const game_entry_ROOT_ID = "reviewer-game-favorite";
const RETRY_DELAY_MS = 100;
let scheduledGameId = "";
function getGameId() {
    return new URL(window.location.href).searchParams.get("id");
}
function getGameTitle() {
    const heading = document.querySelector("h1");
    const headingText = heading?.textContent?.trim();
    if (headingText) {
        return headingText;
    }
    return document.title || "收藏对局";
}
function createRoot() {
    const root = document.createElement("div");
    root.id = game_entry_ROOT_ID;
    root.className = "reviewer-favorite-entry";
    root.style.margin = "12px 0";
    root.style.display = "flex";
    root.style.gap = "8px";
    root.style.alignItems = "center";
    root.style.flexWrap = "wrap";
    return root;
}
function findMountTarget() {
    const target = document.querySelector(".table-wrap, table.table, table");
    if (target instanceof HTMLElement) {
        return target;
    }
    return null;
}
function mountIntoTarget(repository, gameId, retryCount) {
    if (document.getElementById(game_entry_ROOT_ID)) {
        return;
    }
    const target = findMountTarget();
    if (!target) {
        if (retryCount > 0) {
            window.setTimeout(() => mountIntoTarget(repository, gameId, retryCount - 1), RETRY_DELAY_MS);
        }
        else {
            scheduledGameId = "";
        }
        return;
    }
    const root = createRoot();
    const button = document.createElement("button");
    button.id = "reviewer-game-favorite-button";
    button.type = "button";
    button.className = "btn btn-outline-secondary btn-sm";
    const { editor, saveButton, setValue, getTags, summaryInput } = createFavoriteEditor("game");
    const refreshState = () => {
        const favorite = repository.get("game", gameId);
        button.textContent = favorite ? "已收藏" : "加入收藏";
        setValue(favorite?.summary ?? "", favorite?.tags ?? []);
    };
    button.disabled = repository.isAvailable() === false;
    refreshState();
    button.addEventListener("click", () => {
        editor.style.display = editor.style.display === "none" ? "flex" : "none";
    });
    saveButton.addEventListener("click", () => {
        const saved = repository.save({
            id: gameId,
            type: "game",
            sourceUrl: window.location.href,
            title: getGameTitle(),
            summary: summaryInput.value.trim(),
            tags: getTags(),
        });
        if (!saved) {
            return;
        }
        editor.style.display = "none";
        refreshState();
    });
    root.appendChild(button);
    root.appendChild(editor);
    target.parentElement?.insertBefore(root, target);
    scheduledGameId = "";
}
function mountGameFavoriteEntry(repository = createFavoritesRepository()) {
    const gameId = getGameId();
    if (!gameId) {
        return false;
    }
    if (document.getElementById(game_entry_ROOT_ID) || scheduledGameId === gameId) {
        return false;
    }
    scheduledGameId = gameId;
    mountIntoTarget(repository, gameId, 20);
    return true;
}

// EXTERNAL MODULE: ./node_modules/tziakcha-fetcher/lib/record/index.js
var record = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/index.js");
var record_default = /*#__PURE__*/__webpack_require__.n(record);
;// ./src/shared/tziakcha-records/record.ts

const decompressZlibBase64 = (record_default()).decompress;
function normalizeOptions(options) {
    if (!options?.fetch || options.baseUrl) {
        return options;
    }
    return {
        ...options,
        fetch: (input, init) => {
            const normalizedInput = typeof input === "string" && input.startsWith("https://tziakcha.net/")
                ? input.slice("https://tziakcha.net".length)
                : input;
            return options.fetch(normalizedInput, init);
        },
    };
}
async function fetchTziakchaRecordStep(recordId, options) {
    return (await record_default().fetchStep(recordId, normalizeOptions(options)));
}

// EXTERNAL MODULE: ./node_modules/tziakcha-fetcher/lib/session/index.js
var lib_session = __webpack_require__("./node_modules/tziakcha-fetcher/lib/session/index.js");
var session_default = /*#__PURE__*/__webpack_require__.n(lib_session);
// EXTERNAL MODULE: ./node_modules/tziakcha-fetcher/lib/url/index.js
var url = __webpack_require__("./node_modules/tziakcha-fetcher/lib/url/index.js");
;// ./src/shared/tziakcha-records/url.ts
/* unused harmony import specifier */ var fetcherUrl;

function parseTziakchaSessionId(input) {
    const parsed = fetcherUrl.parseTziakchaSessionId(input);
    if (!parsed) {
        return null;
    }
    const trimmed = input.trim();
    if ((trimmed.includes("?") || trimmed.includes("/")) && parsed === trimmed) {
        try {
            const url = new URL(trimmed, "https://tziakcha.net");
            return url.searchParams.get("id");
        }
        catch {
            return null;
        }
    }
    return parsed;
}

;// ./src/shared/tziakcha-records/rounds.ts
/* unused harmony import specifier */ var fetcherSession;
/* unused harmony import specifier */ var rounds_parseTziakchaSessionId;


function rounds_normalizeOptions(options) {
    if (!options?.fetch || options.baseUrl) {
        return options;
    }
    return {
        ...options,
        fetch: (input, init) => {
            const normalizedInput = typeof input === "string" && input.startsWith("https://tziakcha.net/")
                ? input.slice("https://tziakcha.net".length)
                : input;
            return options.fetch(normalizedInput, init);
        },
    };
}
async function fetchTziakchaSessionRounds(inputUrlOrId, options) {
    const sessionId = rounds_parseTziakchaSessionId(inputUrlOrId);
    if (!sessionId) {
        throw new Error("无法从输入中解析雀渣对局 id");
    }
    const session = await fetcherSession.fetchRounds(sessionId, rounds_normalizeOptions(options));
    return {
        sessionId: session.sessionId,
        players: session.players.map((player) => ({
            name: player.name,
            id: typeof player.id === "string" || typeof player.id === "number"
                ? String(player.id)
                : undefined,
        })),
        records: session.records.map((record) => ({
            id: record.id,
            index: record.index,
            step: record.step,
        })),
        periods: session.periods,
        isFinished: session.isFinished,
    };
}

;// ./src/shared/tziakcha-records/session.ts

function session_normalizeOptions(options) {
    if (!options?.fetch || options.baseUrl) {
        return options;
    }
    return {
        ...options,
        fetch: (input, init) => {
            const normalizedInput = typeof input === "string" && input.startsWith("https://tziakcha.net/")
                ? input.slice("https://tziakcha.net".length)
                : input;
            const headers = init && "headers" in init && init.headers
                ? init.headers
                : undefined;
            const normalizedInit = headers && Object.keys(headers).length === 0
                ? { ...init, headers: undefined }
                : init;
            return options.fetch(normalizedInput, {
                ...normalizedInit,
            });
        },
    };
}
async function fetchTziakchaSession(sessionId, options) {
    const session = await session_default().fetch(sessionId, session_normalizeOptions(options));
    return {
        sessionId: session.sessionId,
        players: session.players.map((player) => ({
            name: player.name,
            id: typeof player.id === "string" || typeof player.id === "number"
                ? String(player.id)
                : undefined,
        })),
        records: session.records.map((record) => ({
            id: record.id,
            index: record.index,
        })),
        periods: session.periods,
        isFinished: session.isFinished,
    };
}

// EXTERNAL MODULE: ./node_modules/tziakcha-fetcher/lib/record/win.js
var win = __webpack_require__("./node_modules/tziakcha-fetcher/lib/record/win.js");
var win_default = /*#__PURE__*/__webpack_require__.n(win);
;// ./src/shared/tziakcha-records/win-info.ts
/* unused harmony import specifier */ var fetcherWin;

const FAN_NAMES = (win_default()).FAN_NAMES;
const TZIACKHA_SEAT_TO_PLAYER_ORDER = (win_default()).SEAT_PLAYER_ORDERS;
function parseTziakchaWinFanItems(rawT) {
    return fetcherWin.parseTziakchaWinFanItems(rawT);
}
function extractTziakchaRoundWinInfos(session) {
    return win_default().extractTziakchaRoundWinInfos(session);
}

;// ./src/shared/tziakcha-records/index.ts






;// ./src/shared/session-data.ts

async function fetchSessionData(sessionId) {
    const session = await fetchTziakchaSession(sessionId);
    return {
        players: session.players,
        records: session.records.map((record) => ({ id: record.id })),
        isFinished: session.isFinished,
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
 * 读取单局牌谱数据
 */
async function fetchStepData(recordId) {
    return fetchTziakchaRecordStep(recordId);
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
    const sessionPlayerNames = sessionData.players.map((player, index) => player.name || `Seat ${index}`);
    const steps = await Promise.all(sessionData.records.map((record) => fetchStepData(record.id)));
    return {
        sessionPlayerNames,
        steps,
        isFinished: sessionData.isFinished,
    };
}
function computeRoundOutcomes(sessionPlayerNames, steps, playerMetrics) {
    const session = {
        sessionId: "",
        players: sessionPlayerNames.map((name) => ({ name })),
        records: steps.map((step, index) => ({
            id: String(index),
            index,
            step,
        })),
        periods: steps.length,
        isFinished: true,
    };
    return extractTziakchaRoundWinInfos(session).map((round) => {
        round.winners.forEach((winner) => {
            if (playerMetrics && playerMetrics[winner.playerIndex]) {
                playerMetrics[winner.playerIndex].winRounds.push({
                    roundNo: round.roundNo,
                    totalFan: winner.totalFan,
                    fanItems: winner.fanItems,
                });
            }
        });
        return {
            roundNo: round.roundNo,
            winners: round.winners.map((winner) => ({
                playerName: winner.playerName,
                totalFan: winner.totalFan,
                fanItems: winner.fanItems,
            })),
            discarderNames: round.discarders.map((discarder) => discarder.playerName),
            selfDraw: round.selfDraw,
        };
    });
}
async function computeMetrics(sessionId) {
    const prepared = await prepareSessionData(sessionId);
    const { sessionPlayerNames, steps, isFinished } = prepared;
    if (!isFinished) {
        throw new Error(SESSION_NOT_FINISHED_ERROR);
    }
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
    mountGameFavoriteEntry();
    upsertLoadingRows("计算中...");
    const preparedPromise = prepareSessionData(sessionId);
    void preparedPromise
        .then((prepared) => {
        const rounds = computeRoundOutcomes(prepared.sessionPlayerNames, prepared.steps);
        infoLog("Game session prepared", {
            sessionId,
            isFinished: prepared.isFinished,
            recordCount: prepared.steps.length,
            roundsWithOutcomeCount: rounds.length,
        });
        installRoundToggleButtons(rounds);
    })
        .catch((error) => {
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

;// ./src/features/favorites/record-entry.ts



const record_entry_ROOT_ID = "reviewer-record-favorite";
const record_entry_RETRY_DELAY_MS = 100;
function getRecordId() {
    return new URL(w.location.href).searchParams.get("id");
}
function getRecordTitle() {
    const gameAnchor = document.querySelector("#ti a");
    const gameTitle = gameAnchor?.textContent?.trim();
    if (gameTitle) {
        return gameTitle;
    }
    const titleEl = document.querySelector("title");
    const titleText = titleEl?.textContent?.trim();
    if (titleText) {
        return titleText;
    }
    return document.title || "收藏小局";
}
function record_entry_createRoot() {
    const root = document.createElement("div");
    root.id = record_entry_ROOT_ID;
    root.className = "ctrl-e";
    root.style.display = "flex";
    root.style.gap = "8px";
    root.style.alignItems = "center";
    root.style.flexWrap = "wrap";
    return root;
}
function mountIntoCtrl(repository, recordId, retryCount) {
    if (document.getElementById(record_entry_ROOT_ID)) {
        return;
    }
    const ctrl = document.getElementById("ctrl");
    if (!ctrl) {
        if (retryCount > 0) {
            w.setTimeout(() => mountIntoCtrl(repository, recordId, retryCount - 1), record_entry_RETRY_DELAY_MS);
        }
        return;
    }
    const root = record_entry_createRoot();
    const button = document.createElement("button");
    button.id = "reviewer-record-favorite-button";
    button.type = "button";
    button.className = "btn btn-outline-secondary btn-sm";
    const { editor, saveButton, setValue, getTags, summaryInput } = createFavoriteEditor("record");
    const refreshState = () => {
        const favorite = repository.get("record", recordId);
        button.textContent = favorite ? "已收藏" : "加入收藏";
        setValue(favorite?.summary ?? "", favorite?.tags ?? []);
    };
    button.disabled = !repository.isAvailable();
    refreshState();
    button.addEventListener("click", () => {
        editor.style.display = editor.style.display === "none" ? "flex" : "none";
    });
    saveButton.addEventListener("click", () => {
        const saved = repository.save({
            id: recordId,
            type: "record",
            sourceUrl: w.location.href,
            title: getRecordTitle(),
            summary: summaryInput.value.trim(),
            tags: getTags(),
        });
        if (!saved) {
            return;
        }
        editor.style.display = "none";
        refreshState();
    });
    root.appendChild(button);
    root.appendChild(editor);
    ctrl.appendChild(root);
}
function mountRecordFavoriteEntry(repository = createFavoritesRepository()) {
    const recordId = getRecordId();
    if (!recordId) {
        return false;
    }
    mountIntoCtrl(repository, recordId, 10);
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
function isFavoritesPage() {
    return w.location.hash === FAVORITES_HASH;
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



const PLAY_PREFIX = "Play ";
const CALL_PREFIXES = ["Chi", "Peng", "Gang", "BuGang"];
const BAR_MAX_HEIGHT = 50;
const BAR_MIN_HEIGHT = 6;
const PLAY_SOFTMAX_TEMPERATURE = 1.6;
const RIVER_TILE_SELECTORS = [
    ".pool .tl",
    ".river .tl",
    ".discard .tl",
    ".show .tl",
    ".paihe .tl",
    ".sutehai .tl",
    ".desk-river .tl",
    "[class*='river'] .tl",
    "[class*='discard'] .tl",
    "[class*='show'] .tl",
    "[class*='paihe'] .tl",
    "[class*='sutehai'] .tl",
    "[class*='pool'] .tl",
];
const NON_RIVER_TILE_EXCLUSION_SELECTORS = [
    ".hand",
    ".furo",
    ".fulou",
    ".meld",
    ".naki",
    ".wall",
    ".rinshan",
    ".dora",
    ".dead-wall",
    ".review-container",
    "#review",
    "#res",
    "#fwin",
];
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
function softmax(weights, temperature = 1) {
    if (weights.length === 0) {
        return [];
    }
    const maxWeight = Math.max(...weights);
    const expWeights = weights.map((weight) => Math.exp((weight - maxWeight) / temperature));
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
function isPlayCandidate(act) {
    return act.trim().startsWith(PLAY_PREFIX);
}
function isCallCandidate(act) {
    const trimmed = act.trim();
    return CALL_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}
function getTileIndexFromPlayAction(act) {
    return render_bz2tc(act.trim().slice(PLAY_PREFIX.length));
}
function toBarHeight(probability) {
    const eased = Math.sqrt(Math.max(0, probability));
    return BAR_MIN_HEIGHT + eased * (BAR_MAX_HEIGHT - BAR_MIN_HEIGHT);
}
function getPlayCandidates(candidates) {
    return candidates.filter(([, act]) => isPlayCandidate(act));
}
function isVisibleTile(tileEl) {
    let current = tileEl;
    while (current) {
        if (current instanceof HTMLElement && current.hidden) {
            return false;
        }
        const style = window.getComputedStyle(current);
        if (style.display === "none" || style.visibility === "hidden") {
            return false;
        }
        current = current.parentElement;
    }
    return true;
}
function findLastRiverTile() {
    for (const selector of RIVER_TILE_SELECTORS) {
        const tiles = Array.from(document.querySelectorAll(selector)).filter(isVisibleTile);
        const lastTile = tiles.at(-1);
        if (lastTile instanceof HTMLElement) {
            return lastTile;
        }
    }
    const fallbackTiles = Array.from(document.querySelectorAll(".tl")).filter((tileEl) => isVisibleTile(tileEl) &&
        !NON_RIVER_TILE_EXCLUSION_SELECTORS.some((selector) => tileEl.closest(selector)));
    const lastTile = fallbackTiles.at(-1);
    return lastTile instanceof HTMLElement ? lastTile : null;
}
function serializeTile(tileEl) {
    const htmlTile = tileEl;
    return [
        htmlTile.dataset.val ?? "",
        htmlTile.className,
        htmlTile.style.left,
        htmlTile.style.top,
    ].join("|");
}
function capturePoolSnapshot() {
    return Array.from(document.querySelectorAll(".pool")).map((poolEl) => ({
        tiles: Array.from(poolEl.querySelectorAll(".tl"))
            .filter(isVisibleTile)
            .map(serializeTile),
    }));
}
function findChangedPoolLastTile(previousSnapshot) {
    const pools = Array.from(document.querySelectorAll(".pool"));
    if (pools.length === 0 || !previousSnapshot?.length) {
        return null;
    }
    let changedPoolIndex = -1;
    let bestScore = 0;
    pools.forEach((poolEl, index) => {
        const currentTiles = Array.from(poolEl.querySelectorAll(".tl"))
            .filter(isVisibleTile)
            .map(serializeTile);
        const previousTiles = previousSnapshot[index]?.tiles ?? [];
        if (currentTiles.length < previousTiles.length) {
            return;
        }
        let firstDiffIndex = -1;
        const sharedLength = Math.min(currentTiles.length, previousTiles.length);
        for (let tileIndex = 0; tileIndex < sharedLength; tileIndex += 1) {
            if (currentTiles[tileIndex] !== previousTiles[tileIndex]) {
                firstDiffIndex = tileIndex;
                break;
            }
        }
        if (firstDiffIndex === -1 && currentTiles.length === previousTiles.length) {
            return;
        }
        const score = firstDiffIndex === -1
            ? currentTiles.length - previousTiles.length
            : currentTiles.length - firstDiffIndex;
        if (score > bestScore) {
            changedPoolIndex = index;
            bestScore = score;
        }
    });
    if (changedPoolIndex < 0) {
        return null;
    }
    const targetPool = pools[changedPoolIndex];
    const visibleTiles = Array.from(targetPool.querySelectorAll(".tl")).filter(isVisibleTile);
    const lastTile = visibleTiles.at(-1);
    return lastTile instanceof HTMLElement ? lastTile : null;
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
    const playCandidates = getPlayCandidates(candidates);
    if (playCandidates.length === 0) {
        return;
    }
    const probs = softmax(playCandidates.map(([weight]) => weight), PLAY_SOFTMAX_TEMPERATURE);
    playCandidates.forEach(([, act], idx) => {
        const tileIndex = getTileIndexFromPlayAction(act);
        if (tileIndex >= 0 && tileIndex < 136) {
            const nextProb = probs[idx] ?? 0;
            const prevProb = tileWeightMap.get(tileIndex) ?? 0;
            tileWeightMap.set(tileIndex, Math.max(prevProb, nextProb));
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
        bar.style.height = `${toBarHeight(prob).toFixed(2)}px`;
        htmlTile.appendChild(bar);
    });
}
function highlightHandTile(tileIndex) {
    const tz = getTZInstance();
    if (!tz || typeof tz.stp !== "number" || !tz.stat?.[tz.stp]) {
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
            infoLog(`Highlighted hand tile DOM for player ${playerIndex}: ${tileIndex}`);
        }
    });
}
function highlightFirstCandidate(candidates, previousPoolSnapshot) {
    const first = candidates[0];
    if (!first?.[1]) {
        return;
    }
    const act = first[1].trim();
    if (isPlayCandidate(act)) {
        const tileIndex = getTileIndexFromPlayAction(act);
        if (tileIndex >= 0 && tileIndex < 136) {
            highlightHandTile(tileIndex);
        }
        return;
    }
    if (!isCallCandidate(act)) {
        return;
    }
    const riverTile = findChangedPoolLastTile(previousPoolSnapshot) ?? findLastRiverTile();
    if (!riverTile) {
        return;
    }
    riverTile.classList.add("highlight-first-tile");
    infoLog(`Highlighted latest river tile for action: ${act}`);
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
    const previousPoolSnapshot = runtime.getLastPoolSnapshot();
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
    const hasPlay = candidates.some(([, act]) => isPlayCandidate(act));
    if (hasPlay && tz && typeof tz.stp === "number") {
        const currentStat = tz.stat?.[tz.stp];
        const playerIndex = currentStat?.k ?? 0;
        showWeightVisualization(candidates, playerIndex, runtime.options);
    }
    if (runtime.options.highlightFirstTile) {
        highlightFirstCandidate(candidates, previousPoolSnapshot);
    }
    runtime.setLastPoolSnapshot(capturePoolSnapshot());
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
    let lastPoolSnapshot = null;
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
        getLastPoolSnapshot: () => lastPoolSnapshot,
        setLastPoolSnapshot: (value) => {
            lastPoolSnapshot = value;
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
    w.setTimeout(() => mountRecordFavoriteEntry(), 550);
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
    const analysisHost = document.getElementById("reviewer-tech-analysis-zumgze");
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
        if (analysisHost) {
            analysisHost.appendChild(wrap);
        }
        else {
            const basicHeading = basicTable.previousElementSibling;
            if (basicHeading && basicHeading.tagName === "H4") {
                basicHeading.parentNode?.insertBefore(wrap, basicHeading);
            }
            else {
                basicTable.parentNode?.insertBefore(wrap, basicTable);
            }
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

;// ./src/features/game/win-info.ts


;// ./src/features/tech/analysis/compare-calc.ts


const Z_95 = 1.96;
const SKIP_FAN_INDEX = new Set([0, 83]);
function toCount(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
        return 0;
    }
    return num;
}
function getFanTotal(fan) {
    return toCount(fan.c0) + toCount(fan.d0);
}
function getFanTotalCount(fan) {
    return getFanTotal(fan);
}
function getFanCount(fan, idx) {
    return toCount(fan[`c${idx}`]) + toCount(fan[`d${idx}`]);
}
function safeRate(count, total) {
    if (total <= 0) {
        return 0;
    }
    return count / total;
}
function fanPointByIndex(index) {
    if (index >= 1 && index <= 7)
        return 88;
    if (index >= 8 && index <= 13)
        return 64;
    if (index >= 14 && index <= 15)
        return 48;
    if (index >= 16 && index <= 19)
        return 32;
    if (index >= 20 && index <= 28)
        return 24;
    if (index >= 29 && index <= 35)
        return 16;
    if (index >= 36 && index <= 40)
        return 12;
    if (index >= 41 && index <= 49)
        return 8;
    if (index >= 50 && index <= 56)
        return 6;
    if (index >= 57 && index <= 60)
        return 4;
    if (index >= 61 && index <= 70)
        return 2;
    if (index >= 71 && index <= 82)
        return 1;
    if (index === 84)
        return 5;
    if (index >= 85 && index <= 88)
        return 8;
    return 0;
}
function inFanGroup(index, group) {
    const point = fanPointByIndex(index);
    if (group === "small") {
        return point <= 2;
    }
    if (group === "main") {
        return point >= 4 && point <= 32;
    }
    if (group === "high") {
        return point >= 48;
    }
    return true;
}
function isOneOrTwoFan(index) {
    const point = fanPointByIndex(index);
    return point === 1 || point === 2;
}
function buildFanDiffRows(fanA = {}, fanB = {}) {
    const totalA = getFanTotal(fanA);
    const totalB = getFanTotal(fanB);
    const rows = [];
    for (let fanIndex = 0; fanIndex < FAN_NAMES.length; fanIndex += 1) {
        if (SKIP_FAN_INDEX.has(fanIndex)) {
            continue;
        }
        const countA = getFanCount(fanA, fanIndex);
        const countB = getFanCount(fanB, fanIndex);
        if (countA === 0 && countB === 0) {
            continue;
        }
        const pA = safeRate(countA, totalA);
        const pB = safeRate(countB, totalB);
        rows.push({
            fanIndex,
            fanName: FAN_NAMES[fanIndex] || `番种${fanIndex}`,
            rateA: pA * 100,
            rateB: pB * 100,
            diffPct: (pA - pB) * 100,
        });
    }
    return rows;
}
function filterFanDiffRowsByGroup(rows, group) {
    return rows.filter((row) => inFanGroup(row.fanIndex, group));
}
function splitTopFanDiffRows(rows, topN) {
    const limit = Number.isFinite(topN) ? Math.max(1, Math.floor(topN)) : 10;
    const positive = [...rows]
        .filter((row) => row.diffPct > 0)
        .sort((left, right) => right.diffPct - left.diffPct)
        .slice(0, limit);
    const negative = [...rows]
        .filter((row) => row.diffPct < 0)
        .sort((left, right) => left.diffPct - right.diffPct)
        .slice(0, limit);
    return { positive, negative };
}
function computeMeanAbsDiff(rows) {
    if (!rows.length) {
        return 0;
    }
    const sumAbs = rows.reduce((sum, row) => sum + Math.abs(row.diffPct), 0);
    return sumAbs / rows.length;
}
function computeSimilarityScore(rows, totalA, totalB) {
    const usedRows = rows.filter((row) => !isOneOrTwoFan(row.fanIndex));
    if (!usedRows.length) {
        return {
            score: 100,
            ciLower: 100,
            ciUpper: 100,
            distance: 0,
        };
    }
    const dProb = usedRows.reduce((sum, row) => sum + Math.abs(row.rateA / 100 - row.rateB / 100), 0);
    const nA = Math.max(1, totalA);
    const nB = Math.max(1, totalB);
    const varD = usedRows.reduce((sum, row) => {
        const pA = row.rateA / 100;
        const pB = row.rateB / 100;
        return sum + (pA * (1 - pA)) / nA + (pB * (1 - pB)) / nB;
    }, 0);
    const seProb = Math.sqrt(Math.max(0, varD));
    const z95 = 1.96;
    const ciLowerProb = Math.max(0, dProb - z95 * seProb);
    const ciUpperProb = dProb + z95 * seProb;
    const score = chagaScoreFromDistance(dProb * 100);
    const scoreFromLower = chagaScoreFromDistance(ciLowerProb * 100);
    const scoreFromUpper = chagaScoreFromDistance(ciUpperProb * 100);
    return {
        score,
        ciLower: Math.min(scoreFromLower, scoreFromUpper),
        ciUpper: Math.max(scoreFromLower, scoreFromUpper),
        distance: dProb * 100,
    };
}
function computeOverallStdCi(rows) {
    const n = rows.length;
    if (n < 2) {
        return { std: 0, ciLower: 0, ciUpper: 0, sampleSize: n };
    }
    const mean = rows.reduce((sum, row) => sum + row.diffPct, 0) / n;
    const variance = rows.reduce((sum, row) => sum + (row.diffPct - mean) ** 2, 0) / (n - 1);
    const std = Math.sqrt(Math.max(0, variance));
    // Approximate standard error for standard deviation.
    const seStd = std / Math.sqrt(2 * (n - 1));
    const ciLower = Math.max(0, std - Z_95 * seStd);
    const ciUpper = std + Z_95 * seStd;
    return { std, ciLower, ciUpper, sampleSize: n };
}
function toBasic(data) {
    if (!data || typeof data !== "object") {
        return {};
    }
    return data;
}
function computeMetricDiffRows(specs, dataA, dataB) {
    const basicA = toBasic(dataA?.basic);
    const basicB = toBasic(dataB?.basic);
    const wholeA = toBasic(dataA?.whole);
    const wholeB = toBasic(dataB?.whole);
    return specs.map((spec) => {
        const valueA = Number(spec.calc(basicA, wholeA)) || 0;
        const valueB = Number(spec.calc(basicB, wholeB)) || 0;
        return {
            key: spec.key,
            label: spec.label,
            valueA,
            valueB,
            diff: valueA - valueB,
        };
    });
}

// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/features/tech/analysis/index.less
var analysis = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/features/tech/analysis/index.less");
;// ./src/features/tech/analysis/index.less

      
      
      
      
      
      
      
      
      

var analysis_options = {};

analysis_options.styleTagTransform = (styleTagTransform_default());
analysis_options.setAttributes = (setAttributesWithoutAttributes_default());
analysis_options.insert = insertBySelector_default().bind(null, "head");
analysis_options.domAPI = (styleDomAPI_default());
analysis_options.insertStyleElement = (insertStyleElement_default());

var analysis_update = injectStylesIntoStyleTag_default()(analysis/* default */.A, analysis_options);




       /* harmony default export */ const tech_analysis = (analysis/* default */.A && analysis/* default */.A.locals ? analysis/* default */.A.locals : undefined);

;// ./src/features/tech/analysis/index.ts




const ANALYSIS_PANEL_ID = "reviewer-tech-analysis-panel";
const TAB_ANALYSIS_ID = "reviewer-tech-tab-analysis";
const FAN_GROUP_TAB_ID = "reviewer-style-fan-group-tabs";
const FAN_FILTER_RARE_BTN_ID = "reviewer-style-fan-filter-rare";
const FAN_FILTER_LARGE_DIFF_BTN_ID = "reviewer-style-fan-filter-large-diff";
const FAN_SORT_MODE_BTN_ID = "reviewer-style-fan-sort-mode";
const SELF_PLAYER_SENTINEL = "__self__";
let initialized = false;
let playerAId = "";
let playerBId = "";
let fanRowsAll = [];
let currentFanGroup = "all";
let playerAName = "";
let playerBName = "";
let hideRareFans = true;
let onlyLargeDiffFans = false;
let sortByAbsDiff = false;
function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}
function safeDiv(numerator, denominator) {
    if (denominator <= 0) {
        return 0;
    }
    return numerator / denominator;
}
function parseArray(source, key, n) {
    const out = [];
    for (let i = 0; i < n; i += 1) {
        out.push(toNumber(source[`${key}${i}`]));
    }
    return out;
}
function weightedSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i += 1) {
        sum += arr[i] * i;
    }
    return sum;
}
function countSum(arr) {
    return arr.reduce((sum, item) => sum + item, 0);
}
function calcWinStats(data) {
    const basic = data.basic || {};
    const claim = toNumber(basic.claim);
    const draw = toNumber(basic.draw);
    const shoot = toNumber(basic.shoot);
    const splash = toNumber(basic.splash);
    const watch = toNumber(basic.watch);
    const tie = toNumber(basic.tie);
    const lose = toNumber(basic.lose);
    const fault = toNumber(basic.fault);
    const win = claim + draw;
    const total = win + shoot + splash + watch + tie;
    return {
        winRate: safeDiv(win, total) * 100,
        drawRate: safeDiv(draw, win) * 100,
        shootRate: safeDiv(shoot, total) * 100,
        splashRate: safeDiv(splash, total) * 100,
        watchRate: safeDiv(watch, total) * 100,
        loseInShootRate: safeDiv(lose, shoot) * 100,
        faultRate: safeDiv(fault, total) * 100,
        tieRate: safeDiv(tie, total) * 100,
    };
}
function calcCycleStats(data) {
    const basic = data.basic || {};
    const cycle = data.cycle || {};
    const claim = toNumber(basic.claim);
    const draw = toNumber(basic.draw);
    const shoot = toNumber(basic.shoot);
    const splash = toNumber(basic.splash);
    const c = parseArray(cycle, "c", 35);
    const d = parseArray(cycle, "d", 35);
    const s = parseArray(cycle, "s", 35);
    const p = parseArray(cycle, "p", 35);
    const l1 = [];
    const l2 = [];
    const l3 = [];
    const l4 = [];
    for (let i = 0; i < 35; i += 1) {
        l1.push(toNumber(cycle[`l${i}_1`]));
        l2.push(toNumber(cycle[`l${i}_2`]));
        l3.push(toNumber(cycle[`l${i}_3`]));
        l4.push(toNumber(cycle[`l${i}_4`]));
    }
    const win = claim + draw;
    const listenArr = parseArray(cycle, "a", 35);
    return {
        avgWinCycle: safeDiv(weightedSum(c) + weightedSum(d) + win, win),
        avgListenCycle: safeDiv(weightedSum(listenArr), countSum(listenArr)),
        avgClaimCycle: safeDiv(weightedSum(c) + claim, claim),
        avgDrawCycle: safeDiv(weightedSum(d) + draw, draw),
        avgShootCycle: safeDiv(weightedSum(s) + shoot, shoot),
        avgSplashCycle: safeDiv(weightedSum(p) + splash, splash),
        avgOpen1Cycle: safeDiv(weightedSum(l1), countSum(l1)),
        avgOpen2Cycle: safeDiv(weightedSum(l2), countSum(l2)),
        avgOpen3Cycle: safeDiv(weightedSum(l3), countSum(l3)),
        avgOpen4Cycle: safeDiv(weightedSum(l4), countSum(l4)),
    };
}
function calcPointStats(data) {
    const basic = data.basic || {};
    const point = data.point || {};
    const claim = toNumber(basic.claim);
    const draw = toNumber(basic.draw);
    const shoot = toNumber(basic.shoot);
    const splash = toNumber(basic.splash);
    const watch = toNumber(basic.watch);
    const c = parseArray(point, "c", 333);
    const d = parseArray(point, "d", 333);
    const s = parseArray(point, "s", 333);
    const p = parseArray(point, "p", 333);
    const wv = parseArray(point, "w", 333);
    const win = claim + draw;
    return {
        avgWinFan: safeDiv(weightedSum(c) + weightedSum(d), win),
        avgClaimFan: safeDiv(weightedSum(c), claim),
        avgDrawFan: safeDiv(weightedSum(d), draw),
        avgShootFan: safeDiv(weightedSum(s), shoot),
        avgSplashFan: safeDiv(weightedSum(p), splash),
        avgWatchFan: safeDiv(weightedSum(wv), watch),
    };
}
const WIN_METRICS = [
    { key: "winRate", label: "和牌率", calc: (basic) => toNumber(basic.winRate) },
    {
        key: "drawRate",
        label: "自摸率",
        calc: (basic) => toNumber(basic.drawRate),
    },
    {
        key: "shootRate",
        label: "点炮率",
        calc: (basic) => toNumber(basic.shootRate),
    },
    {
        key: "splashRate",
        label: "被摸率",
        calc: (basic) => toNumber(basic.splashRate),
    },
    {
        key: "watchRate",
        label: "听牌率",
        calc: (basic) => toNumber(basic.watchRate),
    },
    {
        key: "loseInShootRate",
        label: "点炮听牌率",
        calc: (basic) => toNumber(basic.loseInShootRate),
    },
    {
        key: "faultRate",
        label: "错和率",
        calc: (basic) => toNumber(basic.faultRate),
    },
    { key: "tieRate", label: "荒庄率", calc: (basic) => toNumber(basic.tieRate) },
];
const CYCLE_METRICS = [
    {
        key: "avgWinCycle",
        label: "和牌巡数",
        calc: (basic) => toNumber(basic.avgWinCycle),
    },
    {
        key: "avgListenCycle",
        label: "听牌巡数",
        calc: (basic) => toNumber(basic.avgListenCycle),
    },
    {
        key: "avgClaimCycle",
        label: "点和巡数",
        calc: (basic) => toNumber(basic.avgClaimCycle),
    },
    {
        key: "avgDrawCycle",
        label: "自摸巡数",
        calc: (basic) => toNumber(basic.avgDrawCycle),
    },
    {
        key: "avgShootCycle",
        label: "点炮巡数",
        calc: (basic) => toNumber(basic.avgShootCycle),
    },
    {
        key: "avgSplashCycle",
        label: "被摸巡数",
        calc: (basic) => toNumber(basic.avgSplashCycle),
    },
    {
        key: "avgOpen1Cycle",
        label: "鸣第一组巡数",
        calc: (basic) => toNumber(basic.avgOpen1Cycle),
    },
    {
        key: "avgOpen2Cycle",
        label: "鸣第二组巡数",
        calc: (basic) => toNumber(basic.avgOpen2Cycle),
    },
    {
        key: "avgOpen3Cycle",
        label: "鸣第三组巡数",
        calc: (basic) => toNumber(basic.avgOpen3Cycle),
    },
    {
        key: "avgOpen4Cycle",
        label: "鸣第四组巡数",
        calc: (basic) => toNumber(basic.avgOpen4Cycle),
    },
];
const POINT_METRICS = [
    {
        key: "avgWinFan",
        label: "平均和牌番",
        calc: (basic) => toNumber(basic.avgWinFan),
    },
    {
        key: "avgClaimFan",
        label: "平均点和番",
        calc: (basic) => toNumber(basic.avgClaimFan),
    },
    {
        key: "avgDrawFan",
        label: "平均自摸番",
        calc: (basic) => toNumber(basic.avgDrawFan),
    },
    {
        key: "avgShootFan",
        label: "平均点炮番",
        calc: (basic) => toNumber(basic.avgShootFan),
    },
    {
        key: "avgSplashFan",
        label: "平均被摸番",
        calc: (basic) => toNumber(basic.avgSplashFan),
    },
    {
        key: "avgWatchFan",
        label: "平均见证番",
        calc: (basic) => toNumber(basic.avgWatchFan),
    },
];
function analysis_escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
function getSelfIdFromQuery() {
    const params = new URLSearchParams(w.location.search);
    return params.get("id") || "";
}
function getContainer() {
    const basic = document.getElementById("basic");
    return basic?.parentElement || null;
}
function hideLegacyTools(container) {
    const ids = [
        "opt",
        "result",
        "rst_alt",
        "cln_alt",
        "reset_alt",
        "clean_alt",
        "rst",
        "cln",
        "dorst",
        "docln",
        "reset",
    ];
    ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) {
            return;
        }
        el.innerHTML = "";
        el.style.display = "none";
        el.dataset.forceHidden = "1";
    });
    const clearByHeading = (keyword) => {
        Array.from(container.querySelectorAll("h4")).forEach((heading) => {
            const text = (heading.textContent || "").replace(/\s+/g, "");
            if (!text.includes(keyword)) {
                return;
            }
            let node = heading.parentElement;
            while (node && node !== container) {
                node.innerHTML = "";
                node.style.display = "none";
                node.dataset.forceHidden = "1";
                node = node.parentElement;
            }
        });
    };
    clearByHeading("危险操作");
    clearByHeading("查看");
    Array.from(container.querySelectorAll("small")).forEach((small) => {
        const text = (small.textContent || "").replace(/\s+/g, "");
        if (text.includes("重置") ||
            text.includes("清空") ||
            text.includes("清除操作")) {
            const holder = (small.parentElement || small);
            holder.innerHTML = "";
            holder.style.display = "none";
            holder.dataset.forceHidden = "1";
        }
    });
}
function moveNotesToBottom(container) {
    const panel = document.getElementById(ANALYSIS_PANEL_ID);
    const noteBlocks = Array.from(container.querySelectorAll("div > small.fw-light"))
        .map((small) => small.parentElement)
        .filter((node) => Boolean(node))
        .filter((node) => !(panel && panel.contains(node)));
    noteBlocks.forEach((node) => {
        container.appendChild(node);
    });
}
function getDataAreaNodes() {
    const container = getContainer();
    if (!container) {
        return [];
    }
    const panel = document.getElementById(ANALYSIS_PANEL_ID);
    const topTabs = container.querySelector("ul.nav.nav-tabs");
    if (!topTabs) {
        return [];
    }
    const nodes = [];
    let cursor = topTabs.nextElementSibling;
    while (cursor) {
        if (cursor !== panel) {
            nodes.push(cursor);
        }
        cursor = cursor.nextElementSibling;
    }
    return nodes;
}
function setDataSectionVisible(visible) {
    const nodes = getDataAreaNodes();
    nodes.forEach((node) => {
        if (node.dataset.forceHidden === "1") {
            return;
        }
        node.style.display = visible ? "" : "none";
    });
}
function ensureAnalysisPanel() {
    let panel = document.getElementById(ANALYSIS_PANEL_ID);
    if (panel) {
        return panel;
    }
    const container = getContainer();
    if (!container) {
        return null;
    }
    panel = document.createElement("div");
    panel.id = ANALYSIS_PANEL_ID;
    panel.style.display = "none";
    panel.innerHTML = `
    <section id="reviewer-tech-analysis-zumgze"></section>
    <section id="reviewer-tech-style-wrap" class="reviewer-tech-style-wrap">
      <h4 style="margin-top:2em;">风格</h4>
      <div class="reviewer-style-players">
        <div class="reviewer-style-player-card">
          <div class="reviewer-style-player-title">玩家A</div>
          <input id="reviewer-style-player-a-keyword" class="form-control form-control-sm" placeholder="输入昵称关键词" />
          <select id="reviewer-style-player-a-select" class="form-select form-select-sm"><option value="">--请选择--</option></select>
          <div id="reviewer-style-player-a-name" class="reviewer-style-picked text-muted">未选择</div>
        </div>
        <div class="reviewer-style-player-card">
          <div class="reviewer-style-player-title">玩家B</div>
          <input id="reviewer-style-player-b-keyword" class="form-control form-control-sm" placeholder="输入昵称关键词" />
          <select id="reviewer-style-player-b-select" class="form-select form-select-sm"><option value="">--请选择--</option></select>
          <div id="reviewer-style-player-b-name" class="reviewer-style-picked text-muted">未选择</div>
        </div>
      </div>
      <div class="reviewer-style-toolbar">
        <button id="reviewer-style-compare-run" type="button" class="btn btn-outline-primary btn-sm">开始比较</button>
        <span id="reviewer-style-status" class="text-muted"></span>
      </div>
      <div class="reviewer-style-summary text-dark">
        <span id="reviewer-style-score-label" class="reviewer-style-score-trigger" title="由 CHAGA 同源算法映射得到，用于评估两位玩家打法相似程度（仅供参考）">相似度</span>：<span id="reviewer-style-score">0.00 / 100</span>
        <div id="reviewer-style-overall-ci" class="reviewer-style-score-ci">95% 置信区间：0.00 / 100 ～ 0.00 / 100</div>
      </div>

      <h5 class="reviewer-style-subtitle">和牌相关</h5>
      <table class="table table-hover table-sm reviewer-style-table">
        <thead class="table-dark">
          <tr>
            <th>指标</th>
            <th class="text-end reviewer-style-head-a">A</th>
            <th class="text-center">差值</th>
            <th class="text-start reviewer-style-head-b">B</th>
          </tr>
        </thead>
        <tbody id="reviewer-style-win-tbody"></tbody>
      </table>

      <h5 class="reviewer-style-subtitle">巡数相关</h5>
      <table class="table table-hover table-sm reviewer-style-table">
        <thead class="table-dark">
          <tr>
            <th>指标</th>
            <th class="text-end reviewer-style-head-a">A</th>
            <th class="text-center">差值</th>
            <th class="text-start reviewer-style-head-b">B</th>
          </tr>
        </thead>
        <tbody id="reviewer-style-cycle-tbody"></tbody>
      </table>

      <h5 class="reviewer-style-subtitle">番数相关</h5>
      <table class="table table-hover table-sm reviewer-style-table">
        <thead class="table-dark">
          <tr>
            <th>指标</th>
            <th class="text-end reviewer-style-head-a">A</th>
            <th class="text-center">差值</th>
            <th class="text-start reviewer-style-head-b">B</th>
          </tr>
        </thead>
        <tbody id="reviewer-style-point-tbody"></tbody>
      </table>

      <h5 class="reviewer-style-subtitle">番种比较</h5>
      <div class="reviewer-style-fan-actions">
        <button id="${FAN_FILTER_RARE_BTN_ID}" type="button" class="reviewer-style-toggle-btn is-active">不显示稀有番种</button>
        <button id="${FAN_FILTER_LARGE_DIFF_BTN_ID}" type="button" class="reviewer-style-toggle-btn">仅显示大差异番种</button>
        <button id="${FAN_SORT_MODE_BTN_ID}" type="button" class="reviewer-style-toggle-btn">排序：差值</button>
      </div>
      <ul class="nav nav-tabs reviewer-style-subtabs" id="${FAN_GROUP_TAB_ID}">
        <li class="nav-item"><a class="nav-link active" href="javascript:void(0)" data-fan-group="all">全部番种</a></li>
        <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-fan-group="small">小番(<=2)</a></li>
        <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-fan-group="main">主番(4~32)</a></li>
        <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-fan-group="high">大牌(>=48)</a></li>
      </ul>
      <div class="reviewer-style-fan-scroll">
        <table class="table table-hover table-sm reviewer-style-table">
          <thead class="table-dark">
            <tr>
              <th>番种</th>
              <th class="text-end reviewer-style-head-a">A</th>
              <th class="text-center">差值</th>
              <th class="text-start reviewer-style-head-b">B</th>
            </tr>
          </thead>
          <tbody id="reviewer-style-fan-diff-tbody"></tbody>
        </table>
      </div>
    </section>
  `;
    container.appendChild(panel);
    return panel;
}
function ensureAnalysisTab() {
    const nav = document.querySelector("ul.nav.nav-tabs");
    if (!nav) {
        return null;
    }
    const existing = document.getElementById(TAB_ANALYSIS_ID);
    if (existing) {
        return existing;
    }
    const li = document.createElement("li");
    li.className = "nav-item";
    const link = document.createElement("a");
    link.id = TAB_ANALYSIS_ID;
    link.className = "nav-link";
    link.href = "javascript:void(0)";
    link.textContent = "分析";
    li.appendChild(link);
    nav.appendChild(li);
    return link;
}
function activateTab(link) {
    const nav = link.closest("ul");
    if (!nav) {
        return;
    }
    Array.from(nav.querySelectorAll(".nav-link")).forEach((item) => {
        item.classList.remove("active");
    });
    link.classList.add("active");
}
function bindTabToggle() {
    const analysisTab = document.getElementById(TAB_ANALYSIS_ID);
    const panel = document.getElementById(ANALYSIS_PANEL_ID);
    if (!analysisTab || !panel || analysisTab.dataset.bound) {
        return;
    }
    analysisTab.dataset.bound = "1";
    analysisTab.addEventListener("click", () => {
        panel.style.display = "";
        setDataSectionVisible(false);
        activateTab(analysisTab);
    });
    const nav = analysisTab.closest("ul");
    if (!nav) {
        return;
    }
    Array.from(nav.querySelectorAll(".nav-link")).forEach((item) => {
        if (item === analysisTab || item.dataset.analysisBound) {
            return;
        }
        item.dataset.analysisBound = "1";
        item.addEventListener("click", () => {
            panel.style.display = "none";
            setDataSectionVisible(true);
            const href = item.getAttribute("href") || "";
            if (!href || href.startsWith("javascript:") || href.startsWith("#")) {
                activateTab(item);
            }
        });
    });
}
function getStatusEl() {
    return document.getElementById("reviewer-style-status");
}
function setStatus(text) {
    const el = getStatusEl();
    if (el) {
        el.textContent = text;
    }
}
function formatSigned(value, digits = 3) {
    const v = Number.isFinite(value) ? value : 0;
    return `${v >= 0 ? "+" : ""}${v.toFixed(digits)}`;
}
async function fetchTechById(id) {
    const query = id && id !== SELF_PLAYER_SENTINEL ? `?id=${encodeURIComponent(id)}` : "";
    const resp = await fetch(`/_qry/user/tech/${query}`, {
        method: "POST",
        credentials: "include",
    });
    if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
    }
    return (await resp.json());
}
async function fetchMatchCandidates(keyword) {
    const resp = await fetch(`/_qry/match/?kw=${encodeURIComponent(keyword)}`, {
        method: "POST",
        credentials: "include",
    });
    if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
    }
    const json = (await resp.json());
    if (Array.isArray(json)) {
        return json;
    }
    return Array.isArray(json?.data) ? json.data : [];
}
function renderDiffBar(value, maxAbs) {
    const widthPct = (Math.abs(value) / Math.max(maxAbs, 1e-9)) * 50;
    const positive = value >= 0;
    const fillStyle = positive
        ? `right:50%; width:${widthPct.toFixed(2)}%; background:#dc3545;`
        : `left:50%; width:${widthPct.toFixed(2)}%; background:#198754;`;
    return `
    <div class="reviewer-style-bar-wrap">
      <div class="reviewer-style-bar-zero"></div>
      <div class="reviewer-style-bar-fill" style="${fillStyle}"></div>
      <div class="reviewer-style-bar-label ${positive ? "text-danger" : "text-success reviewer-style-bar-label-left"}">${formatSigned(value, 3)}</div>
    </div>
  `;
}
function renderMetricRows(targetId, rows) {
    const tbody = document.getElementById(targetId);
    if (!tbody) {
        return;
    }
    const maxAbs = Math.max(...rows.map((row) => Math.abs(row.diff)), 1e-9);
    tbody.innerHTML = rows
        .map((row) => `
      <tr>
        <td class="text-dark reviewer-style-metric-label">${analysis_escapeHtml(row.label)}</td>
        <td class="text-end text-muted reviewer-style-metric-value">${row.valueA.toFixed(3)}</td>
        <td class="text-center reviewer-style-metric-bar-cell">${renderDiffBar(row.diff, maxAbs)}</td>
        <td class="text-start text-muted reviewer-style-metric-value">${row.valueB.toFixed(3)}</td>
      </tr>
    `)
        .join("");
}
function renderTopDiffRows(rows) {
    const tbody = document.getElementById("reviewer-style-fan-diff-tbody");
    if (!tbody) {
        return;
    }
    if (!rows.length) {
        tbody.innerHTML =
            '<tr><td colspan="4" class="text-center text-muted">该分组无可比较番种</td></tr>';
        return;
    }
    const maxAbs = Math.max(...rows.map((row) => Math.abs(row.diffPct)), 1e-9);
    tbody.innerHTML = rows
        .map((row) => `
      <tr>
        <td class="text-dark">${analysis_escapeHtml(row.fanName)}</td>
        <td class="text-end text-muted">${row.rateA.toFixed(3)}</td>
        <td class="text-center">${renderDiffBar(row.diffPct, maxAbs)}</td>
        <td class="text-start text-muted">${row.rateB.toFixed(3)}</td>
      </tr>
    `)
        .join("");
}
function renderCurrentTopDiff() {
    const grouped = filterFanDiffRowsByGroup(fanRowsAll, currentFanGroup);
    const filtered = grouped.filter((row) => {
        if (hideRareFans && row.rateA < 0.5 && row.rateB < 0.5) {
            return false;
        }
        if (onlyLargeDiffFans && Math.abs(row.diffPct) <= 1) {
            return false;
        }
        return true;
    });
    const sorted = [...filtered].sort((left, right) => {
        if (sortByAbsDiff) {
            return Math.abs(right.diffPct) - Math.abs(left.diffPct);
        }
        return right.diffPct - left.diffPct;
    });
    renderTopDiffRows(sorted);
}
function updateFanActionButtonsState() {
    const rareBtn = document.getElementById(FAN_FILTER_RARE_BTN_ID);
    const largeDiffBtn = document.getElementById(FAN_FILTER_LARGE_DIFF_BTN_ID);
    const sortBtn = document.getElementById(FAN_SORT_MODE_BTN_ID);
    if (rareBtn) {
        rareBtn.classList.toggle("is-active", hideRareFans);
    }
    if (largeDiffBtn) {
        largeDiffBtn.classList.toggle("is-active", onlyLargeDiffFans);
    }
    if (sortBtn) {
        sortBtn.classList.toggle("is-active", sortByAbsDiff);
        sortBtn.textContent = sortByAbsDiff ? "排序：绝对值" : "排序：差值";
    }
}
function bindFanActionButtons() {
    const rareBtn = document.getElementById(FAN_FILTER_RARE_BTN_ID);
    const largeDiffBtn = document.getElementById(FAN_FILTER_LARGE_DIFF_BTN_ID);
    const sortBtn = document.getElementById(FAN_SORT_MODE_BTN_ID);
    if (rareBtn && !rareBtn.dataset.bound) {
        rareBtn.dataset.bound = "1";
        rareBtn.addEventListener("click", () => {
            hideRareFans = !hideRareFans;
            updateFanActionButtonsState();
            renderCurrentTopDiff();
        });
    }
    if (largeDiffBtn && !largeDiffBtn.dataset.bound) {
        largeDiffBtn.dataset.bound = "1";
        largeDiffBtn.addEventListener("click", () => {
            onlyLargeDiffFans = !onlyLargeDiffFans;
            updateFanActionButtonsState();
            renderCurrentTopDiff();
        });
    }
    if (sortBtn && !sortBtn.dataset.bound) {
        sortBtn.dataset.bound = "1";
        sortBtn.addEventListener("click", () => {
            sortByAbsDiff = !sortByAbsDiff;
            updateFanActionButtonsState();
            renderCurrentTopDiff();
        });
    }
    updateFanActionButtonsState();
}
function setSelectOptions(selectEl, candidates) {
    const options = ['<option value="">--请选择--</option>'];
    candidates.forEach((item) => {
        if (!item?.i) {
            return;
        }
        const name = item.n || item.i;
        options.push(`<option value="${analysis_escapeHtml(item.i)}" data-name="${analysis_escapeHtml(name)}">${analysis_escapeHtml(name)}</option>`);
    });
    selectEl.innerHTML = options.join("");
}
function bindPlayerSearch(keywordId, selectId, pickedId, onSelected) {
    const keywordInput = document.getElementById(keywordId);
    const selectEl = document.getElementById(selectId);
    const pickedEl = document.getElementById(pickedId);
    if (!keywordInput || !selectEl || !pickedEl) {
        return;
    }
    let timer = 0;
    keywordInput.addEventListener("input", () => {
        if (timer) {
            w.clearTimeout(timer);
        }
        const keyword = keywordInput.value.trim();
        if (!keyword) {
            selectEl.innerHTML = '<option value="">--请选择--</option>';
            return;
        }
        timer = w.setTimeout(() => {
            fetchMatchCandidates(keyword)
                .then((items) => {
                setSelectOptions(selectEl, items);
            })
                .catch((error) => {
                warnLog("Failed to search player", error);
            });
        }, 160);
    });
    selectEl.addEventListener("change", () => {
        const option = selectEl.options[selectEl.selectedIndex] || null;
        const id = option?.value || "";
        const name = option?.getAttribute("data-name") || option?.textContent || "";
        if (!id) {
            return;
        }
        pickedEl.textContent = `已选择：${name}`;
        onSelected(id, name);
    });
}
function updateTablePlayerHeaders(nameA, nameB) {
    const headerA = nameA || "玩家A";
    const headerB = nameB || "玩家B";
    Array.from(document.querySelectorAll(".reviewer-style-head-a")).forEach((el) => {
        el.textContent = headerA;
    });
    Array.from(document.querySelectorAll(".reviewer-style-head-b")).forEach((el) => {
        el.textContent = headerB;
    });
}
function refreshFanTabsState() {
    const groupTabs = document.getElementById(FAN_GROUP_TAB_ID);
    if (groupTabs) {
        Array.from(groupTabs.querySelectorAll(".nav-link")).forEach((tab) => {
            tab.classList.toggle("active", tab.dataset.fanGroup === currentFanGroup);
        });
    }
}
function bindFanSubTabs() {
    const groupTabs = document.getElementById(FAN_GROUP_TAB_ID);
    if (groupTabs && !groupTabs.dataset.bound) {
        groupTabs.dataset.bound = "1";
        groupTabs.addEventListener("click", (event) => {
            const target = event.target;
            const tab = target?.closest(".nav-link");
            if (!tab) {
                return;
            }
            const nextGroup = (tab.dataset.fanGroup || "all");
            currentFanGroup = nextGroup;
            refreshFanTabsState();
            renderCurrentTopDiff();
        });
    }
}
function enrichStats(raw) {
    return {
        fan: raw.fan || {},
        basic: {
            ...calcWinStats(raw),
            ...calcCycleStats(raw),
            ...calcPointStats(raw),
        },
        whole: raw.basic || {},
    };
}
async function runCompare() {
    if (!playerAId || !playerBId) {
        setStatus("请先选择两个玩家");
        return;
    }
    setStatus("比较中...");
    try {
        const [dataA, dataB] = await Promise.all([
            fetchTechById(playerAId),
            fetchTechById(playerBId),
        ]);
        const statsA = enrichStats(dataA);
        const statsB = enrichStats(dataB);
        fanRowsAll = buildFanDiffRows(statsA.fan, statsB.fan);
        const similarity = computeSimilarityScore(fanRowsAll, getFanTotalCount(statsA.fan), getFanTotalCount(statsB.fan));
        const scoreEl = document.getElementById("reviewer-style-score");
        if (scoreEl) {
            scoreEl.textContent = `${similarity.score.toFixed(2)} / 100`;
        }
        const overallCiEl = document.getElementById("reviewer-style-overall-ci");
        if (overallCiEl) {
            overallCiEl.textContent = `95% 置信区间：${similarity.ciLower.toFixed(2)} / 100 ～ ${similarity.ciUpper.toFixed(2)} / 100`;
        }
        refreshFanTabsState();
        renderCurrentTopDiff();
        updateTablePlayerHeaders(playerAName || "玩家A", playerBName || "玩家B");
        renderMetricRows("reviewer-style-win-tbody", computeMetricDiffRows(WIN_METRICS, statsA, statsB));
        renderMetricRows("reviewer-style-cycle-tbody", computeMetricDiffRows(CYCLE_METRICS, statsA, statsB));
        renderMetricRows("reviewer-style-point-tbody", computeMetricDiffRows(POINT_METRICS, statsA, statsB));
        setStatus(`已比较 ${playerAName || "玩家A"} vs ${playerBName || "玩家B"}`);
    }
    catch (error) {
        warnLog("Failed to compare style", error);
        setStatus("比较失败，请检查会员权限或搜索结果");
    }
}
function bindCompareActions() {
    const btn = document.getElementById("reviewer-style-compare-run");
    if (!btn || btn.dataset.bound) {
        return;
    }
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
        void runCompare();
    });
}
function initPlayerInputs() {
    const selfId = getSelfIdFromQuery();
    const aPicked = document.getElementById("reviewer-style-player-a-name");
    playerAId = selfId || SELF_PLAYER_SENTINEL;
    playerAName = "当前玩家";
    if (aPicked) {
        aPicked.textContent = "已选择：当前玩家";
    }
    bindPlayerSearch("reviewer-style-player-a-keyword", "reviewer-style-player-a-select", "reviewer-style-player-a-name", (id, name) => {
        playerAId = id;
        playerAName = name;
    });
    bindPlayerSearch("reviewer-style-player-b-keyword", "reviewer-style-player-b-select", "reviewer-style-player-b-name", (id, name) => {
        playerBId = id;
        playerBName = name;
    });
    updateTablePlayerHeaders(playerAName || "玩家A", playerBName || "玩家B");
}
function initTechAnalysis() {
    if (initialized) {
        bindTabToggle();
        return;
    }
    const basicTable = document.getElementById("basic");
    const eloTable = document.getElementById("elo");
    if (!basicTable || !eloTable) {
        w.setTimeout(initTechAnalysis, 120);
        return;
    }
    const container = getContainer();
    if (!container) {
        return;
    }
    if (!ensureAnalysisPanel()) {
        return;
    }
    if (!ensureAnalysisTab()) {
        return;
    }
    hideLegacyTools(container);
    moveNotesToBottom(container);
    bindTabToggle();
    initPlayerInputs();
    bindFanSubTabs();
    bindFanActionButtons();
    bindCompareActions();
    initialized = true;
}

;// ./src/features/tech/index.ts




let startedTechHref = "";
function initTechFeature(href) {
    if (startedTechHref === href) {
        return false;
    }
    startedTechHref = href;
    infoLog("Tech feature init started");
    initTechAnalysis();
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
        favorites: isFavoritesPage(),
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
    installFavoritesNavItem();
    if (routeFlags.favorites) {
        if (initFavoritesPageFeature(href)) {
            debugLog("Favorites route init dispatched");
        }
        return;
    }
    cleanupFavoritesPage();
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