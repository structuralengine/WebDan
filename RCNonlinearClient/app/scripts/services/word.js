'use strict';

/**
 * @ngdoc service
 * @name webdan.Word
 * @description
 * # Word
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Word', ['webdanRef', '$firebaseArray', '$firebaseObject', '$firebaseUtils',
    function(webdanRef, $firebaseArray, $firebaseObject, $firebaseUtils) {

      let ref = webdanRef.child('words');
      let words = $firebaseArray(ref);
      let Word = {};

      Word.validators = {
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
        let origWord = words.$getRecord(word.$id);
        let plainWord = $firebaseUtils.toJSON(word);
        angular.extend(origWord, plainWord);
        return words.$save(origWord)
          .then(function(ref) {
            ref;
          })
          .catch(function(err) {
            throw err;
          });
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

      Word.remove = function(word) {
        let origWord = words.$getRecord(word.$id);
        return words.$remove(origWord).catch(function(err) {
          throw err;
        });
      }

      Word.isEmpty = function(word) {
        return Object.keys(word).filter(function(prop) {
          return !prop.startsWith('$');
        }).every(function(prop) {
          switch (prop) {
            case 'page':
              return true;
            case 'var':
              return !word.var.text && !word.var.html;
            default:
              return !word[prop];
          }
        });
      }

      return Word;
    }
  ]);
