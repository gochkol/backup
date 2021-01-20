(function () {
  'use strict';

  angular
    .module('app.account')
    .controller('AccountController', AccountController);

  AccountController.$inject = ['$state', 'globalData', 'globalDataSet', 'userData', 'userDataSet', 'constants', 'config', 'infoFactory', 'modalUtils'];

  function AccountController($state, globalData, globalDataSet, userData, userDataSet, constants, config, infoFactory, modalUtils) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.cancelSubscription = cancelSubscription; 
    vm.submit = submit;
    vm.constants = constants();
    vm.showCancel = false;
    vm.showUpgrade = false;
    vm.showEditBasic = false;
    vm.showBillEdit = false;
    vm.showPW = false;
    vm.unlinkFacebook = unlinkFacebook;

    function submitPaymentInfoToBackend(obj){
      var params = {nonce: obj, billing_plan_id: vm.billingPlanID};
      userData.submitPaymentInfoToBackend(vm, params, finishPayment);
    }

    function updatePaymentInfo(obj){
      var params = {nonce: obj};
      userData.updatePaymentInfo(vm, params, finishPayment);
    }

    function cancelSubscription(){
      userData.cancelSubscription(vm, {}, cancelled);
    }

    function cancelled(){
      modalUtils.launch('greatJob', 'Your subscription has been cancelled');
      $state.go('home');
    }

    function finishPayment(){
      modalUtils.launch('greatJob', 'You have paid');
      $state.go('home');
    }
    
    function unlinkFacebook(){
      if (vm.user.facebook_email != ''){
        vm.user.facebook_email = '';
        userData.updateUser(vm);
        modalUtils.launch('facebookUnlink');
      }
    }
	
    function submit(){
      userData.updateUser(vm);
    }

  }

})();

