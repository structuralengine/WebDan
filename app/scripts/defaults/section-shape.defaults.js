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
    {no: 1, name: '矩形'},
    {no: 2, name: 'T 形'},
    {no: 3, name: '円形'},
    {no: 4, name: '台形'},
    {no: 5, name: '小判'},
  ]);
