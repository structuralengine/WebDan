'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MemberSectionsIndexCtrl
 * @description
 * # MemberSectionsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MemberSectionsIndexCtrl', ['$scope', '$log', '$filter', 'MemberSection', 'Member',
    function($scope, $log, $filter, MemberSection, Member) {
      let ctrl = this;

      function renderGroupNo(hot, td, row, col, prop, m_no, cellProperties) {
        renderGroup(td, m_no, 'g_no');
        return td;
      }

      function renderGroupName(hot, td, row, col, prop, m_no, cellProperties) {
        renderGroup(td, m_no, 'g_name');
        return td;
      }

      function renderGroup(td, m_no, prop) {
        let label = '';
        if (m_no) {
          let member = Member.getAsc(m_no, 'm_no');
          if (member && member.Group) {
            label = member.Group[prop] || '';
          }
        }
        angular.element(td).html(label);
      }

      function init() {
        let columns = angular.copy(MemberSection.columns);
        columns[2].renderer = renderGroupNo;
        columns[3].renderer = renderGroupName;

        ctrl.settings = {
          colHeaders: true,
          nestedHeaders: MemberSection.nestedHeaders,
          columns: columns,
          minSpareRows: 1,
          afterChange: function(changes, source) {
            if (source !== 'loadData') {
              let get = this.getSourceDataAtRow;
              changes.forEach(function(change) {
                let memberSection = get(change[0]);
                MemberSection.save(memberSection);
              });
            }
          },
        };

        let memberSections = MemberSection.query();
        ctrl.memberSections = $filter('orderBy')(memberSections, function(memberSection) {
          return memberSection.m_no;
        });
      }

      init();
    }
  ]);
