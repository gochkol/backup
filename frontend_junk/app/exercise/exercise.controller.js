(function () {
  'use strict';

  angular
    .module('app.exercise')
    .controller('ExerciseController', ExerciseController);

  ExerciseController.$inject = ['$scope', '$state', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'workout', 'workoutData', 'helpers', 'exerciser', 'modalUtils'];

  function ExerciseController($scope, $state, globalData, userData, globalDataSet, userDataSet, workout, workoutData, helpers, exerciser, modalUtils){
    var vm = this;
    vm.user = userDataSet.user;
    vm.userHistory = userDataSet.userHistory;
    vm.workout = workoutData;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.color = "greentext";
    vm.navcolor = "calm-bg";
    vm.timeString = helpers.timeString;
    vm.curOrNext = false;
    vm.centerButton = "12";
    vm.button = {};
    vm.button.color = "btn-success";
    vm.button.text = "start";
    vm.startPauseClick = exerciser.startPauseClick;
    vm.complete = exerciser.complete;
    vm.doneOrSkip = "skip";
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
    vm.finishWorkout = exerciser.finishWorkout;
    vm.getSource = getSource;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time'},
      reps:         {name: 'Reps'},
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

    for(var b in vm.bodyStats){
      if(vm.bodyStats[b].value == 'weight'){
        exerciser.setUserWeight(vm.bodyStats[b].data);
      }
    }

    function getSource(){
		  if(vm.getCurrentSet() == vm.workout.blocks[vm.getCurrentBlock()].block_sets.length - 1 && vm.getCurrentBlock() != vm.workout.blocks.length-1 && !exerciser.getIsSet()){
		    vm.workout.blocks[vm.getCurrentBlock()+1].animationInfo.photoStart();
	      return vm.workout.blocks[vm.getCurrentBlock()+1].animationInfo.images[vm.workout.blocks[vm.getCurrentBlock()+1].animationInfo.current];
		  }else{
		    return vm.workout.blocks[vm.getCurrentBlock()].animationInfo.images[vm.workout.blocks[vm.getCurrentBlock()].animationInfo.current];
		  }
    }

    function skip(){
      exerciser.skip(vm);
      vm.workoutName = exerciser.getCurrentExercise(vm.workout);
      vm.nextExercise = exerciser.getNextExercise(vm.workout);
      vm.curProgress = exerciser.getCurProgress(vm.workout);
      vm.currentTime = exerciser.getCurrentTime(vm);
    }

  }

})();
