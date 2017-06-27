'use strict';

/**
 * @ngdoc service
 * @name webdan.MemberSection
 * @description
 * # MemberSection
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('MemberSection', ['LowResource', 'memberSectionConfig', 'HtHelper',
    function (LowResource, memberSectionConfig, HtHelper) {

      let MemberSection = LowResource({
        'table': 'memberSections',
        'foreignKeys': {
          'parents': {
            Member: 'm_no',
          },
        },
      });

      _.mixin(MemberSection, HtHelper);

      MemberSection.htInit(memberSectionConfig);

      return MemberSection;
    }
  ]);
