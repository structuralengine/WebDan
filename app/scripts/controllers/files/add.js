'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:FilesAddCtrl
 * @description
 * # FilesAddCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('FilesAddCtrl', function ($scope, $log, $location, File) {
    let ctrl = this;

    ctrl.submit = function(form) {
      File.$add(ctrl.file)
        .then(function(file) {
          form.$setPristine();
          $location.path('/');
        })
        .catch(function(err) {
          $log.error(err);
        });
    }
  });
