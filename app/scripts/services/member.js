'use strict';

/**
 * @ngdoc service
 * @name webdan.Member
 * @description
 * # Member
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Member', ['$injector', '$filter', 'LowResource', 'memberConfig', 'appConfig', 'HtHelper',
    function ($injector, $filter, LowResource, memberConfig, appConfig, HtHelper) {

      let primaryKey = 'm_no';
      let gNoColumn = 2;

      let Member = LowResource({
        "store": 'members',
        "primaryKey": primaryKey,
        "foreignKeys": {
          "children": {
            DesignPoint: primaryKey,
          },
        },
        afterAdd: afterAdd,
      });

      function afterAdd(m_no) {
        let data = {m_no: m_no};
        let children = this.foreignKeys.children;
        angular.forEach(children, function(foreignKey, alias) {
          let Child = $injector.get(alias);
          Child.add(data);
        });
      }

      Member.afterChange = function(changes, source) {
        let hot = this;
        changes.forEach(function(change) {
          let [row, prop, oldVal, newVal] = change;
          if (prop == 'g_no') {
            updateGNo(hot, row, newVal);
          }
          else if (prop == 'g_name') {
            updateGName(hot, row, newVal);
          }
        });
      };

      function updateGNo(hot, row, newGNo) {
        let member = hot.getSourceDataAtRow(row);
        let m_no = member.m_no;

        let members = hot.getSourceData();
        let others = members.filter(function(m) {
          return (m.g_no == newGNo && m.m_no != m_no);
        });

        let g_name;
        if (others.length) {
          g_name = others[0].g_name;
        }
        else {
          newGNo = $filter('number')(newGNo, 1);
          g_name = appConfig.defaults.groups[newGNo] || newGNo;
        }

        // g_no を設定すると g_name が自動設定される
        member.g_name = g_name;
      }

      function updateGName(hot, row, newGName) {
        // g_name を変更すると、
        // g_name が変更された行の g_no と同じ値を持つ、他の行の g_name も同時に変更される
        let g_no = hot.getDataAtCell(row, gNoColumn);

        let members = hot.getSourceData();
        members.forEach(function(member) {
          if (member.g_no == g_no) {
            member.g_name = newGName;
          }
        });
      }

      _.mixin(Member, HtHelper);

      Member.htInit(memberConfig);

      Member.settings.columns[4].renderer = getRenderer('shapes');
      Member.settings.columns[9].renderer = getRenderer('conditions');
      Member.settings.columns[10].renderer = getRenderer('conditions');
      Member.settings.columns[11].renderer = getRenderer('conditions');

      function getRenderer(key) {
        return function(hot, td, row, col, prop, no, cellProperties) {
          let items = appConfig.defaults[key];
          let item = _.find(items, function(item) {
            return (item.no == no);
          });
          let label = '';
          if (item) {
            label = item.name;
          }
          angular.element(td).html(label);
          return td;
        };
      }

      return Member;
    }
  ]);
