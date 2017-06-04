'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MemberSectionsIndexCtrl
 * @description
 * # MemberSectionsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MemberSectionsIndexCtrl', ['$scope', '$log', '$filter', 'MemberSection', 'Member', 'handsontableConfig',
    function($scope, $log, $filter, MemberSection, Member, handsontableConfig) {
      let ctrl = this;

      function init() {
        let columns = angular.copy(MemberSection.columns);
        columns[2].renderer = Member.getRenderer('Group.g_no');
        columns[3].renderer = Member.getRenderer('Group.g_name');

        ctrl.settings = handsontableConfig.create({
          resource: MemberSection,
          nestedHeaders: MemberSection.nestedHeaders,
          columns: columns,
        });

        ctrl.memberSections = $filter('orderBy')(MemberSection.query(), function(memberSection) {
          return memberSection.m_no;
        });
      }

      init();
    }
  ]);
