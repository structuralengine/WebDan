(function() {
  'use strict';
  angular.module('firebase.auth.app', ['firebase'])

    .factory('Auth', ['$firebaseAuth',
      function($firebaseAuth) {
        return $firebaseAuth();
      }
    ]);

})();
