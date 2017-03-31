// 共通処理が多いので、RestangularをControllerで直接操作しないで、serviceでラップする
// 全て1ファイルに入れるよりも、機能別に分けるべき？
angular.module('RestService', ['restangular'])

.factory('ValuesSvc', ['Restangular', function (Restangular) {

    // allとserviceどう違うのか？
    //    return Restangular.all('values');  // http://{apiroot}/comments/
    return Restangular.service('values');  // http://{apiroot}/comments/
}])

.factory('CalcSvc', ['Restangular', function (Restangular) {

    return Restangular.service('calc');   // http://{apiroot}/calc/
}]);

/*
// 複数設定可能
.factory('IssueSvc', function (Restangular) {
    // api毎に異なる設定も可能
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('/api/v2');
    }).all('issues');
});
*/
