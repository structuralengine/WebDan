'use strict';

/**
 * @ngdoc service
 * @name webdan.materialStrengthsConfig
 * @description
 * # materialStrengthsConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('materialStrengthsConfig', {
    "鉄筋 (N/mm<sup>2</sup>)": {
      en: "bar",
      var: "bar",
      column: {
        data: "bar",
        type: "text",
      },
    },
    "": {
      en: "range",
      var: "range",
      column: {
        data: "range",
        type: "text",
      },
    },
    "軸方向鉄筋": {
      en: "longitudinal rebar",
      var: "rebar",
      column: {
        data: "rebar",
        type: "numeric",
      },
    },
    "側方向鉄筋": {
      en: "Side rebar",
      var: "sidebar",
      column: {
        data: "sidebar",
        type: "numeric",
      },
    },
    "スターラップ": {
      en: "hoop tie",
      var: "hoop",
      column: {
        data: "hoop",
        type: "numeric",
      },
    },
    "折曲げ鉄筋": {
      en: "bent up bar",
      var: "bent",
      column: {
        data: "bent",
        type: "numeric",
      },
    },
  });
