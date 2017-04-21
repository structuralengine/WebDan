'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MemberSectionIndexCtrl
 * @description
 * # MemberSectionIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MemberSectionIndexCtrl', ['$scope', '$compile', '$log', '$q', 'Member', 'SectionShape', 'Condition', 'MemberSection',
    function($scope, $compile, $log, '$q', Member, SectionShape, Condition, MemberSection) {
      var ctrl = this;
      ctrl.settings = {};

      ctrl.settings.memberSections = {
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
          /* 3*/ {data: 'memberId'    , type: 'numeric', format: '0.0', readOnly: true, renderer: Member.renderNo},
          /* 4*/ {data: 'memberId'    , editor: 'select', selectOptions: Member.selectOptions, renderer: Member.renderName},
          /* 5*/ {data: 'shapeId'     , editor: 'select', selectOptions: SectionShape.selectOptions, renderer: SectionShape.renderName},
          /* 6*/ {data: 'B'           , type: 'numeric'},
          /* 7*/ {data: 'H'           , type: 'numeric'},
          /* 8*/ {data: 'Bt'          , type: 'numeric'},
          /* 9*/ {data: 't'           , type: 'numeric'},
          /*10*/ {data: 'con_u'       , editor: 'select', selectOptions: Condition.selectOptions, renderer: Condition.renderName},
          /*11*/ {data: 'con_l'       , editor: 'select', selectOptions: Condition.selectOptions, renderer: Condition.renderName},
          /*12*/ {data: 'con_s'       , editor: 'select', selectOptions: Condition.selectOptions, renderer: Condition.renderName},
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
        afterChange: function(changes, source) {
          (changes || []).forEach(function(change) {
            let [idx, prop, oldVal, newVal] = change;
            let memberSection = ctrl.memberSections[idx];
            if (memberSection) {
              memberSection.$dirty = true;
            }
          })
        },
        afterRender: function() {
          $compile(this.rootElement)($scope);
        },
      };

      ctrl.settings.members = {
        readOnly: true,
        rowHeaders: true,
        columns: [
          {data: 'g_no'},
          {data: 'g_name', allowHtml: true, renderer: 'html'}
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

      ctrl.isDirty = function() {
        return (ctrl.memberSections || []).some(function(memberSection) {
          return !!memberSection.$dirty;
        });
      }

      ctrl.save = function() {
        ctrl.memberSections.forEach(function(memberSection) {
          if (!memberSection.$dirty) {
            return;
          }

          try {
            if (MemberSection.isEmpty(memberSection)) {
              let idx = ctrl.memberSections.indexOf(memberSection);
              if (!memberSection.$id) {
                removeMemberSection(idx);
              } else {
                MemberSection.remove(memberSection).then(function(ref) {
                  removeMemberSection(idx);
                });
              }
            } else {
              if (memberSection.$id) {
                MemberSection.save(memberSection).then(function(ref) {
                  resetDirty(memberSection);
                });
              } else {
                MemberSection.add(memberSection).then(function(ref) {
                  memberSection.$id = ref.key;
                  resetDirty(memberSection);
                });
              }
            }
          } catch (e) {
            $log.error(e);
          }
        })
      }

      function removeMemberSection(idx) {
        ctrl.memberSections.splice(idx, 1);
      }

      function resetDirty(memberSection) {
        memberSection.$dirty = false;
      }

      function init() {
        ctrl.members = Member.query();
        ctrl.sectionShapes = SectionShape.query();
        ctrl.conditions = Condition.query();
        ctrl.memberSections = MemberSection.query();
      }

      init();
    }
  ]);
