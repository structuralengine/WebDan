'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:GroupsIndexCtrl
 * @description
 * # GroupsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('GroupsIndexCtrl', ['$scope', '$filter', 'Group', 'HtHelper', 'handsontableConfig',
    function ($scope, $filter, Group, HtHelper, handsontableConfig) {
      let ctrl = this;

      ctrl.settings = handsontableConfig.create({
        nestedHeaders: Group.nestedHeaders,
        columns: Group.columns,
        resource: Group,
      });

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), function(group) {
          return group.g_no;
        });
      }

      init();
    }
  ]);
