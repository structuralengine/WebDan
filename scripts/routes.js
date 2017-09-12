'use strict';

angular.module('webdan')
  .config(['$routeProvider', 'SECURED_ROUTES', function($routeProvider, SECURED_ROUTES) {
    // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
    // unfortunately, a decorator cannot be use here because they are not applied until after
    // the .config calls resolve, so they can't be used during route configuration, so we have
    // to hack it directly onto the $routeProvider object
    $routeProvider.whenAuthenticated = function(path, route) {
      route.resolve = route.resolve || {};
      route.resolve.user = ['Auth', function(Auth) {
        return Auth.$requireSignIn();
      }];
      $routeProvider.when(path, route);
      SECURED_ROUTES[path] = true;
      return $routeProvider;
    };
  }])

  // configure views; whenAuthenticated adds a resolve method to ensure users authenticate
  // before trying to access that route
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/account', {
      //.whenAuthenticated('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .when('/main', {
      //.whenAuthenticated('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/basic-information', {
      //.whenAuthenticated('/basic-information', {
        templateUrl: 'views/basic-information.html',
        controller: 'BasicInformationCtrl',
        controllerAs: 'ctrl'
      })
      .when('/material-strength-rests', {
      //.whenAuthenticated('/material-strength-rests', {
        templateUrl: 'views/material-strength-rests.html',
        controller: 'MaterialStrengthRestsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/calculation-print', {
      //.whenAuthenticated('/calculation-print', {
        templateUrl: 'views/calculation-print.html',
        controller: 'CalculationPrintCtrl',
        controllerAs: 'ctrl'
      })
      .when('/', {
      //.whenAuthenticated('/', {
        templateUrl: 'views/members.html',
        controller: 'MembersCtrl',
        controllerAs: 'ctrl'
      })
      .when('/design-points', {
      //.whenAuthenticated('/design-points', {
        templateUrl: 'views/design-points.html',
        controller: 'DesignPointsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/design-points/defaults', {
      //.whenAuthenticated('/design-points/defaults', {
        templateUrl: 'views/design-points/defaults.html',
        controller: 'DesignPointsDefaultsCtrl'
      })
      .when('/bars', {
      //.whenAuthenticated('/bars', {
        templateUrl: 'views/bars.html',
        controller: 'BarsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/fatigues', {
      //.whenAuthenticated('/fatigues', {
        templateUrl: 'views/fatigues.html',
        controller: 'FatiguesCtrl',
        controllerAs: 'ctrl'
      })
      .when('/bending-moments', {
      //.whenAuthenticated('/bending-moments', {
        templateUrl: 'views/bending-moments.html',
        controller: 'BendingMomentsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/shears', {
      //.whenAuthenticated('/shears', {
        templateUrl: 'views/shears.html',
        controller: 'ShearsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/safety-factors', {
      //.whenAuthenticated('/safety-factors', {
        templateUrl: 'views/safety-factors.html',
        controller: 'SafetyFactorsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/material-strengths', {
      //.whenAuthenticated('/material-strengths', {
        templateUrl: 'views/material-strengths.html',
        controller: 'MaterialStrengthsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/safety-factors-material-strengths', {
      //.whenAuthenticated('/safety-factors-material-strengths', {
        templateUrl: 'views/safety-factors-material-strengths.html',
        controller: 'SafetyFactorsMaterialStrengthsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/section-forces', {
      //.whenAuthenticated('/section-forces', {
        templateUrl: 'views/section-forces.html',
        controller: 'SectionForcesCtrl',
        controllerAs: 'ctrl'
      })
      .when('/calc', {
      //.whenAuthenticated('/calc', {
        templateUrl: 'views/calc.html',
        controller: 'CalcCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({redirectTo: '/'});
  }])

  // Apply some route security. Any route's resolve method can reject the promise with
  // "AUTH_REQUIRED" to force a redirect. This method enforces that and also watches
  // for changes in auth status which might require us to navigate away from a path
  // that we can no longer view.
  .run(['$rootScope', '$location', 'Auth', 'SECURED_ROUTES', 'loginRedirectPath',
    function($rootScope, $location, Auth, SECURED_ROUTES, loginRedirectPath) {
      // watch for login status changes and redirect if appropriate
      Auth.$onAuthStateChanged(check);

      // some of our routes may reject resolve promises with the special {authRequired: true} error
      // this redirects to the login page whenever that is encountered
      $rootScope.$on('$routeChangeError', function(e, next, prev, err) {
        if( err === 'AUTH_REQUIRED' ) {
          $location.path(loginRedirectPath);
        }
      });

      function check(user) {
        if( !user && authRequired($location.path()) ) {
          $location.path(loginRedirectPath);
        }
      }

      function authRequired(path) {
        return SECURED_ROUTES.hasOwnProperty(path);
      }
    }
  ])

  // used by route security
  .constant('SECURED_ROUTES', {});
