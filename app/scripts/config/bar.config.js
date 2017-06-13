"use strict";

/**
 * @ngdoc service
 * @name webdan.barsConfig
 * @description
 * # barsConfig
 * Factory in the webdan.
 */
angular.module("webdan")
  .factory("barConfig", ['$injector', 'appConfig',
    function($injector, appConfig) {

      let rebar_sides = appConfig.defaults.bar.rebar_sides;

      return {
        "部材番号": {
          en: "member no",
          var: "m_no",
          items: {
            "": {
              items: {
                "": {
                  column: {
                    data: "designPointId",
                    path: "Member.m_no",
                    readOnly: true,
                  },
                },
              },
            },
          },
        },
        "算出点名": {
          en: "design point",
          var: "p_name",
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
          en: "section",
          var: "B,H",
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
              let bar = hot.getSourceDataAtRow(row);
              if (bar) {
                let DesignPoint = $injector.get('DesignPoint');
                let MemberSection = $injector.get('MemberSection');
                let designPoint = DesignPoint.get(bar.designPointId);
                let memberSection = MemberSection.getBy('m_no', designPoint.m_no);
                label = (row % 2 == 0)? memberSection.B: memberSection.H;
              }
              angular.element(td).html(label);
              return td;
            },
          },
        },
        "ハンチ高": {
          en: "haunch height",
          var: "dH_m,dH_s",
          items: {
            "曲げ": {
              var: "dH_m",
              items: {
                "せん断": {
                  var: "dH_s",
                  column: {
                    data: "haunch_height",
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
        "軸方向鉄筋": {
          en: "longitudinal rebar",
          var: "",
          items: {
            "鉄筋径": {
              en: "Diameter of longitudinal rebar",
              var: "rebar_01",
              items: {
                "": {
                  column: {
                    data: "rebar_01",
                    type: "numeric",
                  },
                },
              },
            },
            "本数": {
              en: "Numbers of longitudinal rebar",
              var: "rebar_02",
              items: {
                "": {
                  column: {
                    data: "rebar_02",
                    type: "numeric",
                  },
                },
              },
            },
            "一段目カブリ": {
              en: "Cover of rebar",
              var: "rebar_03",
              items: {
                "": {
                  column: {
                    data: "rebar_03",
                    type: "numeric",
                    format: "0.0",
                  },
                },
              },
            },
            "並び数": {
              en: "Number per row",
              var: "rebar_04",
              items: {
                "": {
                  column: {
                    data: "rebar_04",
                    type: "numeric",
                    format: "0.00",
                  },
                },
              },
            },
            "アキ": {
              en: "interval",
              var: "rebar_05",
              items: {
                "": {
                  column: {
                    data: "rebar_05",
                    type: "numeric",
                  },
                },
              },
            },
            "間隔": {
              en: "Spacing of longitudinal rebar",
              var: "rebar_06",
              items: {
                "": {
                  column: {
                    data: "rebar_06",
                    type: "numeric",
                    format: "0.0",
                  },
                },
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
              items: {
                "": {
                  column: {
                    data: "sidebar_01",
                    type: "numeric",
                  },
                },
              },
            },
            "本数片": {
              en: "Numbers of Side rebar",
              var: "sidebar_02",
              items: {
                "": {
                  column: {
                    data: "sidebar_02",
                    type: "numeric",
                  },
                },
              },
            },
            "上端位置/ピッチ": {
              en: "depth per interval",
              var: "sidebar_03",
              items: {
                "": {
                  column: {
                    data: "sidebar_03",
                    type: "numeric",
                  },
                },
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
              items: {
                "": {
                  column: {
                    data: "hoop_01",
                    type: "numeric",
                  },
                },
              },
            },
            "組数": {
              en: "Numbers of hoop tie",
              var: "hoop_02",
              items: {
                "": {
                  column: {
                    data: "hoop_02",
                    type: "numeric",
                    format: "0.000",
                  },
                },
              },
            },
            "間隔": {
              en: "Spacing of hoop tie",
              var: "hoop_03",
              items: {
                "": {
                  column: {
                    data: "hoop_03",
                    type: "numeric",
                  },
                },
              },
            },
          },
        },
        "主筋の斜率": {
          en: "Angle of longitudinal rebar",
          var: "rebar_07",
          items: {
            "": {
              items: {
                "": {
                  column: {
                    data: "rebar_07",
                    type: "numeric",
                    format: "0.000",
                  },
                },
              },
            },
          },
        },
        "tan&gamma; + tan&beta;": {
          en: "tanγ+tanβ",
          var: "rebar_08",
          items: {
            "": {
              items: {
                "": {
                  column: {
                    data: "rebar_08",
                    type: "numeric",
                  },
                },
              },
            },
          },
        },
        "折曲げ鉄筋": {
          en: "bent up bar",
          var: "",
          items: {
            "鉄筋径": {
              en: "Diameter of bent up bar",
              var: "bent_01",
              items: {
                "": {
                  column: {
                    data: "bent_01",
                    type: "numeric",
                  },
                },
              },
            },
            "本数": {
              en: "Numbers of bent up bar",
              var: "bent_02",
              items: {
                "": {
                  column: {
                    data: "bent_02",
                    type: "numeric",
                  },
                },
              },
            },
            "間隔": {
              en: "Spacing of bent up bar",
              var: "bent_03",
              items: {
                "": {
                  column: {
                    data: "bent_03",
                    type: "numeric",
                  },
                },
              },
            },
            "角度": {
              en: "Angle of bent up bar",
              var: "bent_04",
              items: {
                "": {
                  column: {
                    data: "bent_04",
                    type: "numeric",
                  },
                },
              },
            },
          },
        },
        "処理": {
          en: "processing",
          var: "flg_enable",
          items: {
            "": {
              items: {
                "": {
                  column: {
                    data: "flg_enable",
                    type: "checkbox",
                  },
                },
              },
            },
          },
        },
      }
    }
  ]);
