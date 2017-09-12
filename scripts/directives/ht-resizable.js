'use strict';

angular.module('webdan')
  .directive('htResizable', ['$window', '$timeout', '$log', 'hotRegisterer',
    function ($window, $timeout, $log, hotRegisterer) {
      return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
          if (angular.isUndefined(attrs.hotId)) {
            $log.error('required hot-id for Handsontable');
            return;
          }

          let hot;
          let delay = angular.isDefined(attrs.delay) ? parseInt(attrs.delay): 200;

          let promise;
          angular.element($window).on('resize', function(e) {
            if (promise) {
              $timeout.cancel(promise);
              promise = null;
            }
            promise = $timeout(function() {
              resizeHt();
            }, delay);
          });

          function resizeHt() {
            if (!hot) {
              hot = hotRegisterer.getInstance(attrs.hotId);
            }
            if (hot) {
              hot.render();
            }
          }

          element.addClass('ht-resizable');
        }
      };
    }
  ]);
