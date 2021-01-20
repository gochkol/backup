(function () {
  'use strict';

  angular
    .module('app')
    .config(appConfig)

  appConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'jwtInterceptorProvider', '$httpProvider', 'configProvider', 'stateConfigProvider', 'userDataProvider'];

  function appConfig($urlRouterProvider, $stateProvider, jwtInterceptorProvider, $httpProvider, configProvider, stateConfigProvider, userDataProvider) {
    //$urlRouterProvider.otherwise('/');

    jwtInterceptorProvider.tokenGetter = function(){
      return userDataProvider.getAuthToken();
    }

    $httpProvider.interceptors.push('jwtInterceptor');

    configProvider.setOptions({
      cacheCheckWaitSeconds: 3600,
      globalStoreName: 'UpDownData.v1.global',
      userStoreName:   'UpDownData.v1.user'
      //globalStoreName: 'UpDownData.v1.global' + '.' + Math.floor((new Date()).getTime() / 1000),
      //userStoreName:   'UpDownData.v1.user' + '.' + Math.floor((new Date()).getTime() / 1000),
    });

    stateConfigProvider.initialize();
  }


})();
