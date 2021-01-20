(function () {
  'use strict';

  angular
    .module('app.reset')
    .controller('ResetController', ResetController);

  ResetController.$inject = ['$http', 'userData'];

  function ResetController($http, userData){
    var vm = this;
    vm.email = "";
    vm.emailSent = false;
    vm.reset = reset;

    function reset(){
      vm.emailSent = true;
      userData.resetPassword(vm.email);
    }
  }

})();
