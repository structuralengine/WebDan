'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersCtrl
 * @description
 * # MembersCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersCtrl', ['$scope', '$filter', 'Member', 'appConfig',
    function ($scope, $filter, Member, appConfig) {
      let ctrl = this;

      function init() {
        let members = Member.query();
        if (members.length == 0) {
          let count = appConfig.defaults.member.length || 40;
          let primaryKey = Member.primaryKey;
          for (let i = 1; i <= count; i++) {
            let data = {};
            data[primaryKey] = i;
            Member.save(data);
          }
          members = Member.query();
        }
        ctrl.members = $filter('orderBy')(members, 'm_no');
        ctrl.settings = Member.settings;
      }

      init();
    }
  ]);
