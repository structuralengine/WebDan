'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:DesignPointsAddCtrl
 * @description
 * # DesignPointsAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('DesignPointsAddCtrl', ['$scope', '$log', '$filter', '$location', 'DesignPoint', 'Member',
    function ($scope, $log, $filter, $location, DesignPoint, Member) {
      let ctrl = this;

      ctrl.submit = function(form) {
        DesignPoint.$add(ctrl.designPoint)
          .then(function(designPoint) {
            ctrl.designPoint = {member: ctrl.designPoint.member};
            form.$setPristine();
            //$location.path('/design-points');
          })
          .catch(function(err) {
            $log.error(err);
          })
      }

      function init() {
        Member.$queryAsc()
          .then(function(members) {
            ctrl.members = $filter('orderBy')(members, 'm_no');
          })
          .catch(function(err) {
            $log.error(err);
          });
      }

      init();
    }
  ]);
