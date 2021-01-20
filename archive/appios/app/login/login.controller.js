(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$state', 'globalData', 'auth'];

  function LoginController($scope, $state, globalData, auth) {
    var vm = this;
    vm.isReadOnly = false;
    vm.user = {'email': '', 'password': ''};
    vm.login = login;

    function login() {
      vm.isReadOnly = true;
      auth.login(vm.user);
    }
  }

})();

