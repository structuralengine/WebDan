'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MenuCtrl', ['$scope', '$window', '$lowdb', '$log', 'CalculationPrint', 'moment', 'msgConfig', 'appConfig',
    function ($scope, $window, $lowdb, $log, CalculationPrint, moment, msgConfig, appConfig) {
      let menu = this;
      let resource;
      let dz;

      menu.createNewBucket = function() {
        CalculationPrint.clear();
        reload();
      };

      menu.loadFile = function(file) {
        $lowdb.load(file)
          .then(function() {
            reload();
          }, function(err) {
            $window.alert(err);
          });
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
            $lowdb.download();
          }
        }
      };
    }
  ]);
