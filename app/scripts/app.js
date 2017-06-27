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
    'local-db',
    'ht-utils',
    'ui.bootstrap',
  ])
  .config(['dbConfig', 'appConfig',
    function(dbConfig, appConfig) {
      dbConfig.source = appConfig.db.source;
      dbConfig.defaults = appConfig.db.defaults;
    }
  ]);
