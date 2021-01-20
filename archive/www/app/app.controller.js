(function () {
  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['$scope', 'globalData', 'userData', 'workout', '$state', '$ionicLoading', '$timeout'];

  function AppController($scope, globalData, userData, workout, $state, $ionicLoading, $timeout){

    var vm = this;
    vm.customWorkout = customWorkout;
    vm.profile = profile;
    vm.friends = friends;
    vm.locations = locations;
    vm.favorites = favorites;
    vm.settings = settings;
    vm.company = company;
    vm.home = home;
    vm.stats = stats;
	
    function customWorkout(){
      $ionicLoading.show({
        template: 'Opening Custom Workout...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      workout.setCustomRequest();
      $state.go('nav.customizeWorkout').then(function(){$ionicLoading.hide()});
    }
    
	
    function favorites(){
      $ionicLoading.show({
        template: 'Opening Favorites...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $state.go('nav.favorites').then(function(){$ionicLoading.hide()});
    }
	
    function stats(){
      $ionicLoading.show({
        template: 'Opening Stats...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $state.go('nav.stats').then(function(){$ionicLoading.hide()});
    }
	
    function locations(){
      $ionicLoading.show({
        template: 'Opening Locations...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $state.go('nav.locations').then(function(){$ionicLoading.hide()});
    }
	
    function settings(){
      $ionicLoading.show({
        template: 'Opening User Preferences...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $state.go('nav.settings').then(function(){$ionicLoading.hide()});
    }
	
    function company(){
      $ionicLoading.show({
        template: 'Opening Teams...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $state.go('nav.company').then(function(){$ionicLoading.hide()});
    }
	
    function friends(){
      $ionicLoading.show({
        template: 'Opening Friends...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $state.go('nav.friends').then(function(){$ionicLoading.hide()});
    }
	
    function profile (){
      $ionicLoading.show({
        template: 'Opening Profile...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $state.go('nav.profile').then(function(){$ionicLoading.hide()});
    }
	
    function home (){
      $ionicLoading.show({
        template: 'Opening Home...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $state.go('nav.home').then(function(){$ionicLoading.hide()});
    }

    $scope.$on('$routeChangeSuccess', function(e, nextRoute){
      if ( nextRoute.$$route && angular.isDefined( nextRoute.$$route.pageTitle ) ) {
        $scope.pageTitle = nextRoute.$$route.pageTitle;
      }
    });

  }

})();