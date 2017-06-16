'use strict';

/**
 * @ngdoc service
 * @name webdan.defaults/rebarSideFatigueDefaults
 * @description
 * # defaults/rebarSideFatigueDefaults
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('rebarSideFatigueDefaults', {
    rebar_sides: {
      1: '曲げ用・上',
      2: '曲げ用・下',
      3: 'せん断用',
    },
  });
