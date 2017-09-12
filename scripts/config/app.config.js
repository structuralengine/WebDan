'use strict';

angular.module('webdan')
  .constant('appConfig', {
    db: {
      'source': 'webdan.2',
      'defaults': {
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
        calculationPrint: {}
      }
    },
    CalculationPrint: {
      calculatePage: 'calculate.aspx',
      server: {
        url: 'http://www.structuralengine.com/RCNonlinear/api/values'
      }
    }
  });
