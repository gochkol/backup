(function () {
  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['$scope', 'globalData', '$translate', 'userData'];

  function AppController($scope, globalData, $translate, userData){

    $scope.$on('$routeChangeSuccess', function(e, nextRoute){
      if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
        $scope.pageTitle = nextRoute.$$route.pageTitle;
      }
    });

    $scope.changeLanguage = function (langKey) {
      $translate.use(langKey);
    };

  }

})();


