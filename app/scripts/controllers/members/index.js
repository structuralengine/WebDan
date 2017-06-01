'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersIndexCtrl
 * @description
 * # MembersIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersIndexCtrl', ['$scope', '$log', '$filter', 'Member', 'Group',
    function($scope, $log, $filter, Member, Group) {
      let ctrl = this;

      ctrl.settings = {
        rowHeaders: true,
        colHeaders: true,
        nestedHeaders: Member.nestedHeaders,
        columns: Member.columns
      };

      function init() {
        let members = Member.$query();
        ctrl.members = $filter('orderBy')(members, 'm_no');
      }

      init();
    }
  ]);
