angular.module('firebase.ref.app', ['firebase'])
  .factory('Ref', ['$window', function($window) {
    'use strict';
    return new $window.firebase.database().ref();
  }]);
