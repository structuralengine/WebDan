'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:TabsCtrl
 * @description
 * # TabsCtrl
 * Controller of the webdan
 */

angular.module('webdan').controller('TabsCtrl', ['$scope', '$rootScope', '$filter', 'appConfig', 'Page', function ($scope, $rootScope, $filter, appConfig, Page) {
  var tabs = this;

  Page.query().$loaded(function (pages) {
    var slug = $filter('slug');
    pages.forEach(function (page) {
      page.slug = slug(page.en);
    });

    tabs.pages = pages;
  });

  $rootScope.$on('$routeChangeSuccess', function (e, $route) {
    tabs.path = $route.$$route.originalPath.substring(1) || 'basic-information';
  });
}]);
//# sourceMappingURL=tabs.js.map
