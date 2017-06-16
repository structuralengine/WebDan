'use strict';

/**
 * @ngdoc service
 * @name webdan.Member
 * @description
 * # Member
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Member', ['$injector', 'LowResource', 'memberConfig', 'HtHelper',
    function ($injector, LowResource, memberConfig, HtHelper) {

      let primaryKey = 'm_no';

      let Member = LowResource({
        "store": 'members',
        "primaryKey": primaryKey,
        "foreignKeys": {
          "parents": {
            Group: 'g_no',
          },
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

      _.mixin(Member, HtHelper);

      Member.htInit(memberConfig);

      return Member;
    }
  ]);
