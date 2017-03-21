
// コンテンツ関連のスクリプト -------------------------
app.controller('page8Controller',['$scope','$http', function ($scope, $http) {
    // [送信] ボタンで 非同期通信を開始
    $scope.onclick = function () {
        $http({
            method: 'GET',
            url: './api/values/5',
            params: { name: $scope.name }
        })
        // 通信成功時の処理
        .success(function (data, status, headers, config) {
            $scope.result = data;
        })
        // 通信失敗時の処理
        .error(function (data, status, headers, config) {
            $scope.result = '!!通信に失敗しました!!';
        });
    };
}]);



