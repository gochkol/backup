(function () {
  'use strict';

  angular
    .module('app')
    .config(appConfig)

  appConfig.$inject = ['$urlRouterProvider', '$stateProvider', 'jwtInterceptorProvider', '$httpProvider', 'configProvider', 'stateConfigProvider', 'authProvider', '$translateProvider'];

  function appConfig($urlRouterProvider, $stateProvider, jwtInterceptorProvider, $httpProvider, configProvider, stateConfigProvider, authProvider, $translateProvider) {
    $urlRouterProvider.otherwise(otherwiseRoute);

    jwtInterceptorProvider.tokenGetter = function(){
      return authProvider.getAuthToken();
    }

    //FacebookProvider.init('1094701290564160');

    $httpProvider.interceptors.push('jwtInterceptor');

    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.translations('en', {
      "LOGIN_LABEL_USERNAME": "Username:",
      "LOGIN_LABEL_PASSWORD": "Password:",
      "LOGIN_HEADER_WHY": "Why Updown",
      "LOGIN_BUTTON_ES": "Spanish",
      "LOGIN_BUTTON_EN": "English",
    });
    $translateProvider.translations('es', {
      "LOGIN_LABEL_USERNAME": "Username:",
      "LOGIN_LABEL_PASSWORD": "Password:",
      "LOGIN_HEADER_WHY": "Why Updown",
      "LOGIN_BUTTON_ES": "Espanol",
      "LOGIN_BUTTON_EN": "Ingles",
    });
    $translateProvider.determinePreferredLanguage();
    $translateProvider.fallbackLanguage("en");

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
    var gotoState = 'main';
    if(angular.isFunction($rootScope.isLoggedIn)){
      gotoState = $rootScope.isLoggedIn() ? 'home' : 'main';
    }

    $state.go(gotoState);
  }

})();
