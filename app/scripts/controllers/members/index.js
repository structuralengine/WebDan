'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersIndexCtrl
 * @description
 * # MembersIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersIndexCtrl', function ($scope, $log, $filter, Member, Group) {
    let ctrl = this;

    ctrl.changeGroup = function(group) {
      group;
    }

    function init() {
      Group.$queryAsc().then(function(groups) {
        ctrl.groups = groups;
      });

      ctrl.settings = {
        rowHeaders: true,
        colHeaders: true,
        nestedHeaders: Member.nestedHeaders,
        columns: Member.columns
      };

      Member.$queryAsc().then(function(members) {
        ctrl.members = $filter('orderBy')(members, 'm_no');
      });
    }

    init();
  });
