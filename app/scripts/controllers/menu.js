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
      let resource;
      let dz;

      menu.createNewBucket = function() {
        CalculationPrint.clear();
        reload();
      };

      menu.loadFile = function(file) {
        try {
          let reader = new FileReader();
          reader.onload = function(e) {
            let json = e.target.result;
            let loadedData = angular.fromJson(json);
            CalculationPrint.load(loadedData);
            reload();
          };
          reader.readAsText(file);
        }
        catch (e) {
          $log.error(e);
        }
      };

      function reload() {
        $window.location.reload();
      }

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
          }
        }
      };
    }
  ]);
