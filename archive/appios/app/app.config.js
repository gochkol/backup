(function () {
  'use strict';

  angular
    .module('app')
    .config(appConfig)

  appConfig.$inject = ['$urlRouterProvider', '$stateProvider', '$ionicConfigProvider', 'jwtInterceptorProvider', '$httpProvider', 'configProvider', 'stateConfigProvider', 'userDataProvider'];

  function appConfig($urlRouterProvider, $stateProvider, $ionicConfigProvider, jwtInterceptorProvider, $httpProvider, configProvider, stateConfigProvider, userDataProvider) {
    $urlRouterProvider.otherwise(otherwiseRoute);

    jwtInterceptorProvider.tokenGetter = function(){
      return userDataProvider.getAuthToken();
    }

    $httpProvider.interceptors.push('jwtInterceptor');
    $ionicConfigProvider.views.maxCache(0);


    configProvider.setOptions({
      cacheCheckWaitSeconds: 3600,
      globalStoreName: 'UpDownData.v1.global',
      userStoreName:   'UpDownData.v1.user'
    });

    stateConfigProvider.initialize();
  }

  otherwiseRoute.$inject = ['$injector', '$location'];

  function otherwiseRoute($injector, $location){
    var $rootScope = $injector.get('$rootScope');
    var $state = $injector.get('$state');
    var gotoState = null;

//IMPORTANT - KEEP THIS COMMENTED OUT UNTIL FIX IS IN
    if($rootScope.isLoggedIn && angular.isFunction($rootScope.isLoggedIn)){
      gotoState = $rootScope.isLoggedIn() ? 'nav.home' : 'login';
    }else{
      gotoState = 'login';
    }
    $state.go(gotoState);
  }


})();
