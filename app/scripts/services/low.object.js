'use strict';

/**
 * @ngdoc service
 * @name webdan.$lowObject
 * @description
 * # $lowObject
 * Provider in the webdan.
 */
angular.module('webdan')
  .provider('$lowObject', function () {

    // Private variables
    let provider = this;

    // Public API for configuration
    this.defaults = {
      foreignKeys: {
        parent: {},
        children: {},
      },
    };

    // Method for instantiating
    this.$get = ['$lowdb',
      function ($lowdb) {

        function lowObjectFactory(params) {
          let store;
          let storedObject;
          let propKeys;

          function lowObject() {}

          lowObject.query = function() {
            storedObject = store.value();

            let properties = [];
            angular.forEach(storedObject, function(value, key) {
              if (key != 'id') {
                properties.push({
                  key: key,
                  value: value,
                });
              }
            });

            return properties;
          }

          lowObject.save = function(row, value) {
            let key = propKeys[row];
            storedObject[key] = value;
            store.write();
          }

          lowObject.init = function() {
            store = $lowdb.get(params.store);
          };

          function init() {
            lowObject.init();
            storedObject = store.value();
            propKeys = Object.keys(storedObject);
            $lowdb.appendResource(lowObject);

            return lowObject;
          }

          return init();
        }

        return lowObjectFactory;
      }
    ];
  });
