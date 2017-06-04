'use strict';

/**
 * @ngdoc service
 * @name webdan.Bar
 * @description
 * # Bar
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Bar', ['$lowArray', '$injector', 'barsConfig', 'HtHelper', 'appConfig',
    function ($lowArray, $injector, barsConfig, HtHelper, appConfig) {

      let Bar = $lowArray({
        store: 'bars',
        foreignKeys: {
          parent: {
            DesignPoint: 'designPoint_id',
          },
        },
      });

      let parseColumns = Bar.parseColumns;
      Bar.parseColumns = function(columns) {
        parseColumns(columns);

        columns.forEach(function(column) {
          switch (column.path) {
            case 'section':
              column.renderer = renderSection;
              break;
            default:
              break;
          }
          switch (column.data) {
            case 'haunch_height':
              column.renderer = renderHaunchHeight;
              break;
            case 'rebar_side':
              column.renderer = renderRebarSide;
              break;
            default:
              break;
          }
        });
      }

      let DesignPoint = $injector.get('DesignPoint');
      let MemberSection = $injector.get('MemberSection');
      function renderSection(hot, td, row, col, prop, designPoint_id, cellProperties) {
        let content = '';
        let key = (row % 2 == 0)? 'B': 'H';
        let $td = angular.element(td).addClass(key);
        if (designPoint_id) {
          let designPoint = DesignPoint.get(designPoint_id);
          let memberSection = MemberSection.getBy('m_no', designPoint.m_no);
          content = memberSection.section[key] || '';
        }
        $td.html(content);
        return td;
      }

      function renderHaunchHeight(hot, td, row, col, prop, value, cellProperties) {
        if (value) {
          let bar = hot.getSourceDataAtRow(row);
          bar[key] = value;
        }
        let key = (row % 2 == 0)? 'dH_m': 'dH_s';
        angular.element(td).html(value).addClass(key);
        return td;
      }

      let positions = appConfig.defaults.bars.positions;
      function renderRebarSide(hot, td, row, col, prop, value, cellProperties) {
        let position = positions[value] || '';
        angular.element(td).html(position);
        return td;
      }

      function init() {
        Bar.nestedHeaders = HtHelper.parseNestedHeaders(barsConfig, 2);
        Bar.columns = HtHelper.parseColumns(barsConfig);
        Bar.parseColumns(Bar.columns);
        return Bar;
      }

      return init();
    }
  ]);
