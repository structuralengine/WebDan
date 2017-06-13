"use strict";

/**
 * @ngdoc service
 * @name webdan.fatigueConfig
 * @description
 * # fatigueConfig
 * Factory in the webdan.
 */
angular.module("webdan")
  .factory("fatigueConfig", ['$injector', 'appConfig',
    function($injector, appConfig) {

      let rebar_sides = appConfig.defaults.fatigue.rebar_sides;

      return {
        "部材番号": {
          en: "",
          var: "",
          items: {
            "": {
              items: {
                "": {
                  column: {
                    data: "designPointId",
                    path: "Member.m_no",
                    type: "numeric",
                    readOnly: true,
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
                    data: "designPointId",
                    path: "p_name",
                    readOnly: true,
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
                "H": {},
              },
            },
          },
          column: {
            data: "designPointId",
            path: "section",
            type: "numeric",
            readOnly: true,
            renderer: function(hot, td, row, col, prop, value, cellProperties) {
              let label = '';
              let fatigue = hot.getSourceDataAtRow(row);
              if (fatigue) {
                let DesignPoint = $injector.get('DesignPoint');
                let MemberSection = $injector.get('MemberSection');
                let designPoint = DesignPoint.get(fatigue.designPointId);
                let memberSection = MemberSection.getBy('m_no', designPoint.m_no);
                label = ''+
                  '<span class="B">'+ memberSection.B +'</span>'+
                  '<span class="H">'+ memberSection.H +'</span>';
              }
              angular.element(td).html(label);
              return td;
            },
          },
        },
        "位置": {
          en: "position",
          var: "rebar_side",
          items: {
            "": {
              items: {
                "": {},
              },
            },
          },
          values: rebar_sides,
          column: (function(sides) {
            let renderer = function(hot, td, row, col, prop, value, cellProperties) {
              let label = sides[value] || value;
              angular.element(td).html(label);
              return td;
            };

            return {
              data: "rebar_side",
              type: "numeric",
              readOnly: true,
              renderer: renderer,
            };
          })(rebar_sides),
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
      };
    }
  ]);
