'use strict';

/**
 * @ngdoc service
 * @name webdan.appConfig
 * @description
 * # appConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('appConfig', {
    defaults: {
      member: {
        length: 40,
      },
      bar: {
        rebar_sides: {
          1: "上",
          2: "下",
        },
      },
      fatigue: {
        rebar_sides: {
          1: '曲げ用・上',
          2: '曲げ用・下',
          3: 'せん断用',
        },
      },
    },
  });
