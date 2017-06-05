'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BendingMomentsIndexCtrl
 * @description
 * # BendingMomentsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BendingMomentsIndexCtrl', ['$scope', '$filter', 'BendingMoment', 'DesignPoint', 'handsontableConfig',
    function ($scope, $filter, BendingMoment, DesignPoint, handsontableConfig) {
      let ctrl = this;

      function init() {
        let nestedHeaders = BendingMoment.nestedHeaders;
        let columns = BendingMoment.columns;

        ctrl.settings = handsontableConfig.create({
          nestedHeaders: nestedHeaders,
          columns: columns,
          resource: BendingMoment,
        });

        let bendingMoments = BendingMoment.query().filter(function(bendingMoment) {
          if (bendingMoment.m_no) {
            return bendingMoment.m_no;
          }
          else {
            let designPoint = DesignPoint.getAsc(bendingMoment.designPoint_id);
            bendingMoment.m_no = designPoint.Member.m_no;
            return designPoint.p_name;
          }
        });

        ctrl.bendingMoments = $filter('orderBy')(bendingMoments, function(bendingMoment) {
          return bendingMoment.m_no;
        })
      }

      init();
    }
  ]);
