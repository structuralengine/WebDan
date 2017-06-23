'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MenuCtrl', ['$scope', '$window', '$route', '$log', 'CalculationPrint', 'moment', 'msgConfig', 'appConfig',
    function ($scope, $window, $route, $log, CalculationPrint, moment, msgConfig, appConfig) {
      let menu = this;
      let resource;

      menu.createNewBucket = function() {
        CalculationPrint.clear();
      };

      menu.loadFile = function() {

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
          }
        }
      }
    }
  ]);
