'use strict';

/**
 * @ngdoc directive
 * @name webdan.directive:ngHideAuth
 * @description
 * # ngHideAuth
 */
angular.module('webdan')
  .directive('ngHideAuth', ['Auth', '$timeout', function (Auth, $timeout) {
    'use strict';

    return {
      restrict: 'A',
      link: function(scope, el) {
        el.addClass('ng-cloak'); // hide until we process it
        function update() {
          // sometimes if ngCloak exists on same element, they argue, so make sure that
          // this one always runs last for reliability
          $timeout(function () {
            el.toggleClass('ng-cloak', !!Auth.$getAuth());
          }, 0);
        }

        Auth.$onAuthStateChanged(update);
        update();
      }
    };
  }]);
