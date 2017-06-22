'use strict';

/**
 * @ngdoc service
 * @name webdan.defaults/groupDefaults
 * @description
 * # defaults/groupDefaults
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('groupDefaults', {
    '1.0': '上層梁',
    '1.1': '中層梁',
    '1.2': '地中梁',
    '1.3': '片持梁',
    '1.4': '頂版',
    '1.5': '底版',
    '1.6': 'フーチング',
    '2.0': '柱 矩形',
    '2.1': '柱 円形',
    '2.2': '柱 小判',
    '3.0': '杭',
  });