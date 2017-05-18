'use strict';

/**
 * @ngdoc service
 * @name webdan.sectionForcesConfig
 * @description
 * # sectionForcesConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('sectionForcesConfig', {
    "部材番号": {
      "en": "Member No",
      column: {
        data: "Member.m_no",
        type: "numeric"
      }
    },
    "部材名": {
      "en": "Member Name",
      column: {
        data: "Member.Group.g_name",
      }
    },
    "算出点名": {
      en: "Point Name",
      column: {
        data: "p_name",
        type: "text",
      },
    },
  });
