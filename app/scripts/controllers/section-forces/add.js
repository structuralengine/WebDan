'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SectionForcesAddCtrl
 * @description
 * # SectionForcesAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SectionForcesAddCtrl', function ($scope, $log, SectionForce, Member) {
    let ctrl = this;

    ctrl.submit = function(form) {
      SectionForce.$add(ctrl.sectionForce)
        .then(function(sectionForce) {
          ctrl.sectionForce = {};
          form.$setPristine();
        })
        .catch(function(err) {
          $log.error(err);
        });
    }

    function init() {
      Member.$queryAsc().then(function(members) {
        ctrl.members = members;
      });
    }

    init();
  });
