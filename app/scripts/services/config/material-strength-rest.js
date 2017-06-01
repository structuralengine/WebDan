'use strict';

/**
 * @ngdoc service
 * @name webdan.materialStrengthRestConfig
 * @description
 * # materialStrengthRestConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('materialStrengthRestConfig', {
    'fck': {
      en: 'desgin compressive strength of concrete',
      ja: 'コンクリートの設計基準強度 f\'ck (N/mm<sup>2</sup>)',
      column: {
        data: 'fck',
        type: 'numeric',
        format: '0.1'
      },
    },
    'dmax': {
      en: 'maximum aggregate size',
      ja: '粗骨材の最大寸法 (mm)',
      column: {
        data: 'dmax',
        type: 'numeric',
        format: '0.1'
      },
    },
    'k1': {
      en: '',
      ja: '鋼材の表面形状係数 (通常は未入力) &kappa;<sub>1</sub>',
      column: {
        data: 'k1',
        type: 'numeric',
        format: '0.1'
      },
    },
  });
