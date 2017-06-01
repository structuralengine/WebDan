'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MenuCtrl
 * @description
 * # MenuCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MenuCtrl', ['$scope', '$log', '$window', 'tmp', 'moment', 'appConfig',
    function ($scope, $log, $window, tmp, moment, appConfig) {
      let menu = this;

      menu.createNewBucket = function() {
        tmp.data = {};
        $log.debug(tmp);
      };

      menu.saveAsFile = function() {
        try {
          let messages = appConfig.messages.groups.file;
          if (tmp.data) {
            throw messages.save.failed;
          }
          else {
            $window.alert(messages.save.nodata);
          }
        }
        catch (e) {
          if ($window.confirm(e)) {
            let content = angular.toJson(tmp.data);
            let format = appConfig.formats.save.timestamp;
            let timestamp = moment().format(format);
            let filename = 'webdan.'+ timestamp +'.json';
            let type = {type: 'application/json; charset=utf-8'};
            let file = new File([content], filename, type);
            saveAs(file);
          }
        }
      }
    }
  ]);
