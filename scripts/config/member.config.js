'use strict';

angular.module('webdan')
  .factory('memberConfig', ['htSpeedInput', 'sectionShapeDefaults', 'conditionDefaults',
    function(htSpeedInput, sectionShapeDefaults, conditionDefaults) {

      return {
        '部材番号': {
          'en': 'Member No',
          'column': {
            'data': 'm_no',
            'type': 'numeric'
          },
          items: {
            '': {}
          }
        },
        '部材長': {
          'en': 'Member length',
          'column': {
            'data': 'm_len',
            'type': 'numeric',
            'format': '0.001'
          },
          items: {
            '': {}
          }
        },
        'グループ No': {
          en: 'group no',
          column: {
            data: 'g_no',
            type: 'numeric',
            format: '0.0'
          },
          items: {
            '': {}
          }
        },
        '部材名': {
          'en': 'Member Name',
          'column': {
            'data': 'g_name'
          },
          items: {
            '': {}
          }
        },
        '断面形状': {
          en: 'section shape',
          column: {
            data: 'shape',
            renderer: htSpeedInput.getRenderer(sectionShapeDefaults)
          },
          items: {
            '': {}
          }
        },
        '断面 (mm)': {
          en: 'section',
          items: {
            'B': {
              en: 'width',
              column: {
                data: 'B',
                type: 'numeric'
              }
            },
            'H': {
              en: 'height',
              column: {
                data: 'H',
                type: 'numeric'
              }
            },
            'B<sub>t</sub>': {
              en: 'flange width',
              html: 'B<sub>t</sub>',
              column: {
                data: 'Bt',
                type: 'numeric'
              }
            },
            't': {
              en: 'flange Thickness',
              column: {
                data: 't',
                type: 'numeric'
              }
            }
          }
        },
        '環境条件': {
          en: 'conditions',
          items: {
            '上側': {
              en: 'upper side',
              column: {
                data: 'con_u',
                type: 'numeric',
                renderer: htSpeedInput.getRenderer(conditionDefaults)
              }
            },
            '下側': {
              en: 'lower side',
              column: {
                data: 'con_l',
                type: 'numeric',
                renderer: htSpeedInput.getRenderer(conditionDefaults)
              }
            },
            'せん断': {
              en: 'shear',
              column: {
                data: 'con_s',
                type: 'numeric',
                renderer: htSpeedInput.getRenderer(conditionDefaults)
              }
            }
          }
        },
        '外観': {
          en: 'exterior',
          items: {
            '上側': {
              en: 'upper side',
              column: {
                data: 'vis_u',
                type: 'checkbox'
              }
            },
            '下側': {
              en: 'lower side',
              column: {
                data: 'vis_l',
                type: 'checkbox'
              }
            }
          }
        },
        'ひび割れ': {
          en: 'crack',
          items: {
            '&epsilon;<sub>csd</sub>': {
              column: {
                data: 'ecsd',
                type: 'numeric'
              }
            }
          }
        },
        'せん断': {
          en: 'shear',
          items: {
            'k<sub>r</sub>': {
              column: {
                data: 'kr',
                type: 'numeric',
                format: '0.0'
              }
            }
          }
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
              }
            },
            '帯筋': {
              en: 'hoop tie',
              column: {
                data: 'r1_2',
                type: 'numeric',
                format: '0.00'
              }
            },
            '折曲げ': {
              en: 'bent up bar',
              column: {
                data: 'r1_3',
                type: 'numeric',
                format: '0.00'
              }
            }
          }
        },
        '部材数': {
          en: 'count',
          column: {
            data: 'n',
            type: 'numeric'
          },
          items: {
            '': {}
          }
        },
        '疲労パス': {
          en: 'for fatigue',
          column: {
            data: 'flg_fatigue',
            type: 'checkbox'
          },
          items: {
            '': {}
          }
        }
      };
    }
  ]);
