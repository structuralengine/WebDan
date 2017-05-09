'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersIndexCtrl
 * @description
 * # MembersIndexCtrl
 * Controller of the webdan
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

angular.module('webdan').controller('MembersIndexCtrl', ['$scope', '$log', 'Member', function ($scope, $log, Member) {
  var _ctrl$settings;

  var ctrl = this;
  var origMembers;

  ctrl.members = [];

  Member.query().$loaded(function (members) {
    origMembers = members;
    ctrl.members = angular.copy(members);
  });

  ctrl.settings = (_ctrl$settings = {
    minSpareRows: 1,
    colHeaders: true,
    rowHeaders: true
  }, _defineProperty(_ctrl$settings, 'colHeaders', ['グループ No.', '部材名']), _defineProperty(_ctrl$settings, 'columns', [{ data: 'g_no' }, { data: 'g_name' }]), _defineProperty(_ctrl$settings, 'afterChange', function afterChange(changes, source) {
    (changes || []).forEach(function (change) {
      var _change = _slicedToArray(change, 4),
          idx = _change[0],
          prop = _change[1],
          oldVal = _change[2],
          newVal = _change[3];

      var member = ctrl.members[idx];
      if (member) {
        member.$dirty = true;
      }
    });
  }), _ctrl$settings);

  ctrl.isDirty = function () {
    return ctrl.members.some(function (member) {
      return !!member.$dirty;
    });
  };

  ctrl.save = function () {
    ctrl.members.forEach(function (member) {
      if (!member.$dirty) {
        return;
      }

      try {
        if (Member.isEmpty(member)) {
          var idx = ctrl.members.indexOf(member);
          if (!member.$id) {
            removeMember(idx);
          } else {
            Member.remove(member).then(function (ref) {
              removeMember(idx);
            });
          }
        } else {
          if (member.$id) {
            Member.save(member).then(function (ref) {
              resetDirty(member);
            });
          } else {
            Member.add(member).then(function (ref) {
              member.$id = ref.key;
              resetDirty(member);
            });
          }
        }
      } catch (e) {
        $log.error(e);
      }
    });
  };

  function removeMember(idx) {
    ctrl.members.splice(idx, 1);
  }

  function resetDirty(member) {
    member.$dirty = false;
  }
}]);
//# sourceMappingURL=index.js.map
