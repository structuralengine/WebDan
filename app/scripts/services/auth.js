'use strict';

/**
 * @ngdoc service
 * @name webdan.Auth
 * @description
 * # Auth
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Auth', ['$resource', '$rootScope',
    function ($resource, $rootScope) {

      let sessionKey = 'webdan.user';

      let url = 'http://www.structuralengine.com/customer/api/values';
      let params = {};
      let actions = {
        signIn: {
          method: 'GET',
          withCredentials: true,
        },
      };
      let options = {};
      let Auth = $resource(url, params, actions, options);

      Auth.$getAuth = function() {
        return sessionStorage.getItem(sessionKey);
      }

      Auth.signOut = function() {
        sessionStorage.removeItem(sessionKey);
        checkAuthState();
      };

      let onAuthStateChanged = angular.noop;
      $rootScope.$on('$routeChangeSuccess', function(e) {
        checkAuthState();
      });

      function checkAuthState() {
        let user = Auth.$getAuth();
        onAuthStateChanged(user);
      }

      Auth.$onAuthStateChanged = function(cb) {
        onAuthStateChanged = cb || angular.noop;
      }

      return Auth;
    }
  ]);
