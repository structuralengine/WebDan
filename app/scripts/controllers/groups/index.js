'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:GroupsIndexCtrl
 * @description
 * # GroupsIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('GroupsIndexCtrl', ['$scope', '$log', 'Group', 'HtHelper',
    function ($scope, $log, Group, HtHelper) {
      let ctrl = this;

      function update(changes, hot) {
        let groups = HtHelper.getChangeRows(changes, hot);
        groups.forEach(function(group) {
          let p;
          if (group.$id) {
            p = Group.$save(group);
          }
          else {
            p = Group.$add(group);
          }
          p.then(function(g) {
            g;
          }).catch(function(err) {
            $log.error(err);
          });
        });
      }

      function init() {
        ctrl.settings = {
          rowHeaders: true,
          colHeaders: true,
          minSpareRows: 1,
          nestedHeaders: Group.nestedHeaders,
          columns: Group.columns,
          afterChange: function(changes, source) {
            if (source !== 'loadData') {
              update(changes, this);
            }
          },
        };

        ctrl.groups = Group.query();
      }

      init();
    }
  ]);
