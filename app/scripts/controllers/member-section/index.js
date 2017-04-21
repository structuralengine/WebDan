'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MemberSectionIndexCtrl
 * @description
 * # MemberSectionIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MemberSectionIndexCtrl', ['$scope', '$compile', 'Member', 'SectionShape', 'Condition', 'MemberSection',
    function($scope, $compile, Member, SectionShape, Condition, MemberSection) {
      var ctrl = this;

      ctrl.memberSections = [{
        'm_no': 1,
        'm_len': 0.000,
        'g_no': 2.0,
        'g_name': '柱 矩形',
        'shape': '円形',
        'B': 750,
        'H': 1200,
        'Bt': 2480,
        't': 250,
        'con_u': 1,
        'con_l': 1,
        'con_s': 1,
        'vis_u': false,
        'vis_l': true,
        'ecsd': 202,
        'kr': 202.31,
        'r1_1': 57.10,
        'r1_2': 25.50,
        'r1_3': 25.50,
        'n': 3,
        'flg_fatigue': true,
      }];

      ctrl.members = Member.query();
      ctrl.sectionShapes = SectionShape.query();
      ctrl.conditions = Condition.query();

      ctrl.settings = {};

      ctrl.settings.memberSections = {
        data: ctrl.memberSections,
        minSpareRows: 1,
        colHeaders: true,
        nestedHeaders: [
          [
            /* 1*/ '<span header-rowspan="2">部材<br>番号</span>',
            /* 2*/ '<span header-rowspan="2">部材長</span>',
            /* 3*/ '<span header-rowspan="2">グループ <br>No.</span>',
            /* 4*/ '<span header-rowspan="2">部材名</span>',
            /* 5*/ '<span header-rowspan="2">断面形状</span>',
            /* 6*/ {label: '断面 (mm)', colspan: 4},
            /* 7*/
            /* 8*/
            /* 9*/
            /*10*/ {label: '環境条件', colspan: 3},
            /*11*/
            /*12*/
            /*13*/ {label: '外観', colspan: 2},
      	    /*14*/
      	    /*15*/ 'ひび割',
      	    /*16*/ 'せん断',
      	    /*17*/ {label: '鉄筋 曲げ加工 r<sub>1</sub>', colspan: 3},
      	    /*18*/
      	    /*19*/
      	    /*20*/ '<span header-rowspan="2">部材数</span>',
      	    /*21*/ '<span header-rowspan="2">疲労<br>パス</span>'
          ],
          [
            /* 1*/ '',
            /* 2*/ '',
            /* 3*/ '',
            /* 4*/ '',
            /* 5*/ '',
            /* 6*/ 'B',
            /* 7*/ 'H',
            /* 8*/ 'B<sub>t</sub>',
            /* 9*/ 't',
            /*10*/ '上側',
            /*11*/ '下側',
            /*12*/ 'せん断',
            /*13*/ '上側',
            /*14*/ '下側',
            /*15*/ '&epsilon;<sub>csd</sub>',
            /*16*/ 'k<sub>r</sub>',
            /*17*/ '軸鉄筋',
            /*18*/ '帯筋',
            /*19*/ '折曲げ',
            /*20*/ '',
            /*21*/ '',
          ],
        ],
        columns: [
          /* 1*/ {data: 'm_no'        , type: 'numeric'},
          /* 2*/ {data: 'm_len'       , type: 'numeric', format: '0.000'},
          /* 3*/ {data: 'g_no'        , type: 'numeric', format: '0.0'},
          /* 4*/ {data: 'g_name', },
          /* 5*/ {data: 'shape', },
          /* 6*/ {data: 'B'           , type: 'numeric'},
          /* 7*/ {data: 'H'           , type: 'numeric'},
          /* 8*/ {data: 'Bt'          , type: 'numeric'},
          /* 9*/ {data: 't'           , type: 'numeric'},
          /*10*/ {data: 'con_u'       , type: 'numeric'},
          /*11*/ {data: 'con_l'       , type: 'numeric'},
          /*12*/ {data: 'con_s'       , type: 'numeric'},
          /*13*/ {data: 'vis_u'       , type: 'checkbox'},
          /*14*/ {data: 'vis_l'       , type: 'checkbox'},
          /*15*/ {data: 'ecsd'        , type: 'numeric'},
          /*16*/ {data: 'kr'          , type: 'numeric', format: '0.0'},
          /*17*/ {data: 'r1_1'        , type: 'numeric', format: '0.00'},
          /*18*/ {data: 'r1_2'        , type: 'numeric', format: '0.00'},
          /*19*/ {data: 'r1_3'        , type: 'numeric', format: '0.00'},
          /*20*/ {data: 'n'           , type: 'numeric'},
          /*21*/ {data: 'flg_fatigue' , type: 'checkbox'},
        ],
        afterRender: function() {
          $compile(this.rootElement)($scope);
        },
      };

      ctrl.settings.members = {
        readOnly: true,
        rowHeaders: true,
        columns: [
          {data: 'g_no'},
          {data: 'g_name', allowHtml: true}
        ],
      };

      ctrl.settings.sectionShapes = {
        readOnly: true,
        rowHeaders: true,
        columns: [
          {data: 'name'}
        ],
      };

      ctrl.settings.conditions = {
        readOnly: true,
        rowHeaders: true,
        columns: [
          {data: 'name'}
        ],
      };
    }
  ]);
