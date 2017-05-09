'use strict';

/**
 * @ngdoc service
 * @name webdan.Calculation
 * @description
 * # Calculation
 * Factory in the webdan.
 */

angular.module('webdan').factory('Calculation', function () {
  return {
    page: function page(value1, value2) {
      // 値をセッションへ代入する。この値を calculation.aspx が読み込む

      // 呼び出す
      return 'calculation.aspx';
    }
  };
});
//# sourceMappingURL=calculation.js.map
