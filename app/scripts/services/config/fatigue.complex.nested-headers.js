'use strict';

/**
 * @ngdoc service
 * @name webdan.fatigueComplexNestedHeadersConfig
 * @description
 * # fatigueComplexNestedHeadersConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('fatigueComplexNestedHeadersConfig', [
    // 1
    [
      '部材番号',
      '算出点名',
      '断面',
      '位置',
      {
        label: '曲げ用',
        colspan: 8,
      },
      {
        label: 'せん断用',
        colspan: 8,
      }
    ],
    // 2
    [
      '',
      '',
      'B',
      '',
      'S<sub>A</sub>/S<sub>C</sub>',
      'S<sub>B</sub>/S<sub>C</sub>',
      {
        label: '&kappa; = 0.06',
        colspan: 2,
      },
      {
        label: '&kappa; = 0.12',
        colspan: 2,
      },
      {
        label: '複線補正 r<sub>2</sub>',
        colspan: 2,
      },
      'S<sub>A</sub>/S<sub>C</sub>',
      'S<sub>B</sub>/S<sub>C</sub>',
      {
        label: '&kappa; = 0.06',
        colspan: 2,
      },
      {
        label: '&kappa; = 0.12',
        colspan: 2,
      },
      {
        label: '複線補正 r<sub>2</sub>',
        colspan: 2,
      },
    ],
    // 3
    [
      '',
      '',
      'H',
      '',
      '',
      '',
      'N<sub>A</sub>',
      'N<sub>B</sub>',
      'N<sub>A</sub>',
      'N<sub>B</sub>',
      '&alpha;',
      '&beta;',
      '',
      '',
      'N<sub>A</sub>',
      'N<sub>B</sub>',
      'N<sub>A</sub>',
      'N<sub>B</sub>',
      '&alpha;',
      '&beta;',
    ]
  ]);
