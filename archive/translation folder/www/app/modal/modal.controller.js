(function () {
  'use strict';

  angular
    .module('app.modal')
    .controller('ModalController', ModalController);

  ModalController.$inject = ['$scope', '$modalInstance', 'modalData'];

  function ModalController($scope, $modalInstance, modalData) {
    var vm = $scope;
    vm.data = modalData;
    vm.ok = ok;
    vm.cancel = cancel;

    function ok(){
      $modalInstance.close('this is data');
    }

    function cancel(){
      $modalInstance.dismiss('cancel');
    }
  }
})();


