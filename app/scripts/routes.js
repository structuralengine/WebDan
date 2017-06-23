'use strict';
/**
 * @ngdoc overview
 * @name webdan:routes
 * @description
 * # routes.js
 *
 * Configure routes for use with Angular, and apply authentication security
 * Add new routes using `yo angularfire:route` with the optional --auth-required flag.
 *
 * Any controller can be secured so that it will only load if user is logged in by
 * using `whenAuthenticated()` in place of `when()`. This requires the user to
 * be logged in to view this route, and adds the current user into the dependencies
 * which can be injected into the controller. If user is not logged in, the promise is
 * rejected, which is handled below by $routeChangeError
 *
 * Any controller can be forced to wait for authentication to resolve, without necessarily
 * requiring the user to be logged in, by adding a `resolve` block similar to the one below.
 * It would then inject `user` as a dependency. This could also be done in the controller,
 * but abstracting it makes things cleaner (controllers don't need to worry about auth state
 * or timing of displaying its UI components; it can assume it is taken care of when it runs)
 *
 *   resolve: {
 *     user: ['Auth', function(Auth) {
 *       return Auth.$getAuth();
 *     }]
 *   }
 *
 */
angular.module('webdan')

/**
 * Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
 * when called, invokes Auth.$requireAuth() service (see Auth.js).
 *
 * The promise either resolves to the authenticated user object and makes it available to
 * dependency injection (see AccountCtrl), or rejects the promise if user is not logged in,
 * forcing a redirect to the /login page
 */
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
      .whenAuthenticated('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .whenAuthenticated('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .whenAuthenticated('/', {
        templateUrl: 'views/basic-information.html',
        controller: 'BasicInformationCtrl',
        controllerAs: 'ctrl',
      })
      // .whenAuthenticated('/groups', {
      //   templateUrl: 'views/groups.html',
      //   controller: 'GroupsCtrl',
      //   controllerAs: 'ctrl',
      // })
      .whenAuthenticated('/material-strength-rests', {
        templateUrl: 'views/material-strength-rests.html',
        controller: 'MaterialStrengthRestsCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/calculation-print', {
        templateUrl: 'views/calculation-print.html',
        controller: 'CalculationPrintCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/members', {
        templateUrl: 'views/members.html',
        controller: 'MembersCtrl',
        controllerAs: 'ctrl',
      })
      // .whenAuthenticated('/member-sections', {
      //   templateUrl: 'views/member-sections.html',
      //   controller: 'MemberSectionsCtrl',
      //   controllerAs: 'ctrl',
      // })
      .whenAuthenticated('/design-points', {
        templateUrl: 'views/design-points.html',
        controller: 'DesignPointsCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/bars', {
        templateUrl: 'views/bars.html',
        controller: 'BarsCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/fatigues', {
        templateUrl: 'views/fatigues.html',
        controller: 'FatiguesCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/bending-moments', {
        templateUrl: 'views/bending-moments.html',
        controller: 'BendingMomentsCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/shears', {
        templateUrl: 'views/shears.html',
        controller: 'ShearsCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/safety-factors', {
        templateUrl: 'views/safety-factors.html',
        controller: 'SafetyFactorsCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/material-strengths', {
        templateUrl: 'views/material-strengths.html',
        controller: 'MaterialStrengthsCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/safety-factors-material-strengths', {
        templateUrl: 'views/safety-factors-material-strengths.html',
        controller: 'SafetyFactorsMaterialStrengthsCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/section-forces', {
        templateUrl: 'views/section-forces.html',
        controller: 'SectionForcesCtrl',
        controllerAs: 'ctrl',
      })
      .whenAuthenticated('/calc', {
        templateUrl: 'views/calc.html',
        controller: 'CalcCtrl',
        controllerAs: 'ctrl',
      })
      .otherwise({redirectTo: '/'});
  }])

  /**
   * Apply some route security. Any route's resolve method can reject the promise with
   * "AUTH_REQUIRED" to force a redirect. This method enforces that and also watches
   * for changes in auth status which might require us to navigate away from a path
   * that we can no longer view.
   */
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
