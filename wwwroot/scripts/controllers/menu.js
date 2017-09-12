'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MenuCtrl', ['$scope', '$window', '$rootScope', '$lowdb', '$log', '$injector', 'CalculationPrint', 'moment', 'msgConfig', 'appConfig',
    function ($scope, $window, $rootScope, $lowdb, $log, $injector, CalculationPrint, moment, msgConfig, appConfig) {
      let menu = this;
      let resource;

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
        let models = [
          'Member',
          'DesignPoint',
          'Bar',
          'Fatigue',
          'BendingMoment',
          'Shear',
          'SafetyFactor',
          'MaterialStrength',
          'MaterialStrengthRest',
          'BasicInformation',
          'CalculationPrint',
        ];
        models.forEach(function(model) {
          let Model = $injector.get(model);
          Model.reload();
        });
        $rootScope.$broadcast('reload');
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
