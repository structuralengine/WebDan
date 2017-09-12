'use strict';

angular.module('webdan')
  .factory('shearConfig', ['$injector', 'HtHelper',
    function($injector, HtHelper) {

      return (function() {
          return {
              '部材番号': {
                  column: {
                      data: 'designPointId',
                      path: 'Member.m_no',
                      type: 'numeric',
                      readOnly: true
                  },
                  items: {
                      '': {
                          items: {
                              '': {}
                          }
                      }
                  }
              },
              '部材名': {
                  column: {
                      data: 'designPointId',
                      path: 'Member.g_name',
                      readOnly: true
                  },
                  items: {
                      '': {
                          items: {
                              '': {}
                          }
                      }
                  }
              },
              '算出点名': {
                  column: {
                      data: 'designPointId',
                      path: 'p_name',
                      renderer: HtHelper.getEditableForeignValueRenderer('DesignPoint', 'p_name')
                  },
                  items: {
                      '': {
                          items: {
                              '': {}
                          }
                      }
                  }
              },
              '耐久性・使用性': {
                  en: 'for examination',
                  var: 'case_10',
                  items: {
                      '設計耐力<span class=\'break\'></span>検討用': {
                          en: '',
                          var: 'pik_10',
                          items: {
                              'V<sub>d</sub>': {
                                  en: 'V<sub>d</sub>',
                                  column: {
                                      data: 'case_10.pik_10.Vd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'M<sub>d</sub>': {
                                  en: 'M<sub>d</sub>',
                                  column: {
                                      data: 'case_10.pik_10.Md',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'N<sub>d</sub>': {
                                  en: 'N<sub>d</sub>',
                                  column: {
                                      data: 'case_10.pik_10.Nd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              }
                          }
                      },
                      '永久荷重による<span class=\'break\'></span>断面力': {
                          en: 'for examination on stress intensity of reinforcing bar',
                          var: 'pik_12',
                          items: {
                              'V<sub>d</sub>': {
                                  en: 'V<sub>d</sub>',
                                  column: {
                                      data: 'case_10.pik_11.Vd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'M<sub>d</sub>': {
                                  en: 'M<sub>d</sub>',
                                  column: {
                                      data: 'case_10.pik_11.Md',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'N<sub>d</sub>': {
                                  en: 'N<sub>d</sub>',
                                  column: {
                                      data: 'case_10.pik_11.Nd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              }
                          }
                      },
                      '変動荷重による<span class=\'break\'></span>断面力': {
                          en: 'Check of durability (Permanent Load)',
                          var: 'pik_13',
                          items: {
                              'V<sub>d</sub>': {
                                  en: 'V<sub>d</sub>',
                                  column: {
                                      data: 'case_10.pik_12.Vd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'M<sub>d</sub>': {
                                  en: 'M<sub>d</sub>',
                                  column: {
                                      data: 'case_10.pik_12.Md',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'N<sub>d</sub>': {
                                  en: 'N<sub>d</sub>',
                                  column: {
                                      data: 'case_10.pik_12.Nd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              }
                          }
                      }
                  }
              },
              '疲労': {
                  en: 'Failure by fatigue',
                  var: 'case_20',
                  items: {
                      '最小応力': {
                          en: 'Failure by fatigue (Min Stress)',
                          var: 'pik_20',
                          items: {
                              'V<sub>d</sub>': {
                                  en: 'V<sub>d</sub>',
                                  column: {
                                      data: 'case_20.pik_20.Vd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'M<sub>d</sub>': {
                                  en: 'M<sub>d</sub>',
                                  column: {
                                      data: 'case_20.pik_20.Md',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'N<sub>d</sub>': {
                                  en: 'N<sub>d</sub>',
                                  column: {
                                      data: 'case_20.pik_20.Nd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              }
                          }
                      },
                      '最大応力': {
                          en: 'Failure by fatigue (Max Stress)',
                          var: 'pik_21',
                          items: {
                              'V<sub>d</sub>': {
                                  en: 'V<sub>d</sub>',
                                  column: {
                                      data: 'case_20.pik_21.Vd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'M<sub>d</sub>': {
                                  en: 'M<sub>d</sub>',
                                  column: {
                                      data: 'case_20.pik_21.Md',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'N<sub>d</sub>': {
                                  en: 'N<sub>d</sub>',
                                  column: {
                                      data: 'case_20.pik_21.Nd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              }
                          }
                      }
                  }
              },
              '破壊': {
                  en: 'ultimate limit state',
                  var: 'case_30',
                  items: {
                      '設計断面力': {
                          en: 'ultimate limit state',
                          var: 'pik_30',
                          items: {
                              'V<sub>d</sub>': {
                                  en: 'V<sub>d</sub>',
                                  column: {
                                      data: 'case_30.pik_30.Vd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'M<sub>d</sub>': {
                                  en: 'M<sub>d</sub>',
                                  column: {
                                      data: 'case_30.pik_30.Md',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'N<sub>d</sub>': {
                                  en: 'N<sub>d</sub>',
                                  column: {
                                      data: 'case_30.pik_30.Nd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              }
                          }
                      }
                  }
              },
              '復旧性': {
                  en: 'Restorability',
                  var: 'case_40',
                  items: {
                      '復旧<span class=\'break\'></span> 地震時以外': {
                          en: 'usual',
                          items: {
                              'V<sub>d</sub>': {
                                  en: 'V<sub>d</sub>',
                                  column: {
                                      data: 'case_40.usual.Vd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'M<sub>d</sub>': {
                                  en: 'M<sub>d</sub>',
                                  column: {
                                      data: 'case_40.usual.Md',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'N<sub>d</sub>': {
                                  en: 'N<sub>d</sub>',
                                  column: {
                                      data: 'case_40.usual.Nd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              }
                          }
                      },
                      '復旧<span class=\'break\'></span>地震時': {
                          en: 'Seismic',
                          var: 'pik_41',
                          items: {
                              'V<sub>d</sub>': {
                                  en: 'V<sub>d</sub>',
                                  column: {
                                      data: 'case_40.pik_41.Vd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'M<sub>d</sub>': {
                                  en: 'M<sub>d</sub>',
                                  column: {
                                      data: 'case_40.pik_41.Md',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              },
                              'N<sub>d</sub>': {
                                  en: 'N<sub>d</sub>',
                                  column: {
                                      data: 'case_40.pik_41.Nd',
                                      type: 'numeric',
                                      format: '0.00'
                                  }
                              }
                          }
                      }
                  }
              },
              'スパン': {
                  en: 'ultimate limit state',
                  var: 'span',
                  items: {
                      'せん断<span class=\'break\'></span>スパン長': {
                          en: 'ultimate limit state',
                          var: 'span',
                          column: {
                              data: 'span.span',
                              type: 'numeric',
                              format: '0.00'
                          }
                      },
                      'min(t/2,d)': {
                          en: 'ultimate limit state',
                          var: 't2',
                          column: {
                              data: 'span.t2',
                              type: 'numeric',
                              format: '0.00'
                          }
                      },
                      '杭の直径': {
                          en: 'ultimate limit state',
                          var: 'r',
                          column: {
                              data: 'span.r',
                              type: 'numeric',
                              format: '0.00'
                          }
                      }
                  }
              }
          };
      })();
    }
  ]);
