'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:FilesIndexCtrl
 * @description
 * # FilesIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('FilesIndexCtrl', function ($scope, File) {
    let ctrl = this;

    function init() {
      ctrl.settings = {
        rowHeaders: true,
        colHeaders: true,
        nestedHeaders: File.nestedHeaders,
        columns: File.columns
      };

      ctrl.files = File.query();
    }

    init();
  });
