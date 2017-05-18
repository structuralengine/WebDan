'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:SectionForcesIndexCtrl
 * @description
 * # SectionForcesIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('SectionForcesIndexCtrl', function ($scope, $log, SectionForce) {
    let ctrl = this;

    ctrl.settings = {
      rowHeaders: true,
      colHeaders: true,
      nestedHeaders: SectionForce.nestedHeaders,
      columns: SectionForce.columns
    };

    function init() {
      SectionForce.$queryAsc().then(function(sectionForces) {
        ctrl.sectionForces = sectionForces;
      });
    }

    init();
  });
