(function () {
  'use strict';

  angular
    .module('app.workout.summary')
    .controller('SummaryController', SummaryController);

  SummaryController.$inject = ['$scope', '$state', 'userData', 'userDataSet', 'globalDataSet', 'workout', 'workoutData', 'helpers', 'modalUtils'];

  function SummaryController($scope, $state, userData, userDataSet, globalDataSet, workout, workoutData, helpers, modalUtils){
    var vm = this;
    vm.user = userDataSet.user;
    vm.userHistory = userDataSet.userHistory;
    vm.workout = workoutData;
    vm.favorites = userDataSet.favorites;
    vm.favoritesMax = 10;
    vm.updateBlockSet = workout.updateBlockSet;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.createFavorite = createFavorite;
    vm.isReadonlytwo = false;
    vm.finish = finish;
    vm.createFavorite = createFavorite;
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
      workout.updateWorkout(afterFinish);
    }

    function afterFinish(responseData){
      modalUtils.launch('greatJob', helpers.pointSentence(responseData.point));
      workout.clear();
      $state.go('home');
    }

    function createFavorite(){
      if(!vm.isReadonly){
        userData.createFavorite(vm.workout);
      }
    }

  }

})();
