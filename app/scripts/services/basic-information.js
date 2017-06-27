'use strict';

/**
 * @ngdoc service
 * @name webdan.BasicInformation
 * @description
 * # BasicInformation
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('BasicInformation', ['LowResource', 'basicInformationConfig', 'HtHelper',
    function (LowResource, basicInformationConfig, HtHelper) {

      let BasicInformation = LowResource({
        table: 'basicInformation',
      });

      _.mixin(BasicInformation, HtHelper);

      return BasicInformation;
    }
  ]);
