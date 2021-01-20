(function(){
  'use strict';

  angular
    .module('app')
    .factory('auth', auth);

  auth.$inject = ['$http', '$state', '$q', 'store', 'globalData', 'userData', 'modalUtils', '$ionicLoading', '$timeout', 'config'];

  function auth($http, $state, $q, store, globalData, userData, modalUtils, $ionicLoading, $timeout, config){

    var factory = {
      createUser: createUser,
      createGuest: createGuest,
      login: login,
      logout: logout
    }

    return factory;

    function createUser(user){
      injectUserAppData(user);
      $timeout(function () {
        $ionicLoading.hide();
      }, 3000);
      userData.create('user', user).then(
        function(data){
          check_for_warning_message(data);
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
      injectUserAppData(user);
      user['is_guest'] = true;
      $timeout(function () {
        $ionicLoading.hide();
      }, 3000);
      userData.create('user', user).then(
        function(data){
          check_for_warning_message(data);
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
      injectUserAppData(user);
      $timeout(function () {
        $ionicLoading.hide();
      }, 3000);
      userData.create('auth', user).then(
        function(data){
          check_for_warning_message(data);
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
    
    function check_for_warning_message(data){
      if (data.warning_message){
        modalUtils.launch('warningMessage', data.warning_message);
      }
    }
    
    function injectUserAppData(user){
      user.frontend_app_id =  config.frontendAppID;
      user.frontend_api_version = config.frontendAPIVersion;
      user.frontend_app_version = config.frontendAppVersion;
    }

    function logout(){
      userData.clearData();
      $state.go('login');
    }
  }


})();