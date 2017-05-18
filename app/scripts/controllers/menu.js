'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MenuCtrl', ['$scope', '$log', 'tmp',
    function ($scope, $log, tmp) {
      let menu = this;

      menu.createNewBucket = function() {
        tmp.data = {};
        $log.debug(tmp);
      };
    }
  ]);
