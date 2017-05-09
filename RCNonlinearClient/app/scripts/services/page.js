'use strict';

/**
 * @ngdoc service
 * @name webdan.Page
 * @description
 * # Page
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Page', ['webdanRef', '$firebaseArray',
    function(webdanRef, $firebaseArray) {

      let ref = webdanRef.child('pages');
      let pages = $firebaseArray(ref);
      let Page = {};

      Page.validators = {
        'ja': /.+/,
        'en': /[A-Za-z0-9\s]*/,
      };

      Page.query = function() {
        return pages;
      }

      Page.add = function(page) {
        return pages.$add(page)
          .then(function(ref) {
            page.$id = ref.key;
          })
          .catch(function(err) {
            throw err;
          });
      }

      Page.update = function(key, prop, val) {
        let page = pages.$getRecord(key);
        page[prop] = val;
        return pages.$save(page).catch(function(err) {
          throw err;
        });
      }

      return Page;
    }
  ]);
