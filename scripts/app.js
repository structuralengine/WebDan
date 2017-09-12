'use strict';

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
    //'firebase.auth.app',
    'angularMoment',
    'ngHandsontable',
    'local-db',
    'ht-utils',
    'ui.bootstrap'
  ])
  .config(['dbConfig', 'appConfig',
    function(dbConfig, appConfig) {
      angular.extend(dbConfig, appConfig.db);
    }
  ]);
