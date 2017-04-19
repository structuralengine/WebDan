'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:PagesIndexCtrl
 * @description
 * # PagesIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('PagesIndexCtrl', ['$scope', '$log', 'Page',
    function($scope, $log, Page) {
      let ctrl = this;

      ctrl.settings = {
        allowInvalid: false,
        stretchH: 'all',
        colHeaders: ['日本語', '英語'],
        columns: [
          {data: 'ja', validator: Page.validators.ja},
          {data: 'en', validator: Page.validators.en},
        ],
        afterChange: function(change, source) {
          if (source !== 'loadData') {
            try {
              changes.forEach(function(change) {
                let [idx, prop, oldVal, newVal] = change;
                let page = ctrl.pages[idx];
                if (angular.isUndefined(page.$id)) {
                  Page.add(page);
                } else {
                  Page.update(page.$id, prop, newVal);
                }
              });
            }
            catch (err) {
              $log.error(err);
            }
          }
        }
      }


      let pages;
      Page.query().$loaded(function(_pages) {
        pages = _pages;
        ctrl.pages = angular.copy(_pages);
      });
    }
  ]);
