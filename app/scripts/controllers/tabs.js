'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:TabsCtrl
 * @description
 * # TabsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('TabsCtrl', ['$scope', '$rootScope', 'appConfig',
    function($scope, $rootScope, appConfig) {
      var tabs = this;

      tabs.messages = appConfig.messages.tabs;

      $rootScope.$on('$routeChangeSuccess', function(e, $route) {
        tabs.path = $route.$$route.originalPath.substring(1) || 'basic-information';
      });
    }
  ]);
