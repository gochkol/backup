(function(){
  'use strict';

  angular
    .module('app')
    .run(appRun);

  appRun.$inject = ['$ionicPlatform', '$rootScope', '$state', 'store', 'jwtHelper', 'config', 'globalData', 'stateConfig', 'userData', 'angularFilepicker', 'workout'];

  function appRun($ionicPlatform, $rootScope, $state, store, jwtHelper, config, globalData, stateConfig, userData, angularFilepicker, workout){
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

    var statesThatDontRequireAuth = ['app', 'login', 'signup', 'reset', 'misfire'];
    $rootScope.isLoggedIn = isLoggedIn;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      if(toState.name && (statesThatDontRequireAuth.indexOf(toState.name) == -1)){
        if(!$rootScope.isLoggedIn()){
          event.preventDefault();
          $state.go('login');
        }
      }

      $rootScope.$on("$stateChangeError", console.log.bind(console));

      angularFilepicker.setKey('Ap4XIwSo4SZuHDiHiSFrjz');

      config.initialize();
      globalData.initialize();
      userData.initialize();
      stateConfig.initialize();
      workout.initialize();
    });

    function isLoggedIn(){
      var token = userData.getAuthToken();
       if (!token || jwtHelper.isTokenExpired(token)){
         return false;
       }else {
         return true;
       }
    }
  }

})();
