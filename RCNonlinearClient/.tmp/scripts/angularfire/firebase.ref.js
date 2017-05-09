'use strict';

angular.module('firebase.ref', ['firebase']).factory('Ref', ['$window', function ($window) {
  'use strict';

  return new $window.firebase.database().ref();
}]);
//# sourceMappingURL=firebase.ref.js.map
