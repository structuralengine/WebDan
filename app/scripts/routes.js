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
 * when called, invokes Auth.$requireSignIn() service (see Auth.js).
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
      .whenAuthenticated('/', {
        templateUrl: 'views/files/index.html',
        controller: 'FilesIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/files/add', {
        templateUrl: 'views/files/add.html',
        controller: 'FilesAddCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/groups', {
        templateUrl: 'views/groups/index.html',
        controller: 'GroupsIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/groups/add', {
        templateUrl: 'views/groups/add.html',
        controller: 'GroupsAddCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/members', {
        templateUrl: 'views/members/index.html',
        controller: 'MembersIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/members/add', {
        templateUrl: 'views/members/add.html',
        controller: 'MembersAddCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/member-sections', {
        templateUrl: 'views/member-sections/index.html',
        controller: 'MemberSectionsIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/member-sections/add', {
        templateUrl: 'views/member-sections/add.html',
        controller: 'MemberSectionsAddCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/design-points', {
        templateUrl: 'views/design-points/index.html',
        controller: 'DesignPointsIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/design-points/add', {
        templateUrl: 'views/design-points/add.html',
        controller: 'DesignPointsAddCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/section-forces', {
        templateUrl: 'views/section-forces/index.html',
        controller: 'SectionForcesIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/section-forces/add', {
        templateUrl: 'views/section-forces/add.html',
        controller: 'SectionForcesAddCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/bending-moments', {
        templateUrl: 'views/bending-moments/index.html',
        controller: 'BendingMomentsIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/bending-moments/add', {
        templateUrl: 'views/bending-moments/add.html',
        controller: 'BendingMomentsAddCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/shears', {
        templateUrl: 'views/shears/index.html',
        controller: 'ShearsIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/shears/add', {
        templateUrl: 'views/shears/add.html',
        controller: 'ShearsAddCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/bar1s', {
        templateUrl: 'views/bar1s/index.html',
        controller: 'Bar1sIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/bar1s/add', {
        templateUrl: 'views/bar1s/add.html',
        controller: 'Bar1sAddCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/fatigue1s', {
        templateUrl: 'views/fatigue1s/index.html',
        controller: 'Fatigue1sIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/fatigue1s/add', {
        templateUrl: 'views/fatigue1s/add.html',
        controller: 'Fatigue1sAddCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/basic-information', {
        templateUrl: 'views/basic-information/index.html',
        controller: 'BasicInformationIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/safety-factor-material-strength', {
        templateUrl: 'views/safety-factor-material-strength.html',
        controller: 'SafetyFactorMaterialStrengthCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/calculation-print', {
        templateUrl: 'views/calculation-print.html',
        controller: 'CalculationPrintCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/words', {
        templateUrl: 'views/words/index.html',
        controller: 'WordsIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/pages', {
        templateUrl: 'views/pages/index.html',
        controller: 'PagesIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/section-shapes', {
        templateUrl: 'views/section-shapes/index.html',
        controller: 'SectionShapesIndexCtrl',
        controllerAs: 'ctrl'
      })
      .whenAuthenticated('/conditions', {
        templateUrl: 'views/conditions/index.html',
        controller: 'ConditionsIndexCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({redirectTo: '/basic-information'});
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
