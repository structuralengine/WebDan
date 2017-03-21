// メニューバー関連のスクリプト -------------------------
app.controller('menubarController', menubarController);

function menubarController($scope, $mdDialog) {
    this.menuAction = function (name, ev) {
        $mdDialog.show($mdDialog.alert()
            .title(name)
            .textContent('Start learning "' + name + '!')
            .ok('OK')
            .targetEvent(ev)
        );
    };

}