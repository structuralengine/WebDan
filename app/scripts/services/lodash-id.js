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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = '';
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// UUID
// https://gist.github.com/LeverOne/1308368
/* jshint ignore:start */
function uuid (a, b) { for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');return b }
/* jshint ignore:end */

module.exports = {
  // Empties properties
  __empty: function (doc) {
    this.forEach(doc, function (value, key) {
      delete doc[key]
    })
  },

  // Copies properties from an object to another
  __update: function (dest, src) {
    this.forEach(src, function (value, key) {
      dest[key] = value
    })
  },

  // Removes an item from an array
  __remove: function (array, item) {
    var index = this.indexOf(array, item)
    if (index !== -1) array.splice(index, 1)
  },

  __id: function () {
    var id = this.id || 'id'
    return id
  },

  getById: function (collection, id) {
    var self = this
    return this.find(collection, function (doc) {
      if (self.has(doc, self.__id())) {
        return doc[self.__id()].toString() === id.toString()
      }
    })
  },

  createId: function (collection, doc) {
    return uuid()
  },

  insert: function (collection, doc) {
    doc[this.__id()] = doc[this.__id()] || this.createId(collection, doc)
    var d = this.getById(collection, doc[this.__id()])
    if (d) throw new Error('Insert failed, duplicate id')
    collection.push(doc)
    return doc
  },

  upsert: function (collection, doc) {
    if (doc[this.__id()]) {
      // id is set
      var d = this.getById(collection, doc[this.__id()])
      if (d) {
        // replace properties of existing object
        this.__empty(d)
        this.assign(d, doc)
      } else {
        // push new object
        collection.push(doc)
      }
    } else {
      // create id and push new object
      doc[this.__id()] = this.createId(collection, doc)
      collection.push(doc)
    }

    return doc
  },

  updateById: function (collection, id, attrs) {
    var doc = this.getById(collection, id)

    if (doc) {
      this.assign(doc, attrs, {id: doc.id})
    }

    return doc
  },

  updateWhere: function (collection, predicate, attrs) {
    var self = this
    var docs = this.filter(collection, predicate)

    docs.forEach(function (doc) {
      self.assign(doc, attrs, {id: doc.id})
    })

    return docs
  },

  replaceById: function (collection, id, attrs) {
    var doc = this.getById(collection, id)

    if (doc) {
      var docId = doc.id
      this.__empty(doc)
      this.assign(doc, attrs, {id: docId})
    }

    return doc
  },

  removeById: function (collection, id) {
    var doc = this.getById(collection, id)

    this.__remove(collection, doc)

    return doc
  },

  removeWhere: function (collection, predicate) {
    var self = this
    var docs = this.filter(collection, predicate)

    docs.forEach(function (doc) {
      self.__remove(collection, doc)
    })

    return docs
  }
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

'use strict';
Object.defineProperty(__webpack_exports__, '__esModule', { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_id_src_index_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_id_src_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_id_src_index_js__);

_.mixin(__WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_id_src_index_js___default.a);


/***/ })
/******/ ]);