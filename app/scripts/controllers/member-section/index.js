'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:MemberSectionIndexCtrl
 * @description
 * # MemberSectionIndexCtrl
 * Controller of the webdan
 */
angular.module('webdan')
  .controller('MemberSectionIndexCtrl', ['$scope',
    function($scope) {
      var ctrl = this;

      ctrl.memberSections = [
        {
          no: 1,
          length: 0.000,
          groupNo: 1.0,
          name: '上層梁',
          shape: 'T 形',
          section: {
            width: 750,
            height: 1200,
            flangeWidth: 2480,
            flangeThickness: 250,
          },
          conditions: {
            upperSide: 1,
            lowerSide: 1,
            shear: null,
          },
          exterior: {
            upperSide: false,
            lowerSide: false,
          },
          crack: {
            ecsd: 202,
          },
          shear: {
            kr: 202.3,
          },
          r1: {
           longitudinalRebar: 2.30,
           hoopTie: null,
           bentUpBar: null,
          },
          count: null,
          forFatigue: false,
        }
      ];

      ctrl.members = [
        {groupNo: '1.0', name: '中層梁柱前面'},
        {groupNo: '1.1', name: '中層ハンチ端'},
        {groupNo: '1.2', name: '中層梁径間部'},
        {groupNo: '1.3', name: '片持梁'},
        {groupNo: '1.4', name: '頂版'},
        {groupNo: '1.7', name: 'フーチング'},
        {groupNo: '1.9', name: '側壁'},
        {groupNo: '2.0', name: 'A1 橋台'},
        {groupNo: '2.1', name: 'A2 橋台'},
        {groupNo: '2.2', name: 'フーチング直角 &rho;<sub>m</sub> 1.0'},
        {groupNo: '2.3', name: 'フーチング直角上側'},
        {groupNo: '3.0', name: '杭'},
      ];

      ctrl.sectionShapes = [
        {name: '矩形', en: 'rectangle'},
        {name: 'T 形', en: 't shaped'},
        {name: '円形', en: 'section Radius'},
        {name: '台形', en: 'trapezoid'},
        {name: '小判', en: 'oval shape'},
      ];

      ctrl.conditions = [
        {name: '一般', en: 'normal enviro'},
        {name: '腐食性', en: 'corrosive'},
        {name: 'とくに厳しい腐食性', en: 'seve.corrosive'},
      ];

      ctrl.addRow = function() {
        ctrl.memberSections.push({});
      }
    }
  ]);
