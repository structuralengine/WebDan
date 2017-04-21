'use strict';

/**
 * @ngdoc service
 * @name webdan.Bar
 * @description
 * # Bar
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Bar', ['webdanRef', '$firebaseArray', '$firebaseObject', '$firebaseUtils',
    function(webdanRef, $firebaseArray, $firebaseObject, $firebaseUtils) {

      let ref = webdanRef.child('bars');
      let bars = $firebaseArray(ref);
      let Bar = {};

      Bar.query = function(copy) {
        return bars;
      }

      Bar.remove = function(bar) {
        let origBar = bars.$getRecord(bar.$id);
        return bars.$remove(origBar).catch(function(err) {
          throw err;
        });
      }

      Bar.save = function(bar) {
        let origBar = bars.$getRecord(bar.$id);
        let plainBar = $firebaseUtils.toJSON(bar);
        angular.extend(origBar, plainBar);
        return bars.$save(origBar).catch(function(err) {
          throw err;
        });
      }

      Bar.add = function(bar) {
        return bars.$add(bar).catch(function(err) {
          throw err;
        });
      }

      Bar.isEmpty = function(bar) {
        return false;
      }

      return Bar;
    }
  ]);
