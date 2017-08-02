'use strict';

/**
 * @ngdoc service
 * @name webdan.RCNonlinear
 * @description
 * # RCNonlinear
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('RCNonlinear', ['$resource', 'appConfig',
    function ($resource, appConfig) {

      let url = appConfig.CalculationPrint.server.url;
      let params = {};
      let actions = {
        send: {
          method: 'POST',
          withCredentials: false,
        },
      };
      let options = {};
      let RCNonlinear = $resource(url, params, actions, options);

      return RCNonlinear;

    }
  ]);
