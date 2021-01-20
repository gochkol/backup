(function () {
  'use strict';

  angular
    .module('app.reset')
    .controller('ResetController', ResetController);

  ResetController.$inject = ['$http', 'userData', 'helpers'];

  function ResetController($http, userData, helpers){
    var vm = this;
    vm.helpers = helpers;
    vm.blur = helpers.blur;
    vm.email = "";
    vm.emailSent = false;
    vm.reset = reset;

    function reset(){
      vm.emailSent = true;
      userData.resetPassword(vm.email);
      cordova.plugins.Keyboard.close();
    }
  }

})();
