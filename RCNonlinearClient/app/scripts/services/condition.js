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

      let ref = webdanRef.child('conditions');
      let conditions = $firebaseArray(ref);
      let Condition = {};
      let selectOptions;

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

      Condition.selectOptions = function() {
        if (!selectOptions) {
          selectOptions = {};
          conditions.forEach(function(condition) {
            selectOptions[condition.$id] = condition.name;
          });
        }
        return selectOptions;
      }

      Condition.renderName = function(instance, td, row, col, prop, conditionId, cellProperties) {
        return renderProp(td, conditionId, 'name');
      }

      function renderProp(td, conditionId, prop) {
        let condition = conditions.$getRecord(conditionId);
        if (condition) {
          angular.element(td).html(condition[prop] || '');
        }
        return td;
      }

      return Condition;
    }
  ]);
