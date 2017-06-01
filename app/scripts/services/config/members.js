'use strict';

/**
 * @ngdoc service
 * @name webdan.membersConfig
 * @description
 * # membersConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('membersConfig', {
    'グループ No': {
      'en': 'Group No',
      'column': {
        'data': 'Group.g_no',
        'type': 'numeric',
        'format': '0.0'
      }
    },
    '部材名': {
      'en': 'Member Name',
      'column': {
        'data': 'Group.g_name',
        'type': 'text'
      }
    },
    '部材番号': {
      'en': 'Member No',
      'column': {
        'data': 'm_no',
        'type': 'numeric'
      }
    }
  });
