'use strict';

/**
 * @ngdoc overview
 * @name webdan
 * @description
 * # webdan
 *
 * Main module of the application.
 */
angular.module('webdan', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase.ref.app',
    'firebase.auth.app',
    'angularMoment',
    'ngHandsontable',
    'ht-helper',
    'local-db',
    'ui.bootstrap',
  ])
  .config(['$lowdbProvider', 'dbConfig',
    function($lowdbProvider, dbConfig) {
      $lowdbProvider.init({
        path: dbConfig.path,
        state: dbConfig.defaults.state,
      });
    }
  ]);
