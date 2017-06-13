'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MemberSectionsCtrl
 * @description
 * # MemberSectionsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MemberSectionsCtrl', ['$scope', '$filter', 'MemberSection',
    function ($scope, $filter, MemberSection) {
      let ctrl = this;

      function init() {
        let memberSections = MemberSection.query();
        ctrl.memberSections = $filter('orderBy')(memberSections, 'm_no');
        ctrl.settings = MemberSection.settings;
      }

      init();
    }
  ]);
