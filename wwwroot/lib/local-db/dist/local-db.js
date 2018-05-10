'use strict';

/**
 * @ngdoc service
 * @name local-db.main
 * @description
 * # main
 * Main module in the local-db.
 */

angular.module('local-db', []);
//# sourceMappingURL=main.js.map

'use strict';

/******/(function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/var installedModules = {};
  /******/
  /******/ // The require function
  /******/function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/if (installedModules[moduleId]) {
      /******/return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/var module = installedModules[moduleId] = {
      /******/i: moduleId,
      /******/l: false,
      /******/exports: {}
      /******/ };
    /******/
    /******/ // Execute the module function
    /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/__webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/__webpack_require__.c = installedModules;
  /******/
  /******/ // identity function for calling harmony imports with the correct context
  /******/__webpack_require__.i = function (value) {
    return value;
  };
  /******/
  /******/ // define getter function for harmony exports
  /******/__webpack_require__.d = function (exports, name, getter) {
    /******/if (!__webpack_require__.o(exports, name)) {
      /******/Object.defineProperty(exports, name, {
        /******/configurable: false,
        /******/enumerable: true,
        /******/get: getter
        /******/ });
      /******/
    }
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/__webpack_require__.n = function (module) {
    /******/var getter = module && module.__esModule ?
    /******/function getDefault() {
      return module['default'];
    } :
    /******/function getModuleExports() {
      return module;
    };
    /******/__webpack_require__.d(getter, 'a', getter);
    /******/return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/__webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/__webpack_require__.p = '';
  /******/
  /******/ // Load entry module and return exports
  /******/return __webpack_require__(__webpack_require__.s = 1);
  /******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports) {

  // UUID
  // https://gist.github.com/LeverOne/1308368
  /* jshint ignore:start */
  function uuid(a, b) {
    for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-') {}return b;
  }
  /* jshint ignore:end */

  module.exports = {
    // Empties properties
    __empty: function __empty(doc) {
      this.forEach(doc, function (value, key) {
        delete doc[key];
      });
    },

    // Copies properties from an object to another
    __update: function __update(dest, src) {
      this.forEach(src, function (value, key) {
        dest[key] = value;
      });
    },

    // Removes an item from an array
    __remove: function __remove(array, item) {
      var index = this.indexOf(array, item);
      if (index !== -1) array.splice(index, 1);
    },

    __id: function __id() {
      var id = this.id || 'id';
      return id;
    },

    getById: function getById(collection, id) {
      var self = this;
      return this.find(collection, function (doc) {
        if (self.has(doc, self.__id())) {
          return doc[self.__id()].toString() === id.toString();
        }
      });
    },

    createId: function createId(collection, doc) {
      return uuid();
    },

    insert: function insert(collection, doc) {
      doc[this.__id()] = doc[this.__id()] || this.createId(collection, doc);
      var d = this.getById(collection, doc[this.__id()]);
      if (d) throw new Error('Insert failed, duplicate id');
      collection.push(doc);
      return doc;
    },

    upsert: function upsert(collection, doc) {
      if (doc[this.__id()]) {
        // id is set
        var d = this.getById(collection, doc[this.__id()]);
        if (d) {
          // replace properties of existing object
          this.__empty(d);
          this.assign(d, doc);
        } else {
          // push new object
          collection.push(doc);
        }
      } else {
        // create id and push new object
        doc[this.__id()] = this.createId(collection, doc);
        collection.push(doc);
      }

      return doc;
    },

    updateById: function updateById(collection, id, attrs) {
      var doc = this.getById(collection, id);

      if (doc) {
        this.assign(doc, attrs, { id: doc.id });
      }

      return doc;
    },

    updateWhere: function updateWhere(collection, predicate, attrs) {
      var self = this;
      var docs = this.filter(collection, predicate);

      docs.forEach(function (doc) {
        self.assign(doc, attrs, { id: doc.id });
      });

      return docs;
    },

    replaceById: function replaceById(collection, id, attrs) {
      var doc = this.getById(collection, id);

      if (doc) {
        var docId = doc.id;
        this.__empty(doc);
        this.assign(doc, attrs, { id: docId });
      }

      return doc;
    },

    removeById: function removeById(collection, id) {
      var doc = this.getById(collection, id);

      this.__remove(collection, doc);

      return doc;
    },

    removeWhere: function removeWhere(collection, predicate) {
      var self = this;
      var docs = this.filter(collection, predicate);

      docs.forEach(function (doc) {
        self.__remove(collection, doc);
      });

      return docs;
    }

    /***/ };
},
/* 1 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  'use strict';

  Object.defineProperty(__webpack_exports__, '__esModule', { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_id_src_index_js__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_id_src_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_id_src_index_js__);

  _.mixin(__WEBPACK_IMPORTED_MODULE_0__node_modules_lodash_id_src_index_js___default.a);

  /***/
}]
/******/);
//# sourceMappingURL=lodash-id.js.map

'use strict';

/**
 * @ngdoc service
 * @name local-db.$lowdb
 * @description
 * # $lowdb
 * Service in the local-db.
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

angular.module('local-db').service('$lowdb', ['$q', 'dbConfig', 'moment', function ($q, dbConfig, moment) {

  var db = low(dbConfig.source);
  db.defaults(dbConfig.defaults).write();

  var $lowdb = this;

  $lowdb.get = function (tableName) {
    if (!tableName) {
      throw '$lowdb: no table name';
    }
    if (!db.has(tableName).value()) {
      throw '$lowdb: no table: ' + tableName;
    }
    return db.get(tableName);
  };

  $lowdb.getStoredData = function () {
    return db.getState();
  };

  $lowdb.download = function (filename) {
    if (!filename) {
      var format = dbConfig.formats.timestamp || 'YYYYMMDD-HHmmss';
      var timestamp = moment().format(format);
      filename = 'webdan.' + timestamp + '.json';
    }
    var state = $lowdb.getStoredData();
    var json = angular.toJson(state);
    var type = { type: 'application/json; charset=utf-8' };

    if (File) {
      var file = new File([json], filename, type);
      saveAs(file);
    } else {
      var blob = new Blob([json], type);
      saveAs(blob, filename);
    }
  };

  $lowdb.clear = function () {
    db.setState(dbConfig.defaults);
  };

  $lowdb.load = function (file) {
    var d = $q.defer();

    var reader = new FileReader();
    reader.onload = function (e) {
      var loadedState = angular.fromJson(e.target.result);
      var err = validateState(loadedState);
      if (err) {
        d.reject(result);
      } else {
        db.setState(loadedState);
        d.resolve();
      }
    };
    reader.onerror = function (e) {
      d.reject(e);
    };
    reader.readAsText(file);

    return d.promise;
  };

  function validateState(loadedData) {
    var errors = [];
    if (!angular.isObject(loadedData)) {
      loadedData = angular.fromJson(loadedData);
    }
    angular.forEach(dbConfig.defaults, function (state, key) {
      if (angular.isUndefined(loadedData[key])) {
        errors.push('no key: ' + key);
      } else {
        var type = typeof state === 'undefined' ? 'undefined' : _typeof(state);
        if (_typeof(loadedData[key]) != type) {
          errors.push('invalid data type for ' + key);
        }
      }
    });
    return errors.join('\n');
  }
}]);
//# sourceMappingURL=low.db.js.map

'use strict';

/**
 * @ngdoc service
 * @name local-db.LowResource
 * @description
 * # LowResource
 * Provider in the local-db.
 */

angular.module('local-db').provider('LowResource', function () {

  // Private variables
  var provider = this;

  // Public API for configuration
  this.defaults = {
    foreignKeys: {
      parents: {},
      children: {}
    }
  };

  // Method for instantiating
  this.$get = ['$lowdb', '$injector', '$q', function ($lowdb, $injector, $q) {

    function LowResourceFactory(params) {
      var table = void 0;
      var primaryKey = void 0;
      var defaultEntries = void 0;

      function init() {
        LowResource.reload();
        primaryKey = LowResource.primaryKey = params.primaryKey || 'id';
        LowResource.foreignKeys = angular.merge({}, provider.defaults.foreignKeys, params.foreignKeys || {});
        LowResource.afterAdd = params.afterAdd || angular.noop;
        defaultEntries = params.defaultEntries || [];
      }

      function LowResource() {}

      LowResource.reload = function () {
        table = LowResource.table = $lowdb.get(params.table);
      };

      LowResource.query = function () {
        return table.value();
      };

      LowResource.save = function (entry) {
        if (exists(entry[primaryKey])) {
          return this.update(entry);
        } else {
          return this.add(entry);
        }
      };

      function exists(id) {
        var storedEntry = LowResource.getById(id);
        return !!storedEntry;
      }

      LowResource.createDefaultEntries = function (foreignKey, foreignValue) {
        if (angular.isString(defaultEntries) && defaultEntries.startsWith('http')) {
          return $http.get(defaultEntries).then(function (response) {
            defaultEntries = response.data;
            createDefaultEntries(foreignKey, foreignValue);
          });
        } else {
          createDefaultEntries(foreignKey, foreignValue);
          return $q.resolve();
        }
      };

      function createDefaultEntries(foreignKey, foreignValue) {
        angular.copy(defaultEntries).forEach(function (entry) {
          if (foreignKey && foreignValue) {
            entry[foreignKey] = foreignValue;
          }
          LowResource.add(entry);
        });
      }

      LowResource.add = function (entry) {
        if (primaryKey == 'id') {
          entry[primaryKey] = _.createId();
        }
        table.push(entry).write();

        return this.getById(entry[primaryKey]);
      };

      LowResource.update = function (entry) {
        var id = entry[primaryKey];
        var ref = this.getById(id, true);
        ref.assign(entry).write();

        return this.getById(id);
      };

      LowResource.getById = function (id, asRef) {
        return this.getBy(primaryKey, id, asRef);
      };

      LowResource.getBy = function (prop, value, asRef) {
        var param = {};
        param[prop] = value;
        var ref = this.table.find(param);
        if (asRef) {
          return ref;
        } else {
          return ref.value();
        }
      };

      LowResource.getAsc = function (id, prop) {
        prop = prop || this.primaryKey;
        var entry = this.getBy(prop, id);
        if (entry) {
          entry = angular.copy(entry);
          angular.forEach(this.foreignKeys.parents, function (foreignKey, alias) {
            if (angular.isDefined(entry[foreignKey])) {
              var Parent = $injector.get(alias);
              if (Parent) {
                var parent = Parent.getAsc(entry[foreignKey], foreignKey);
                if (parent) {
                  entry[alias] = parent;
                }
              } else {
                throw 'Invalid parent: ' + alias;
              }
            }
          });
        }
        return entry;
      };

      LowResource.remove = function (id) {
        var params = {};
        params[primaryKey] = id;
        return table.remove(params).write();
      };

      LowResource.getStoredData = function () {
        return $lowdb.getStoredData();
      };

      LowResource.saveAs = function (filename) {
        $lowdb.download(filename);
      };

      LowResource.clear = function () {
        $lowdb.clear();
        LowResource.reload();
      };

      LowResource.load = function (file) {
        return $lowdb.load(file).then(function () {
          LowResource.reload();
        });
      };

      init();

      return LowResource;
    }

    return LowResourceFactory;
  }];
});
//# sourceMappingURL=low.resource.js.map

'use strict';

/**
 * @ngdoc service
 * @name local-db.dbConfig
 * @description
 * # dbConfig
 * Constant in the local-db.
 */

angular.module('local-db').constant('dbConfig', {
  source: 'db',
  defaults: {},
  formats: {
    timestamp: 'YYYYMMDD-HHmmss'
  }
});
//# sourceMappingURL=db.config.js.map

'use strict';

/**
 * @ngdoc directive
 * @name local-db.directive:openFile
 * @description
 * # openFile
 */

angular.module('local-db').directive('openFile', function () {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {

      var receiver = scope.$eval(attrs.receiver) || angular.noop;
      var clickable = attrs.clickable || 'a[open-file]';
      var extensions = attrs.extensions || '.json';

      var dz = new Dropzone(element[0], {
        url: '#',
        autoProcessQueue: false,
        clickable: [clickable],
        acceptedFiles: extensions,
        addedfile: receiver
      });
    }
  };
});
//# sourceMappingURL=open-file.js.map
