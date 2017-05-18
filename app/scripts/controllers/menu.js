'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MenuCtrl', ['$scope', '$log', 'tmp', 'moment',
    function ($scope, $log, tmp, moment) {
      let menu = this;

      menu.createNewBucket = function() {
        tmp.data = {};
        $log.debug(tmp);
      };

      menu.saveAsFile = function() {
        try {
          throw 'save failed';
        }
        catch (e) {
          let content = angular.toJson(tmp.data);
          let timestamp = moment().format('YYYYMMDD-HHmmss');
          let filename = "webdan."+ timestamp +".json";
          let type = {type: "application/json; charset=utf-8"};
          let file = new File([content], filename, type);
          saveAs(file);
        }
      }
    }
  ]);
