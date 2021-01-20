(function(){
  'use strict';


  angular
    .module('app')
    .provider('auth', authProvider);

  authProvider.$inject = [];

  function authProvider(){
    var dataStore = null;
    var provider = {
      getAuthToken: getAuthToken,
      $get: auth
    }

    return provider;

    function getAuthToken(){
      return dataStore.get('authToken');
    }

    auth.$inject = ['$http', '$state', '$q', 'store', 'globalData', 'userData', 'partnerData', 'modalUtils', 'config', 'jwtHelper'];

    function auth($http, $state, $q, store, globalData, userData, partnerData, modalUtils, config, jwtHelper){
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
        linkFacebookUser: linkFacebookUser,
        partnerLogin: partnerLogin,
        getAuthToken: getAuthToken,
        isLoggedIn: isLoggedIn,
        isPartner: isPartner,
        setAuthToken: setAuthToken,
        clearData: clearData
      }

      dataStore = store.getNamespacedStore(config.options.authStoreName);

      return factory;

      function clearData(){
        dataStore.set('authToken', undefined);
      }

     function setAuthToken(authToken){
        dataStore.set('authToken', authToken);
      }

      function isLoggedIn(){
        var token = getAuthToken();
         if (!token || jwtHelper.isTokenExpired(token)){
           return false;
         }
         else{
           return true;
         }
      }

      function isPartner(){
        var token = getAuthToken();
        if (!token){
          return false;
        }
        var info = jwtHelper.decodeToken(token);
        if (info['partner_user_id']){
          return true;
        }
        else{
          return false;
        }
      }

      function createUser(user){
        injectUserAppData(user);
        userData.create('user', user).then(
          function(data){
            check_for_warning_message(data);
            setAuthToken(data.auth_token);
            modalUtils.launch('welcomeAfterSignup');
            $state.go('home');
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
            setAuthToken(data.auth_token);
            $state.go('home');
          },
          function(response){
            modalUtils.launch('error', response.data.errors);
          }
        );
      }

      function partnerLogin(partnerUser){
        injectUserAppData(partnerUser);
        partnerData.partnerLogin(partnerUser).then(
          function(response){
            var data = response.data;
            setAuthToken(data.auth_token);
            $state.go('partner');
          },
          function(response){
            modalUtils.launch('error', response.data.errors);
          }
        );
      }



      function facebookLogin(){
        var user = {access_token: facebookResponse.authResponse.accessToken}
        injectUserAppData(user);
        userData.facebookLogin(user).then(
          function(response){
            var data = response.data;
            check_for_warning_message(data);
            setAuthToken(data.auth_token);
            $state.go('home');
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
        //facebookResponse = facebookResponse = {status: 'unknown', authResponse: {}};
      }

      function linkFacebookUser(user){
        user['access_token'] = facebookResponse.authResponse.accessToken;
        injectUserAppData(user);
        userData.facebookLink(user).then(
          function(response){
            var data = response.data;
            setAuthToken(data.auth_token);
            $state.go('home');
          },
          function(response){
            modalUtils.launch('error', response.data.errors);
          }
        );
        //facebookResponse = facebookResponse = {status: 'unknown', authResponse: {}};
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
        clearData();
        partnerData.clearData();
        userData.clearData();
        $state.go('main');
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
 }

})();
