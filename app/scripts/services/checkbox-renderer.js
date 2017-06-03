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

    this.render = function(instance, td, row, col, prop, value, cellProperties) {
      if (typeof value !== 'boolean') {
        value = !!value;
      }
      let checkboxRenderer = Handsontable.renderers.getRenderer('checkbox');
      checkboxRenderer(instance, td, row, col, prop, value, cellProperties);
      return td;
    }
  });
