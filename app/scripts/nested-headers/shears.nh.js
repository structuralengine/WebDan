'use strict';

/**
 * @ngdoc service
 * @name webdan.nestedHeaders/shearsNestedHeadersConfig
 * @description
 * # nestedHeaders/shearsNestedHeadersConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('shearsNestedHeadersConfig', [
    {row: 0, col: 0, rowspan: 3},
    {row: 0, col: 1, rowspan: 3},
    {row: 0, col: 2, rowspan: 3},
    {row: 0, col: 3, rowspan: 3},

    {row: 1, col: 28, rowspan: 3},
    {row: 1, col: 29, rowspan: 3},
    {row: 1, col: 30, rowspan: 3},
]);
