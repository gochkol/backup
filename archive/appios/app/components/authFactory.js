(function(){
  'use strict';

  angular
    .module('app')
    .factory('auth', auth);

  auth.$inject = ['$http', '$state', '$q', 'store', 'globalData', 'userData', 'modalUtils'];

  function auth($http, $state, $q, store, globalData, userData, modalUtils){

    var factory = {
      createUser: createUser,
      createGuest: createGuest,
      login: login,
      logout: logout
    }

    return factory;

    function createUser(user){
      userData.create('user', user).then(
        function(data){
          userData.setAuthToken(data.auth_token);
          userData.setGuestStatus(false);
          modalUtils.launch('welcomeAfterSignup');
          $state.go('nav.home');
        },
        function(data){
          modalUtils.launch('error', data.errors);
        }
      );
    }

    function createGuest(user){
      user['is_guest'] = true;
      userData.create('user', user).then(
        function(data){
          userData.setAuthToken(data.auth_token);
          userData.setGuestStatus(true);
          modalUtils.launch('welcomeGuest');
          $state.go('guestNav.quickWorkout');
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
          userData.setGuestStatus(false);
          $state.go('nav.home');
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