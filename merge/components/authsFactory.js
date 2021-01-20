(function(){
  'use strict';


  angular
    .module('app')
    .factory('auth', auth);

  auth.$inject = ['$http', '$state', '$q', '$ionicLoading', 'store', 'globalData', 'userData', 'modalUtils', 'config', '$rootScope'];

  function auth($http, $state, $q, $ionicLoading, store, globalData, userData, modalUtils, config, $rootScope){
    var facebookResponse = {status: 'unknown', authResponse: {}};
    var dataOAuth = {};
    var factory = {
      createUser: createUser,
      login: login,
      logout: logout,
      setFacebookResponse: setFacebookResponse,
      getFacebookLoginStatus: getFacebookLoginStatus,
      facebookLogin: facebookLogin,
      setOAuthData: setOAuthData,
      getOAuthData: getOAuthData,
      linkFacebookUser: linkFacebookUser
    }

    return factory;

    function createUser(user){
      injectUserAppData(user);
      userData.create('user', user).then(
        function(data){
          check_for_warning_message(data);
          userData.setAuthToken(data.auth_token);
          modalUtils.launch('welcomeAfterSignup');
          $state.go('nav.home').then($ionicLoading.hide());
        },
        function(data){
          modalUtils.launch('error', data.errors);
        }
      );
    }

    function login(user){
      injectUserAppData(user);
      userData.login(user).then(
        function(response){
          var data = response.data;
          check_for_warning_message(data);
          userData.setAuthToken(data.auth_token);
          $state.go('nav.home').then($ionicLoading.hide());
        },
        function(response){
          if (response.status == 499){
            // sign this user up!
            setOAuthData(response.data.oauth_data);
            $state.go('signupFacebook', response.data.oauth_data);
          }
          else{
            modalUtils.launch('error', response.data.errors);
          }
        }
      );
    }

    function facebookLogin(){
      var user = {access_token: facebookResponse.authResponse.accessToken};
      injectUserAppData(user);
      userData.facebookLogin(user).then(
        function(response){
          var data = response.data;
          check_for_warning_message(data);
          userData.setAuthToken(data.auth_token);
          $state.go('nav.home');
        },
        function(response){
          if (response.status == 499){
            // sign this user up!
            setOAuthData(response.data.oauth_data);
            $state.go('signupFacebook', response.data.oauth_data);
          }
          else{
            modalUtils.launch('error', response.data.errors);
          }
        }
      );
    }

    function linkFacebookUser(user){
      user['access_token'] = facebookResponse.authResponse.accessToken;
      injectUserAppData(user);
      userData.facebookLink(user).then(
        function(response){
          var data = response.data;
          userData.setAuthToken(data.auth_token);
          modalUtils.launch('facebookLink');
          $state.go('nav.home');
        },
        function(response){
          modalUtils.launch('error', response.data.errors);
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
      user.ionic_device_token = $rootScope.ionicDeviceToken;
    }

    function logout(){
      userData.clearData();
      $state.go('login');
    }

    function setFacebookResponse(response){
      facebookResponse = response;
    }

    function getFacebookLoginStatus(){
      return (facebookResponse.status == 'connected') ? true : false;
    }

    function getOAuthData(){
      return dataOAuth;
    }

    function setOAuthData(data){
      dataOAuth = data;
    }
 };

})();

