angular.module('webdan')//, ['ui.bootstrap'])
    .factory('CalcService', ['$http', '$uibModal', function ($http, $uibModal) {

    // サービスの中身はコントローラーの内容やhtmlに直接依存させない
    // 値の受け渡しの処理などはコントローラ内に書く
    // （そういった意味では、app.jsに全部のコントローラーを書くと長くなるためファイル分割した方が望ましい）
    calcStart = function () {

        //データ集計

        //集計したデータを元に 決定した 計算数
        for (i = 0; i < 1; i++) {

            //サーバーに POST すべきデータを用意する
            var data = getTestData();


            // 非同期通信を開始
            // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
            $http({
                method: 'POST',
                url: './api/values', //url: 'http://www.structuralengine.com/RCNonlinear/api/values',
                headers: { 'Content-Type': 'application/json' },

                // とりあえずJSONを文字列化して送る。文字列化せずに、受け側でdictionaryやオブジェクトとして受けることが可能なのかどうかは不明。
                // VB側でJSONにあわせてクラス定義すれば可能っぽいが、一々面倒くさそう。
                data: "'" + JSON.stringify(data) + "'"
            })
            .then(function (result) {
                // 通信成功時の処理
                alert(JSON.stringify(result));

                // 戻り値の加工とか

                // 返却値の確定
                //deferred.resolve(result); // 引数により実質的な戻り値の受け渡しを行う。引数は複数渡してもよい。呼び出し元を受け取る数に合わせる
            }
            , function (result) {
                // 通信失敗時の処理

                // 返却値の確定
                alert('!!通信に失敗しました!!');
            });
        }


        //入力データ および 計算結果 データを 帳票に入力
        $location.path('/path');

        /*帳票をモードレスウィンドウで表示
        $uibModal.open({
            template: '<div class="md">{{message}}</div>',
            controller: 'DialogController',
            backdrop: true
        })
        */
    };

    // 外部から呼び出せるファンクション
    // return { 
    //      外から見た関数名 : 内部の関数名
    //      ,外から見た関数名 : 内部の関数名
    // }
    return {
        calcStart: calcStart
        //        , function2: function2
        //        , function3: function3Alias
    };




    //テストデータ json
    function getTestData() {

        var data = {
            "La": 0.1,
            "Md": 540,
            "Nd": 0,
            "SectionElastic": [
                {
                    "Ec": 25,
                    "ElasticID": "A",
                    "dmax": 20,
                    "fck": 24,
                    "rc": 1,
                    "rm": 1,
                    "σcMode": 1
                }
            ],
            "Sections": [
                {
                    "ElasticID": "A",
                    "Height": 1300,
                    "WBottom": 800,
                    "WTop": 800
                }
            ],
            "SteelElastic": [
                {
                    "ElasticID": "SD345",
                    "Es": 200,
                    "c": 660,
                    "fsk": 345,
                    "kw": 1,
                    "pw": 0.15,
                    "rm": 1,
                    "rs": 1
                },
                {
                    "ElasticID": "SD295",
                    "Es": 200,
                    "c": 660,
                    "fsk": 295,
                    "kw": 1,
                    "pw": 0.15,
                    "rm": 1,
                    "rs": 1
                },
                {
                    "ElasticID": "SS400",
                    "Es": 200,
                    "c": 660,
                    "fsk": 235,
                    "kw": 1,
                    "pw": 0.15,
                    "rm": 1,
                    "rs": 1
                }
            ],
            "Steels": [
                {
                    "Depth": 105,
                    "ElasticID": "SD345",
                    "IsTensionBar": false,
                    "i": "D29",
                    "n": 2
                },
                {
                    "Depth": 1201,
                    "ElasticID": "SD345",
                    "IsTensionBar": true,
                    "i": "D29",
                    "n": 2
                },
                {
                    "Depth": 433.33,
                    "ElasticID": "SD295",
                    "IsTensionBar": false,
                    "i": "D10",
                    "n": 2
                },
                {
                    "Depth": 866.67,
                    "ElasticID": "SD295",
                    "IsTensionBar": false,
                    "i": "D10",
                    "n": 2
                },
                {
                    "Depth": 150,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "22",
                    "n": 400
                },
                {
                    "Depth": 1150,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "22",
                    "n": 400
                },
                {
                    "Depth": 208.8,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "12",
                    "n": 95.6
                },
                {
                    "Depth": 304.4,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "12",
                    "n": 95.6
                },
                {
                    "Depth": 400,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "12",
                    "n": 95.6
                },
                {
                    "Depth": 495.6,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "12",
                    "n": 95.6
                },
                {
                    "Depth": 591.2,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "12",
                    "n": 95.6
                },
                {
                    "Depth": 686.8,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "12",
                    "n": 95.6
                },
                {
                    "Depth": 782.4,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "12",
                    "n": 95.6
                },
                {
                    "Depth": 878,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "12",
                    "n": 95.6
                },
                {
                    "Depth": 973.6,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "12",
                    "n": 95.6
                },
                {
                    "Depth": 1069.2,
                    "ElasticID": "SS400",
                    "IsTensionBar": false,
                    "i": "12",
                    "n": 95.6
                }
            ]
        };

        return data;
    }


}]);
