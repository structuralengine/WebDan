'use strict';

/**
 * @ngdoc service
 * @name webdan.safetyFactorsConfig
 * @description
 * # safetyFactorsConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('safetyFactorConfig', {
    '': {
      en: 'Name',
      var: 'name',
      items: {
        "": {
          column: {
            data: 'name',
            type: 'text',
            readOnly: true,
          },
        },
      },
      values: [
        '耐久性',
        '安全性 (疲労破壊)',
        '安全性 (破壊)',
        '復旧性 (損傷 地震時以外)',
        '復旧性 (損傷 地震時)',
      ],
    },
    '曲げ 安全係数': {
      en: 'Safety factor for bending moment',
      var: '',
      items: {
        '&gamma;<sub>c</sub>': {
          en: '&gamma;<sub>c</sub>',
          var: 'm_rc',
          column: {
            data: 'm_rc',
            type: 'numeric',
            format: '0.00',
          },
        },
        '&gamma;<sub>s</sub>': {
          en: '&gamma;<sub>s</sub>',
          var: 'm_rs',
          column: {
            data: 'm_rs',
            type: 'numeric',
            format: '0.00',
          },
        },
        '&gamma;<sub>bs</sub>': {
          en: '&gamma;<sub>bs</sub>',
          var: 'm_rbs',
          column: {
            data: 'm_rbs',
            type: 'numeric',
            format: '0.00',
          },
        },
      },
    },
    'せん断 安全係数': {
      en: 'Safety factor for shear force',
      var: '',
      items: {
        '&gamma;<sub>c</sub>': {
          en: '&gamma;<sub>c</sub>',
          var: 's_rc',
          column: {
            data: 's_rc',
            type: 'numeric',
            format: '0.00',
          },
        },
        '&gamma;<sub>s</sub>': {
          en: '&gamma;<sub>s</sub>',
          var: 's_rs',
          column: {
            data: 's_rs',
            type: 'numeric',
            format: '0.00',
          },
        },
        '&gamma;<sub>bc</sub>': {
          en: '&gamma;<sub>bc</sub',
          var: 's_rbd',
          column: {
            data: 's_rbd',
            type: 'numeric',
            format: '0.00',
          },
        },
        '&gamma;<sub>bs</sub>': {
          en: '&gamma;<sub>bs</sub>',
          var: 's_rbs',
          column: {
            data: 's_rbs',
            type: 'numeric',
            format: '0.00',
          },
        },
        '&gamma;<sub>b</sub>': {
          en: '&gamma;<sub>b</sub>',
          var: 's_rb',
          column: {
            data: 's_rb',
            type: 'numeric',
            format: '0.00',
          },
        },
      },
    },
    '係数': {
      en: 'Member factor',
      var: '',
      items: {
        '&gamma;<sub>i</sub>': {
          en: '&gamma;<sub>i</sub>',
          var: 'ri',
          column: {
            data: 'ri',
            type: 'numeric',
            format: '0.00',
          },
        },
      },
    },
    '鉄筋配置': {
      en: 'Consider rebar',
      var: 'consider_rebar',
      column: {
        data: 'consider_rebar',
        type: 'text',
      },
    },
  });
