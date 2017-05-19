'use strict';

/**
 * @ngdoc service
 * @name webdan.appConfig
 * @description
 * # appConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('appConfig', {
    messages: {
      tabs: {
        'basic-information'               : '基本データ',
        'groups'                          : 'グループ',
        'members'                         : '部材',
        'member-section'                  : '部材・断面',
        'design-point'                    : '算出点',
        'bars'                            : '鉄筋配置',
        'fatigue'                         : '疲労データ',
        'safety-factor-material-strength' : '安全係数・材料強度',
        'section-forces'                  : '断面力',
        'calculation-print'               : '計算・印刷'
      },
      groups: {
        file: {
          save: {
            failed: ['ファイルの保存に失敗しました', 'ファイルをダウンロードします'].join('\n'),
            nodata: ['データが読み込まれていません', 'データを新規作成するか、ファイルを読み込んでください'].join('\n')
          }
        }
      }
    },
    formats: {
      save: {
        timestamp: 'YYYYMMDD-HHmmss',
      },
    }
  });
