'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsIndexCtrl
 * @description
 * # BarsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsIndexCtrl', ['$scope', '$compile',
    function($scope, $compile) {
      let ctrl = this;

      ctrl.bars = [];

      ctrl.settings = {
        data: ctrl.bars,
        minSpareRows: 1,
        colHeaders: true,
        nestedHeaders: [
          [
            /* 1*/ '<span header-rowspan="3">No.</span>',
            /* 2*/ '<span header-rowspan="3">部材<br>番号</span>',
            /* 3*/ '<span header-rowspan="3">算出点名</span>',
            /* 4*/ '断面',
            /* 5*/ 'ハンチ高',
            /* 6*/ {label: '軸方向鉄筋', colspan: 7},
            /* 7*/
            /* 8*/
            /* 9*/
            /*10*/
            /*11*/
            /*12*/
            /*13*/ {label: '側方鉄筋', colspan: 3},
            /*14*/
            /*15*/
            /*16*/ {label: 'スターラップ', colspan: 3},
            /*17*/
            /*18*/
            /*19*/ '<span header-rowspan="3">主筋の斜率</span>',
            /*20*/ '<span header-rowspan="3">tan&gamma;<br> + <br>tan&beta;</span>',
            /*21*/ {label: '折曲げ鉄筋', colspan: 4},
            /*22*/
            /*23*/
            /*24*/
            /*25*/ '処理',
          ],
          [
            /* 1*/ '',
            /* 2*/ '',
            /* 3*/ '',
            /* 4*/ 'B',
            /* 5*/ '曲げ',
            /* 6*/ '<span header-rowspan="2">位置</span>',
            /* 7*/ '<span header-rowspan="2">鉄筋径</span>',
            /* 8*/ '<span header-rowspan="2">本数</span>',
            /* 9*/ '<span header-rowspan="2">一段目カブリ</span>',
            /*10*/ '<span header-rowspan="2">並び数</span>',
            /*11*/ '<span header-rowspan="2">アキ</span>',
            /*12*/ '<span header-rowspan="2">間隔</span>',
            /*13*/ '<span header-rowspan="2">鉄筋径</span>',
            /*14*/ '<span header-rowspan="2">本数片</span>',
            /*15*/ '<span header-rowspan="2">上端位置/ピッチ</span>',
            /*16*/ '<span header-rowspan="2">鉄筋径</span>',
            /*17*/ '<span header-rowspan="2">組数</span>',
            /*18*/ '<span header-rowspan="2">間隔</span>',
            /*19*/ '',
            /*20*/ '',
            /*21*/ '<span header-rowspan="2">鉄筋径</span>',
            /*22*/ '<span header-rowspan="2">本数</span>',
            /*23*/ '<span header-rowspan="2">間隔</span>',
            /*24*/ '<span header-rowspan="2">角度</span>',
            /*25*/ '',
          ],
          [
            /* 1*/ '',
            /* 2*/ '',
            /* 3*/ '',
            /* 4*/ 'H',
            /* 5*/ 'せん断',
            /* 6*/ '',
            /* 7*/ '',
            /* 8*/ '',
            /* 9*/ '',
            /*10*/ '',
            /*11*/ '',
            /*12*/ '',
            /*13*/ '',
            /*14*/ '',
            /*15*/ '',
            /*16*/ '',
            /*17*/ '',
            /*18*/ '',
            /*19*/ '',
            /*20*/ '',
            /*21*/ '',
            /*22*/ '',
            /*23*/ '',
            /*24*/ '',
            /*25*/ '',
          ],
        ],
        columns: [
          /* 1*/ {data: 'no'        , type: 'numeric'},
          /* 2*/ {data: 'm_no'       , type: 'numeric', format: '0.000'},
          /* 3*/ {data: 'p_name'        , type: 'numeric', format: '0.0'},
          /* 4*/ {data: 'B', },
          /* 5*/ {data: 'H', },
          /* 6*/ {data: 'dH_m'           , type: 'numeric'},
          /* 7*/ {data: 'dH_s'           , type: 'numeric'},
          /* 8*/ {data: 'reber_side'          , type: 'numeric'},
          /* 9*/ {data: 'reber_01'           , type: 'numeric'},
          /*10*/ {data: 'reber_02'       , type: 'numeric'},
          /*11*/ {data: 'reber_03'       , type: 'numeric'},
          /*12*/ {data: 'reber_04'       , type: 'numeric'},
          /*13*/ {data: 'reber_05'       , type: 'checkbox'},
          /*14*/ {data: 'reber_06'       , type: 'checkbox'},
          /*15*/ {data: 'sideber_01'        , type: 'numeric'},
          /*16*/ {data: 'sideber_02'          , type: 'numeric', format: '0.0'},
          /*17*/ {data: 'sideber_03'        , type: 'numeric', format: '0.00'},
          /*18*/ {data: 'hoop_01'        , type: 'numeric', format: '0.00'},
          /*19*/ {data: 'hoop_02'        , type: 'numeric', format: '0.00'},
          /*20*/ {data: 'hoop_03'           , type: 'numeric'},
          /*21*/ {data: 'reber_07'        , type: 'numeric'},
          /*22*/ {data: 'reber_08'        , type: 'numeric'},
          /*23*/ {data: 'bent_01'        , type: 'numeric'},
          /*24*/ {data: 'bent_02'        , type: 'numeric'},
          /*25*/ {data: 'bent_03'        , type: 'numeric'},
          /*26*/ {data: 'bent_04'        , type: 'numeric'},
          /*27*/ {data: 'flg_enable'        , type: 'numeric'},
        ],
        afterRender: function() {
          $compile(this.rootElement)($scope);
        },
      };
    }
  ]);
