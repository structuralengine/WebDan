// ナビゲーションバー関連のスクリプト -------------------------
app.controller('navibarController', navibarController);

function navibarController($scope) {
    $scope.data = {
        selectedIndex: 0,

        tab1Locked: false,
        tab2Locked: false,
        tab3Locked: true,
        tab4Locked: false,
        tab5Locked: false,
        tab7Locked: false,
        tab8Locked: false,

    };
    $scope.next = function () {
        $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 7);
    };
    $scope.previous = function () {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
}