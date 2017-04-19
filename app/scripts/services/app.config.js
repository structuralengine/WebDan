'use strict';

/**
 * @ngdoc service
 * @name webdan.appConfig
 * @description
 * # appConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('appConfig', (function() {
    var Config = {};

    Config.messages = {
      tabs: {
        'basic-information'               : '基本データ',
        'member-section'                  : '部材・断面',
        'design-point'                    : '算出点',
        'bars'                            : '鉄筋配置',
        'fatigue'                         : '疲労データ',
        'safety-factor-material-strength' : '安全係数・材料強度',
        'section-forces'                  : '断面力',
        'calculation-print'               : '計算・印刷',
        'words'                           : '用語',
        'pages'                           : '項目'
      }
    };

    return Config;
  })());
