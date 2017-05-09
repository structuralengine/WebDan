'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:WordsIndexCtrl
 * @description
 * # WordsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('WordsIndexCtrl', ['$scope', '$log', 'Page', 'Word',
    function($scope, $log, Page, Word) {
      var ctrl = this;

      ctrl.pages = Page.query();

      ctrl.settings = {
        allowInvalid: false,
        colHeaders: [
          '番号',
          '日本語',
          '英語',
          '変数 as text',
          '変数 as html'
        ],
        colWidths: [50, 200, 200, 100, 200],
        columns: [
          {data: 'pointer', type: 'numeric'},
          {data: 'ja'},
          {data: 'en', validator: Word.validators.en},
          {data: 'var.text', validator: Word.validators.var.text},
          {data: 'var.html'},
        ],
        contextMenu: ['remove_row'],
        afterChange: function(changes, source) {
          (changes || []).forEach(function(change) {
            try {
              let [idx, prop, oldVal, newVal] = change;
              let word = ctrl.words[idx];
              if (word) {
                word.$dirty = true;
              }
            }
            catch (e) {
              $log.error(e);
            }
          });
        },
        beforeRemoveRow: function(index, amount, logicalRows) {
          logicalRows.forEach(function(idx) {
            let word = ctrl.words[idx];
            if (word && word.$id) {
              Word.remove(word);
            }
          });
        },
      };

      ctrl.select = function(page) {
        ctrl.page = page;
        Word.query(page.$id).$loaded(function(words) {
          ctrl.origWords = words;
          ctrl.words = angular.copy(words);
        });
      }

      ctrl.isDirty = function() {
        return (ctrl.words || []).some(function(word) {
          return !!word.$dirty;
        });
      };

      ctrl.save = function() {
        return (ctrl.words || []).forEach(function(word) {
          if (word.$dirty) {
            try {
              if (Word.isEmpty(word)) {
                if (word.$id) {
                  let idx = ctrl.words.indexOf(word);
                  Word.remove(word).then(function(ref) {
                    ctrl.words.splice(idx, 1);
                  });
                }
              } else {
                if (word.$id) {
                  Word.save(word).then(function(ref) {
                    word.$dirty = false;
                  });
                } else {
                  word.page = ctrl.page.$id;
                  Word.add(word).then(function(ref) {
                    word.$dirty = false;
                  });
                }
              }
            } catch (e) {
              $log.error(e);
            }
          }
        })
      };

    }
  ]);
