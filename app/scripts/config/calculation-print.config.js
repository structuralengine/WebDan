'use strict';

/**
 * @ngdoc service
 * @name webdan.calculationPrintConfig
 * @description
 * # calculationPrintConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('calculationPrintConfig', {
    'content': {
      '計算・出力内容': {
        '基本データ': {
          en: '',
          var: 'calc_01',
        },
        '安全係数・材料強度': {
          en: '',
          var: 'calc_02',
        },
        '断面力の集計表': {
          en: '',
          var: 'calc_03',
        },
        '性能照査': {
          en: '',
          var: 'calc_04',
        },
        '必要鉄筋量': {
          en: '',
          var: 'calc_05',
        },
      },
    },
    'check': {
      '照査': {
        '曲げ': {
          en: '',
          var: 'calc_m',
        },
        'せん断': {
          en: '',
          var: 'calc_s',
        },
      },
    },
    'calc_target': {
      '部材': {
        en: '',
        var: 'calc_target',
      },
    },
    'print': {
      '処理': {
        'すべて出力': {
          en: '',
          var: 'print_all',
        },
        'マークのみ出力': {
          en: '',
          var: 'print_checked',
        },
        'マーク以外出力': {
          en: '',
          var: 'print_unchecked',
        },
      },
    },
    'preview': {
      '画面表示後に印刷': {
        en: '',
        var: 'print_preview',
      },
    },
  });
