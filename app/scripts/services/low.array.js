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
          let afterAdd;

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
              let id = doc[primaryKey];
              let foundDoc = lowArray.get(id);
              if (foundDoc) {
                return lowArray.update(doc);
              }
            }
            return lowArray.add(doc);
          }

          lowArray.add = function(doc) {
            if (primaryKey == 'id') {
              doc[primaryKey] = _.createId();
            }
            let result = store.push(doc).write();
            if (afterAdd && foreignKeys.children) {
              afterAdd(doc[primaryKey], foreignKeys.children);
            }
          };

          lowArray.update = function(doc) {
            let id = doc[primaryKey];
            let foundDoc = lowArray.get(id, true);
            return foundDoc.assign(doc).write();
          }

          lowArray.get = function(id, asRef) {
            return lowArray.getBy(primaryKey, id, asRef);
          };

          lowArray.getBy = function(prop, val, asRef) {
            let param = {};
            param[prop] = val;
            let ref = store.find(param);

            if (asRef) {
              return ref;
            }
            else {
              return ref.value();
            }
          };

          lowArray.getAsc = function(id, prop) {
            prop = prop || primaryKey;
            let doc = lowArray.getBy(prop, id);
            if (doc) {
              doc = angular.copy(doc);
              angular.forEach(foreignKeys.parent, function(foreignKey, alias) {
                if (angular.isDefined(doc[foreignKey])) {
                  let Parent = $injector.get(alias);
                  if (!Parent) {
                    throw 'Invalid parent: '+ alias;
                  }
                  else {
                    let parent = Parent.getAsc(doc[foreignKey], foreignKey);
                    if (parent) {
                      doc[alias] = parent;
                    }
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
            if (changes) {
              let get = hot.getSourceDataAtRow;
              changes.forEach(function(change) {
                let item = get(change[0]);
                lowArray.save(item);
              });
            }
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

          lowArray.getSelectRenderer = function(options, path) {
            return function renderB(hot, td, row, col, prop, value, cellProperties) {
              let content = '';
              if (value) {
                let option = options[value] || {};
                if (path) {
                  content = _.get(option, path);
                }
                else {
                  content = option;
                }
              }
              angular.element(td).html(content);
              return td;
            }
          }

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
          };

          lowArray.parseColumns = function(columns) {
            let parentForeignKeys = {};
            angular.forEach(foreignKeys.parent, function(foreignKey, alias) {
              parentForeignKeys[foreignKey] = alias;
            });

            columns.forEach(function(column) {
              let parentForeignKey = column.data;
              let parentAlias = parentForeignKeys[parentForeignKey];
              if (angular.isDefined(parentAlias)) {
                let Parent = $injector.get(parentAlias);
                let path = column.path;
                if (!path) {
                  throw 'no foreign path for '+ parentAlias;
                }
                column.renderer = Parent.getRenderer(path);
              }
            });
          }

          lowArray.init = function() {
            store = $lowdb.get(params.store);
          }

          function init() {
            lowArray.init();
            $lowdb.appendResource(lowArray);
            primaryKey = params.primaryKey || 'id';
            foreignKeys = angular.merge({}, provider.defaults.foreignKeys, params.foreignKeys || {});

            if (angular.isDefined(params.afterAdd)) {
              afterAdd = params.afterAdd;
            }

            return lowArray;
          }

          return init();
        }

        return lowArrayFactory;
      }
    ];
  });
