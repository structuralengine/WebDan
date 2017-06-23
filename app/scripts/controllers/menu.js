'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MenuCtrl', ['$scope', '$window', '$log', 'CalculationPrint', 'moment', 'msgConfig', 'appConfig',
    function ($scope, $window, $log, CalculationPrint, moment, msgConfig, appConfig) {
      let menu = this;

      menu.createNewBucket = function() {
      };

      menu.saveAsFile = function() {
        try {
          let msg = msgConfig.files;
          throw msg.save.failed;
        }
        catch (e) {
          if ($window.confirm(e)) {
            let format = appConfig.formats.save.timestamp;
            let timestamp = moment().format(format);
            let filename = 'webdan.'+ timestamp +'.json';
            CalculationPrint.saveAs(filename);
            // let content = angular.toJson(storedData);
            // let format = appConfig.formats.save.timestamp;
            // let timestamp = moment().format(format);
            // let type = {type: 'application/json; charset=utf-8'};
            // let file = new File([content], filename, type);
            // saveAs(file);
          }
        }
      }
    }
  ]);
