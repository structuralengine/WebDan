'use strict';

/**
 * @ngdoc service
 * @name webdan.checkboxRenderer
 * @description
 * # checkboxRenderer
 * Service in the webdan.
 */
angular.module('webdan')
  .service('checkboxRenderer', function () {

    let numRegex = /\d+/;

    this.render = function(instance, td, row, col, prop, value, cellProperties) {
      switch (typeof value) {
        case 'boolean':
          break;
        case 'string':
          value = value.trim().toLowerCase();
          if (value == 'true') {
            value = true;
          }
          else {
            value = false;
          }
          break;
        default:
          value = false;
          break;
      }
      let checkboxRenderer = Handsontable.renderers.getRenderer('checkbox');
      checkboxRenderer(instance, td, row, col, prop, value, cellProperties);
      return td;
    }
  });
