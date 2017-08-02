'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:TabsCtrl
 * @description
 * # TabsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('TabsCtrl', ['$scope', '$rootScope',
    function($scope, $rootScope) {
      let tabs = this;

      $rootScope.$on('$routeChangeSuccess', function(e, $route) {
        tabs.path = $route.$$route.originalPath.substring(1) || 'members';
      });
    }
  ]);
