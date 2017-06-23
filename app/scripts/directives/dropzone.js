'use strict';

/**
 * @ngdoc directive
 * @name webdan.directive:dropzone
 * @description
 * # dropzone
 */
angular.module('webdan')
  .directive('dropzone', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the dropzone directive');
      }
    };
  });