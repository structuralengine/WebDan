'use strict';

/**
 * @ngdoc service
 * @name webdan.config/db.config
 * @description
 * # config/db.config
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('dbConfig', {
    'path': 'webdan.2',
    'defaults': {
      'state': {
        basicInformation: {},
        groups: [],
          members: [],
            designPoints: [],
              bars: [],
              fatigues: [],
              bendingMoments: [],
              shears: [],
          safetyFactors: [],
          materialStrengths: [],
          materialStrengthRests: [],
        calculationPrint: {},
      },
    },
  });
