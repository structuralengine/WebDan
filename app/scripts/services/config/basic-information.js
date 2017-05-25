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
    "pickup": {
      en: "",
      ja: "",
      items: {
        "moment": {
          en: "pick up (moment)",
          ja: "ピックアップ (曲げ耐力用)",
          items: {
            "pik_m10": {
              en: "for examination of tensile extreme fiber stress intensity",
              ja: "耐久性 縁引張応力度検討用",
            },
            "pik_m11": {
              en: "for examination on stress intensity of reinforcing bar",
              ja: "耐久性 鉄筋応力度検討用",
            },
            "pik_m12": {
              en: "Check of durability(Permanent Load)",
              ja: "耐久性 (永久荷重)",
            },
            "pik_m13": {
              en: "Check of durability(Variable Load)",
              ja: "耐久性 (変動荷重)",
            },
            "pik_m14": {
              en: "Check for serviceability(visible crack)",
              ja: "使用性 (外観ひび割れ)",
            },
            "pik_m20": {
              en: "Failure by fatigue(Min Stress)",
              ja: "安全性 (疲労破壊) 最小応力",
            },
            "pik_m21": {
              en: "Failure by fatigue(Max Stress)",
              ja: "安全性 (疲労破壊) 最大応力",
            },
            "pik_m30": {
              en: "ultimate limit state",
              ja: "安全性 (破壊)",
            },
            "pik_m40": {
              en: "Restorability (usual)",
              ja: "復旧性 (損傷 地震時以外)",
            },
            "pik_m41": {
              en: "Restorability (Seismic)",
              ja: "復旧性 (損傷 地震時)",
            },
          }
        },
        "shearforce": {
          en: "pick up (shear force)",
          ja: "ピックアップ (せん断耐力用)",
          items: {
            "pik_s10": {
              en: "Determine whether checking of shear crack can be omitted",
              ja: "耐久性 せん断ひび割れ検討判定用",
            },
            "pik_s11": {
              en: "Check of durability(Permanent Load)",
              ja: "耐久性 (永久荷重)",
            },
            "pik_s12": {
              en: "Check of durability(Variable Load)",
              ja: "耐久性 (変動荷重)",
            },
            "pik_s20": {
              en: "Failure by fatigue(Min Stress)",
              ja: "安全性 (疲労破壊) 最小応力",
            },
            "pik_s21": {
              en: "Failure by fatigue(Max Stress)",
              ja: "安全性 (疲労破壊) 最大応力",
            },
            "pik_s30": {
              en: "ultimate limit state",
              ja: "安全性 (破壊)",
            },
            "pik_s40": {
              en: "Restorability (usual)",
              ja: "復旧性 (損傷 地震時以外)",
            },
            "pik_s41": {
              en: "Restorability (Seismic)",
              ja: "復旧性 (損傷 地震時)",
            },
          },
        },
      }
    },
    "buttons": {
      items: {
        "pik_title": {
          en: "Standard heading",
          ja: "標準の見出し",
        },
        "load_temp": {
          en: "Load template",
          ja: "テンプレート読み込み",
        },
        "save_temp": {
          en: "Save template",
          ja: "テンプレート保存",
        },
        "open_pik": {
          en: "Open PickUp File(.pik)",
          ja: "PickUp File (.pik) を開く",
        },
        "open_dat": {
          en: "Open PickUp File(.dat)",
          ja: "PickUp.dat 読み込み",
        },
      },
    },
    "spec": {
      en: "specification",
      ja: "仕様",
      items: {
        "spec": {
          en: "",
          ja: "",
          items: {
            "jr": {
              en: "JR companies",
              ja: "JR 各社",
            },
            "jrtt": {
              en: "japan railway construction transport and technology agency",
              ja: "鉄道・運輸機構",
            },
            "jrc": {
              en: "East Japan Railway Company",
              ja: "JR 東日本",
            },
            "jes": {
              en: "Jointed Element Structure",
              ja: "JES 工法",
            },
          },
        },
        "con_12": {
          en: "EARTH STRUCTURE",
          ja: "抗土圧構造モード",
        },
      },
    },
    "limit": {
      en: "",
      ja: "",
      items: {
        "limit_m05": {
          en: "limit",
          ja: "制限値 (mm)",
        },
      },
    },
    "axis": {
      en: "The axial force of the horizontal member",
      ja: "水平部材の軸方向力",
      items: {
        "axial_01": {
          en: "consider",
          ja: "考慮する",
          items: {
            "axial_04": {
              en: "Also check the maximum axial force",
              ja: "軸力 最大最小についても照査する",
            },
          },
        },
        "axial_02": {
          en: "doesn't consider",
          ja: "考慮しない",
        },
        "axial_03": {
          en: "Consider only tensile stress",
          ja: "引張 (マイナス) のみ考慮",
        },
      },
    },
    "rebar": {
      en: "calculation point of tensile bar",
      ja: "",
      items: {
        "rebar_01": {
          en: "Centroid",
          ja: "引張鉄筋の着目位置",
        },
        "rebar_02": {
          en: "first stage rebar for the design of width of crack",
          ja: "重心位置で計算",
        },
        "rebar_03": {
          en: "first stage rebar",
          ja: "ひび割れ計算のみ 1段目鉄筋",
        },
      }
    },
    "conditions": {
      en: "",
      ja: "",
      items: {
        "con_01": {
          en: "Even when the Extreme fiber stress is within the limit value,  check of width of crack",
          ja: "縁応力度が制限値以内の時でもひび割れ幅を計算する",
        },
        "con_02": {
          en: "The cover of the reinforcing bars is limited to 100 mm for check of crack",
          ja: "ひび割れ幅制限値に用いるかぶりは 100mm を上限とする",
        },
        "con_03": {
          en: "Calculate with T-shaped cross section with flange side tension as rectangular cross section",
          ja: "T 形断面でフランジ側引張は矩形断面で計算する",
        },
        "con_04": {
          en: "Place one reinforcing bar at the apex in circular cross section",
          ja: "円形断面で鉄筋を頂点に 1 本配置する",
        },
        "con_05": {
          en: "Calculate the axial compressive strength N'oud of pillars / piles (member factor γb = 1.3)",
          ja: "柱・杭の軸方向圧縮耐力 N'<sub>oud</sub> を計算する (部材係数 &gamma;<sub>b</sub>=1.3)",
        },
        "con_06": {
          en: "In the study of durability shear crack, Vd &lt; 0.7 * Vcd is not omitted",
          ja: "耐久性のせん断ひび割れの検討で V<sub>d</sub> &lt; 0.7 &sdot; V<sub>cd</sub> でも省略しない",
        },
        "con_07": {
          en: "Do not consider σc <= 0.4 * fcd",
          ja: "&sigma;<sub>c</sub> &le; 0.4 &sdot; f<sub>cd</sub> の検討を行わない",
        },
        "con_08": {
          en: "Shear strength: Mud used for calculation of βn does not consider axial force",
          ja: "せん断耐力: &beta;<sub>n</sub> の算定に用いる M<sub>ud</sub> は軸力を考慮しない",
        },
      },
    },
    "fatigue": {
      en: "Fatigue data",
      ja: "疲労データ",
      items: {
        "con_09": {
          en: "Variable stress takes compressive stress into consideration (compressive stress ~ stress amplitude of tensile stress). Without check, compressive stress is set to 0 and it is set as stress amplitude",
          ja: "変動応力は圧縮応力を考慮する (圧縮応力～引張応力の応力振幅)。チェックなしは、圧縮応力は 0 として応力振幅とする",
        },
        "con_10": {
          en: "The fluctuating stress degree is the difference of the stress level of the rebar with the minimum stress and the maximum stress. Without checking, the degree of stress using variable stress is taken as the variable stress level.",
          ja: "変動応力度は最小応力と最大応力を用いた鉄筋応力度の差とする。チェックなしは、変動応力を用いた応力度を変動応力度とする。",
        },
      },
    },
    "others": {
      en: "",
      ja: "",
      items: {
        "N": {
          en: "fatigue life",
          ja: "疲労寿命",
        },
        "T": {
          en: "design service life",
          ja: "設計耐用年数",
        },
        "jA": {
          en: "",
          ja: "jA",
        },
        "jB": {
          en: "",
          ja: "jB",
        },
      },
    },
  });
