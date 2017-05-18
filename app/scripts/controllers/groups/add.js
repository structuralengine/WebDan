'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:GroupsAddCtrl
 * @description
 * # GroupsAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('GroupsAddCtrl', function ($scope, $log, $location, Group, File) {

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


    function init() {
      ctrl.files = File.query();
    }

    init();
  });
