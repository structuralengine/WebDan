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
        'basic-information':
          '基本データ',
        'groups':
          'グループ',
        'members':
          '部材',
        'member-sections':
          '部材・断面',
        'design-points-2':
          'DesignPoints',
        'design-points':
          '算出点',
        'bars':
          '鉄筋配置',
        'fatigues':
          '疲労データ',
        'safety-factors':
          '安全係数',
        'material-strengths':
          '材料強度',
        'section-forces':
          '断面力',
        'calculation-print':
          '計算・印刷',
      },
      groups: {
        file: {
          save: {
            failed: [
              'ファイルの保存に失敗しました',
              'ファイルをダウンロードします'
            ].join('\n'),
            nodata: [
              'データが読み込まれていません',
              'データを新規作成するか、ファイルを読み込んでください'
            ].join('\n')
          }
        }
      }
    },
    formats: {
      save: {
        timestamp: 'YYYYMMDD-HHmmss',
      },
    },
    defaults: {
      safetyFactors: {
        keys: [
          "耐久性",
          "安全性 (疲労破壊)",
          "安全性 (破壊)",
          "復旧性 (損傷 地震時以外)",
          "復旧性 (損傷 地震時)",
        ],
        considerRebars: [
          {
            no: 1,
            name: "引張鉄筋",
          },{
            no: 2,
            name: "引張＋圧縮",
          },{
            no: 3,
            name: "全周鉄筋",
          },{
            no: 4,
            name: "All 位置指定",
          },
        ],
      },
    },
  });
