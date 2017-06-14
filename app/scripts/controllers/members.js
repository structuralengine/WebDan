'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersCtrl
 * @description
 * # MembersCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersCtrl', ['$scope', '$filter', 'Member', 'memberDefaults',
    function ($scope, $filter, Member, memberDefaults) {
      let ctrl = this;

      function init() {
        let members = Member.query();

        if (members.length == 0) {
          memberDefaults.forEach(function(member) {
            Member.save(member);
          })
          members = Member.query();
        }

        ctrl.members = $filter('orderBy')(members, 'm_no');
        ctrl.settings = Member.settings;
      }

      init();
    }
  ]);
