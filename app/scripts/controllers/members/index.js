'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersIndexCtrl
 * @description
 * # MembersIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersIndexCtrl', ['$scope', '$log', '$filter', 'Member', 'Group', 'handsontableConfig',
    function($scope, $log, $filter, Member, Group, handsontableConfig) {
      let ctrl = this;

      function init() {
        let columns = angular.copy(Member.columns);
        columns[0].renderer = Group.getRenderer('g_name');

        ctrl.settings = handsontableConfig.create({
          nestedHeaders: Member.nestedHeaders,
          columns: columns,
          resource: Member,
        });

        ctrl.members = $filter('orderBy')(Member.query(), function(member) {
          return member.m_no;
        });
      }

      init();
    }
  ]);
