'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersEditCtrl
 * @description
 * # MembersEditCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersEditCtrl', function ($scope, $log, $routeParams, $location, Member, Group) {
    let ctrl = this;
    let memberKey = $routeParams.key;

    ctrl.submit = function(form) {
      Member.save(ctrl.member)
        .then(function(member) {
          form.$setPristine();
          $location.path('/members');
        })
        .catch(function(err) {
          $log.error(err);
        })
    }


    function init() {
      ctrl.groups = Group.query();

      Member.get(memberKey)
        .then(function(member) {
          ctrl.member = member;
        })
        .catch(function(err) {
          $log.error(err);
        });
    }

    init();
  });
