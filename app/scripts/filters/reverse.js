'use strict';

/**
 * @ngdoc filter
 * @name webdan.filter:reverse
 * @function
 * @description
 * # reverse
 * Filter in the webdan.
 */
angular.module('webdan')
  .filter('reverse', function () {
    return function (input) {
      return angular.isArray(items)? items.slice().reverse() : [];
    };
  });
