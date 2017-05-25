'use strict';

/**
 * @ngdoc service
 * @name webdan.firebaseResource
 * @description
 * # firebaseResource
 * Factory in the webdan.
 */
angular.module('webdan')
  .provider('$fbResource', function() {

    // Private variables
    let provider = this;

    // Public API for configuration
    this.defaults = {
      foreignKeysIn: {
        parent: {
          children: {},
        },
        entry: {
          parent: {},
          children: {}
        },
        child: {
          parent: {}
        }
      }
    };

    // Method for instantiating
    this.$get = ['$q', '$log', '$injector', '$firebaseArray', '$firebaseObject', '$firebaseUtils',
      function ($q, $log, $injector, $firebaseArray, $firebaseObject, $firebaseUtils) {

        function firebaseFactory(params) {
          let ref = params.ref;
          let coll = $firebaseArray(ref);
          let foreignKeysIn = {};
          let ParentFactory;
          let ChildFactories = {};

          function init() {
            let normalizedForeignKeysIn = angular.merge({}, provider.defaults.foreignKeysIn, params.foreignKeysIn);
            angular.forEach(normalizedForeignKeysIn, function(foreignKeyConfig, position) {
              let config = foreignKeysIn[position] = {};
              angular.forEach(foreignKeyConfig, function(pairs, property) {
                let values = config[property] = Object.entries(pairs).map(function(entry) {
                  return {
                    factoryName: entry[0],
                    foreignKey: entry[1]
                  };
                });

                if (!(position == 'entry' && property == 'children') && values.length) {
                  config[property] = values.shift();
                }
              });
            });
            $log.debug('inner formatted foreign keys', foreignKeysIn);
          }

          init();

          function Firebase(value) {}

          Firebase.query = function(parentKey, path) {
            let query = ref;
            if (!path && foreignKeysIn.entry.parent) {
              path = foreignKeysIn.entry.parent.foreignKey;
            }
            if (path && parentKey) {
              query = query.orderByChild(path);
              query = query.equalTo(parentKey);
              return $firebaseArray(query);
            }
            return coll;
          }

          Firebase.$query = function(parentKey, path) {
            return Firebase.query(parentKey, path).$loaded().then(function(entries) {
              return $q.resolve(entries);
            });
          }

          Firebase.$queryAsc = function(parentKey, path) {
            return Firebase.$query(parentKey, path).then(function(entries) {
              let p1 = entries.map(function(entry) {
                return Firebase.$getAsc(entry.$id);
              });

              return $q.all(p1).then(function(entries) {
                return $q.resolve(entries);
              })
            })
          }

          Firebase.$queryDesc = function(parentKey, path) {
            return Firebase.$query(parentKey, path).then(function(entries) {
              let p1 = entries.map(function(entry) {
                return Firebase.$getDesc(entry);
              });

              return $q.all(p1).then(function(entries) {
                return $q.resolve(entries);
              });
            })
          }

          Firebase.$add = function(entry, collection) {
            collection = collection || coll;
            return collection.$add(entry).then(function(_ref) {
              return Firebase.$get(_ref.key, collection);
            })
          }

          Firebase.$save = function(entry, collection) {
            collection = collection || coll;
            return collection.$save(entry).then(function(_ref) {
              return Firebase.$get(_ref.key, collection);
            })
          }

          Firebase.get = function(key, collection) {
            if (!key) {
              return $firebaseObject(ref);
            }
            else {
              collection = collection || coll;
              if (collection.$resolved) {
                return collection.$getRecord(key);
              }
              else {
                throw 'firebase collection not resolved';
              }
            }
          }

          Firebase.$get = function(key, collection) {
            if (!key) {
              return Firebase.get(key).$loaded(function(entry) {
                return entry;
              });
            }
            else {
              return Firebase.$query().then(function() {
                try {
                  let entry = Firebase.get(key, collection);
                  if (entry) {
                    return $q.resolve(entry);
                  }
                  else {
                    throw 'no such entry with key: '+ key;
                  }
                }
                catch (err) {
                  $log.error(err);
                  return $q.reject(err);
                }
              })
            }
          }

          Firebase.$getAsc = function(key, collection) {
            return Firebase.$get(key, collection).then(function(entry) {
              let Parent = getParentFactory();
              if (!Parent) {
                return $q.resolve(entry);
              }
              else {
                let parentForeignConfig = foreignKeysIn.entry.parent;
                let parentForeignKey = parentForeignConfig.foreignKey;
                let parentFactoryName = parentForeignConfig.factoryName;
                if (angular.isUndefined(entry[parentForeignKey]) || !entry[parentForeignKey]) {
                  return $q.resolve(entry);
                }
                else {
                  let parentKey = entry[parentForeignKey];
                  return Parent.$getAsc(parentKey).then(function(parentEntry) {
                    entry[parentFactoryName] = parentEntry;
                    return $q.resolve(entry);
                  })
                }
              }
            })
          }

          Firebase.$getDesc = function(entry, collection) {
            if (angular.isString(entry)) {
              return Firebase.$get(entry).then(function(_entry) {
                return Firebase.$getDesc(_entry, collection);
              })
            }
            else {
              if (foreignKeysIn.entry.children.length == 0) {
                return $q.resolve(entry);
              }
              else {
                let p1 = foreignKeysIn.entry.children.map(function(childConfig) {
                  let childFactoryName = childConfig.factoryName;
                  let Child = getChildFactory(childFactoryName);
                  if (!Child) {
                    return $q.resolve(entry);
                  }
                  else {
                    let path = foreignKeysIn.child.parent.foreignKey;
                    return Child.$queryDesc(entry.$id, path).then(function(childEntries) {
                      entry[childFactoryName] = childEntries;
                      return $q.resolve(entry);
                    })
                  }
                })

                return $q.all(p1).then(function(entries) {
                  $log.debug('$q.all then entry', entries);
                  return $q.resolve(entries[0]);
                })
              }
            }
          }

          Firebase.$remove = function(entry, collection) {
            collection = collection || coll;
            let key = entry.$id;
            let idx = collection.$indexFor(key);
            return collection.$remove(idx);
          }

          Firebase.ref = function() {
            return ref;
          }

          ref.on('child_added', function(childSnapshot, prevChildKey) {
            setForeignKey(childSnapshot);
          });

          ref.on('child_removed', function(childSnapshot) {
            removeForeignKey(childSnapshot);
          })

          ref.on('child_changed', function(childSnapshot, prevChildKey) {
            updateForeignKey(childSnapshot);
          })

          function setForeignKey(snapshot) {
            let foreignPoint = getForeignPoints.parent(snapshot);
            if (foreignPoint) {
              foreignPoint.$value = true;
              foreignPoint.$save();
            }
          }

          function removeForeignKey(snapshot) {
            let foreignPointInParent = getForeignPoints.parent(snapshot);
            if (foreignPointInParent) {
              foreignPointInParent.$remove();
            }

            getForeignPoints.children(snapshot).forEach(function(foreignPointInChild) {
              foreignPointInChild.$remove();
            })
          }

          function updateForeignKey(snapshot) {
            let Parent = getParentFactory();
            if (Parent) {
              let parentForeignKey = foreignKeysIn.entry.parent.foreignKey;
              let newParentKey = snapshot.val()[parentForeignKey];

              let entryKey = snapshot.key;
              let entryForeignKey = foreignKeysIn.parent.children.foreignKey;
              let path = entryForeignKey +'/'+ entryKey;
              Parent.$query(true, path).then(function(parents) {
                let parentRef = Parent.ref();
                let keyChanged = false;
                parents.forEach(function(parent) {
                  keyChanged = (parent.$id !== newParentKey);
                  if (keyChanged) {
                    let path = parent.$id +'/'+ entryForeignKey +'/'+ entryKey;
                    let foreignRef = parentRef.child(path);
                    $firebaseObject(foreignRef).$remove();
                  }
                })

                if (keyChanged) {
                  setForeignKey(snapshot);
                }
              })
            }
          }

          let getForeignPoints = {
            parent: function(snapshot) {
              let Parent = getParentFactory();
              if (Parent && foreignKeysIn.parent) {
                let entryForeignKeyInParent = foreignKeysIn.parent.children.foreignKey;
                let parentForeignKeyInEntry = foreignKeysIn.entry.parent.foreignKey;
                if (Parent && entryForeignKeyInParent && parentForeignKeyInEntry) {
                  let entryKey = snapshot.key;
                  let parentKey = snapshot.val()[parentForeignKeyInEntry] || null;
                  if (parentKey) {
                    let path = parentKey +'/'+ entryForeignKeyInParent +'/'+ entryKey;
                    let foreignRef = Parent.ref().child(path);
                    return $firebaseObject(foreignRef);
                  }
                }
              }
              return null;
            },
            children: function(snapshot) {
              let points = foreignKeysIn.entry.children.map(function(child) {
                let Child = getChildFactory(child.factoryName);
                let entryForeignKeyInChild = foreignKeysIn.child.parent.foreignKey;
                let childForeignKeyInEntry = child.foreignKey;
                if (Child && entryForeignKeyInChild && childForeignKeyInEntry) {
                  let childKeys = snapshot.val()[childForeignKeyInEntry];
                  let childRef = Child.ref();
                  return Object.keys(childKeys).map(function(childKey) {
                    let path = childKey +'/'+ entryForeignKeyInChild;
                    let foreignRef = childRef.child(path);
                    return $firebaseObject(foreignRef);
                  })
                }
                return [];
              }).filter(function(_points) {
                return (_points.length > 0);
              });

              points = _.flatten(points);
              return points;
            },
          }

          function getParentFactory() {
            if (!ParentFactory && foreignKeysIn.entry.parent && foreignKeysIn.entry.parent.factoryName) {
              let factoryName = foreignKeysIn.entry.parent.factoryName;
              ParentFactory = $injector.get(factoryName);
            }
            return ParentFactory;
          }

          function getChildFactory(childFactoryName) {
            if (angular.isUndefined(ChildFactories[childFactoryName])) {
              ChildFactories[childFactoryName] = $injector.get(childFactoryName);
            }
            return ChildFactories[childFactoryName];
          }

          return Firebase;
        }

        return firebaseFactory;
      }
    ];
  });
