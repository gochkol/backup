(function () {
  'use strict';

  angular
    .module('app.workout.summary')
    .controller('SummaryController', SummaryController);

  SummaryController.$inject = ['$state', 'userData', 'userDataSet', 'globalDataSet', 'workout', 'workoutData', 'helpers', 'infoFactory'];

  function SummaryController($state, userData, userDataSet, globalDataSet, workout, workoutData, helpers, infoFactory){
    var vm = this;
    vm.user = userDataSet.user;
    vm.workout = workoutData;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.isReadonly = false;
    vm.finish = finish;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time:'},
      reps:         {name: 'Reps:'},
      breath:       {name: 'Breaths:'},
      pattern:      {name: 'Pattern:'},
      weight:       {name: 'Lbs:'},
      rest:         {name: 'Rest:'}
    }

    function finish(){
      workout.updateWorkout();
      workout.clearWorkout();
      $state.go('home');
    }
  }

})();
