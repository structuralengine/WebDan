'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:WordsIndexCtrl
 * @description
 * # WordsIndexCtrl
 * Controller of the webdan
 */

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

angular.module('webdan').controller('WordsIndexCtrl', ['$scope', '$log', 'Page', 'Word', function ($scope, $log, Page, Word) {
  var ctrl = this;

  ctrl.pages = Page.query();

  ctrl.settings = {
    allowInvalid: false,
    colHeaders: ['番号', '日本語', '英語', '変数 as text', '変数 as html'],
    colWidths: [50, 200, 200, 100, 200],
    columns: [{ data: 'pointer', type: 'numeric' }, { data: 'ja' }, { data: 'en', validator: Word.validators.en }, { data: 'var.text', validator: Word.validators.var.text }, { data: 'var.html' }],
    contextMenu: ['remove_row'],
    afterChange: function afterChange(changes, source) {
      (changes || []).forEach(function (change) {
        try {
          var _change = _slicedToArray(change, 4),
              idx = _change[0],
              prop = _change[1],
              oldVal = _change[2],
              newVal = _change[3];

          var word = ctrl.words[idx];
          if (word) {
            word.$dirty = true;
          }
        } catch (e) {
          $log.error(e);
        }
      });
    },
    beforeRemoveRow: function beforeRemoveRow(index, amount, logicalRows) {
      logicalRows.forEach(function (idx) {
        var word = ctrl.words[idx];
        if (word && word.$id) {
          Word.remove(word);
        }
      });
    }
  };

  ctrl.select = function (page) {
    ctrl.page = page;
    Word.query(page.$id).$loaded(function (words) {
      ctrl.origWords = words;
      ctrl.words = angular.copy(words);
    });
  };

  ctrl.isDirty = function () {
    return (ctrl.words || []).some(function (word) {
      return !!word.$dirty;
    });
  };

  ctrl.save = function () {
    return (ctrl.words || []).forEach(function (word) {
      if (word.$dirty) {
        try {
          if (Word.isEmpty(word)) {
            if (word.$id) {
              var idx = ctrl.words.indexOf(word);
              Word.remove(word).then(function (ref) {
                ctrl.words.splice(idx, 1);
              });
            }
          } else {
            if (word.$id) {
              Word.save(word).then(function (ref) {
                word.$dirty = false;
              });
            } else {
              word.page = ctrl.page.$id;
              Word.add(word).then(function (ref) {
                word.$dirty = false;
              });
            }
          }
        } catch (e) {
          $log.error(e);
        }
      }
    });
  };
}]);
//# sourceMappingURL=index.js.map
