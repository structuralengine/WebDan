'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MemberSectionsAddCtrl
 * @description
 * # MemberSectionsAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MemberSectionsAddCtrl', ['$scope', '$log', 'MemberSection', 'Member',
    function($scope, $log, MemberSection, Member) {
      let ctrl = this;

      ctrl.submit = function(form) {
        MemberSection.$add(ctrl.memberSection)
          .then(function(memberSection) {
            delete ctrl.memberSection.p_name;
            form.$setPristine();
          })
          .catch(function(err) {
            $log.error(err);
          })
      }

      function init() {
        Member.$queryAsc().then(function(members) {
          ctrl.members = members;
        });
      }

      init();
    }
  ]);
