(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$state', '$modalInstance', 'globalData', 'auth',  '$http'];

  function LoginController($scope, $state, $modalInstance, globalData, auth, $http) {
    var vm = $scope;
    vm.cancel = cancel;
	  vm.user = {'email': '', 'password': ''};
    vm.login = login;
    vm.ok = ok;
	  vm.forgotPW = forgotPW;
	  vm.signup = signup;
    vm.facebookLogin = facebookLogin;
    vm.facebookShowButton = false;
    vm.facebookLoggedIn = false;
    vm.facebook



    function login() {
	    $modalInstance.close();
      //auth.login(vm.user);
      auth.partnerLogin(vm.user);
    }

    function ok(){
      $modalInstance.close();
    }

    function facebookLogin(){
      var status = auth.getFacebookLoginStatus();

      FB.getLoginStatus(function(response){}, {scope: 'public_profile, email'});

      if (status){
        auth.facebookLogin();
      }
      else
      {
        FB.login(
          function(response){
            auth.setFacebookResponse(response);
            if (response.status == 'connected'){
              auth.facebookLogin();
            }
          },
          {scope: 'public_profile, email'}
        );
      }
	    $modalInstance.close();
    }

    function forgotPW() {
	    $modalInstance.close();
	    $state.go('resetPassword');
	  }

    function signup() {
	    $modalInstance.close();
	    $state.go('signup');
	  }
    function cancel(){
      $modalInstance.close();
    }
  }
})();


