'use strict';

/**
 * @ngdoc service
 * @name webdan.groupsConfig
 * @description
 * # groupsConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('groupsConfig', {
    "ファイル名": {
      "en": "File Name",
      "column": {
        "data": "File.name",
        "type": "text"
      }
    },
    "グループ No": {
      "en": "Group No",
      "column": {
        "data": "g_no",
        "type": "numeric",
        "format": "0.0"
      }
    },
    "部材名": {
      "en": "Member Name",
      "column": {
        "data": "g_name",
        "type": "text"
      }
    }
  });
