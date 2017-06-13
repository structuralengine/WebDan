'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MaterialStrengthRestsCtrl
 * @description
 * # MaterialStrengthRestsCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MaterialStrengthRestsCtrl', ['$scope', '$filter', 'HtObject', 'MaterialStrengthRest', 'Group', 'materialStrengthRestConfig',
    function ($scope, $filter, HtObject, MaterialStrengthRest, Group, materialStrengthRestConfig) {
      let ctrl = this;

      function init() {
        ctrl.groups = $filter('orderBy')(Group.query(), function(group) {
          return group.g_no;
        })

        let rests = MaterialStrengthRest.query();
        let gropudedRests = _.groupBy(rests, function(rest) {
          return rest.g_no;
        });

        let store = MaterialStrengthRest.store;
        Object.keys(gropudedRests).forEach(function(g_no) {
          let rests = gropudedRests[g_no];
          gropudedRests[g_no] = rests.map(function(rest) {
            return new HtObject(rest, {
              store: store,
              config: materialStrengthRestConfig,
            });
          })
        });

        ctrl.materialStrengthRests = gropudedRests;
      }

      init();
    }
  ]);
