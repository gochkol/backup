(function(){
  'use strict';

  angular
    .module('app')
    .factory('auth', auth);

  auth.$inject = ['$http', '$state', '$q', 'store', 'globalData', 'userData', 'modalUtils'];

  function auth($http, $state, $q, store, globalData, userData, modalUtils){

    var factory = {
      createUser: createUser,
      login: login,
      logout: logout
    }

    return factory;

    function createUser(user){
      userData.create('user', user).then(
        function(data){
          userData.setAuthToken(data.auth_token);
          modalUtils.launch('welcomeAfterSignup');
          $state.go('home');
        },
        function(data){
          modalUtils.launch('error', data.errors);
        }
      );
    }

    function login(user){
      userData.create('auth', user).then(
        function(data){
          userData.setAuthToken(data.auth_token);
          $state.go('home');
        },
        function(data){
          modalUtils.launch('error', data.errors);
        }
      );
    }

    function logout(){
      userData.clearData();
      $state.go('login');
    }
  }

})();
