'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersCtrl
 * @description
 * # MembersCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersCtrl', ['$scope', '$filter', 'Member',
    function ($scope, $filter, Member) {
      let ctrl = this;

      function init() {
        let members = Member.query();
        ctrl.members = $filter('orderBy')(members, 'm_no');
        ctrl.settings = Member.settings;
      }

      init();
    }
  ]);
