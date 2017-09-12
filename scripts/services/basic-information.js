'use strict';

angular.module('webdan')
  .factory('BasicInformation', ['LowResource', 'basicInformationConfig', 'HtHelper',
    function (LowResource, basicInformationConfig, HtHelper) {

      let BasicInformation = LowResource({
        table: 'basicInformation'
      });

      _.mixin(BasicInformation, HtHelper);

      return BasicInformation;
    }
  ]);
