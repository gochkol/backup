(function () {
  'use strict';

  angular
    .module('app.workout')
    .controller('WorkoutController', WorkoutController)

  WorkoutController.$inject = ['$scope', '$state', 'userData', 'userDataSet', 'globalDataSet', 'workout', 'workoutData', 'helpers', 'exerciser', 'modalUtils', '$ionicScrollDelegate', '$ionicHistory', '$ionicLoading', '$timeout', '$ionicActionSheet'];

  function WorkoutController($scope, $state, userData, userDataSet, globalDataSet, workout, workoutData, helpers, exerciser, modalUtils, $ionicScrollDelegate, $ionicHistory, $ionicLoading, $timeout, $ionicActionSheet){
    var vm = this;
    vm.user = userDataSet.user;
    vm.userHistory = userDataSet.userHistory;
    vm.workout = workoutData;
    vm.workout.blocks.length == 0 ? vm.shower = "customizeAdvance" : vm.shower = "exercise";
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.isReadonly = false;
    vm.favorites = userDataSet.favorites;
    vm.favoritesMax = 10;
    vm.showBlockInfo = showBlockInfo;
    vm.updateBlockSet = updateBlockSet;
    vm.moveBlock = moveBlock;
    vm.moveItem = moveItem;
    vm.showReorder = false;
    vm.deleteBlock = deleteBlock;
    vm.swapBlock = swapBlock;
    vm.duplicateBlock = duplicateBlock;
    vm.addRandomBlock = addRandomBlock;
    vm.exerciseList = [];
    vm.filteredExercises = filteredExercises;
    vm.createFavorite = createFavorite;
    vm.bodyAreas = [];
    vm.equipments = [];
    vm.categories = [];
    vm.addExerciseHidden = (vm.workout.workout_type === "custom");
    vm.addExercises = addExercises;
    vm.deleteLastSet = deleteLastSet;
    vm.duplicateLastSet = duplicateLastSet;
    vm.start = start;
    vm.scrollBottom = scrollBottom;
    vm.scrollTop = scrollTop;
    vm.blur = helpers.blur;
    vm.finish = finish;
    vm.isCollapsed = false;
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
    if(vm.shower == "exercise"){
      vm.currentTime = exerciser.getCurrentTime(vm);
      vm.currentTotalTime = exerciser.getCurrentTotalTime();
      vm.workoutName = exerciser.getCurrentExercise(vm.workout);
      vm.nextExercise = exerciser.getNextExercise(vm.workout);
      vm.curProgress = exerciser.getCurProgress(vm.workout);
      vm.caloriesBurned = exerciser.getCaloriesBurned();
      vm.setBG = exerciser.getBG(vm.workout);
    }
    vm.workout.workout_total_time = vm.currentTotalTime;
    vm.message = "";
    vm.skipAvailable = true;
    vm.skip = skip;
    vm.cyclerStopped = true;
    vm.getCurrentBlock = exerciser.getCurrentBlock;
    vm.getCurrentSet = exerciser.getCurrentSet;
    vm.bodyStats = userDataSet.bodyStats;
    vm.finishWorkout = exerciser.finishWorkout;
    vm.getSource = getSource;
    vm.simple = vm.user.settings.simple === "simple" ? true : false;
    vm.simple = vm.workout.workout_type === "custom" ? false : vm.simple;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time'},
      reps:         {name: 'Rep'},
      breath:       {name: 'Breaths'},
      pattern:      {name: 'Pattern'},
      weight:       {name: 'Lb'},
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

    if (vm.workout.workout_type === "custom"){
      vm.simple = false;
    }

    refreshDisplay();

    function refreshDisplay(){
      for (var i = 0; i < vm.workout.blocks.length; i++){
        var block = vm.workout.blocks[i];
        block.showDownButton = (i == vm.workout.blocks.length-1) ? false : true;
        block.showUpButton = (i == 0) ? false : true;
        block.animationInfo.photoStart();
      }

      vm.bodyAreas = [{name: 'All Body Areas', id: null}].concat(globalDataSet.bodyAreas);
      vm.equipments = [{name: 'All Equipment', id: null},{name: 'No Equipment', id: -1}].concat(globalDataSet.equipments);
      vm.categories = [{name: 'All Categories', id: null}].concat(globalDataSet.categories);
    }

    function showBlockInfo(blockIndex){
      var block = vm.workout.blocks[blockIndex];
      block.showInfo = !block.showInfo;
//    Commenting out below line so aninamtions will stay on all the time.
//    block.showInfo ? block.animationInfo.photoStart() : block.animationInfo.photoEnd();
//    do animation stuff here
    }

    function updateBlockSet(criteriaName, blockSet, block){
      workout.updateBlockSet(criteriaName, blockSet, block);
    }

    function moveBlock(blockIndex, direction){
      workout.moveBlock(blockIndex, direction);
      refreshDisplay();
    }

    function moveItem(blockIndex, fromIndex, toIndex){
      if(fromIndex > toIndex){
        do{
          moveBlock(blockIndex, "up");
          blockIndex--;
          fromIndex--;
        }while(fromIndex != toIndex);
      }else if(fromIndex < toIndex){
        do{
          moveBlock(blockIndex, "down");
          blockIndex++;
          fromIndex++;
        }while(fromIndex != toIndex);
      }
    }

    function deleteLastSet(blockIndex){
      workout.deleteLastSet(blockIndex);
      refreshDisplay();
    }

    function duplicateLastSet(blockIndex){
      workout.duplicateLastSet(blockIndex);
      refreshDisplay();
    }

    function createFavorite(){
      if(!vm.isReadonly){
        userData.createFavorite(vm.workout);
        //vm.isReadonly = !vm.isReadonly;
        document.getElementById("favoriteIcon").classList.add('energized');
      };
	  $ionicHistory.clearCache();
    }

    function swapBlock(blockIndex){
      workout.swapBlock(blockIndex, refreshDisplay);
    }

    function duplicateBlock(blockIndex){
      workout.duplicateBlock(blockIndex, refreshDisplay);
    }

    function addExercises(){
      workout.addExercises(vm.selectedExercises, refreshDisplay);
      vm.selectedExercises = [];
    }

    function addRandomBlock(){
      workout.addRandomBlock(refreshDisplay);
    }

    function deleteBlock(blockIndex){
      workout.deleteBlock(blockIndex);
      refreshDisplay();
    }

    function filteredExercises(){
      var keys = vm.exerciseKeys ? vm.exerciseKeys.toLowerCase().split(" ") : null;
      var exercises = globalDataSet.exercises;

      vm.exerciseList = [];
      for (var i = 0; i < exercises.length; i++){
        var exercise = exercises[i];
        if (vm.selectedBodyArea && vm.selectedBodyArea.id != null && vm.selectedBodyArea.id != exercise.primary_body_area_id){
          continue;
        }
        if (vm.selectedEquipment && vm.selectedEquipment.id != null){
          if (vm.selectedEquipment.id == -1 && exercise.equipment_ids.length != 0){
            continue;
          }
          else if (vm.selectedEquipment.id != -1 && exercise.equipment_ids.indexOf(vm.selectedEquipment.id) < 0){
           continue;
          }
        }
        if (vm.selectedCategory && vm.selectedCategory.id != null && exercise.category_ids.indexOf(vm.selectedCategory.id) < 0){
          continue;
        }
        if (keys){
          var hasKeys = true;
          for (var j = 0; j < keys.length; j++){
            if (exercise.keys.indexOf(keys[j]) < 0){
              hasKeys = false;
              break;
            }
          }
          if (!hasKeys){
            continue;
          }
        }
        vm.exerciseList.push(exercise);
      }
      vm.exerciseList = vm.exerciseList.sort(function(a,b){if(a.name > b.name) return 1; if (a.name < b.name) return -1; return 0});
      return vm.exerciseList;
    }

    function start(){
      $ionicLoading.show({
      template: 'Starting Workout...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 3000);
      exerciser.initializeState();
      vm.shower = 'exercise';
      $ionicLoading.hide();
    }

    function scrollBottom(){
      $timeout(function(){
        $ionicScrollDelegate.scrollTo(0,99999,true);
      }, 500);
    }

    function scrollTop(){
      $timeout(function(){
        $ionicScrollDelegate.scrollTo(0,0,true);
      }, 500);
    }

    function finish(){
      $ionicLoading.show({
      template: 'Learning...'
      });
      workout.updateWorkout(afterFinish);
    }

    function afterFinish(responseData){
      $timeout(function () {
        $ionicLoading.hide();
      }, 3000);
      modalUtils.launch('greatJob', helpers.pointSentence(responseData.point))
      workout.clear();
      $ionicHistory.clearCache().then(function(){$state.go('nav.home')}).then(function(){$ionicLoading.hide()});
    }

    exerciser.setAudioSettings(vm.user.settings);

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
      if(vm.workout.blocks.length == 0){return;}
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
