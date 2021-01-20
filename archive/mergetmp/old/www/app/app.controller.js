(function () {
  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['$scope', 'globalData', 'userData'];

  function AppController($scope, globalData, userData){

    var vm = this;
 //   vm.userDataSet = userData.get('friendRequestsForMe');
 //   vm.friendRequestsForMe = vm.userDataSet;

    $scope.$on('$routeChangeSuccess', function(e, nextRoute){
      if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
        $scope.pageTitle = nextRoute.$$route.pageTitle;
      }
    });

  }

})();


