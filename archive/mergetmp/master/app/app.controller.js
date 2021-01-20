(function () {
  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['$scope', 'globalData', 'userData', 'workout', '$state'];

  function AppController($scope, globalData, userData, workout, $state){

    var vm = this;
    vm.customWorkout = customWorkout;
	
	function customWorkout(){
      workout.setCustomRequest();
      $state.go('nav.customizeWorkout');
    }

    $scope.$on('$routeChangeSuccess', function(e, nextRoute){
      if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
        $scope.pageTitle = nextRoute.$$route.pageTitle;
      }
    });

  }

})();


