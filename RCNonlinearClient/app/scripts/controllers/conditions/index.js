'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:ConditionsIndexCtrl
 * @description
 * # ConditionsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('ConditionsIndexCtrl', ['$scope', '$log', 'Condition',
    function($scope, $log, Condition) {
      var ctrl = this;
      var origConditions;

      ctrl.conditions = [];

      Condition.query().$loaded(function(conditions) {
        origConditions = conditions;
        ctrl.conditions = angular.copy(conditions);
      });

      ctrl.settings = {
        minSpareRows: 1,
        colHeaders: true,
        rowHeaders: true,
        colHeaders: ['部材名'],
        columns: [{data: 'name'}],
        afterChange: function(changes, source) {
          (changes || []).forEach(function(change) {
            let [idx, prop, oldVal, newVal] = change;
            let condition = ctrl.conditions[idx];
            if (condition) {
              condition.$dirty = true;
            }
          })
        }
      };

      ctrl.isDirty = function() {
        return ctrl.conditions.some(function(condition) {
          return !!condition.$dirty;
        })
      };

      ctrl.save = function() {
        ctrl.conditions.forEach(function(condition) {
          if (!condition.$dirty) {
            return;
          }

          try {
            if (Condition.isEmpty(condition)) {
              let idx = ctrl.conditions.indexOf(condition);
              if (!condition.$id) {
                removeCondition(idx);
              } else {
                Condition.remove(condition).then(function(ref) {
                  removeCondition(idx);
                });
              }
            } else {
              if (condition.$id) {
                Condition.save(condition).then(function(ref) {
                  resetDirty(condition);
                });
              } else {
                Condition.add(condition).then(function(ref) {
                  condition.$id = ref.key;
                  resetDirty(condition);
                });
              }
            }
          } catch (e) {
            $log.error(e);
          }
        })
      }

      function removeCondition(idx) {
        ctrl.conditions.splice(idx, 1);
      }

      function resetDirty(condition) {
        condition.$dirty = false;
      }
    }
  ]);
