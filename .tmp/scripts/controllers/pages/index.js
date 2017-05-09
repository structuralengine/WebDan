'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:PagesIndexCtrl
 * @description
 * # PagesIndexCtrl
 * Controller of the webdan
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

angular.module('webdan').controller('PagesIndexCtrl', ['$scope', '$log', 'Page', function ($scope, $log, Page) {
  var ctrl = this;

  ctrl.settings = {
    allowInvalid: false,
    //stretchH: 'all',
    colHeaders: ['日本語', '英語'],
    columns: [{ data: 'ja', validator: Page.validators.ja }, { data: 'en', validator: Page.validators.en }],
    afterChange: function afterChange(change, source) {
      if (source !== 'loadData') {
        try {
          changes.forEach(function (change) {
            var _change = _slicedToArray(change, 4),
                idx = _change[0],
                prop = _change[1],
                oldVal = _change[2],
                newVal = _change[3];

            var page = ctrl.pages[idx];
            if (angular.isUndefined(page.$id)) {
              Page.add(page);
            } else {
              Page.update(page.$id, prop, newVal);
            }
          });
        } catch (err) {
          $log.error(err);
        }
      }
    }
  };

  var pages = void 0;
  Page.query().$loaded(function (_pages) {
    pages = _pages;
    ctrl.pages = angular.copy(_pages);
  });
}]);
//# sourceMappingURL=index.js.map
