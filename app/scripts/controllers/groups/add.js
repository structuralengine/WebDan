'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:GroupsAddCtrl
 * @description
 * # GroupsAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('GroupsAddCtrl', ['$scope', '$log', '$location', 'Group',
    function ($scope, $log, $location, Group) {
      let ctrl = this;

      ctrl.submit = function(form) {
        Group.$add(ctrl.group)
          .then(function(group) {
            ctrl.group = {};
            form.$setPristine();
          })
          .catch(function(err) {
            $log.error(err);
          })
      }
    }
  ]);
