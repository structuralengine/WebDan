'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SectionShapesIndexCtrl
 * @description
 * # SectionShapesIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SectionShapesIndexCtrl', ['$scope', '$log', 'SectionShape',
    function($scope, $log, SectionShape) {
      var ctrl = this;
      var origSectionShapes;

      ctrl.sectionShapes = [];

      SectionShape.query().$loaded(function(sectionShapes) {
        origSectionShapes = sectionShapes;
        ctrl.sectionShapes = angular.copy(sectionShapes);
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
            let sectionShape = ctrl.sectionShapes[idx];
            if (sectionShape) {
              sectionShape.$dirty = true;
            }
          })
        }
      };

      ctrl.isDirty = function() {
        return ctrl.sectionShapes.some(function(sectionShape) {
          return !!sectionShape.$dirty;
        })
      };

      ctrl.save = function() {
        ctrl.sectionShapes.forEach(function(sectionShape) {
          if (!sectionShape.$dirty) {
            return;
          }

          try {
            if (SectionShape.isEmpty(sectionShape)) {
              let idx = ctrl.sectionShapes.indexOf(sectionShape);
              if (!sectionShape.$id) {
                removeSectionShape(idx);
              } else {
                SectionShape.remove(sectionShape).then(function(ref) {
                  removeSectionShape(idx);
                });
              }
            } else {
              if (sectionShape.$id) {
                SectionShape.save(sectionShape).then(function(ref) {
                  resetDirty(sectionShape);
                });
              } else {
                SectionShape.add(sectionShape).then(function(ref) {
                  sectionShape.$id = ref.key;
                  resetDirty(sectionShape);
                });
              }
            }
          } catch (e) {
            $log.error(e);
          }
        })
      }

      function removeSectionShape(idx) {
        ctrl.sectionShapes.splice(idx, 1);
      }

      function resetDirty(sectionShape) {
        sectionShape.$dirty = false;
      }
    }
  ]);
