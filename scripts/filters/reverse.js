'use strict';

angular.module('webdan')
  .filter('reverse', function () {
      return function (input) {
          return angular.isArray(items) ? items.slice().reverse() : [];
      };
  });
