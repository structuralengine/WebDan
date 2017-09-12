'use strict';

angular.module('webdan')
  .constant('materialStrengthRestConfig', {
    'コンクリートの設計基準強度 f\'ck (N/mm<sup>2</sup>)': {
      en: 'desgin compressive strength of concrete',
      var: 'fck',
      column: {
        data: 'fck',
        type: 'numeric',
        format: '0.1'
      }
    },
    '粗骨材の最大寸法 (mm)': {
      en: 'maximum aggregate size',
      var: 'dmax',
      column: {
        data: 'dmax',
        type: 'numeric',
        format: '0.1'
      }
    },
    '鋼材の表面形状係数 (通常は未入力) &kappa;<sub>1</sub>': {
      en: '',
      var: 'k1',
      column: {
        data: 'k1',
        type: 'numeric',
        format: '0.1'
      }
    }
  });
