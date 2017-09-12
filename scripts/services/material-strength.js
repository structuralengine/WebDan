'use strict';

angular.module('webdan')
    .factory('MaterialStrength', ['LowResource', 'materialStrengthConfig', 'materialStrengthDefaults', 'HtHelper',
        function (LowResource, materialStrengthConfig, materialStrengthDefaults, HtHelper) {

            let MaterialStrength = LowResource({
                'table': 'materialStrengths',
                'foreignKeys': {
                    'parents': {
                        Group: 'g_no'
                    }
                }
            });

            MaterialStrength.createDefaultEntries = function (foreignKey, foreignValue) {
                let bars = materialStrengthDefaults.bars;
                let ranges = materialStrengthDefaults.ranges;
                bars.forEach(function (bar) {
                    ranges.forEach(function (range) {
                        MaterialStrength.save({
                            bar: bar,
                            range: range,
                            g_no: foreignValue
                        });
                    });
                });
            };

            _.mixin(MaterialStrength, HtHelper);
            MaterialStrength.htInit(materialStrengthConfig);

            return MaterialStrength;
        }
    ]);
