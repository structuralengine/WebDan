'use strict';

/**
 * @ngdoc directive
 * @name webdan.directive:headerRowspan
 * @description
 * # headerRowspan
 */
angular.module('webdan')
  .directive('headerRowspan', ['hotRegisterer',
    function(hotRegisterer) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          let $th = element.parents('th').attr('rowspan', attrs.headerRowspan);
          let $tr = $th.parents('tr').addClass('has-rowspan');
          let idx = $th.prop('cellIndex');
          $tr.nextAll('tr').each(function(i, tr) {
            let $tr = $(tr);
            $tr.children(':nth-child('+ (idx + 1) +')').addClass('hide-for-rowspan');
            $tr.children(':nth-child('+ (idx + 2) +')').addClass('next-to-rowspan');
          });
        }
      }
    }
  ]);
