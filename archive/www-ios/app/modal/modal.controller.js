(function () {
  'use strict';

  angular
    .module('app.modal')
    .controller('ModalController', ModalController);

  ModalController.$inject = ['$scope', '$state', '$modalInstance', 'modalData', '$ionicLoading', '$timeout'];

  function ModalController($scope, $state, $modalInstance, modalData, $ionicLoading, $timeout) {
    var vm = $scope;
    vm.data = modalData;
    vm.ok = ok;
    vm.returnHome = returnHome;
    vm.cancel = cancel;
    vm.isReadonlytwo = false;
    if(vm.data.goal){
      vm.data.bonus = Math.round(vm.data.goal*0.25);
    }

    function ok(){
      $modalInstance.close();
    }

    function returnHome() {
      $ionicLoading.show({
        template: 'Leaving...'
      });
	    $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $modalInstance.close();
      $state.go('nav.home');
    }

    function cancel(){
      $modalInstance.dismiss();
    }
  }
})();


