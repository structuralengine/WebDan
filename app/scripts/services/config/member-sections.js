'use strict';

/**
 * @ngdoc service
 * @name webdan.memberSectionsConfig
 * @description
 * # memberSectionsConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('memberSectionsConfig', {
    '部材番号': {
      en: 'member no',
      column: {
        data: 'Member.m_no',
        type: 'numeric',
      }
    },
    '部材長': {
      en: 'member length',
      column: {
        data: 'm_len',
        type: 'numeric',
        format: '0.000'
      }
    },
    'グループ No': {
      en: 'group no',
      column: {
        data: 'Member.Group.g_no',
        type: 'numeric',
        format: '0.0'
      }
    },
    '部材名': {
      en: 'member name',
      column: {
        data: 'Member.Group.g_name',
      }
    },
    '断面形状': {
      en: 'section shape',
      column: {
        data: 'shape',
      }
    },
    '断面 (mm)': {
      en: 'section',
      items: {
        'B': {
          en: 'width',
          column: {
            data: 'section.B',
            type: 'numeric',
          }
        },
        'H': {
          en: 'height',
          column: {
            data: 'section.H',
            type: 'numeric',
          }
        },
        'B<sub>t</sub>': {
          en: 'flange width',
          html: 'B<sub>t</sub>',
          column: {
            data: 'section.Bt',
            type: 'numeric',
          }
        },
        't': {
          en: 'flange Thickness',
          column: {
            data: 'section.t',
            type: 'numeric',
          }
        },
      }
    },
    '環境条件': {
      en: 'conditions',
      items: {
        '上側': {
          en: 'upper side',
          column: {
            data: 'conditions.con_u',
            type: 'numeric',
          }
        },
        '下側': {
          en: 'lower side',
          column: {
            data: 'conditions.con_l',
            type: 'numeric',
          }
        },
        'せん断': {
          en: 'shear',
          column: {
            data: 'conditions.con_s',
            type: 'numeric',
          }
        },
      }
    },
    '外観': {
      en: 'exterior',
      items: {
        '上側': {
          en: 'upper side',
          column: {
            data: 'exterior.vis_u',
            type: 'checkbox',
          }
        },
        '下側': {
          en: 'lower side',
          column: {
            data: 'exterior.vis_l',
            type: 'checkbox',
          }
        },
      }
    },
    'ひび割れ': {
      en: 'crack',
      html: '&epsilon;<sub>csd</sub>',
      column: {
        data: 'ecsd',
        type: 'numeric',
      }
    },
    'せん断': {
      en: 'shear',
      html: 'k<sub>r</sub>',
      column: {
        data: 'kr',
        type: 'numeric',
        format: '0.0'
      }
    },
    '鉄筋曲げ加工': {
      en: 'r1',
      html: 'r<sub>1</sub>',
      items: {
        '軸鉄筋': {
          en: 'longitudinal rebar',
          column: {
            data: 'r1.r1_1',
            type: 'numeric',
            format: '0.00'
          }
        },
        '帯筋': {
          en: 'hoop tie',
          column: {
            data: 'r1.r1_2',
            type: 'numeric',
            format: '0.00'
          }
        },
        '折曲げ': {
          en: 'bent up bar',
          column: {
            data: 'r1.r1_3',
            type: 'numeric',
            format: '0.00'
          }
        },
      }
    },
    '部材数': {
      en: 'count',
      column: {
        data: 'n',
        type: 'numeric',
      }
    },
    '疲労パス': {
      en: 'for fatigue',
      column: {
        data: 'flg_fatigue',
        type: 'checkbox',
      }
    },
  });
