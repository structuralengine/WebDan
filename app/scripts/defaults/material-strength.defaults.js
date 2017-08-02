'use strict';

/**
 * @ngdoc service
 * @name webdan.defaults/materialStrengthDefaults
 * @description
 * # defaults/materialStrengthDefaults
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('materialStrengthDefaults', {
    bars: [
      '降伏強度',
      '設計引張強度',
    ],
    ranges: [
      'D29 以上',
      'D25 以下',
    ],
  });
