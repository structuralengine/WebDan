'use strict';

/**
 * @ngdoc service
 * @name webdan.Fatigue
 * @description
 * # Fatigue
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Fatigue', ['$lowArray', '$injector', 'fatiguesConfig', 'appConfig', 'HtHelper',
    function ($lowArray, $injector, fatiguesConfig, appConfig, HtHelper) {

      let Fatigue = $lowArray({
        store: 'fatigues',
        foreignKeys: {
          parent: {
            DesignPoint: 'designPoint_id'
          },
        },
      });

      let parseColumns = Fatigue.parseColumns;
      Fatigue.parseColumns = function(columns) {
        parseColumns(columns);

        columns.forEach(function(column) {
          if (column.path == 'section') {
            column.renderer = renderSection;
          }
          else if (column.data == 'rebar_side') {
            column.renderer = renderRebarSide;
          }
        })
      }

      let DesignPoint = $injector.get('DesignPoint');
      let MemberSection = $injector.get('MemberSection');
      function renderSection(hot, td, row, col, prop, designPoint_id, cellProperties) {
        let content = '';
        if (designPoint_id && row % 3 == 0) {
          let designPoint = DesignPoint.get(designPoint_id);
          let memberSection = MemberSection.getBy('m_no', designPoint.m_no);
          let B = memberSection.section.B || '';
          let H = memberSection.section.H || '';
          content = ''+
            '<div class="B">'+ B +'</div>'+
            '<div class="H">'+ H +'</div>';
        }
        angular.element(td).html(content).addClass('numeric');
        return td;
      }

      let positions = appConfig.defaults.fatigues.positions;
      function renderRebarSide(hot, td, row, col, prop, value, cellProperties) {
        let position = positions[value] || '';
        angular.element(td).html(position);
        return td;
      }

      function init() {
        Fatigue.nestedHeaders = HtHelper.parseNestedHeaders(fatiguesConfig, 2);
        Fatigue.columns = HtHelper.parseColumns(fatiguesConfig);
        Fatigue.parseColumns(Fatigue.columns);
        return Fatigue;
      }

      return init();
    }
  ]);
