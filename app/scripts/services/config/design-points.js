'use strict';

/**
 * @ngdoc service
 * @name webdan.designPointsConfig
 * @description
 * # designPointsConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('designPointsConfig', {
    '算出点': {
      en: 'Point',
      column: {
        data: 'p_id',
        type: 'text',
      },
    },
    '位置': {
      en: 'Location',
      column: {
        data: 'p_pos',
        type: 'numeric',
        format: '0.000',
      },
    },
    '算出点名': {
      en: 'Point Name',
      column: {
        data: 'p_name',
        type: 'text',
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
      column: {
        data: 'r',
        type: 'numeric',
        format: '0.0',
      },
    },
  });
