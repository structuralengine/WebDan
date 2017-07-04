'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MembersCtrl
 * @description
 * # MembersCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MembersCtrl', ['$scope', '$filter', '$q', 'Member', 'memberDefaults', 'sectionShapeDefaults', 'conditionDefaults', 'htNestedHeaders', 'membersNestedHeadersConfig',
    function ($scope, $filter, $q, Member, memberDefaults, sectionShapeDefaults, conditionDefaults, htNestedHeaders, membersNestedHeadersConfig) {
      let ctrl = this;

      ctrl.shapes = sectionShapeDefaults;
      ctrl.conditions = conditionDefaults;

      $scope.$on('reload', function(e) {
        init();
      });

      function init() {
        let members = Member.query();

        if (members.length == 0) {
          Member.createDefaultEntries();
          members = Member.query();
        }

        ctrl.members = $filter('orderBy')(members, 'm_no');
        ctrl.settings = Member.settings;
        ctrl.settings.afterRender = function() {
          htNestedHeaders.mergeCells(this, membersNestedHeadersConfig);
        }
      }

      init();
    }
  ]);
