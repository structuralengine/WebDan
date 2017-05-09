'use strict';

/**
 * @ngdoc service
 * @name webdan.Bar
 * @description
 * # Bar
 * Factory in the webdan.
 */

angular.module('webdan').factory('Bar', ['webdanRef', '$firebaseArray', '$firebaseObject', '$firebaseUtils', function (webdanRef, $firebaseArray, $firebaseObject, $firebaseUtils) {

  var ref = webdanRef.child('bars');
  var bars = $firebaseArray(ref);
  var Bar = {};

  Bar.query = function (copy) {
    return bars;
  };

  Bar.remove = function (bar) {
    var origBar = bars.$getRecord(bar.$id);
    return bars.$remove(origBar).catch(function (err) {
      throw err;
    });
  };

  Bar.save = function (bar) {
    var origBar = bars.$getRecord(bar.$id);
    var plainBar = $firebaseUtils.toJSON(bar);
    angular.extend(origBar, plainBar);
    return bars.$save(origBar).catch(function (err) {
      throw err;
    });
  };

  Bar.add = function (bar) {
    return bars.$add(bar).catch(function (err) {
      throw err;
    });
  };

  Bar.isEmpty = function (bar) {
    return false;
  };

  return Bar;
}]);
//# sourceMappingURL=bar.js.map
