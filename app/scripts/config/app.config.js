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
    formats: {
      save: {
        timestamp: 'YYYYMMDD-HHmmss',
      },
    },
    DesignPoint: {
      useDefaults: false,
    },
    CalculationPrint: {
      sessionStorageKey: 'webdan.postData',
      server: {
        //url: 'http://www.structuralengine.com/RCNonlinear/api/values',
        url: 'https://jsonplaceholder.typicode.com/photos',
      },
    },
  });
