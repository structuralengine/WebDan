'use strict';

/**
 * @ngdoc function
 * @name webdan.controller:BasicInformationIndexCtrl
 * @description
 * # BasicInformationIndexCtrl
 * Controller of the webdan
 */

angular.module('webdan').controller('BasicInformationIndexCtrl', ['$scope', function ($scope) {
        var ctrl = this;

        ctrl.table = {};
        ctrl.table.a = [{ 'stress': '耐久性 縁引張応力度検討用', 'pickupno': null }, { 'stress': '耐久性 鉄筋応力度検討用', 'pickupno': null }, { 'stress': '耐久性 (永久荷重)', 'pickupno': null }, { 'stress': '耐久性 (変動荷重)', 'pickupno': null }, { 'stress': '使用性 (外観ひび割れ)', 'pickupno': null }, { 'stress': '安全性 (疲労破壊) 最小応力', 'pickupno': null }, { 'stress': '安全性 (疲労破壊) 最大応力', 'pickupno': null }, { 'stress': '安全性 (破壊)', 'pickupno': null }, { 'stress': '復旧性 (損傷 地震時以外)', 'pickupno': null }, { 'stress': '復旧性 (損傷 地震時)', 'pickupno': null }];
        ctrl.table.b = [{ 'stress': '耐久性 せん断ひび割れ検討判定用', 'pickupno': null }, { 'stress': '耐久性 (永久荷重)', 'pickupno': null }, { 'stress': '耐久性 (変動荷重)', 'pickupno': null }, { 'stress': '安全性 (疲労破壊) 最小応力', 'pickupno': null }, { 'stress': '安全性 (疲労破壊) 最大応力', 'pickupno': null }, { 'stress': '安全性 (破壊)', 'pickupno': null }, { 'stress': '復旧性 (損傷 地震時以外)', 'pickupno': null }, { 'stress': '復旧性 (損傷 地震時)', 'pickupno': null }];
}]);
//# sourceMappingURL=index.js.map
