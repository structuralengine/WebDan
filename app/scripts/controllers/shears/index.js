'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:ShearsIndexCtrl
 * @description
 * # ShearsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('ShearsIndexCtrl', function ($scope, $log, Shear) {
    let ctrl = this;

    function init() {
      let nestedHeaders = angular.copy(Shear.nestedHeaders);
      nestedHeaders[0].splice(0, 0, '部材番号', '部材名', '算出点名');
      nestedHeaders[1].splice(0, 0, '', '', '');
      nestedHeaders[2].splice(0, 0, '', '', '');

      let columns = angular.copy(Shear.columns);
      columns.splice(0, 0, {
        data: 'DesignPoint.Member.m_no',
        type: 'numeric'
      }, {
        data: 'DesignPoint.Member.Group.g_name',
      }, {
        data: 'DesignPoint.p_name',
      })

      ctrl.settings = {
        rowHeaders: true,
        colHeaders: true,
        nestedHeaders: nestedHeaders,
        columns: columns
      };

      Shear.$queryAsc().then(function(shears) {
        ctrl.shears = shears;
      });
    }

    init();
  });
