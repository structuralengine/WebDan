'use strict';

/**
 * @ngdoc service
 * @name webdan.HtHelper
 * @description
 * # HtHelper
 * Service in the webdan.
 */
angular.module('webdan')
  .service('HtHelper', function () {

    this.parseNestedHeaders = function(config, maxDepth) {
      let depth = 0;
      let nestedHeaders = [];
      parseHeaderConfig(config, nestedHeaders, depth, maxDepth);

      return nestedHeaders;
    }

    function parseHeaderConfig(config, nestedHeaders, depth, maxDepth) {
      if (angular.isUndefined(nestedHeaders[depth])) {
        nestedHeaders.splice(depth, 0, []);
      }
      let nestedHeader = nestedHeaders[depth];

      let colspan = 0;
      angular.forEach(config, function(conf, key) {
        if (angular.isUndefined(conf.items)) {
          if (maxDepth && depth < maxDepth) {
            let nextDepth = depth + 1;
            if (angular.isUndefined(nestedHeaders[nextDepth])) {
              nestedHeaders.splice(nextDepth, 0, []);
            }
            nestedHeaders[nextDepth].push('');
          }
          nestedHeader.push(key);
          colspan++;
        }
        else {
          let span = parseHeaderConfig(conf.items, nestedHeaders, depth + 1, maxDepth);
          nestedHeader.push({
            label: key,
            colspan: span
          });
          colspan += span;
        }
      });

      return colspan;
    }

    this.parseColumns = function(config) {
      let columns = [];
      createColumns(config, columns);
      return columns;
    }

    function createColumns(config, columns) {
      angular.forEach(config, function(conf, key) {
        if (angular.isDefined(conf.column)) {
          columns.push(conf.column);
        }
        if (angular.isDefined(conf.items)) {
          createColumns(conf.items, columns);
        }
      });
    }

    this.getChangeRows = function(changes, hot) {
      let rows = changes.map(function(change) {
        return change[0];
      });
      let uniqRows = Array.from(new Set(rows));

      return uniqRows.map(function(row) {
        return hot.getSourceDataAtRow(row);
      });
    }

  });
