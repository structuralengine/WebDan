'use strict';

/**
 * @ngdoc service
 * @name webdan.Condition
 * @description
 * # Condition
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Condition', ['webdanRef', '$firebaseArray', '$firebaseObject', '$firebaseUtils',
    function(webdanRef, $firebaseArray, $firebaseObject, $firebaseUtils) {

      var ref = webdanRef.child('conditions');
      var conditions = $firebaseArray(ref);
      var Condition = {};

      Condition.query = function(copy) {
        return conditions;
      }

      Condition.remove = function(condition) {
        let origCondition = conditions.$getRecord(condition.$id);
        return conditions.$remove(origCondition).catch(function(err) {
          throw err;
        });
      }

      Condition.save = function(condition) {
        let origCondition = conditions.$getRecord(condition.$id);
        let plainCondition = $firebaseUtils.toJSON(condition);
        angular.extend(origCondition, plainCondition);
        return conditions.$save(origCondition).catch(function(err) {
          throw err;
        });
      }

      Condition.add = function(condition) {
        return conditions.$add(condition).catch(function(err) {
          throw err;
        });
      }

      Condition.isEmpty = function(condition) {
        return !condition.name.trim();
      }

      return Condition;
    }
  ]);
