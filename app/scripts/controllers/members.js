'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersCtrl
 * @description
 * # MembersCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersCtrl', ['$scope', '$filter', 'Member', 'memberDefaults', 'appConfig',
    function ($scope, $filter, Member, memberDefaults, appConfig) {
      let ctrl = this;

      ctrl.subSettings = {
        rowHeaders: false,
        minSpareRows: 0,
      };
      ctrl.shapes = appConfig.defaults.shapes;
      ctrl.conditions = appConfig.defaults.conditions;

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
