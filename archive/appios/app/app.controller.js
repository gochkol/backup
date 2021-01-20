(function () {
  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['$scope', 'globalData'];

  function AppController($scope, globalData){

    $scope.$on('$routeChangeSuccess', function(e, nextRoute){
      if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
        $scope.pageTitle = nextRoute.$$route.pageTitle;
      }
    });

  }

})();


