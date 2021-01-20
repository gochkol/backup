(function () {
  'use strict';

  angular
    .module('app.exercise')
    .controller('ExerciseController', ExerciseController);

  ExerciseController.$inject = ['$scope', '$state', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'workout', 'workoutData', 'helpers', 'infoFactory', 'exerciser', 'modalUtils'];

  function ExerciseController($scope, $state, globalData, userData, globalDataSet, userDataSet, workout, workoutData, helpers, infoFactory, exerciser, modalUtils){
    var vm = this;
    vm.user = userDataSet.user;
    vm.workout = workoutData;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.isCollapsed = false;
    vm.infoClicked = infoFactory.getClicked;
    vm.color = "balanced";
    vm.navcolor = "tabs-background-calm";
    vm.timeString = helpers.timeString;
    vm.curOrNext = false;
    vm.centerButton = "12";
    vm.button = {};
    vm.button.color = "btn-success";
    vm.button.text = "ion-play";
    vm.button.textTwo = "Start";
    vm.startPauseClick = exerciser.startPauseClick;
    vm.complete = exerciser.complete;
    vm.doneOrSkip = "Skip";
    vm.setOrRest = "Set";
    vm.currentTime = exerciser.getCurrentTime(vm);
    vm.currentTotalTime = exerciser.getCurrentTotalTime();
    vm.workout.workout_total_time = vm.currentTotalTime;
    vm.setBG = exerciser.getBG(vm.workout);
    vm.message = "";
    vm.workoutName = exerciser.getCurrentExercise(vm.workout);
    vm.nextExercise = exerciser.getNextExercise(vm.workout);
    vm.curProgress = exerciser.getCurProgress(vm.workout);
    vm.caloriesBurned = exerciser.getCaloriesBurned();
    vm.skipAvailable = true;
    vm.skip = skip;
    vm.cyclerStopped = true;
    vm.getCurrentBlock = exerciser.getCurrentBlock;
    vm.getCurrentSet = exerciser.getCurrentSet;
    vm.bodyStats = userDataSet.bodyStats;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time:'},
      reps:         {name: 'Reps:'},
      breath:       {name: 'Breaths:'},
      pattern:      {name: 'Pattern:'},
      weight:       {name: 'Lbs:'},
      rest:         {name: 'Rest:'}
    }
    for(var b in vm.bodyStats){
      if(vm.bodyStats[b].value == 'weight'){
        exerciser.setUserWeight(vm.bodyStats[b].data);
      }
    }
    function skip(){
      exerciser.skip(vm);
      vm.workoutName = exerciser.getCurrentExercise(vm.workout);
      vm.nextExercise = exerciser.getNextExercise(vm.workout);
      vm.curProgress = exerciser.getCurProgress(vm.workout);
    }

  }

})();
