'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:WordsIndexCtrl
 * @description
 * # WordsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('WordsIndexCtrl', ['$scope', 'appConfig', 'Word',
    function($scope, appConfig, Word) {
      var ctrl = this;
      var words;

      ctrl.submit = function(form) {
        if (form.AddWordForm.$valid) {
          words.$add(ctrl.word).then(function(ref) {
            ctrl.word = {};
          });
        }
        else if (form.EditWordForm.$valid) {
          form.EditWordForm;
        }
      }

      ctrl.select = function(key) {
        ctrl.page = key;
        ctrl.words = words = Word.query(key);
      }

      ctrl.pages = appConfig.messages.tabs;
    }
  ]);
