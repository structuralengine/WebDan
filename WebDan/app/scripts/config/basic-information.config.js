'use strict';

/**
 * @ngdoc service
 * @name webdan.basicInformationConfig
 * @description
 * # basicInformationConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('basicInformationConfig', {
    'pickup.moment': {
      'ピックアップ (曲げ耐力用)': {
        '耐久性 縁引張応力度検討用': {
          en: 'for examination of tensile extreme fiber stress intensity',
          column: {
            data: 'pik_m10',
            type: 'numeric',
          },
        },
        '耐久性 鉄筋応力度検討用': {
          en: 'for examination on stress intensity of reinforcing bar',
          column: {
            data: 'pik_m11',
            type: 'numeric',
          },
        },
        '耐久性 (永久荷重)': {
          en: 'Check of durability(Permanent Load)',
          column: {
            data: 'pik_m12',
            type: 'numeric',
          },
        },
        '耐久性 (変動荷重)': {
          en: 'Check of durability(Variable Load)',
          column: {
            data: 'pik_m13',
            type: 'numeric',
          },
        },
        '使用性 (外観ひび割れ)': {
          en: 'Check for serviceability(visible crack)',
          column: {
            data: 'pik_m14',
            type: 'numeric',
          },
        },
        '安全性 (疲労破壊) 最小応力': {
          en: 'Failure by fatigue(Min Stress)',
          column: {
            data: 'pik_m20',
            type: 'numeric',
          },
        },
        '安全性 (疲労破壊) 最大応力': {
          en: 'Failure by fatigue(Max Stress)',
          column: {
            data: 'pik_m21',
            type: 'numeric',
          },
        },
        '安全性 (破壊)': {
          en: 'ultimate limit state',
          column: {
            data: 'pik_m30',
            type: 'numeric',
          },
        },
        '復旧性 (損傷 地震時以外)': {
          en: 'Restorability (usual)',
          column: {
            data: 'pik_m40',
            type: 'numeric',
          },
        },
        '復旧性 (損傷 地震時)': {
          en: 'Restorability (Seismic)',
          column: {
            data: 'pik_m41',
            type: 'numeric',
          },
        },
      },
    },
    'pickup.shearforce': {
      'ピックアップ (せん断耐力用)': {
        '耐久性 せん断ひび割れ検討判定用': {
          en: 'Determine whether checking of shear crack can be omitted',
          column: {
            data: 'pik_s10',
            type: 'numeric',
          },
        },
        '耐久性 (永久荷重)': {
          en: 'Check of durability(Permanent Load)',
          column: {
            data: 'pik_s11',
            type: 'numeric',
          },
        },
        '耐久性 (変動荷重)': {
          en: 'Check of durability(Variable Load)',
          column: {
            data: 'pik_s12',
            type: 'numeric',
          },
        },
        '安全性 (疲労破壊) 最小応力': {
          en: 'Failure by fatigue(Min Stress)',
          column: {
            data: 'pik_s20',
            type: 'numeric',
          },
        },
        '安全性 (疲労破壊) 最大応力': {
          en: 'Failure by fatigue(Max Stress)',
          column: {
            data: 'pik_s21',
            type: 'numeric',
          },
        },
        '安全性 (破壊)': {
          en: 'ultimate limit state',
          column: {
            data: 'pik_s30',
            type: 'numeric',
          },
        },
        '復旧性 (損傷 地震時以外)': {
          en: 'Restorability (usual)',
          column: {
            data: 'pik_s40',
            type: 'numeric',
          },
        },
        '復旧性 (損傷 地震時)': {
          en: 'Restorability (Seismic)',
          column: {
            data: 'pik_s41',
            type: 'numeric',
          },
        },
      },
    },
    'buttons': {
      'ボタン': {
        '標準の見出し': {
          en: 'Standard heading',
          var: 'pik_title',
        },
        'テンプレート読み込み': {
          en: 'Load template',
          var: 'load_temp',
        },
        'テンプレート保存': {
          en: 'Save template',
          var: 'save_temp',
        },
        'PickUp File (.pik) を開く': {
          en: 'Open PickUp File(.pik)',
          var: 'open_pik',
        },
        'PickUp.dat 読み込み': {
          en: 'Open PickUp File(.dat)',
          var: 'open_dat',
        },
      },
    },
    'specification': {
      '仕様': {
        type: 'radio',
        var: 'spec',
        en: 'specification',
        options: {
          'jr': {
            en: 'JR companies',
            ja: 'JR 各社',
          },
          'jrtt': {
            en: 'japan railway construction transport and technology agency',
            ja: '鉄道・運輸機構',
          },
          'jrc': {
            en: 'East Japan Railway Company',
            ja: 'JR 東日本',
          },
          'jes': {
            en: 'Jointed Element Structure',
            ja: 'JES 工法',
          },
        },
      },
      '抗土圧構造モード': {
        type: 'checkbox',
        var: 'con_12',
        en: 'EARTH STRUCTURE',
      },
    },
    'limit': {
      '使用性 (外観) ひび割れ幅': {
        type: 'number',
        var: 'limit_m05',
        label: '制限値',
        postfix: 'mm',
      },
    },
    'axial': {
      '水平部材の軸方向力': {
        en: 'The axial force of the horizontal member',
        type: 'radio',
        var: 'axial',
        options: {
          'axial_01': {
            en: 'consider',
            ja: '考慮する',
            optionals: {
              '軸力 最大最小についても照査する': {
                en: 'Also check the maximum axial force',
                type: 'checkbox',
                var: 'axial_04',
              },
            },
          },
          'axial_02': {
            en: 'doesn\'t consider',
            ja: '考慮しない',
          },
          'axial_03': {
            en: 'Consider only tensile stress',
            ja: '引張 (マイナス) のみ考慮',
          },
        },
      },
    },
    'rebar': {
      '引張鉄筋の着目位置': {
        en: 'calculation point of tensile bar',
        type: 'radio',
        var: 'rebar',
        options: {
          'rebar_01': {
            en: 'Centroid',
            ja: '重心位置で計算',
          },
          'rebar_02': {
            en: 'first stage rebar for the design of width of crack',
            ja: 'ひび割れ計算のみ 1段目鉄筋',
          },
          'rebar_03': {
            en: 'first stage rebar',
            ja: '全ての計算を 1段目鉄筋',
          },
        },
      },
    },
    'conditions': {
      '条件': {
        '縁応力度が制限値以内の時でもひび割れ幅を計算する': {
          en: 'Even when the Extreme fiber stress is within the limit value,  check of width of crack',
          var: 'con_01',
        },
        'ひび割れ幅制限値に用いるかぶりは 100mm を上限とする': {
          en: 'The cover of the reinforcing bars is limited to 100 mm for check of crack',
          var: 'con_02',
        },
        'T 形断面でフランジ側引張は矩形断面で計算する': {
          en: 'Calculate with T-shaped cross section with flange side tension as rectangular cross section',
          var: 'con_03',
        },
        '円形断面で鉄筋を頂点に 1 本配置する': {
          en: 'Place one reinforcing bar at the apex in circular cross section',
          var: 'con_04',
        },
        '柱・杭の軸方向圧縮耐力 N\'<sub>oud</sub> を計算する (部材係数 &gamma;<sub>b</sub>=1.3)': {
          en: 'Calculate the axial compressive strength N\'oud of pillars / piles (member factor γb = 1.3)',
          var: 'con_05',
        },
        '耐久性のせん断ひび割れの検討で V<sub>d</sub> &lt; 0.7 &sdot; V<sub>cd</sub> でも省略しない': {
          en: 'In the study of durability shear crack, Vd &lt; 0.7 * Vcd is not omitted',
          var: 'con_06',
        },
        '&sigma;<sub>c</sub> &le; 0.4 &sdot; f<sub>cd</sub> の検討を行わない': {
          en: 'Do not consider σc <= 0.4 * fcd',
          var: 'con_07',
        },
        'せん断耐力: &beta;<sub>n</sub> の算定に用いる M<sub>ud</sub> は軸力を考慮しない': {
          en: 'Shear strength: Mud used for calculation of βn does not consider axial force',
          var: 'con_08',
        },
      },
    },
    'fatigueData': {
      '疲労データ': {
        '変動応力は圧縮応力を考慮する (圧縮応力～引張応力の応力振幅)。チェックなしは、圧縮応力は 0 として応力振幅とする': {
          en: 'Variable stress takes compressive stress into consideration (compressive stress ~ stress amplitude of tensile stress). Without check, compressive stress is set to 0 and it is set as stress amplitude',
          type: 'checkbox',
          var: 'con_09',
        },
        '変動応力度は最小応力と最大応力を用いた鉄筋応力度の差とする。チェックなしは、変動応力を用いた応力度を変動応力度とする。': {
          en: 'The fluctuating stress degree is the difference of the stress level of the rebar with the minimum stress and the maximum stress. Without checking, the degree of stress using variable stress is taken as the variable stress level.',
          type: 'checkbox',
          var: 'con_10',
        },
      },
    },
    'N': {
      '疲労寿命': {
        en: 'fatigue life',
        type: 'number',
        var: 'N',
        postfix: '&times;10<sup>6</sup> 回'
      },
    },
    'T': {
      '設計耐用年数': {
        en: 'design service life',
        var: 'T',
        postfix: '年',
      },
    },
    'trains': {
      '1日当たり列車本数': {
        'j<sub>A</sub>': {
          type: 'number',
          var: 'jA',
          postfix: '本/日',
        },
        'j<sub>B</sub>': {
          type: 'number',
          var: 'jB',
          postfix: '本/日',
        },
      },
    },
  });
