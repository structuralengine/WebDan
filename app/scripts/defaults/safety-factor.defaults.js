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
    {name: '耐久性'},
    {name: '安全性 (疲労破壊)'},
    {name: '安全性 (破壊)'},
    {name: '復旧性 (損傷 地震時以外)'},
    {name: '復旧性 (損傷 地震時)'},
  ]);
