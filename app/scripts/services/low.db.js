'use strict';

/**
 * @ngdoc service
 * @name webdan.lowdb
 * @description
 * # lowdb
 * Service in the webdan.
 */
angular.module('webdan')
  .service('$lowdb', ['appConfig',
    function (appConfig) {

      let db;
      let defaultState;
      let resources = [];
      let $lowdbSvc = this;

      this.get = function(storeKey) {
        return db.get(storeKey);
      };

      this.clear = function() {
        let newState = angular.copy(defaultState);
        this.load(newState);
      };

      this.load = function(state) {
        if (state) {
          db.setState(state);
        }
        db.read();

        resources.forEach(function(resource) {
          let reset = resource.init || angular.noop;
          reset();
        });
      };

      this.appendResource = function(resource) {
        if (!resources.includes(resource)) {
          resources.push(resource);
        }
      };

      this.download = function() {
        let state = db.getState();
        angular.forEach(state, function(entries, key) {
          if (angular.isArray(entries)) {
            state[key] = $lowdbSvc.clean(entries);
          }
        });

        save(state);
      }

      function save(state) {
        let json = angular.toJson(state);
        let filename = appConfig.source +'.'+ Date.now() +'.json';
        let type = {type: "application/json; charset=utf-8"};
        let file = new File([json], filename, type);
        saveAs(file);
      }

      this.clean = function(entries) {
        return entries.filter(function(entry) {
          let values = Object.values(entry).filter(function(value) {
            return (value !== null);
          });
          return (values.length > 0);
        });
      };

      function init(config) {
        defaultState = angular.copy(config.defaults.state)
        db = low(config.source);
        db.defaults(defaultState).write();
      }

      init(appConfig);

    }
  ]);
