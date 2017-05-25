'use strict';

/**
 * @ngdoc service
 * @name webdan.ccalculationPrintConfig
 * @description
 * # ccalculationPrintConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('calculationPrintConfig', {
    "content": {
      items: {
        "calc_01": {
          en: "",
          ja: "基本データ",
        },
        "calc_02": {
          en: "",
          ja: "安全係数・材料強度",
        },
        "calc_03": {
          en: "",
          ja: "断面力の集計表",
        },
        "calc_04": {
          en: "",
          ja: "性能照査",
        },
        "calc_05": {
          en: "",
          ja: "必要鉄筋量",
        },
      },
    },
    "check": {
      items: {
        "calc_m": {
          en: "",
          ja: "曲げ",
        },
        "calc_s": {
          en: "",
          ja: "せん断",
        },
      },
    },
    "print": {
      items: {
        "print_all": {
          en: "",
          ja: "すべて出力",
        },
        "print_checked": {
          en: "",
          ja: "マークのみ出力",
        },
        "print_unchecked": {
          en: "",
          ja: "マーク以外出力",
        },
      },
    },
    "preview": {
      items: {
        "print_preview": {
          en: "",
          ja: "画面表示後に印刷",
        },
      },
    },
  });
