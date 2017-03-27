// メニューバー関連のスクリプト -------------------------
app.controller('MenuController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
    var ctrl = this;

    ctrl.menuAction = function (name, ev) {
        $mdDialog.show($mdDialog.alert()
            .title(name)
            .textContent('Start learning "' + name + '!')
            .ok('OK')
            .targetEvent(ev)
        );
    };
}]);
