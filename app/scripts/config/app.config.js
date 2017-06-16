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
      groups: {
        '1.0': '上層梁',
        '1.1': '中層梁',
        '1.2': '地中梁',
        '1.3': '片持梁',
        '1.4': '頂版',
        '1.5': '底版',
        '1.6': 'フーチング',
        '2.0': '柱 矩形',
        '2.1': '柱 円形',
        '2.2': '柱 小判',
        '3.0': '杭',
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
