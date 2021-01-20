(function(){
  'use strict';

  angular
    .module('app')
    .run(appRun);

  appRun.$inject = ['$rootScope', '$state', '$window', 'store', 'jwtHelper', 'config', 'globalData', 'stateConfig', 'userData', 'partnerData', 'angularFilepicker', 'workout', 'modalUtils', 'exerciser', 'auth'];

  function appRun($rootScope, $state, $window, store, jwtHelper, config, globalData, stateConfig, userData, partnerData, angularFilepicker, workout, modalUtils, exerciser, auth){
    var statesThatDontRequireAuth = ['login', 'signup', 'reset', 'misfire', 'main', 'ourCompany', 'media', 'contact'];
    $rootScope.isLoggedIn = auth.isLoggedIn;
    $rootScope.isPartner = auth.isPartner;
    $rootScope.isInTransition = false;
    $rootScope.facebookAppId = '[' + config.getFacebookAppID() + ']';

    $window.fbAsyncInit = function() {
      FB.init({
        appId  : config.getFacebookAppID(),
        status : true, // check login status
        cookie : true, // enable cookies to allow the server to access the session
        xfbml  : true  // parse XFBML
      });

      FB.Event.subscribe('auth.statusChange', function(response){
        auth.setFacebookResponse(response);
      });

    };
    (function(d) {
      var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
      js = d.createElement('script'); js.id = id; js.async = true;
      js.src = "//connect.facebook.net/en_US/all.js";
      d.getElementsByTagName('head')[0].appendChild(js);
    }(document));





    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      var loginRequired = (!toState.data || !toState.data.loginNotRequired);
      var partnerRequired = (toState.data && toState.data.partnerRequired);
      var isLoggedIn = auth.isLoggedIn();
      var isPartner = auth.isPartner();

      if (toState && toState.views && toState.views.nav){
        toState.views.nav.templateUrl = 'app/nav/userNav.html';
      }

      if (fromState.name == 'login' && loginRequired){
        return;
      }

      if(toState.name == 'main' && isLoggedIn){
        event.preventDefault();
        $state.go('logout');
        return;
      }

      if (partnerRequired && !isPartner){
        event.preventDefault();
        $state.go('logout');
        return;
      }

      // HANDLE ui-router state policy
      if (loginRequired && !isLoggedIn){
        event.preventDefault();
        $state.go('main');
        return;
      }

      if ((fromState.name == 'customizeWorkout' && toState.name != 'exercise') ||
               (fromState.name == 'exercise' && toState.name != 'summary') ||
               (fromState.name == 'summary' && toState.name != 'home')){
        if ($rootScope.isInTransition){
          $rootScope.isInTransition = false;
        }
        else{
          event.preventDefault();
          modalUtils.launch('youSure', function(){
            $rootScope.isInTransition = true;
            workout.clear();
            exerciser.clear();
            if (toState.name == 'customizeWorkout' || toState.name == 'exercise'){
              $state.go('home');
            }
            else{
              $state.go(toState.name);
            }
          });
        };
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

      var states = ['customizeWorkout', 'exercise', 'summary'];

      if (states.indexOf($state.current.name) >= 0){
        return "Are you sure you want to leave?  If so, changes will be lost.";
      }
    };

    angularFilepicker.setKey('Ap4XIwSo4SZuHDiHiSFrjz');

    config.initialize();
    globalData.initialize();
    userData.initialize();
    stateConfig.initialize();
    workout.initialize();
    partnerData.initialize();
  }

  function getNavView(){
    var template =  'nav';
    return {
      controller: 'NavController',
      controllerAs: 'nav',
      templateUrl: 'app/nav/' + template + '.html',
      resolve: {
        userDataSet: ['userData', function(userData){
          return userData.getDataSet([
            'user',
            'friends',
            'friendRequestsForMe',
            'friendRequestsFromMe'
          ]);
        }]
      }
    };
  }

})();
