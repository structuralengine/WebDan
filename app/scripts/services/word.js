'use strict';

/**
 * @ngdoc service
 * @name webdan.Word
 * @description
 * # Word
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Word', ['webdanRef', '$firebaseArray',
    function(webdanRef, $firebaseArray) {

      var ref = webdanRef.child('words');
      var Word = {};
      var pageRef;

      Word.query = function(pageKey) {
        pageRef = ref.child(pageKey);
        return $firebaseArray(pageRef);
      };

      return Word;
    }
  ]);
