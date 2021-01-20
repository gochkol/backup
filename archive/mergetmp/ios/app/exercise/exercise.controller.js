(function () {
  'use strict';

  angular
    .module('app.exercise')
    .controller('ExerciseController', ExerciseController);

  ExerciseController.$inject = ['$scope', '$state', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'workout', 'workoutData', 'helpers', 'infoFactory', 'exerciser', 'modalUtils', '$ionicActionSheet'];

  function ExerciseController($scope, $state, globalData, userData, globalDataSet, userDataSet, workout, workoutData, helpers, infoFactory, exerciser, modalUtils, $ionicActionSheet){
    var vm = this;
    vm.user = userDataSet.user;
	  vm.userHistory = userDataSet.userHistory;
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
    vm.finishWorkout = exerciser.finishWorkout;
    vm.getSource = getSource;
    vm.blur = helpers.blur;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time'},
      reps:         {name: 'Reps'},
      breath:       {name: 'Breaths'},
      pattern:      {name: 'Pattern'},
      weight:       {name: 'Lbs'},
      rest:         {name: 'Rest'}
    }
    for(var b in vm.bodyStats){
      if(vm.bodyStats[b].value == 'weight'){
        exerciser.setUserWeight(vm.bodyStats[b].data);
      }
    }
    vm.show = show;
    var showOptions = [{buttons: [{ text: 'Hide image' }],
                        destructiveText: 'End workout now',
                        titleText: 'Workout Options',
                        cancelText: 'Cancel',
                        cancel: cancel,
                        buttonClicked: buttonClicked,
                        destructiveButtonClicked: destructiveButtonClicked},
                       {buttons: [{ text: 'Hide image' },
                                  { text: 'Move current exercise to end' }],
                        destructiveText: 'End workout now',
                        titleText: 'Workout Options',
                        cancelText: 'Cancel',
                        cancel: cancel,
                        buttonClicked: buttonClicked,
                        destructiveButtonClicked: destructiveButtonClicked},
                       {buttons: [{ text: 'Hide image' }],
                        titleText: 'Workout Options',
                        cancelText: 'Cancel',
                        cancel: cancel,
                        buttonClicked: buttonClicked},
                       {buttons: [{ text: 'Hide image' },
                                  { text: 'Move current exercise to end' }],
                        titleText: 'Workout Options',
                        cancelText: 'Cancel',
                        cancel: cancel,
                        buttonClicked: buttonClicked}];

    function getSource(){
      if(vm.getCurrentSet() == vm.workout.blocks[vm.getCurrentBlock()].block_sets.length - 1 && vm.getCurrentBlock() != vm.workout.blocks.length-1 && !exerciser.getIsSet()){
        vm.workout.blocks[vm.getCurrentBlock()+1].animationInfo.photoStart();
        return vm.workout.blocks[vm.getCurrentBlock()+1].animationInfo.images[vm.workout.blocks[vm.getCurrentBlock()+1].animationInfo.current];
      }else{
        return vm.workout.blocks[vm.getCurrentBlock()].animationInfo.images[vm.workout.blocks[vm.getCurrentBlock()].animationInfo.current];
      }
    }

    function show() {
      // Show the action sheet
      var hideSheet;
      if(vm.isCollapsed){
        showOptions[0].buttons[0].text = "Show image";
        showOptions[1].buttons[0].text = "Show image";
        showOptions[2].buttons[0].text = "Show image";
        showOptions[3].buttons[0].text = "Show image";
      }else{
        showOptions[0].buttons[0].text = "Hide image";
        showOptions[1].buttons[0].text = "Hide image";
        showOptions[2].buttons[0].text = "Hide image";
        showOptions[3].buttons[0].text = "Hide image";
      }

      if(!vm.skipAvailable || vm.getCurrentBlock() == (vm.workout.blocks.length-1)){
        if(vm.getCurrentBlock() == 0){
          hideSheet = $ionicActionSheet.show(showOptions[2]);
        }else{
          hideSheet = $ionicActionSheet.show(showOptions[0]);
        }
      }else{
        if(vm.getCurrentBlock() == 0){
          hideSheet = $ionicActionSheet.show(showOptions[3]);
        }else{
          hideSheet = $ionicActionSheet.show(showOptions[1]);
        }
      }

    }

    function cancel(){}

    function buttonClicked(index){
      switch(index){
        case 0:
          hideShowAnimation();
          break;
        case 1:
          vm.skip();
          break;
      }
      return true;
    }

    function destructiveButtonClicked(){
      vm.finishWorkout(vm);
      return true;
    }

    function hideShowAnimation(){
      vm.isCollapsed = !vm.isCollapsed;
      vm.isCollapsed ? vm.workout.blocks[vm.getCurrentBlock()].animationInfo.photoEnd() : vm.workout.blocks[vm.getCurrentBlock()].animationInfo.photoStart();
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
