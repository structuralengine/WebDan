'use strict';

/**
 * @ngdoc service
 * @name webdan.barsNestedHeadersComplexConfig
 * @description
 * # barsNestedHeadersComplexConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('barsNestedHeadersComplexConfig', [
    // 1st column
    [
      '部材番号',
      '算出点名',
      '断面',
      'ハンチ高',
      '位置',
      {
        label: '軸方向鉄筋',
        colspan: 6,
      },
      {
        label: '側方鉄筋',
        colspan: 3,
      },
      {
        label: 'スターラップ',
        colspan: 3,
      },
      '主筋の斜率',
      'tan&gamma; + tan&beta;',
      {
        label: '折曲げ鉄筋',
        colspan: 4,
      },
      '処理',
    ],
    // 2nd column
    [
      '',
      '',
      'B',
      '曲げ',
      '',
      '鉄筋径',
      '本数',
      '一段目カブリ',
      '並び数',
      'アキ',
      '間隔',
      '鉄筋径',
      '本数片',
      '上端位置/ピッチ',
      '鉄筋径',
      '組数',
      '間隔',
      '',
      '',
      '鉄筋径',
      '本数',
      '間隔',
      '角度',
      '',
    ],
    // 3rd column
    [
      '',
      '',
      'H',
      'せん断',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  ]);
