(function () {
  'use strict';

  angular
    .module('app.modal')
    .controller('ModalController', ModalController);

  ModalController.$inject = ['$scope', '$state', '$modalInstance', 'modalData'];

  function ModalController($scope, $state, $modalInstance, modalData) {
    var vm = $scope;
    vm.data = modalData;
    vm.ok = ok;
	vm.returnHome = returnHome;
    vm.cancel = cancel;
    vm.isReadonlytwo = false;

    function ok(){
      $modalInstance.close();
    }
	
	function returnHome() {
	  $modalInstance.close();
	  $state.go('nav.home');
	}

    function cancel(){
      $modalInstance.dismiss();
    }
  }
})();


