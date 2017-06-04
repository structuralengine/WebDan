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
          let primaryKey;
          let foreignKeys;

          function lowArray() {}

          lowArray.query = function() {
            let items = store.value();
            if (!angular.isArray(items)) {
              return items;
            }
            else {
              return items.filter(function(item) {
                return Object.values(item).filter(function(value) {
                  return !!value;
                }).length > 0;
              });
            }
          };

          lowArray.save = function(doc) {
            if (doc[primaryKey]) {
              return lowArray.update(doc);
            }
            else {
              return lowArray.add(doc);
            }
          }

          lowArray.add = function(doc) {
            doc[primaryKey] = _.createId();
            return store.push(doc).write();
          };

          lowArray.update = function(doc) {
            let id = doc[primaryKey];
            return store.find({id: id}).assign(doc).write();
          }

          lowArray.get = function(id) {
            return lowArray.getBy(primaryKey, id);
          };

          lowArray.getBy = function(prop, val) {
            let param = {};
            param[prop] = val;
            return store.find(param).value();
          };

          lowArray.getAsc = function(id, prop) {
            prop = prop || 'id';
            let doc = lowArray.getBy(prop, id);
            if (doc) {
              doc = angular.copy(doc);
              angular.forEach(foreignKeys.parent, function(foreignKey, alias) {
                if (angular.isDefined(doc[foreignKey])) {
                  let Parent = $injector.get(alias);
                  if (Parent) {
                    let parent = Parent.getAsc(doc[foreignKey], foreignKey);
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

          lowArray.remove = function(id) {
            return store.remove({id: id}).write();
          };

          lowArray.afterChange = function(changes, hot) {
            let get = hot.getSourceDataAtRow;
            changes.forEach(function(change) {
              let item = get(change[0]);
              lowArray.save(item);
            });
          }

          lowArray.getRenderer = function(path) {
            return function(hot, td, row, col, prop, id, cellProperties) {
              let label = '';
              if (id) {
                let item = lowArray.getAsc(id);
                if (item) {
                  label = _.get(item, path);
                }
              }
              angular.element(td).html(label);
              return td;
            };
          };

          lowArray.getOptions = function getOptions(path) {
            return function(row, col, prop) {
              let items = lowArray.query();
              return items.reduce(function(coll, item) {
                let id = item[primaryKey];
                if (id) {
                  coll[id] = _.get(item, path);
                }
                return coll;
              }, {});
            }
          }

          lowArray.init = function() {
            store = $lowdb.get(params.store);
          }

          function init() {
            lowArray.init();
            $lowdb.appendResource(lowArray);
            primaryKey = params.primaryKey || 'id';
            foreignKeys = angular.merge({}, provider.defaults.foreignKeys, params.foreignKeys || {});

            return lowArray;
          }

          return init();
        }

        return lowArrayFactory;
      }
    ];
  });
