'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SectionShapesIndexCtrl
 * @description
 * # SectionShapesIndexCtrl
 * Controller of the webdan
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

angular.module('webdan').controller('SectionShapesIndexCtrl', ['$scope', '$log', 'SectionShape', function ($scope, $log, SectionShape) {
  var _ctrl$settings;

  var ctrl = this;
  var origSectionShapes;

  ctrl.sectionShapes = [];

  SectionShape.query().$loaded(function (sectionShapes) {
    origSectionShapes = sectionShapes;
    ctrl.sectionShapes = angular.copy(sectionShapes);
  });

  ctrl.settings = (_ctrl$settings = {
    minSpareRows: 1,
    colHeaders: true,
    rowHeaders: false
  }, _defineProperty(_ctrl$settings, 'colHeaders', ['No', '形状名']), _defineProperty(_ctrl$settings, 'columns', [{ data: 'no', type: 'numeric' }, { data: 'name' }]), _defineProperty(_ctrl$settings, 'afterChange', function afterChange(changes, source) {
    (changes || []).forEach(function (change) {
      var _change = _slicedToArray(change, 4),
          idx = _change[0],
          prop = _change[1],
          oldVal = _change[2],
          newVal = _change[3];

      var sectionShape = ctrl.sectionShapes[idx];
      if (sectionShape) {
        sectionShape.$dirty = true;
      }
    });
  }), _ctrl$settings);

  ctrl.isDirty = function () {
    return ctrl.sectionShapes.some(function (sectionShape) {
      return !!sectionShape.$dirty;
    });
  };

  ctrl.save = function () {
    ctrl.sectionShapes.forEach(function (sectionShape) {
      if (!sectionShape.$dirty) {
        return;
      }

      try {
        if (SectionShape.isEmpty(sectionShape)) {
          var idx = ctrl.sectionShapes.indexOf(sectionShape);
          if (!sectionShape.$id) {
            removeSectionShape(idx);
          } else {
            SectionShape.remove(sectionShape).then(function (ref) {
              removeSectionShape(idx);
            });
          }
        } else {
          if (sectionShape.$id) {
            SectionShape.save(sectionShape).then(function (ref) {
              resetDirty(sectionShape);
            });
          } else {
            SectionShape.add(sectionShape).then(function (ref) {
              sectionShape.$id = ref.key;
              resetDirty(sectionShape);
            });
          }
        }
      } catch (e) {
        $log.error(e);
      }
    });
  };

  function removeSectionShape(idx) {
    ctrl.sectionShapes.splice(idx, 1);
  }

  function resetDirty(sectionShape) {
    sectionShape.$dirty = false;
  }
}]);
//# sourceMappingURL=index.js.map
