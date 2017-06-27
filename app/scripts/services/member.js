'use strict';

/**
 * @ngdoc service
 * @name webdan.Member
 * @description
 * # Member
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Member', ['$injector', '$filter', 'LowResource', 'Group', 'memberConfig', 'groupDefaults', 'sectionShapeDefaults', 'conditionDefaults', 'HtHelper',
    function ($injector, $filter, LowResource, Group, memberConfig, groupDefaults, sectionShapeDefaults, conditionDefaults, HtHelper) {

      let primaryKey = 'm_no';
      let g_no_column = 2;
      let params = {
        'table': 'members',
        'primaryKey': primaryKey,
        'foreignKeys': {
          'children': {
            DesignPoint: primaryKey,
          },
        },
        afterAdd: afterAdd,
      };
      let Member = LowResource(params);

      function afterAdd(m_no) {
        let children = this.foreignKeys.children;
        angular.forEach(children, function(foreignKey, alias) {
          let Child = $injector.get(alias);
          let children;
          if (angular.isDefined(Child.getDefaults)) {
            children = Child.getDefaults();
          }
          else {
            children = [];
          }

          children.forEach(function(data) {
            data[primaryKey] = m_no;
            Child.add(data);
          });
        });
      }

      Member.afterChange = function(changes, source) {
        let hot = this;
        changes.forEach(function(change) {
          let [row, prop, oldVal, newVal] = change;
          let member = hot.getSourceDataAtRow(row);

          switch (prop) {
            case 'g_no':
            case 'g_name':
              let members = hot.getSourceData();
              Group.update(member, members);
              break;
            default:
              break;
          }
        });
      };

      Member.Group = {
        query: function() {
          let groups = Group.query();
          if (Object.keys(groups).length == 0) {
            let members = Member.query();
            Group.load(members);
            groups = Group.query();
          }
          groups = groups.map(function(group) {
            group.g_no = $filter('number')(group.g_no, 1) + '';
            return group;
          });

          return $filter('orderBy')(groups, 'g_no');
        },
      }

      _.mixin(Member, HtHelper);

      Member.htInit(memberConfig);

      Member.settings.columns[4].renderer = getRenderer('shapes');
      Member.settings.columns[9].renderer = getRenderer('conditions');
      Member.settings.columns[10].renderer = getRenderer('conditions');
      Member.settings.columns[11].renderer = getRenderer('conditions');

      function getRenderer(key) {
        let items;
        switch (key) {
          case 'conditions':
            items = conditionDefaults;
            break;
          case 'shapes':
            items = sectionShapeDefaults;
            break;
          default:
            items = [];
            break;
        }
        return function(hot, td, row, col, prop, no, cellProperties) {
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
