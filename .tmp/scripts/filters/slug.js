'use strict';

/**
 * @ngdoc filter
 * @name webdan.filter:slug
 * @function
 * @description
 * # slug
 * Filter in the webdan.
 */

angular.module('webdan').filter('slug', function () {
  return function (input) {
    return (input || '').replace(/\s/g, '-');
  };
});
//# sourceMappingURL=slug.js.map
