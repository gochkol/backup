(function () {
  'use strict';

  angular
    .module('app.exercise')
    .controller('ExerciseController', ExerciseController);

  ExerciseController.$inject = ['$scope', '$state', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'workout', 'workoutData', 'helpers', 'infoFactory', 'exerciseFactory'];

  function ExerciseController($scope, $state, globalData, userData, globalDataSet, userDataSet, workout, workoutData, helpers, infoFactory, exerciseFactory){
    var vm = this;
    vm.user = userDataSet.user;
    vm.workout = workoutData;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.color = "greentext";
    vm.timeString = helpers.timeString;
    vm.curOrNext = false;
    vm.centerButton = "12";
    vm.button = {};
    vm.button.color = "btn-success";
    vm.button.text = "start";
    vm.startPauseClick = exerciseFactory.startPauseClick;
    vm.complete = exerciseFactory.complete;
    vm.doneOrSkip = "skip";
    vm.setOrRest = "Set";
    vm.currentTime = exerciseFactory.getCurrentTime(vm);
    vm.currentTotalTime = exerciseFactory.getCurrentTotalTime();
    vm.workout.workout_total_time = vm.currentTotalTime;
    vm.setBG = exerciseFactory.getBG(vm.workout);
    vm.message = vm.helpers.getRandomValue(vm.globalDataSet.messages) || "";
    vm.workoutName = exerciseFactory.getCurrentExercise(vm.workout);
    vm.nextExercise = exerciseFactory.getNextExercise(vm.workout);
    vm.curProgress = exerciseFactory.getCurProgress(vm.workout);
    vm.caloriesBurned = exerciseFactory.getCaloriesBurned();
    vm.skipAvailable = true;
    vm.skip = exerciseFactory.skip;
    vm.cyclerStopped = true;
    vm.getCurrentBlock = exerciseFactory.getCurrentBlock;
    vm.getCurrentSet = exerciseFactory.getCurrentSet;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time:'},
      reps:         {name: 'Reps:'},
      breath:       {name: 'Breaths:'},
      pattern:      {name: 'Pattern:'},
      weight:       {name: 'Lbs:'},
      rest:         {name: 'Rest:'}
    }

  }

})();
