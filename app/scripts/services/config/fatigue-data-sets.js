'use strict';

/**
 * @ngdoc service
 * @name webdan.fatigueDataSetsConfig
 * @description
 * # fatigueDataSetsConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('fatigueDataSetsConfig', {
    "用途": {
      en: "Purpose",
      column: {
        data: "target",
        type: "text",
      },
    },
    "S<sub>A</sub>/S<sub>C</sub>": {
      en: "S<sub>A</sub>/S<sub>C</sub>",
      column: {
        data: "SASC",
        type: "numeric",
      },
    },
    "S<sub>B</sub>/S<sub>C</sub>": {
      en: "S<sub>B</sub>/S<sub>C</sub>",
      column: {
        data: "SBSC",
        type: "numeric",
      },
    },
    "&kappa; = 0.06": {
      en: "&kappa; = 0.06",
      items: {
        "N<sub>A</sub>": {
          en: "N<sub>A</sub>",
          column: {
            data: "NA",
            type: "numeric",
          },
        },
        "N<sub>B</sub>": {
          en: "N<sub>B</sub>",
          column: {
            data: "NB",
            type: "numeric",
          },
        },
      },
    },
    "&kappa; = 0.12": {
      en: "&kappa; = 0.12",
      items: {
        "N<sub>A</sub>": {
          en: "N<sub>A</sub>",
          column: {
            data: "NA",
            type: "numeric",
          },
        },
        "N<sub>B</sub>": {
          en: "N<sub>B</sub>",
          column: {
            data: "NB",
            type: "numeric",
          },
        },
      },
    },
    "複線補正 r<sub>2</sub>": {
      en: "r<sub>2</sub>",
      items: {
        "&alpha;": {
          en: "&alpha;",
          column: {
            data: "a",
            type: "numeric",
          },
        },
        "&beta;": {
          en: "&beta;",
          column: {
            data: "b",
            type: "numeric",
          },
        },
      },
    },
  });
