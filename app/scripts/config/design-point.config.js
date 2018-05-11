'use strict';

/**
 * @ngdoc service
 * @name webdan.designPointsConfig
 * @description
 * # designPointsConfig
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('designPointConfig', ['htSpeedInput', 'designPointNameDefaults',
    function(htSpeedInput, designPointNameDefaults) {

      return {
        '部材番号': {
          items: {
            '': {
              column: {
                data: 'm_no',
                type: 'numeric',
                readOnly: true,
              },
            },
          },
        },
        '算出点': {
          en: 'Point',
          items: {
            '': {
              column: {
                data: 'p_id',
                type: 'text',
                readOnly: true,
              },
            },
          },
        },
        '位置': {
          en: 'Location',
          items: {
            '': {
              column: {
                data: 'p_pos',
                type: 'numeric',
                format: '0.000',
                readOnly: true,
              },
            },
          },
        },
        '算出点名': {
          en: 'Point Name',
          items: {
            '': {
              column: {
                data: 'p_name',
                type: 'text',
                renderer: htSpeedInput.getRenderer(designPointNameDefaults, true),
              },
            },
          },
        },
        '安全度照査': {
          en: 'Design Forces',
          items: {
            '曲げ': {
              en: 'Bending Moment',
              column: {
                data: 'dm',
                type: 'checkbox',
              },
            },
            'せん断': {
              en: 'Shear Force',
              column: {
                data: 'ds',
                type: 'checkbox',
              },
            },
          }
        },
        '総括表用': {
          en: 'Calculation Results of Member Forces',
          items: {
            '曲げ': {
              en: 'Bending Moment',
              column: {
                data: 'rm',
                type: 'checkbox',
              },
            },
            'せん断': {
              en: 'Shear Force',
              column: {
                data: 'rs',
                type: 'checkbox',
              },
            },
          }
        },
        'せん断スパン (mm)': {
          en: 'Shear Span',
          items: {
            'スパン長': {
              en: 'Span',
              column: {
                data: 'span',
                type: 'numeric',
                format: '0.0',
              },
            },
            '(t/2,d)': {
              en: '?',
              column: {
                data: 't2',
                type: 'numeric',
                format: '0.0',
              },
            },
          }
        },
        '杭の直径 (mm)': {
          en: 'Diameter of Circle by Pile',
          items: {
            '': {
              column: {
                data: 'r',
                type: 'numeric',
                format: '0.0',
              },
            },
          },
        },
      };
    }
  ]);
