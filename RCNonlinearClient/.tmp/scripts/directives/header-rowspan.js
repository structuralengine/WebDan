'use strict';

/**
 * @ngdoc directive
 * @name webdan.directive:headerRowspan
 * @description
 * # headerRowspan
 */

angular.module('webdan').directive('headerRowspan', ['hotRegisterer', function (hotRegisterer) {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      var $th = element.parents('th').attr('rowspan', attrs.headerRowspan);
      var $tr = $th.parents('tr').addClass('has-rowspan');
      var idx = $th.prop('cellIndex');
      $tr.nextAll('tr').each(function (i, tr) {
        var $tr = $(tr);
        $tr.children(':nth-child(' + (idx + 1) + ')').addClass('hide-for-rowspan');
        $tr.children(':nth-child(' + (idx + 2) + ')').addClass('next-to-rowspan');
      });
    }
  };
}]);
//# sourceMappingURL=header-rowspan.js.map
