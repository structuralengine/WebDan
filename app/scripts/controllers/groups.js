'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:GroupsCtrl
 * @description
 * # GroupsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('GroupsCtrl', ['$scope', '$filter', 'Group',
    function ($scope, $filter, Group) {
      let ctrl = this;

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), 'g_no');
        ctrl.settings = Group.settings;
      }

      init();
    }
  ]);
