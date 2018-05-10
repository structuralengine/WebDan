'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MainCtrl', ['$scope',
    function ($scope) {

      $scope.settings = {
        colHeaders: true,
        rowHeaders: true,
        minSpareRows: 1,
        contextMenu: ['romove_row'],
        columns: [
          {data: 'name'},
        ],
      };

      $scope.bs = [
        {name: 'b1'},
      ];

    }
  ]);
