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
      shapes: [
        {no: 1, name: '矩形'},
        {no: 2, name: 'T 形'},
        {no: 3, name: '円形'},
        {no: 4, name: '台形'},
        {no: 5, name: '小判'},
      ],
      conditions: [
        {no: 1, name: '一般'},
        {no: 2, name: '腐食性'},
        {no: 3, name: '特に厳しい腐食性'},
      ],
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
