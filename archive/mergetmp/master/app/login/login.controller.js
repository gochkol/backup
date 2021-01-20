(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$state', 'globalData', 'auth', '$ionicHistory', '$ionicLoading', 'helpers'];

  function LoginController($scope, $state, globalData, auth, $ionicHistory, $ionicLoading, helpers) {
    var vm = this;
    vm.user = {'email': '', 'password': ''};
    vm.login = login;
    vm.blur = helpers.blur;

    function login() {
	  $ionicLoading.show({
      template: 'Logging in...'
      });
	  $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      auth.login(vm.user);
    }
	
	$scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
    });
  }

})();

