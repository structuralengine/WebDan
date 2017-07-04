'use strict';

/**
 * @ngdoc service
 * @name webdan.nestedHeaders/fatiguesNestedHeadersConfig
 * @description
 * # nestedHeaders/fatiguesNestedHeadersConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('fatiguesNestedHeadersConfig',  [
    {row: 0, col: 0, rowspan: 3},
    {row: 0, col: 1, rowspan: 3},
    {row: 0, col: 2, rowspan: 3},

    {row: 0, col: 4, rowspan: 3},
    {row: 0, col: 5, rowspan: 3},
    {row: 0, col: 6, rowspan: 3},

    {row: 1, col: 11, rowspan: 3},
    {row: 1, col: 12, rowspan: 3},
  ]);
