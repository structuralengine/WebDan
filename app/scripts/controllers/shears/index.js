'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:ShearsIndexCtrl
 * @description
 * # ShearsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('ShearsIndexCtrl', ['$scope', '$filter', 'Shear', 'DesignPoint', 'handsontableConfig',
    function ($scope, $filter, Shear, DesignPoint, handsontableConfig) {
      let ctrl = this;

      function init() {
        let nestedHeaders = angular.copy(Shear.nestedHeaders);
        let columns = angular.copy(Shear.columns);

        ctrl.settings = handsontableConfig.create({
          nestedHeaders: nestedHeaders,
          columns: columns,
          resource: Shear,
        });

        let shears = Shear.query().filter(function(shear) {
          if (shear.m_no) {
            return shear.m_no;
          }
          else {
            let designPoint = DesignPoint.getAsc(shear.designPoint_id);
            shear.m_no = designPoint.Member.m_no;
            return designPoint.p_name;
          }
        });

        ctrl.shears = $filter('orderBy')(shears, function(shear) {
          return shear.m_no;
        })
      }

      init();
    }
  ]);
