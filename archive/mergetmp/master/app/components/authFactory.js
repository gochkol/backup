(function(){
  'use strict';

  angular
    .module('app')
    .factory('auth', auth);

  auth.$inject = ['$http', '$state', '$q', 'store', 'globalData', 'userData', 'modalUtils', '$ionicLoading', '$timeout'];

  function auth($http, $state, $q, store, globalData, userData, modalUtils, $ionicLoading, $timeout){

    var factory = {
      createUser: createUser,
      createGuest: createGuest,
      login: login,
      logout: logout
    }

    return factory;

    function createUser(user){
	  $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      userData.create('user', user).then(
        function(data){
          userData.setAuthToken(data.auth_token);
          userData.setGuestStatus(false);
          modalUtils.launch('welcomeAfterSignup');
          $state.go('nav.home').then(function(){$ionicLoading.hide()});
        },
        function(data){
          modalUtils.launch('error', data.errors);
		  $ionicLoading.hide();
        }
      );
    }

    function createGuest(user){
      user['is_guest'] = true;
	  $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      userData.create('user', user).then(
        function(data){
          userData.setAuthToken(data.auth_token);
          userData.setGuestStatus(true);
          modalUtils.launch('welcomeGuest');
          $state.go('guestNav.quickWorkout').then(function(){$ionicLoading.hide()});
        },
        function(data){
          modalUtils.launch('error', data.errors);
		  $ionicLoading.hide();
        }
      );
    }

    function login(user){
	  $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      userData.create('auth', user).then(
        function(data){
          userData.setAuthToken(data.auth_token);
          userData.setGuestStatus(false);
          $state.go('nav.home').then(function(){$ionicLoading.hide()});
        },
        function(data){
          modalUtils.launch('error', data.errors);
		  $ionicLoading.hide();
        }
      );
    }

    function logout(){
      userData.clearData();
      $state.go('login');
    }
  }


})();