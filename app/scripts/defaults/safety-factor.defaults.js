'use strict';

/**
 * @ngdoc service
 * @name webdan.defaults/safetyFactorDefaults
 * @description
 * # defaults/safetyFactorDefaults
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('safetyFactorDefaults', [
    '耐久性',
    '安全性 (疲労破壊)',
    '安全性 (破壊)',
    '復旧性 (損傷 地震時以外)',
    '復旧性 (損傷 地震時)',
  ]);
