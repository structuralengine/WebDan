'use strict';

/**
 * @ngdoc service
 * @name webdan.fatigue1sConfig
 * @description
 * # fatigue1sConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('fatigue1sConfig', {
    "位置": {
      en: "position",
      var: "rebar_side",
      column: {
        data: 'rebar_side',
        type: 'text',
      },
    },
    "用途": {
      en: "purpose",
      var: "purpose",
      column: {
        data: 'purpose',
        type: 'text',
      },
    },
    "S<sub>A</sub>/S<sub>C</sub>": {
      en: "S<sub>A</sub>/S<sub>C</sub>",
      var: "SASC",
      column: {
        data: 'SASC',
        type: 'numeric',
      },
    },
    "S<sub>B</sub>/S<sub>C</sub>": {
      en: "S<sub>B</sub>/S<sub>C</sub>",
      var: "SBSC",
      column: {
        data: 'SBSC',
        type: 'numeric',
      },
    },
    "&kappa; = 0.06": {
      en: "&kappa; = 0.06",
      var: "kappa006",
      items: {
        "N<sub>A</sub>": {
          en: "N<sub>A</sub>",
          var: "NA",
          column: {
            data: 'kappa006.NA',
            type: 'numeric',
          },
        },
        "N<sub>B</sub>": {
          en: "N<sub>B</sub>",
          var: "NB",
          column: {
            data: 'kappa006.NB',
            type: 'numeric',
          },
        },
      }
    },
    "&kappa; = 0.12": {
      en: "&kappa; = 0.12",
      var: "kappa012",
      items: {
        "N<sub>A</sub>": {
          en: "N<sub>A</sub>",
          var: "NA",
          column: {
            data: 'kappa012.NA',
            type: 'numeric',
          },
        },
        "N<sub>B</sub>": {
          en: "N<sub>B</sub>",
          var: "NB",
          column: {
            data: 'kappa012.NB',
            type: 'numeric',
          },
        },
      }
    },
    "複線補正 r<sub>2</sub>": {
      en: "r<sub>2</sub>",
      var: "r2",
      items: {
        "&alpha;": {
          en: "&alpha",
          var: "a",
          column: {
            data: 'r2.a',
            type: 'numeric',
          },
        },
        "&beta;": {
          en: "&beta;",
          var: "b",
          column: {
            data: 'r2.b',
            type: 'numeric',
          },
        },
      }
    },
  });
