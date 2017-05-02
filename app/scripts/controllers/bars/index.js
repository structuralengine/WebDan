'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BarsIndexCtrl
 * @description
 * # BarsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('BarsIndexCtrl', ['$scope', '$compile', '$log', 'Bar',
    function($scope, $compile, $log, Bar) {
      let ctrl = this;

      ctrl.bars = Bar.query();

      ctrl.settings = {
        minSpareRows: 1,
        colHeaders: true,
        nestedHeaders: [
          [
            /* 1*/ '<span header-rowspan="3">No.</span>',
            /* 2*/ '<span header-rowspan="3" class="vertical-container"><span class="vertical">部材番号</span></span>',
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
            /*19*/ '<span header-rowspan="3">主筋の<br>斜率</span>',
            /*20*/ '<span header-rowspan="3">tan&gamma;<br> + <br>tan&beta;</span>',
            /*21*/ {label: '折曲げ鉄筋', colspan: 4},
            /*22*/
            /*23*/
            /*24*/
            /*25*/ '<span header-rowspan="3" class="vertical-container"><span class="vertical">処理</span></span>',
          ],
          [
            /* 1*/ '',
            /* 2*/ '',
            /* 3*/ '',
            /* 4*/ 'B',
            /* 5*/ '曲げ',
            /* 6*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">位置</span></span>',
            /* 7*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">鉄筋径</span></span>',
            /* 8*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">本数</span></span>',
            /* 9*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">一段目<br>カブリ</span></span>',
            /*10*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">並び数</span></span>',
            /*11*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">アキ</span></span>',
            /*12*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">間隔</span></span>',
            /*13*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">鉄筋径</span></span>',
            /*14*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">本数片</span></span>',
            /*15*/ '<span header-rowspan="2">上端位置<br>/ピッチ</span>',
            /*16*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">鉄筋径</span></span>',
            /*17*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">組数</span></span>',
            /*18*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">間隔</span></span>',
            /*19*/ '',
            /*20*/ '',
            /*21*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">鉄筋径</span></span>',
            /*22*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">本数</span></span>',
            /*23*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">間隔</span></span>',
            /*24*/ '<span header-rowspan="2" class="vertical-container"><span class="vertical">角度</span></span>',
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
          /* 1*/ {data: 'no'          , type: 'numeric'},
          /* 2*/ {data: 'm_no'        , type: 'numeric', format: '0.000'},
          /* 3*/ {data: 'p_name'      , type: 'numeric', format: '0.0'},
          /* 4*/ {data: 'BH'          , type: 'numeric'},
          /* 5*/ {data: 'dH'          , type: 'numeric'},
          /* 6*/ {data: 'reber_side'  , type: 'numeric'},
          /* 7*/ {data: 'reber_01'    , type: 'numeric'},
          /* 8*/ {data: 'reber_02'    , type: 'numeric'},
          /* 9*/ {data: 'reber_03'    , type: 'numeric'},
          /*10*/ {data: 'reber_04'    , type: 'numeric'},
          /*11*/ {data: 'reber_05'    , type: 'checkbox'},
          /*12*/ {data: 'reber_06'    , type: 'checkbox'},
          /*13*/ {data: 'sideber_01'  , type: 'numeric'},
          /*14*/ {data: 'sideber_02'  , type: 'numeric', format: '0.0'},
          /*15*/ {data: 'sideber_03'  , type: 'numeric', format: '0.00'},
          /*16*/ {data: 'hoop_01'     , type: 'numeric', format: '0.00'},
          /*17*/ {data: 'hoop_02'     , type: 'numeric', format: '0.00'},
          /*18*/ {data: 'hoop_03'     , type: 'numeric'},
          /*19*/ {data: 'reber_07'    , type: 'numeric'},
          /*20*/ {data: 'reber_08'    , type: 'numeric'},
          /*21*/ {data: 'bent_01'     , type: 'numeric'},
          /*22*/ {data: 'bent_02'     , type: 'numeric'},
          /*23*/ {data: 'bent_03'     , type: 'numeric'},
          /*24*/ {data: 'bent_04'     , type: 'numeric'},
          /*25*/ {data: 'flg_enable'  , type: 'numeric'},
        ],
        afterRender: function() {
          $compile(this.rootElement)($scope);
        },
      };
    }
  ]);
