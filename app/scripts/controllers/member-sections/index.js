'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MemberSectionsIndexCtrl
 * @description
 * # MemberSectionsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MemberSectionsIndexCtrl', function ($scope, $log, $q, MemberSection) {
    let ctrl = this;

    ctrl.settings = {
      colHeaders: true,
      nestedHeaders: MemberSection.nestedHeaders,
      columns: MemberSection.columns
    };

    function init() {
      MemberSection.$queryAsc().then(function(memberSections) {
        ctrl.memberSections = memberSections;
      });
    }

    init();
  });
