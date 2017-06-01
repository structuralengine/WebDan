'use strict';

/**
 * @ngdoc service
 * @name webdan.$lowArray
 * @description
 * # $lowArray
 * Provider in the webdan.
 */
angular.module('webdan')
  .provider('$lowArray', function () {

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
    this.$get = ['$injector', '$lowdb',
      function ($injector, $lowdb) {

        function lowArrayFactory(params) {
          let store;
          let foreignKeys;

          function lowArray() {}

          lowArray.query = function() {
            return store.value();
          };

          lowArray.save = function(doc, immediately) {
            if (doc.id) {
              return lowArray.update(doc, immediately);
            }
            else {
              return lowArray.add(doc, immediately);
            }
          }

          lowArray.add = function(doc, immediately) {
            doc.id = _.createId();
            if (!immediately) {
              store.push(doc);
            }
            return lowArray.update(doc, true);
          };

          lowArray.update = function(doc, immediately) {
            if (!immediately) {
              store.find({id: doc.id}).assign(doc);
            }
            return store.write();
          }

          lowArray.get = function(id) {
            return store.find({id: id}).value();
          };

          lowArray.getBy = function(prop, val) {
            let param = {};
            param[prop] = val;
            return store.find(param).value();
          };

          lowArray.getAsc = function(id) {
            let doc = lowArray.get(id);
            if (doc) {
              doc = angular.copy(doc);
              angular.forEach(foreignKeys.parent, function(foreignKey, alias) {
                if (angular.isDefined(doc[foreignKey])) {
                  let Parent = $injector.get(alias);
                  if (Parent) {
                    let parent = Parent.getAsc(doc[foreignKey]);
                    if (parent) {
                      doc[alias] = parent;
                    }
                  }
                  else {
                    throw 'Invalid parent: '+ alias;
                  }
                }
              });
            }
            return doc;
          }

          lowArray.remove = function(doc, immediately) {
            if (!immediately && doc) {
              store.remove({id: doc.id});
            }
            return store.write();
          };

          lowArray.init = function() {
            store = $lowdb.get(params.store);
          }

          function init() {
            lowArray.init();
            $lowdb.appendResource(lowArray);
            foreignKeys = angular.merge({}, provider.defaults.foreignKeys, params.foreignKeys || {});

            return lowArray;
          }

          return init();
        }

        return lowArrayFactory;
      }
    ];
  });
