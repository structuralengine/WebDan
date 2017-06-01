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
    source: 'webdan.db',
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
        'material-strength-rest':
          '材料強度 (その他)',
        // 'section-forces':
        //   '断面力',
        'bending-moments':
          '曲げ照査',
        'shears':
          'せん断照査',
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
      state: {
        basicInformation: {},
        groups: [],
        members: [],
        designPoints: [],

        memberSections: [],
        bars: [],
        fatigues: [],
        bendingMoments: [],
        shears: [],

        safetyFactors: [],
        materialStrengths: [],
        materialStrengthRest: {},

        calculationPrint: {},
      },
      materialStrengths: {
        bars: [
          {
            name: '降伏強度',
            en: 'Yield strength',
            value: '',
          },{
            name: '設計引張強度',
            en: 'Tension strength',
            value: '',
          },
        ],
        ranges: [
          {
            name: 'D29 以上',
            en: 'above x',
            value: 'above',
          },{
            name: 'D25 以下',
            en: 'below x',
            value: 'below',
          },
        ],
      },
      safetyFactors: {
        keys: [
          '耐久性',
          '安全性 (疲労破壊)',
          '安全性 (破壊)',
          '復旧性 (損傷 地震時以外)',
          '復旧性 (損傷 地震時)',
        ],
        considerRebars: [
          {
            no: 1,
            name: '引張鉄筋',
            value: 'rebar_01',
          },{
            no: 2,
            name: '引張＋圧縮',
            value: 'rebar_02',
          },{
            no: 3,
            name: '全周鉄筋',
            value: 'rebar_03',
          },{
            no: 4,
            name: 'All 位置指定',
            value: 'rebar_04',
          },
        ],
      },
    },
  });
