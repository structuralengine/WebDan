"use strict";

/**
 * @ngdoc service
 * @name webdan.fatiguesConfig
 * @description
 * # fatiguesConfig
 * Constant in the webdan.
 */
angular.module("webdan")
  .constant("fatiguesConfig", {
    "部材番号": {
      en: "",
      var: "",
      items: {
        "": {
          items: {
            "": {
              column: {
                data: "designPoint_id",
                path: "Member.m_no",
                type: "numeric",
              },
            },
          },
        },
      },
    },
    "算出点名": {
      en: "",
      var: "",
      items: {
        "": {
          items: {
            "": {
              column: {
                data: "designPoint_id",
                path: "p_name",
              },
            },
          },
        },
      },
    },
    "断面": {
      en: "",
      var: "",
      items: {
        "B": {
          items: {
            "H": {
              column: {
                data: "designPoint_id",
                path: "section",
                type: "numeric",
              },
            },
          },
        },
      },
    },
    "位置": {
      en: "position",
      var: "rebar_side",
      items: {
        "": {
          items: {
            "": {
              column: {
                data: "rebar_side",
                type: "numeric",
              },
            },
          },
        },
      },
    },
    "S<sub>A</sub>/S<sub>C</sub>": {
      en: "S<sub>A</sub>/S<sub>C</sub>",
      var: "SASC",
      items: {
        "": {
          items: {
            "": {
              column: {
                data: "SASC",
                type: "numeric",
              },
            },
          },
        },
      },
    },
    "S<sub>B</sub>/S<sub>C</sub>": {
      en: "S<sub>B</sub>/S<sub>C</sub>",
      var: "SBSC",
      items: {
        "": {
          items: {
            "": {
              column: {
                data: "SBSC",
                type: "numeric",
              },
            },
          },
        },
      },
    },
    "&kappa;": {
      en: "&kappa; = 0.06",
      var: "kappa",
      items: {
        "0.06": {
          en: "0.06",
          var: "0.06",
          items: {
            "N<sub>A</sub>": {
              en: "N<sub>A</sub>",
              var: "NA",
              column: {
                data: "kappa.006.NA",
                type: "numeric",
              },
            },
            "N<sub>B</sub>": {
              en: "N<sub>B</sub>",
              var: "NB",
              column: {
                data: "kappa.006.NB",
                type: "numeric",
              },
            },
          },
        },
        "0.12": {
          en: "0.12",
          var: "0.12",
          items: {
            "N<sub>A</sub>": {
              en: "N<sub>A</sub>",
              var: "NA",
              column: {
                data: "kappa.012.NA",
                type: "numeric",
              },
            },
            "N<sub>B</sub>": {
              en: "N<sub>B</sub>",
              var: "NB",
              column: {
                data: "kappa.012.NB",
                type: "numeric",
              },
            },
          },
        },
      },
    },
    "複線補正 r<sub>2</sub>": {
      en: "r<sub>2</sub>",
      var: "r2",
      items: {
        "&alpha;": {
          en: "&alpha",
          var: "a",
          items: {
            "": {
              column: {
                data: "r2.a",
                type: "numeric",
              },
            },
          },
        },
        "&beta;": {
          en: "&beta;",
          var: "b",
          items: {
            "": {
              column: {
                data: "r2.b",
                type: "numeric",
              },
            },
          },
        },
      },
    },
  });
