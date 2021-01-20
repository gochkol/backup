(function () {
  'use strict';

  angular
    .module('app.reset')
    .controller('NewPasswordController', NewPasswordController);

  NewPasswordController.$inject = ['$http', '$location', '$state', 'userData', 'modalUtils'];

  function NewPasswordController($http, $location, $state, userData, modalUtils){
    var vm = this;
    vm.email = "";
    vm.password = "";
    vm.passwordConfirmation = "";
    vm.newPassword = newPassword;

    function newPassword(){
      var params = {
        email: vm.email,
        password: vm.password,
        password_confirmation: vm.passwordConfirmation,
        password_reset_code: $location.search().password_reset_code
      }

      userData.newPassword(params).then(
        function(responseData){
          userData.setAuthToken(responseData.auth_token);
          $state.go('home');
        }
      );
    }
  }

})();
