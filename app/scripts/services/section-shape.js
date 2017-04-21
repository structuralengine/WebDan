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
    function(webdanRef, $firebaseArray, $firebaseObject $firebaseUtils) {

      var ref = webdanRef.child('sectionShapes');
      var sectionShapes = $firebaseArray(ref);
      var SectionShape = {};

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

      return SectionShape;
    }
  ]);
