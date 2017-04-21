'use strict';

/**
 * @ngdoc service
 * @name webdan.MemberSection
 * @description
 * # MemberSection
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MemberSection', ['webdanRef', '$firebaseArray', '$firebaseObject',
    function(webdanRef, $firebaseArray, $firebaseObject) {

      var ref = webdanRef.child('memberSections');
      var memberSections = $firebaseArray(ref);
      var MemberSection = {};


      return MemberSection;
    }
  ]);
