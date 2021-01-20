(function () {
  'use strict';

  angular
    .module('app')
    .config(appConfig)

  appConfig.$inject = ['$urlRouterProvider'];

  function appConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
  }

})();
