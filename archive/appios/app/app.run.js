(function(){
  'use strict';

  angular
    .module('app')
    .run(appRun);

  appRun.$inject = ['$ionicPlatform', '$rootScope', '$state', '$window', '$cordovaNetwork', 'store', 'jwtHelper', 'config', 'globalData', 'stateConfig', 'userData', 'workout', 'modalUtils', 'exerciser'];

  function appRun($ionicPlatform, $rootScope, $state, $window, $cordovaNetwork, store, jwtHelper, config, globalData, stateConfig, userData, workout, modalUtils, exerciser){
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard){
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if(window.StatusBar){
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });

    document.addEventListener("deviceready", function () {
      var type = $cordovaNetwork.getNetwork();
      var isOnline = $cordovaNetwork.isOnline();
      var isOffline = $cordovaNetwork.isOffline();

      if(isOffline){
        modalUtils.launch('error', "This app requires an active internet connection. Please connect to a network and try again");
      }

      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        modalUtils.launch('error', "Your internet connection has been restored");
      });

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        modalUtils.launch('error', "This app requires an active internet connection. Please connect to a network and try again");
      })

    }, false);

    var statesThatDontRequireAuth = ['login', 'signup', 'reset', 'misfire'];
    $rootScope.isLoggedIn = userData.isLoggedIn;
    $rootScope.isGuest = userData.isGuest;
    $rootScope.isInTransition = false;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      var loginRequired = (!toState.data || !toState.data.loginNotRequired);
      var guestAllowed = (toState.data && toState.data.guestAccessOK);
      var guestNotAllowed = (loginRequired && !guestAllowed);
      var isLoggedIn = userData.isLoggedIn();
      var isGuest = userData.isGuest();

      if(toState.name == 'nav.exercise' || toState.name == 'guestNav.exercise'){
        document.addEventListener('deviceready', function () {
          cordova.plugins.backgroundMode.enable();
          window.plugins.insomnia.keepAwake();
        }, false);
      }

      if(fromState.name == 'nav.exercise' || fromState.name == 'guestNav.exercise'){
        document.addEventListener('deviceready', function () {
          cordova.plugins.backgroundMode.disable();
          window.plugins.insomnia.allowSleepAgain();
        }, false);
      }

      if(fromState.name === 'login' && toState.name === 'guestNav.summary'){
        event.preventDefault();
        return;
      }

      if (fromState.name == 'login' && loginRequired){
        return;
      }

      if(toState.name == 'login' && isLoggedIn){
        event.preventDefault();
        $state.go('nav.logout');
        return;
      }

      // HANDLE ui-router state policy
      if ((loginRequired && !isLoggedIn) || (isLoggedIn && isGuest && guestNotAllowed)){
        event.preventDefault();
        $state.go('login');
        return;
      }

      if(isGuest && toState.name.indexOf('nav') != -1){
        if(toState.name != 'nav.logout'){
          event.preventDefault();
          $state.go('nav.logout');
        }
        return;
      }

      if (isGuest && toState.name != 'login' && fromState.name == 'summary'){
        event.preventDefault();
        $state.go('login');
        return;
      }

      if (!isGuest){
        if ((fromState.name == 'customizeWorkout' && toState.name != 'exercise') ||
                 (fromState.name == 'nav.exercise' && toState.name != 'summary') ||
                 (fromState.name == 'summary' && toState.name != 'nav.home')){
          if($rootScope.isInTransition){
            $rootScope.isInTransition = false;
          }
          else{
            event.preventDefault();
            modalUtils.launch('youSure', function(){
              $rootScope.isInTransition = true;
              workout.clear();
              exerciser.clear();
              if (toState.name == 'customizeWorkout' || toState.name == 'exercise'){
                $state.go('nav.home');
              }
              else{
                $state.go(toState.name);
              }
            });
          };
        }
      }
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, errorText){
      event.preventDefault();
      errorText = errorText || "Could not transition to desired page.";
      modalUtils.launch('error', errorText);
      // WARNING!
      // do not go to a state from here since this can lead to infinite loop that would freeze the browser or
      // mobile device and our users would hate us
      // $state.go('home'); <------- BAD
    });

    $window.onbeforeunload = function(event){

      var states = ['nav.customizeWorkout', 'nav.exercise', 'summary'];

      if (states.indexOf($state.current.name) >= 0){
        return "Are you sure you want to leave?  If so, changes will most likely be lost.";
      }
    };

    config.initialize();
    globalData.initialize();
    userData.initialize();
    stateConfig.initialize();
    workout.initialize();
  }

})();
