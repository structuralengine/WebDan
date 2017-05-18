'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersAddCtrl
 * @description
 * # MembersAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersAddCtrl', function ($scope, $log, Member, Group) {

    let ctrl = this;

    ctrl.submit = function(form) {
      Member.$add(ctrl.member)
        .then(function(member) {
          delete ctrl.member.m_no;
          form.$setPristine();
        })
        .catch(function(err) {
          $log.error(err);
        })
    }


    function init() {
      ctrl.groups = Group.query();
    }

    init();
  });
