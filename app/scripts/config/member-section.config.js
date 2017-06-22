'use strict';

/**
 * @ngdoc service
 * @name webdan.memberSectionConfig
 * @description
 * # memberSectionConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('memberSectionConfig', {
    '部材番号': {
      en: 'member no',
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
    '部材長': {
      en: 'member length',
      items: {
        '': {
          column: {
            data: 'm_no',
            path: 'm_len',
            type: 'numeric',
            format: '0.000',
            readOnly: true,
          },
        },
      },
    },
    '部材名': {
      en: 'member name',
      items: {
        '': {
          column: {
            data: 'm_no',
            path: 'Group.g_name',
            type: 'numeric',
          },
        },
      },
    },
    '断面形状': {
      en: 'section shape',
      items: {
        '': {
          column: {
            data: 'shape',
          },
        },
      },
    },
    '断面 (mm)': {
      en: 'section',
      items: {
        'B': {
          en: 'width',
          column: {
            data: 'B',
            type: 'numeric',
          },
        },
        'H': {
          en: 'height',
          column: {
            data: 'H',
            type: 'numeric',
          },
        },
        'B<sub>t</sub>': {
          en: 'flange width',
          html: 'B<sub>t</sub>',
          column: {
            data: 'Bt',
            type: 'numeric',
          },
        },
        't': {
          en: 'flange Thickness',
          column: {
            data: 't',
            type: 'numeric',
          },
        },
      },
    },
    '環境条件': {
      en: 'conditions',
      items: {
        '上側': {
          en: 'upper side',
          column: {
            data: 'con_u',
            type: 'numeric',
          },
        },
        '下側': {
          en: 'lower side',
          column: {
            data: 'con_l',
            type: 'numeric',
          },
        },
        'せん断': {
          en: 'shear',
          column: {
            data: 'con_s',
            type: 'numeric',
          },
        },
      },
    },
    '外観': {
      en: 'exterior',
      items: {
        '上側': {
          en: 'upper side',
          column: {
            data: 'vis_u',
            type: 'checkbox',
          },
        },
        '下側': {
          en: 'lower side',
          column: {
            data: 'vis_l',
            type: 'checkbox',
          },
        },
      },
    },
    'ひび割れ': {
      en: 'crack',
      items: {
        '&epsilon;<sub>csd</sub>': {
          column: {
            data: 'ecsd',
            type: 'numeric',
          },
        },
      },
    },
    'せん断': {
      en: 'shear',
      items: {
        'k<sub>r</sub>': {
          column: {
            data: 'kr',
            type: 'numeric',
            format: '0.0'
          },
        },
      },
    },
    '鉄筋曲げ加工 r<sub>1</sub>': {
      en: 'r1',
      items: {
        '軸鉄筋': {
          en: 'longitudinal rebar',
          column: {
            data: 'r1_1',
            type: 'numeric',
            format: '0.00'
          },
        },
        '帯筋': {
          en: 'hoop tie',
          column: {
            data: 'r1_2',
            type: 'numeric',
            format: '0.00'
          },
        },
        '折曲げ': {
          en: 'bent up bar',
          column: {
            data: 'r1_3',
            type: 'numeric',
            format: '0.00'
          },
        },
      },
    },
    '部材数': {
      en: 'count',
      items: {
        '': {
          column: {
            data: 'n',
            type: 'numeric',
          },
        },
      },
    },
    '疲労パス': {
      en: 'for fatigue',
      items: {
        '': {
          column: {
            data: 'flg_fatigue',
            type: 'checkbox',
          },
        },
      },
    },
  })
  .constant('designPointsConfig', {
    '部材番号': {
      items: {
        '': {
          column: {
            data: 'm_no',
            type: 'numeric',
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
  })
