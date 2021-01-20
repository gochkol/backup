(function () {
  'use strict';

  angular
    .module('app.workout.summary')
    .controller('SummaryController', SummaryController);

  SummaryController.$inject = ['$scope', '$state', '$cordovaNetwork', 'userData', 'userDataSet', 'globalDataSet', 'workout', 'workoutData', 'helpers', 'modalUtils', '$ionicHistory', '$ionicLoading', '$timeout'];

  function SummaryController($scope, $state, $cordovaNetwork, userData, userDataSet, globalDataSet, workout, workoutData, helpers, modalUtils, $ionicHistory, $ionicLoading, $timeout){
    var vm = this;
    vm.user = userDataSet.user;
    vm.userHistory = userDataSet.userHistory;
    vm.isGuest = userData.isGuest();
    vm.workout = workoutData;
    vm.favorites = userDataSet.favorites;
    vm.favoritesMax = 10;
    vm.updateBlockSet = workout.updateBlockSet;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.isReadonly = false;
    vm.finish = finish;
    vm.createFavorite = createFavorite;
    vm.blur = helpers.blur;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time'},
      reps:         {name: 'Rep'},
      breath:       {name: 'Breaths'},
      pattern:      {name: 'Pattern'},
      weight:       {name: 'Lbs'},
      rest:         {name: 'Rest'}
    }
    if(workout.getMetric() === ""){
      workout.setMetric(vm.user.settings.units);
      if(vm.user.settings.units != "standard"){
        vm.criterionDisplayInfo.weight.name = 'Kg';
      }
    }else if(workout.getMetric() != "standard"){
      vm.criterionDisplayInfo.weight.name = 'Kg';
    }

    function finish(){
      $ionicLoading.show({
      template: 'Learning...'
      });
      if (userData.getGuestStatus()){
      $ionicLoading.hide();
        modalUtils.launch('guestFinishWorkout');
        $state.go('login');
      }
      else{
        workout.updateWorkout(afterFinish);
      }
    }

    function afterFinish(responseData){
      $timeout(function () {
        $ionicLoading.hide();
      }, 3000);
      modalUtils.launch('greatJob', helpers.pointSentence(responseData.point))
      workout.clear();
      $ionicHistory.clearCache().then(function(){$state.go('nav.home')}).then(function(){$ionicLoading.hide()});
    }

    function createFavorite(){
      if(!vm.isReadonly){
        userData.createFavorite(vm.workout);
        //vm.isReadonly = !vm.isReadonly;
        document.getElementById("favoriteIconSummary").classList.add('energized');
      }
    }
  }

})();
