(function () {
  'use strict';

  angular
    .module('app')
    .config(appConfig)

  appConfig.$inject = ['$urlRouterProvider', '$stateProvider', '$ionicConfigProvider', 'jwtInterceptorProvider', '$httpProvider', 'configProvider', 'stateConfigProvider', 'userDataProvider', '$cordovaAppRateProvider'];

  function appConfig($urlRouterProvider, $stateProvider, $ionicConfigProvider, jwtInterceptorProvider, $httpProvider, configProvider, stateConfigProvider, userDataProvider, $cordovaAppRateProvider) {
    $urlRouterProvider.otherwise(otherwiseRoute);

    jwtInterceptorProvider.tokenGetter = function(){
      return userDataProvider.getAuthToken();
    }

    $httpProvider.interceptors.push('jwtInterceptor');
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.scrolling.jsScrolling(false);

    configProvider.setOptions({
      cacheCheckWaitSeconds: 3600,
      globalStoreName: 'UpDownData.v1.global',
      userStoreName:   'UpDownData.v1.user'
    });

    stateConfigProvider.initialize();

    document.addEventListener("deviceready", function () {

    var prefs = {
      language: 'en',
      appName: 'Updown Fitness',
      iosURL: '1057346888',
      androidURL: 'market://details?id=com.ionicframework.updownapp567681',
      usesUntilPrompt: 5,
      promptForNewVersion: true
    };

    $cordovaAppRateProvider.setPreferences(prefs)

    }, false);
  }

  otherwiseRoute.$inject = ['$injector', '$location'];

  function otherwiseRoute($injector, $location){
    var $rootScope = $injector.get('$rootScope');
    var $state = $injector.get('$state');
    var gotoState = 'login';

    if(angular.isFunction($rootScope.isLoggedIn)){
      gotoState = $rootScope.isLoggedIn() ? 'nav.home' : 'login';
    }
    $state.go(gotoState);
  }


})();
