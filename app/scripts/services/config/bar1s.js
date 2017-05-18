'use strict';

/**
 * @ngdoc service
 * @name webdan.bar1sConfig
 * @description
 * # bar1sConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('bar1sConfig', {
    "位置": {
      en: "position",
      var: "rebar_side",
      column: {
        data: 'rebar_side',
        type: 'text',
      },
    },
    "軸方向鉄筋": {
      en: "longitudinal rebar",
      var: "",
      items: {
        "鉄筋径": {
          en: "Diameter of longitudinal rebar",
          var: "rebar_01",
          column: {
            data: 'rebar_01',
            type: 'numeric',
          },
        },
        "本数": {
          en: "Numbers of longitudinal rebar",
          var: "rebar_02",
          column: {
            data: 'rebar_02',
            type: 'numeric',
          },
        },
        "一段目カブリ": {
          en: "Cover of rebar",
          var: "rebar_03",
          column: {
            data: 'rebar_03',
            type: 'numeric',
            format: '0.0',
          },
        },
        "並び数": {
          en: "Number per row",
          var: "rebar_04",
          column: {
            data: 'rebar_04',
            type: 'numeric',
            format: '0.00',
          },
        },
        "アキ": {
          en: "interval",
          var: "rebar_05",
          column: {
            data: 'rebar_05',
            type: 'numeric',
          },
        },
        "間隔": {
          en: "Spacing of longitudinal rebar",
          var: "rebar_06",
          column: {
            data: 'rebar_06',
            type: 'numeric',
            format: '0.0',
          },
        },
      }
    },
    "側方鉄筋": {
      en: "Side rebar",
      var: "",
      items: {
        "鉄筋径": {
          en: "Diameter of Side rebar",
          var: "sidebar_01",
          column: {
            data: 'sidebar_01',
            type: 'numeric',
          },
        },
        "本数片": {
          en: "Numbers of Side rebar",
          var: "sidebar_02",
          column: {
            data: 'sidebar_02',
            type: 'numeric',
          },
        },
        "上端位置/ピッチ": {
          en: "depth per interval",
          var: "sidebar_03",
          column: {
            data: 'sidebar_03',
            type: 'numeric',
          },
        },
      },
    },
    "スターラップ": {
      en: "hoop tie",
      var: "",
      items: {
        "鉄筋径": {
          en: "Diameter of hoop tie",
          var: "hoop_01",
          column: {
            data: 'hoop_01',
            type: 'numeric',
          },
        },
        "組数": {
          en: "Numbers of hoop tie",
          var: "hoop_02",
          column: {
            data: 'hoop_02',
            type: 'numeric',
            format: '0.000',
          },
        },
        "間隔": {
          en: "Spacing of hoop tie",
          var: "hoop_03",
          column: {
            data: 'hoop_03',
            type: 'numeric',
          },
        },
      },
    },
    "主筋の斜率": {
      en: "Angle of longitudinal rebar",
      var: "rebar_07",
      column: {
        data: 'rebar_07',
        type: 'numeric',
        format: '0.000',
      },
    },
    "tan&gamma; + tan&beta;": {
      en: "tanγ+tanβ",
      var: "rebar_08",
      column: {
        data: 'rebar_08',
        type: 'numeric',
      },
    },
    "折曲げ鉄筋": {
      en: "bent up bar",
      var: "",
      items: {
        "鉄筋径": {
          en: "Diameter of bent up bar",
          var: "bent_01",
          column: {
            data: 'bent_01',
            type: 'numeric',
          },
        },
        "本数": {
          en: "Numbers of bent up bar",
          var: "bent_02",
          column: {
            data: 'bent_02',
            type: 'numeric',
          },
        },
        "間隔": {
          en: "Spacing of bent up bar",
          var: "bent_03",
          column: {
            data: 'bent_03',
            type: 'numeric',
          },
        },
        "角度": {
          en: "Angle of bent up bar",
          var: "bent_04",
          column: {
            data: 'bent_04',
            type: 'numeric',
          },
        },
      },
    },
    "処理": {
      en: "processing",
      var: "flg_enable",
      column: {
        data: 'flg_enable',
        type: 'checkbox',
      },
    },
  });
