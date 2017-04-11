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
        {name: '矩形'},
        {name: 'T 形'},
        {name: '円形'},
        {name: '台形'},
        {name: '小判'},
      ];

      ctrl.conditions = [
        {name: '一般'},
        {name: '腐食性'},
        {name: 'とくに厳しい腐食性'},
      ];
    }
  ]);
