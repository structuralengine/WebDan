'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */

angular.module('ht-utils', []);
//# sourceMappingURL=main.js.map

'use strict';

/**
 * @ngdoc service
 * @name ht-utils.htConfig
 * @description
 * # htConfig
 * Service in the ht-utils.
 */

angular.module('ht-utils').service('htConfig', function () {
  var htConfig = this;

  htConfig.createNestedHeaders = function (items) {
    var nestedHeaders = [];
    createNestedHeaders(items, nestedHeaders);
    return nestedHeaders;
  };

  function createNestedHeaders(items, nestedHeaders, depth) {
    nestedHeaders = nestedHeaders || [];
    depth = depth || 0;
    if (angular.isUndefined(nestedHeaders[depth])) {
      nestedHeaders.splice(depth, 0, []);
    }
    var nestedHeader = nestedHeaders[depth];
    var span = 0;

    angular.forEach(items, function (config, label) {
      if (angular.isUndefined(config.items)) {
        nestedHeader.push(label);
        span++;
      } else {
        var colspan = createNestedHeaders(config.items, nestedHeaders, depth + 1);
        nestedHeader.push({
          label: label,
          colspan: colspan
        });
        span += colspan;
      }
    });

    return span;
  }

  htConfig.createColumns = function (items) {
    var columns = [];
    createColumns(items, columns);
    return columns;
  };

  function createColumns(items, columns) {
    angular.forEach(items, function (config, label) {
      if (angular.isDefined(config.column)) {
        columns.push(config.column);
      } else if (angular.isDefined(config.items)) {
        createColumns(config.items, columns);
      }
    });
  }

  this.createProperties = function (items) {
    var properties = {};
    createProperties(items, properties);
    return properties;
  };

  function createProperties(items, properties) {
    angular.forEach(items, function (config, label) {
      if (angular.isDefined(config.column)) {
        var key = config.column.data.split('.').pop();
        properties[key] = {
          label: label,
          column: config.column
        };
      }
      if (angular.isDefined(config.items)) {
        createColumns(config.items, properties);
      }
    });
  }
});
//# sourceMappingURL=ht.config.js.map

'use strict';

/**
 * @ngdoc service
 * @name ht-utils.HtHelper
 * @description
 * # HtHelper
 * Service in the ht-utils.
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

angular.module('ht-utils').service('HtHelper', ['$injector', '$log', 'htConfig', 'hotRegisterer', function ($injector, $log, htConfig, hotRegisterer) {
  var HtHelper = this;

  var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  HtHelper.htInit = function (config) {
    var resource = this;
    var nestedHeaders = htConfig.createNestedHeaders(config);
    var columns = htConfig.createColumns(config);
    columns = this.parseAsc(columns);
    columns = this.detectCheckboxRenderer(columns);

    this.settings = {
      colHeaders: true,
      rowHeaders: true,
      minSpareRows: 0,
      afterChange: this.getAfterChange(),
      allowInsertRow: false,
      wordWrap: false,
      undo: true,
      columns: columns,
      nestedHeaders: nestedHeaders
    };
  };

  HtHelper.getAfterChange = function () {
    var Resource = this;
    return function (changes, source) {
      if (source != 'loadData') {
        if (angular.isDefined(Resource.afterChange)) {
          Resource.afterChange.apply(this, arguments);
        }

        var get = this.getSourceDataAtRow;
        changes.forEach(function (change) {
          var item = get(change[0]);
          Resource.save(item);
        });
      }
    };
  };

  HtHelper.getRenderer = function (path) {
    var Resource = this;
    return function (hot, td, row, col, prop, id, cellProperties) {
      Handsontable.renderers.BaseRenderer.apply(this, arguments);

      var label = '';
      if (id) {
        var item = Resource.getAsc(id);
        if (item && path) {
          label = _.get(item, path, null);
        }
      }
      angular.element(td).text(label);
      return td;
    };
  };

  HtHelper.getTextRenderer = function () {
    return function (hot, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.BaseRenderer.apply(this, arguments);
      angular.element(td).text(value);
      return td;
    };
  };

  HtHelper.enableEditableForeignValue = function (params) {
    var onResource = void 0;
    var parent = void 0;
    var targetProp = void 0;
    var config = void 0;
    var hotIds = void 0;
    var foreignKey = void 0;

    verify(params);

    foreignKey = onResource.foreignKeys.parents[parent];
    if (!foreignKey) {
      throw 'no foreignKey of ' + onResource.name + ' for ' + parent;
    }
    onResource.settings.afterBeginEditing = getAfterBeginEditingForForeignKeyEditor(parent, targetProp, config);
    onResource.settings.beforeChange = getBeforeChangeForForeignKeyEditor(parent, targetProp, foreignKey, hotIds);

    function verify(params) {
      angular.forEach(params, function (value, key) {
        switch (key) {
          case 'onResource':
            if (angular.isString(value)) {
              value = $injector.get(value);
            }
            if (value) {
              onResource = value;
            } else {
              throw 'HtHelper#enableEditableForeignValue: no resource for ' + value;
            }
            break;
          case 'parent':
            parent = value;
            break;
          case 'targetProp':
            targetProp = value;
            break;
          case 'config':
            config = value;
            break;
          case 'refreshingHotIds':
            hotIds = value;
            break;
          default:
            break;
        }
      });
    }
  };

  HtHelper.getEditableForeignValueRenderer = function (alias, targetProp) {
    var Resource = $injector.get(alias);

    return function (hot, td, row, col, prop, foreignKey, cellProperties) {
      var label = '';
      if (foreignKey) {
        if (HtHelper.isUUID(foreignKey)) {
          var entry = Resource.getById(foreignKey);
          if (entry && entry[targetProp]) {
            label = entry[targetProp];
          } else {
            throw 'no such entry for ' + foreignKey + ' of ' + alias;
          }
        } else if (angular.isString(foreignKey)) {
          label = '###' + foreignKey;
        }
      }
      angular.element(td).text(label);
      return td;
    };
  };

  HtHelper.getSelectRenderer = function (options, path) {
    return function renderB(hot, td, row, col, prop, value, cellProperties) {
      var label = '';
      if (value) {
        var option = options[value] || {};
        if (path) {
          label = _.get(option, path);
        } else {
          label = option;
        }
      }
      angular.element(td).text(label);
      return td;
    };
  };

  HtHelper.getOptions = function getOptions(path) {
    var Resource = this;
    return function (row, col, prop) {
      var items = Resource.query();
      return items.reduce(function (coll, item) {
        var id = item[primaryKey];
        if (id) {
          coll[id] = _.get(item, path);
        }
        return coll;
      }, {});
    };
  };

  HtHelper.parseAsc = function (columns) {
    var parentForeignKeys = {};
    angular.forEach(this.foreignKeys.parents, function (foreignKey, alias) {
      parentForeignKeys[foreignKey] = alias;
    });

    columns.forEach(function (column) {
      if (column.path && !column.renderer) {
        var parentForeignKey = column.data;
        var parentAlias = parentForeignKeys[parentForeignKey];
        if (angular.isDefined(parentAlias)) {
          var Parent = $injector.get(parentAlias);
          column.renderer = Parent.getRenderer(column.path);
        }
      }
    });

    return columns;
  };

  HtHelper.detectCheckboxRenderer = function (columns) {
    var numRegex = /\d+/;
    columns.forEach(function (column) {
      if (column.type == 'checkbox') {
        column.renderer = function (instance, td, row, col, prop, value, cellProperties) {
          switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
            case 'string':
              value = value.toLowerCase();
              if (numRegex.test(value)) {
                value = !!Number(value);
              } else {
                value = value == 'true';
              }
              break;
            case 'number':
              value = !!number(value);
              break;
            default:
              break;
          }
          var checkboxRenderer = Handsontable.renderers.getRenderer('checkbox');
          checkboxRenderer(instance, td, row, col, prop, value, cellProperties);
          return td;
        };
      }
    });
    return columns;
  };

  HtHelper.isUUID = function (id) {
    return uuidRegex.test(id);
  };

  HtHelper.refresh = function (hotIds) {
    if (!angular.isArray(hotIds)) {
      hotIds = [hotIds];
    }
    hotIds.forEach(function (hotId) {
      var hot = hotRegisterer.getInstance(hotId);
      hot.render();
    });
  };

  HtHelper.mergeCells = function (coll, config) {
    var mergeCells = [];

    if (coll.length) {
      if (!config) {
        config = Object.props(coll[0]).map(function (prop) {
          return { prop: prop };
        });
      }

      config.forEach(function (cfg, col) {
        var prop = cfg.prop;
        var rowspan = void 0;
        col = angular.isDefined(cfg.column) ? cfg.column : col;

        var entries = coll.map(function (entry) {
          return entry[prop];
        });

        if (angular.isDefined(cfg.rowspan)) {
          rowspan = cfg.rowspan;
          var count = parseInt(entries.length / rowspan);
          var startIdx = 0;
          for (var i = 0; i < count; i++) {
            mergeCells.push({
              row: startIdx,
              col: col,
              rowspan: rowspan,
              colspan: 1
            });
            startIdx += rowspan;
          }
        } else {
          (function () {
            var lastIdx = entries.length - 1;
            var nextIdx = void 0,
                startEntry = void 0;
            for (var _startIdx = 0; _startIdx <= lastIdx;) {
              startEntry = entries[_startIdx];
              nextIdx = _.findIndex(entries, function (entry) {
                return entry != startEntry;
              }, _startIdx);

              if (nextIdx == -1) {
                rowspan = lastIdx - _startIdx + 1;
              } else {
                rowspan = nextIdx - _startIdx;
              }
              mergeCells.push({
                row: _startIdx,
                col: col,
                rowspan: rowspan,
                colspan: 1
              });
              _startIdx += rowspan;
            }
          })();
        }
      });
    }

    return mergeCells;
  };

  HtHelper.enterMoves = function (hotId, offset) {
    return function () {
      var hot = hotRegisterer.getInstance(hotId);
      if (!hot) {
        var msg = 'no hot instance for ' + hotId;
        $log.error(msg);
        throw msg;
      }
      var settings = hot.getSettings();
      var lastColIdx = settings.columns.length - 1;
      var lastRowIdx = settings.data.length - 1;

      var _hot$getSelected = hot.getSelected(),
          _hot$getSelected2 = _slicedToArray(_hot$getSelected, 4),
          startRow = _hot$getSelected2[0],
          startCol = _hot$getSelected2[1],
          endRow = _hot$getSelected2[2],
          endCol = _hot$getSelected2[3];

      var row = void 0,
          col = void 0;
      if (startCol == lastColIdx) {
        if (startRow == lastRowIdx) {
          row = -lastRowIdx;
        } else {
          row = 1;
        }
        col = -(lastColIdx - 3);
      } else {
        row = 0;
        col = 1;
      }
      return {
        row: row,
        col: col
      };
    };
  };

  function getBeforeChangeForForeignKeyEditor(alias, targetProp, foreignKey, hotIds) {
    return function (changes, source) {
      if (source != 'loadData') {
        var hot = this;
        changes.forEach(function (change, i) {
          var _change = _slicedToArray(change, 4),
              row = _change[0],
              prop = _change[1],
              foreignId = _change[2],
              value = _change[3];

          if (prop == foreignKey && HtHelper.isUUID(foreignId) && !HtHelper.isUUID(value)) {
            var Parent = $injector.get(alias);
            var parent = Parent.getById(foreignId);
            parent[targetProp] = value;
            Parent.save(parent);

            var entry = hot.getSourceDataAtRow(row);
            entry[foreignKey] = foreignId;

            HtHelper.refresh(hotIds);

            changes[i] = null;
          }
        });
      }
    };
  }

  function getAfterBeginEditingForForeignKeyEditor(alias, prop, config) {
    var propCol = function (config) {
      var values = Object.values(config);
      return _.findIndex(values, function (v) {
        return v.column && v.column.path && v.column.path == prop;
      });
    }(config);

    var Resource = $injector.get(alias);

    return function (row, col) {
      if (col == propCol) {
        var editor = this.getActiveEditor();
        var foreignKey = editor.getValue();
        if (foreignKey) {
          var entry = Resource.getById(foreignKey);
          editor.setValue(entry[prop] || '');
        }
      }
    };
  }
}]);
//# sourceMappingURL=ht.helper.js.map

'use strict';

/**
 * @ngdoc service
 * @name ht-utils.HtObject
 * @description
 * # HtObject
 * Factory in the ht-utils.
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

angular.module('ht-utils').factory('HtObject', ['htConfig', function (htConfig) {

  var HtObject = function HtObject(item, params) {
    var self = this;
    var table = void 0;
    var properties = void 0;

    function init() {
      table = params.table;
      properties = htConfig.createProperties(params.config);
      self.datarows = makePropertyArray(item, properties);
    }

    this.columns = [{ data: 'label', renderer: 'html', readOnly: true }, { data: 'value', type: 'numeric' }];

    this.afterChange = function (changes, source) {
      if (source != 'loadData') {
        changes.forEach(function (change) {
          var _change = _slicedToArray(change, 4),
              row = _change[0],
              prop = _change[1],
              oldVal = _change[2],
              newVal = _change[3];

          save(row, newVal);
        });
      }
    };

    this.settings = {
      colHeaders: false,
      rowHeaders: true,
      minSpareRows: 0,
      columns: self.columns,
      afterChange: self.afterChange
    };

    function save(row, value) {
      var propConfig = Object.values(properties)[row];
      var path = propConfig.column.data;
      self.change(path, value);
    };

    this.change = function (key, value) {
      item = _.set(item, key, value);
      table.write();
    };

    function makePropertyArray(data, properties) {
      var dataRows = [];
      angular.forEach(properties, function (prop, key) {
        var path = prop.column.data;
        dataRows.push({
          path: path,
          label: prop.label,
          value: _.get(data, path, null)
        });
      });
      return dataRows;
    }

    init();
  };

  return HtObject;
}]);
//# sourceMappingURL=ht.object.js.map

'use strict';

/**
 * @ngdoc directive
 * @name app.directive:hotId
 * @description
 * # hotId
 */

angular.module('ht-utils').directive('hotId', ['$interval', '$log', 'hotRegisterer', function ($interval, $log, hotRegisterer) {
  return {
    restrict: 'A',
    require: '^htCopyPaste',
    link: function link(scope, element, attrs, htCpCtrl) {
      var hotId = attrs.hotId;
      var delay = parseInt(attrs.delay) || 100;
      var limit = parseInt(attrs.limit) || 600;
      var hot = void 0;

      var promise = $interval(function () {
        hot = hotRegisterer.getInstance(hotId);
        if (hot) {
          cancel();
          htCpCtrl.add(hot);
          element.addClass('ht-id-catched');
        } else if (limit < 0) {
          cancel();
          $log.error('not found hot-id for handsontable');
        }
        limit--;
      }, delay);

      function cancel() {
        $interval.cancel(promise);
      }
    }
  };
}]);
//# sourceMappingURL=hot-id.js.map

'use strict';

/**
 * @ngdoc directive
 * @name app.directive:htCopyPaste
 * @description
 * # htCopyPaste
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

angular.module('ht-utils').directive('htCopyPaste', ['$q', '$log', function ($q, $log) {
  return {
    restrict: 'A',
    controllerAs: '$htCpCtrl',
    controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
      var ctrl = this;
      var curHot = void 0;
      var selectedRange = void 0;
      var copiedStr = void 0;

      ctrl.copy = function () {
        if (curHot && selectedRange) {
          copiedStr = curHot.getCopyableText.apply(curHot, selectedRange);
          curHot.selectCell.apply(curHot, selectedRange);
        }
      };

      ctrl.cut = function () {
        ctrl.copy();
        if (curHot && selectedRange) {
          var data = tokenize().map(function (rowData) {
            return rowData.map(function () {
              return null;
            });
          });
          ctrl.paste(data);
        }
      };

      ctrl.paste = function (data) {
        if (curHot && copiedStr && selectedRange) {
          if (!data) {
            data = tokenize();
          }
          var rlen = data.length;
          if (rlen) {
            var _selectedRange = selectedRange,
                _selectedRange2 = _slicedToArray(_selectedRange, 2),
                startRow = _selectedRange2[0],
                startCol = _selectedRange2[1];

            curHot.populateFromArray(startRow, startCol, data);
            curHot.selectCell.apply(curHot, [startRow, startCol, startRow + rlen - 1, startCol + data[0].length - 1]);
          }
        }
      };

      function tokenize() {
        return copiedStr.split('\n').filter(function (rowData) {
          return rowData.trim();
        }).map(function (rowData) {
          return rowData.split('\t');
        });
      }

      ctrl.undo = function () {
        if (curHot) {
          curHot.undo();
        }
      };

      ctrl.redo = function () {
        if (curHot) {
          curHot.redo();
        }
      };

      ctrl.add = function (hot) {
        hot.updateSettings({
          afterSelectionEnd: function afterSelectionEnd(startRow, startCol, endRow, endCol) {
            curHot = this;
            selectedRange = this.getSelected();
          }
        });
      };
    }]
  };
}]);
//# sourceMappingURL=ht-copy-paste.js.map

'use strict';

/**
 * @ngdoc directive
 * @name ht-utils.directive:CheatButton
 * @description
 * # CheatButton
 *
 * <cheat-button
 *    data-datarows="bs"
 *    data-table-title="条件"
 *    data-button-title="環境条件"
 *    data-placement="right">
 * </cheat-button>
 */

angular.module('ht-utils').directive('cheatButton', ['$sce', function ($sce) {
  var defaults = {
    titles: {
      button: '対応表',
      table: '入力値'
    },
    placement: 'right'
  };

  return {
    restrict: 'EA',
    template: function template(element, attrs) {
      var btnTitle = attrs.buttonTitle || defaults.titles.button;
      var placement = attrs.placement || defaults.placement;

      return '' + ' <button uib-popover-html="$chtBtnCtrl.html"' + '     popover-placement="{{$chtBtnCtrl.placement}}"' + '     class="btn btn-default"' + '     type="button">' + '   {{$chtBtnCtrl.buttonTitle}}' + ' </button>';
    },
    scope: {},
    bindToController: {
      datarows: '=',
      placement: '@',
      buttonTitle: '@'
    },
    controllerAs: '$chtBtnCtrl',
    controller: angular.noop,
    link: function postLink(scope, element, attrs) {
      var ctrl = scope.$chtBtnCtrl;

      var tableTitle = attrs.tableTitle || defaults.titles.table;

      var ngRepeat = ctrl.datarows.map(function (datarow) {
        return '' + ' <tr>' + '   <th class="htDimmed">' + datarow.no + '</th>' + '   <td class="htDimmed">' + (datarow.label || datarow.value) + '</td>' + ' </tr>';
      }).join('');

      var html = '' + '  <div class="handsontable">' + '    <table class="htCore cheat-table">' + '      <colgroup>' + '        <col style="width: 50px;">' + '        <col style="min-width: 50px;">' + '      </colgroup>' + '      <thead>' + '        <tr>' + '          <th class="htDimmed">#</th>' + '          <th class="htDimmed">' + tableTitle + '</th>' + '        </tr>' + '      </thead>' + '      <tbody>' + '        ' + ngRepeat + '      </tbody>' + '    </table>' + '  </div>';

      ctrl.html = $sce.trustAsHtml(html);
    }
  };
}]);
//# sourceMappingURL=cheat-button.js.map

'use strict';

/**
 * @ngdoc service
 * @name ht-utils.htSpeedInput
 * @description
 * # htSpeedInput
 * Service in the ht-utils.
 */

angular.module('ht-utils').service('htSpeedInput', function () {

  this.getRenderer = function (items, useLabelAsData) {
    return function (hot, td, row, col, prop, no, cellProperties) {
      Handsontable.renderers.BaseRenderer.apply(this, arguments);

      var label = '';
      if (no) {
        if (/^\d+$/.test(no)) {
          var item = _.find(items, function (item) {
            return item.no == no;
          });
          if (item) {
            label = item.label || item.value;
            if (useLabelAsData) {
              var datarow = hot.getSourceDataAtRow(row);
              datarow[prop] = label;
            }
          }
        } else {
          label = no;
        }
      }
      angular.element(td).text(label);
      return td;
    };
  };
});
//# sourceMappingURL=ht.speed-input.js.map
