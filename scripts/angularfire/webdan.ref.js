'use strict';

angular.module('webdan')
  .factory('webdanRef', ['Ref',
    function (Ref) {
      return Ref.child('webdan');
    }
  ]);
