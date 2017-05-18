'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:GroupsEditCtrl
 * @description
 * # GroupsEditCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('GroupsEditCtrl', function ($scope, $log, $routeParams, $location, Group, File) {

    let ctrl = this;
    let key = $routeParams.key;

    ctrl.submit = function(form) {
      Group.save(ctrl.group)
        .then(function(g) {
          form.$setPristine();
          $location.path('/gruops');
        })
        .catch(function(err) {
          $log.error(err);
        })
    }


    function init() {
      ctrl.files = File.query();

      Group.$get(key)
        .then(function(group) {
          ctrl.group = group;
        })
        .catch(function(err) {
          $log.error(err);
        });
    }

    init();
  });
