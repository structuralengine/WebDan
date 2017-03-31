
// コンテンツ関連のスクリプト -------------------------
app.controller('Page2Controller', ['$scope', function ($scope) {

    var ctrl = this;

     ctrl.data = [
        {
            'name': 'Bob',
            'email': 'bob@sample.com'
        },
        {
            'name': 'John',
            'email': 'john@sample.com'
        }
     ];
}]);
