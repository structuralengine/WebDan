'use strict';

/**
 * @ngdoc service
 * @name webdan.webdanRef
 * @description
 * # webdanRef
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('webdanRef', ['Ref',
    function (Ref) {
      return Ref.child('webdan');
    }
  ]);
