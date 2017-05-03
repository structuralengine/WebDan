'use strict';

angular.module('webdan')
  .factory('CalcService', ['webdanRef', '$uibModal', 
    function (webdanRef, $uibModal) {

      let ref = webdanRef.child('CalcService');
      let calcService = $firebaseArray(ref);
      
      calcService.calcStart = function () {
        try {
          $uibModal.open({
            template: '<div class="md">モーダルだよ</div>'
          });
        }
        catch (e) {
          alert(e);
        }
      }
    }
  ]);