'use strict';

/**
 * @ngdoc service
 * @name webdan.defaults/conditionDefaults
 * @description
 * # defaults/conditionDefaults
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('conditionDefaults', [
    {no: 1, name: '一般'},
    {no: 2, name: '腐食性'},
    {no: 3, name: '特に厳しい腐食性'},
  ]);
