/*
 * =====================================================================================
 *
 *	serviceクラスを足した場合、ここに追加する
 *
 * =====================================================================================
 */
// 共通デバッグフラグ
// 各コントローラーではconfig.debugを参照
var _global_debugmode_ = true;

var app = angular.module('webDan', ['ui.router'
                                  , 'ngAnimate'
                                  , 'ngMaterial'
                                  , 'ngHandsontable'
                                  , 'restangular'

                                  , 'RestService'
                                  ]);

/*
 * =====================================================================================
 *
 *	設定値
 *
 * =====================================================================================
 */
app.constant('config', {
    'apiRootUrl': 'http://www.structuralengine.com/RCNonlinear/api/'
	,'timeout'		: 5000
	,'debug'		: true
})

/*
 * =====================================================================================
 *
 *	ユーティリティ関数
 *
 * =====================================================================================
 */
.constant('utils', {

	'dump': function (json) {
		if (_global_debugmode_) {	// ここでconfigの値を見たいがそれは無理？
			alert(JSON.stringify(json));
		}
	}

    /*
	,'parseApiResponse': function (res) {
		try {
			return JSON.parse(res.responseText);
		} catch(e) {
			return {
				"statusCode" : 0
				,"status" : 9999
				,"message" : "レスポンスの解析に失敗しました"
				,"_httpStatusCode" : 0
			};
		}
	}
    */
})

/*
.filter('leftpad', function () {
	return function (input, length) {
		return ('00000000000000000000' + String(input)).slice(-length);
	};
})
*/

// configにサービス等をDIしようとしてもエラーになる
// http://qiita.com/akkun_choi/items/618d2d9107029ab0422e#config-run
/*
.config(['$stateProvider', '$urlRouterProvider', '$stickyStateProvider', '$ionicConfigProvider',
function ($stateProvider, $urlRouterProvider, $stickyStateProvider, $ionicConfigProvider) {
*/

/*
 * =====================================================================================
 *
 *	ステート設定
 *
 * =====================================================================================
.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', 'config', 
function ($stateProvider, $urlRouterProvider, RestangularProvider, config) {
 */
.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', 'config',
function ($stateProvider, $urlRouterProvider, RestangularProvider, config) {

    /*
        Restangula
        RESTアクセス用モジュール共通設定
        https://github.com/mgonto/restangular
        http://tech.quartetcom.co.jp/2015/07/22/angularjs-restangular/
        http://qiita.com/taizawa/items/3aaf19c15afc591c1d12
    */
    RestangularProvider.setBaseUrl(config.apiRootUrl);


    /*
        ui-router
        画面遷移を管理しやすくするモジュール
        http://qiita.com/nogson/items/63d8f007fe987e2dfe9e
    */

	//-----------------------------------------------------------
	// ルーティング設定
	//-----------------------------------------------------------
	$stateProvider

    .state('main', {
        url: '/main'
        ,views: {
            'viewApp': {
                templateUrl : 'js/controllers/navi.html'
            }
        }
//		sticky: true
		, abstract: true
//        , onEnter: function () { console.log("enter tabs.html"); }
	})

	.state('main.page1', {
        url: '/page1'
        , views: {
		    'viewMain': {
		        templateUrl: 'js/controllers/page1/page1.html'
				, controller: 'Page1Controller as page1Ctrl'
		    }
		}
//        , onEnter: function () { console.log("enter page1.html"); }
	})

	.state('main.page2', {
	    url: '/page2'
		, views: {
		    'viewMain': {
		        templateUrl: 'js/controllers/page2/page2.html'
				, controller: 'Page2Controller as page2Ctrl'
		    }
		}
	    //        , onEnter: function () { console.log("enter page2.html"); }
	})

	.state('main.page3', {
	    url: '/page3'
		, views: {
		    'viewMain': {
		        templateUrl: 'js/controllers/page3/page3.html'
				, controller: 'Page3Controller as page3Ctrl'
		    }
		}
	})

	.state('main.page4', {
	    url: '/page4'
		, views: {
		    'viewMain': {
		        templateUrl: 'js/controllers/page4/page4.html'
				, controller: 'Page4Controller as page4Ctrl'
		    }
		}
	})

	.state('main.page5', {
	    url: '/page5'
		, views: {
		    'viewMain': {
		        templateUrl: 'js/controllers/page5/page5.html'
				, controller: 'Page5Controller as page5Ctrl'
		    }
		}
	})

	.state('main.page6', {
	    url: '/page6'
		, views: {
		    'viewMain': {
		        templateUrl: 'js/controllers/page6/page6.html'
				, controller: 'Page6Controller as page6Ctrl'
		    }
		}
	})

	.state('main.page7', {
	    url: '/page7'
		, views: {
		    'viewMain': {
		        templateUrl: 'js/controllers/page7/page7.html'
				, controller: 'Page7Controller as page7Ctrl'
		    }
		}
	})

	.state('main.page8', {
	    url: '/page8'
		, views: {
		    'viewMain': {
		        templateUrl: 'js/controllers/page8/page8.html'
				, controller: 'Page8Controller as page8Ctrl'
		    }
		}
	})

	//-----------------------------------------------------------
	// 共通モーダル
	//-----------------------------------------------------------
/*
	.state('modal', {
		url: '/modal'
		,abstract : true
	})

	.state('modal.item-detail', {
		url: '/item-detail',
		views: {
			'viewModal': {		// 描画先のビュー名
				templateUrl: 'app/modal/item-detail/itemDetailMain.html'
//				,controller : 'MItemDetailMainCtrl'
			}
		}
	})
*/
	;

	// 状態遷移デバッグ用
	//$stickyStateProvider.enableDebug(true);

	// 初期画面
	$urlRouterProvider.otherwise('/main/page1');
}])

/*
 * =====================================================================================
 *
 *	初期実行部
 *
 * =====================================================================================
 */
.run(['$window', '$state', '$rootScope', '$timeout', 'config', 'utils', 'sharedObj',
function ($window, $state, $rootScope, $timeout, config, utils, sharedObj)
{
	// グローバルに参照する定数をビュー内でも使用可能にする
	// http://flabo.io/code/20140926/01-angularjs-application-7-tips/
	$rootScope.config = config;
	$rootScope.utils = utils;
	$rootScope.sharedObj = sharedObj;

	// アラート表示
	sharedObj.showAlert = function (title, message, callback) {

		if ('function' !== typeof callback) callback = function (){};

		// objectの場合JSON化する
		if ('object' === typeof message) message = JSON.stringify(message);

		var alertPopup = $ionicPopup.alert({
			title: title,
			template: message,
			buttons: [{ text: '閉じる', type: 'button-outline button-dark'}]
		}).then(callback);
	};

	// 接続障害表示用
	sharedObj.alertNetworkError = function (response){
		// 接続失敗
		sharedObj.showAlert('接続できません', '通信状況をご確認ください。');
	}
}])

//-----------------------------------------------------------
// コントローラ間での共通記憶領域
//-----------------------------------------------------------
.factory('sharedObj', function () {

	// 全ステートで共通のインスタンス
	return {
		// ステートを跨いでモーダル表示を残す場合に使用する（ローディング中の表示など）
		modalWindow : {
			 modal : null
			,state : 0				// ローディング判定などに使用する
		}
	};
});
