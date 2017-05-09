'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:ConditionsIndexCtrl
 * @description
 * # ConditionsIndexCtrl
 * Controller of the webdan
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

angular.module('webdan').controller('ConditionsIndexCtrl', ['$scope', '$log', 'Condition', function ($scope, $log, Condition) {
  var _ctrl$settings;

  var ctrl = this;
  var origConditions;

  ctrl.conditions = [];

  Condition.query().$loaded(function (conditions) {
    origConditions = conditions;
    ctrl.conditions = angular.copy(conditions);
  });

  ctrl.settings = (_ctrl$settings = {
    minSpareRows: 1,
    colHeaders: true,
    rowHeaders: true
  }, _defineProperty(_ctrl$settings, 'colHeaders', ['部材名']), _defineProperty(_ctrl$settings, 'columns', [{ data: 'name' }]), _defineProperty(_ctrl$settings, 'afterChange', function afterChange(changes, source) {
    (changes || []).forEach(function (change) {
      var _change = _slicedToArray(change, 4),
          idx = _change[0],
          prop = _change[1],
          oldVal = _change[2],
          newVal = _change[3];

      var condition = ctrl.conditions[idx];
      if (condition) {
        condition.$dirty = true;
      }
    });
  }), _ctrl$settings);

  ctrl.isDirty = function () {
    return ctrl.conditions.some(function (condition) {
      return !!condition.$dirty;
    });
  };

  ctrl.save = function () {
    ctrl.conditions.forEach(function (condition) {
      if (!condition.$dirty) {
        return;
      }

      try {
        if (Condition.isEmpty(condition)) {
          var idx = ctrl.conditions.indexOf(condition);
          if (!condition.$id) {
            removeCondition(idx);
          } else {
            Condition.remove(condition).then(function (ref) {
              removeCondition(idx);
            });
          }
        } else {
          if (condition.$id) {
            Condition.save(condition).then(function (ref) {
              resetDirty(condition);
            });
          } else {
            Condition.add(condition).then(function (ref) {
              condition.$id = ref.key;
              resetDirty(condition);
            });
          }
        }
      } catch (e) {
        $log.error(e);
      }
    });
  };

  function removeCondition(idx) {
    ctrl.conditions.splice(idx, 1);
  }

  function resetDirty(condition) {
    condition.$dirty = false;
  }
}]);
//# sourceMappingURL=index.js.map
