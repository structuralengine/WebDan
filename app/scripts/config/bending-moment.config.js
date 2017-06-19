"use strict";

/**
 * @ngdoc service
 * @name webdan.bendingMomentsConfig
 * @description
 * # bendingMomentsConfig
 * Factory in the webdan.
 */
angular.module("webdan")
  .factory("bendingMomentConfig", ['$injector', 'HtHelper',
    function($injector, HtHelper) {

      return (function() {
        return {
          "部材番号": {
            en: "",
            var: "",
            column: {
              data: "designPointId",
              path: "Member.m_no",
              type: "numeric"
            },
            items: {
              "": {
                items: {
                  "": {},
                },
              },
            },
          },
          "部材名": {
            en: "",
            var: "",
            column: {
              data: "designPointId",
              path: "Member.g_name",
            },
            items: {
              "": {
                items: {
                  "": {},
                },
              },
            },
          },
          "算出点名": {
            en: "",
            var: "",
            column: {
              data: "designPointId",
              path: "p_name",
              renderer: HtHelper.getEditableForeignValueRenderer('DesignPoint', 'p_name'),
            },
            items: {
              "": {
                items: {
                  "": {},
                },
              },
            },
          },
          "耐久性・使用性": {
            en: "for examination",
            var: "case_10",
            items: {
              "縁応力<span class='break'></span>検討用": {
                en: "for examination of tensile extreme fiber stress intensity",
                var: "pik_10",
                items: {
                  "M<sub>d</sub>": {
                    en: "M<sub>d</sub>",
                    column: {
                      data: "case_10.pik_10.Md",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                  "N<sub>d</sub>": {
                    en: "N<sub>d</sub>",
                    column: {
                      data: "case_10.pik_10.Nd",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                }
              },
              "鉄筋応力度<span class='break'></span>検討用": {
                en: "for examination on stress intensity of reinforcing bar",
                var: "pik_11",
                items: {
                  "M<sub>d</sub>": {
                    en: "M<sub>d</sub>",
                    column: {
                      data: "case_10.pik_11.Md",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                  "N<sub>d</sub>": {
                    en: "N<sub>d</sub>",
                    column: {
                      data: "case_10.pik_11.Nd",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                }
              },
              "耐久性検討用<span class='break'></span>(永久)": {
                en: "Check of durability (Permanent Load)",
                var: "pik_12",
                items: {
                  "M<sub>d</sub>": {
                    en: "M<sub>d</sub>",
                    column: {
                      data: "case_10.pik_12.Md",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                  "N<sub>d</sub>": {
                    en: "N<sub>d</sub>",
                    column: {
                      data: "case_10.pik_12.Nd",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                }
              },
              "耐久性検討用<span class='break'></span>(変動)": {
                en: "Check of durability (Variable Load)",
                var: "pik_13",
                items: {
                  "M<sub>d</sub>": {
                    en: "M<sub>d</sub>",
                    column: {
                      data: "case_10.pik_13.Md",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                  "N<sub>d</sub>": {
                    en: "N<sub>d</sub>",
                    column: {
                      data: "case_10.pik_13.Nd",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                }
              },
              "外観検討用": {
                en: "Check for serviceability (visible crack)",
                var: "pik_14",
                items: {
                  "M<sub>d</sub>": {
                    en: "M<sub>d</sub>",
                    column: {
                      data: "case_10.pik_14.Md",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                  "N<sub>d</sub>": {
                    en: "N<sub>d</sub>",
                    column: {
                      data: "case_10.pik_14.Nd",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                }
              },
            }
          },
          "疲労": {
            en: "Failure by fatigue",
            var: "case_20",
            items: {
              "最小応力": {
                en: "Failure by fatigue (Min Stress)",
                var: "pik_20",
                items: {
                  "M<sub>d</sub>": {
                    en: "M<sub>d</sub>",
                    column: {
                      data: "case_20.pik_20.Md",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                  "N<sub>d</sub>": {
                    en: "N<sub>d</sub>",
                    column: {
                      data: "case_20.pik_20.Nd",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                }
              },
              "最大応力": {
                en: "Failure by fatigue (Max Stress)",
                var: "pik_21",
                items: {
                  "M<sub>d</sub>": {
                    en: "M<sub>d</sub>",
                    column: {
                      data: "case_20.pik_21.Md",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                  "N<sub>d</sub>": {
                    en: "N<sub>d</sub>",
                    column: {
                      data: "case_20.pik_21.Nd",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                }
              },
            }
          },
          "破壊": {
            en: "ultimate limit state",
            var: "case_30",
            items: {
              "設計断面力": {
                en: "ultimate limit state",
                var: "pik_30",
                items: {
                  "M<sub>d</sub>": {
                    en: "M<sub>d</sub>",
                    column: {
                      data: "case_30.pik_30.Md",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                  "N<sub>d</sub>": {
                    en: "N<sub>d</sub>",
                    column: {
                      data: "case_30.pik_30.Nd",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                }
              },
              "軸力最大": {
                en: "N_max",
                items: {
                  "N<sub>max</sub>": {
                    en: "(dummey)",
                    column: {
                      data: "case_30.pik_31",
                      type: "numeric",
                      format: "0.00"
                    }
                  }
                }
              },
            }
          },
          "復旧性": {
            en: "Restorability",
            var: "case_40",
            items: {
              "復旧<span class='break'></span>地震時以外": {
                en: "usual",
                items: {
                  "M<sub>d</sub>": {
                    en: "M<sub>d</sub>",
                    column: {
                      data: "case_40.usual.Md",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                  "N<sub>d</sub>": {
                    en: "N<sub>d</sub>",
                    column: {
                      data: "case_40.usual.Nd",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                }
              },
              "復旧<span class='break'></span>地震時": {
                en: "Seismic",
                var: "pik_41",
                items: {
                  "M<sub>d</sub>": {
                    en: "M<sub>d</sub>",
                    column: {
                      data: "case_40.pik_41.Md",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                  "N<sub>d</sub>": {
                    en: "N<sub>d</sub>",
                    column: {
                      data: "case_40.pik_41.Nd",
                      type: "numeric",
                      format: "0.00"
                    }
                  },
                }
              },
            }
          },
        }
      })();
    }
  ]);
