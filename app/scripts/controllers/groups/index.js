'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:GroupsIndexCtrl
 * @description
 * # GroupsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('GroupsIndexCtrl', ['$scope', '$log', 'Group',
    function ($scope, $log, Group) {
      let ctrl = this;

      function init() {
        ctrl.settings = {
          rowHeaders: true,
          colHeaders: true,
          nestedHeaders: Group.nestedHeaders,
          columns: Group.columns
        };

        Group.$queryAsc().then(function(groups) {
          ctrl.groups = groups;
        });
      }

      init();
    }
  ]);
