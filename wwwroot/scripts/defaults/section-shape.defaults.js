'use strict';

/**
 * @ngdoc service
 * @name webdan.defaults/sectionShapeDefaults
 * @description
 * # defaults/sectionShapeDefaults
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('sectionShapeDefaults', [
    {no: 1, value: '矩形'},
    {no: 2, value: 'T 形'},
    {no: 3, value: '円形'},
    {no: 4, value: '台形'},
    {no: 5, value: '小判'},
  ]);
