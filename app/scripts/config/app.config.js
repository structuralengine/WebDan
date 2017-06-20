'use strict';

/**
 * @ngdoc service
 * @name webdan.appConfig
 * @description
 * # appConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('appConfig', {
    DesignPoint: {
      useDefaults: false,
    },
    CalculationPrint: {
      server: {
        url: 'http://www.structuralengine.com/RCNonlinear/api/values',
      },
    },
  });
