'use strict';

/**
 * @ngdoc service
 * @name webdan.SectionShape
 * @description
 * # SectionShape
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('SectionShape', ['webdanRef', '$firebaseArray', '$firebaseObject', '$firebaseUtils',
    function(webdanRef, $firebaseArray, $firebaseObject, $firebaseUtils) {

      var ref = webdanRef.child('sectionShapes');
      var sectionShapes = $firebaseArray(ref);
      var SectionShape = {};
      let selectOptions;

      SectionShape.query = function(copy) {
        return sectionShapes;
      }

      SectionShape.remove = function(sectionShape) {
        let origSectionShape = sectionShapes.$getRecord(sectionShape.$id);
        return sectionShapes.$remove(origSectionShape).catch(function(err) {
          throw err;
        });
      }

      SectionShape.save = function(sectionShape) {
        let origSectionShape = sectionShapes.$getRecord(sectionShape.$id);
        let plainSectionShape = $firebaseUtils.toJSON(sectionShape);
        angular.extend(origSectionShape, plainSectionShape);
        return sectionShapes.$save(origSectionShape).catch(function(err) {
          throw err;
        });
      }

      SectionShape.add = function(sectionShape) {
        return sectionShapes.$add(sectionShape).catch(function(err) {
          throw err;
        });
      }

      SectionShape.isEmpty = function(sectionShape) {
        return !sectionShape.name.trim();
      }

      SectionShape.selectOptions = function() {
        if (!selectOptions) {
          selectOptions = {};
          sectionShapes.forEach(function(sectionShape) {
            selectOptions[sectionShape.$id] = sectionShape.name;
          });
        }
        return selectOptions;
      }

      SectionShape.renderName = function(instance, td, row, col, prop, sectionShapeNo, cellProperties) {
        if (sectionShapes.$resolved) {
          let shapes = sectionShapes.filter(function(shape) {
            return (shape.no == sectionShapeNo);
          });
          if (shapes.length) {
            angular.element(td).html(shapes[0].name);
          }
        }
        return td;
      }

      function renderProp(td, sectionShapeId, prop) {
        let sectionShape = sectionShapes.$getRecord(sectionShapeId);
        if (sectionShape) {
          angular.element(td).html(sectionShape[prop] || '');
        }
        return td;
      }

      return SectionShape;
    }
  ]);
