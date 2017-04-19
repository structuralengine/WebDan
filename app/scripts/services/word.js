'use strict';

/**
 * @ngdoc service
 * @name webdan.Word
 * @description
 * # Word
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Word', ['webdanRef', '$firebaseArray', '$firebaseObject',
    function(webdanRef, $firebaseArray, $firebaseObject) {

      let ref = webdanRef.child('words');
      let words = $firebaseArray(ref);
      let Word = {};

      Word.validators = {
        'ja': /.+/,
        'en': /[A-Za-z0-9\s]*/,
        'var': {
          'text': /[^<>]*/
        }
      };

      Word.query = function(pageKey) {
        if (pageKey) {
          let query = ref.orderByChild('page').equalTo(pageKey);
          return $firebaseArray(query);
        }
        return words;
      }

      Word.add = function(word) {
        return words.$add(word)
          .then(function(ref) {
            word.$id = ref.key;
          })
          .catch(function(err) {
            throw err;
          });
      }

      Word.save = function(word) {
        return words.$save(word);
      }

      Word.update = function(key, prop, val) {
        let path = key +'/'+ prop.replace('.', '/');
        let propRef = ref.child(path);
        let obj = $firebaseObject(propRef);
        obj.$value = val;
        return obj.$save().catch(function(err) {
          throw err;
        });
      }

      return Word;
    }
  ]);
