(function () {
  'use strict';

  angular
    .module('app.workout.gym')
    .controller('GymWorkoutController', GymWorkoutController)

  GymWorkoutController.$inject = ['$scope', '$state', 'globalDataSet', 'workout', 'workoutData', 'helpers', 'exerciser', 'modalUtils', '$timeout', 'partner'];

  function GymWorkoutController($scope, $state, globalDataSet, workout, workoutData, helpers, exerciser, modalUtils, $timeout, partner){
    var vm = this;
    vm.partner = partner;
    vm.workout = workoutData;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.isReadonly = false;
    vm.favoritesMax = 10;
    vm.isReadOnlyTwo = false;
    vm.showBlockInfo = showBlockInfo;
    vm.updateBlockSet = updateBlockSet;
    vm.moveBlock = moveBlock;
    vm.deleteBlock = deleteBlock;
    vm.duplicateBlock = duplicateBlock;
    vm.exerciseList = [];
    vm.filteredExercises = filteredExercises;
    vm.createFavorite = createFavorite;
    vm.bodyAreas = [];
    vm.equipments = [];
    vm.categories = [];
    vm.addExerciseHidden = true;
    vm.addExercises = addExercises;
    vm.deleteLastSet = deleteLastSet;
    vm.duplicateLastSet = duplicateLastSet;
    vm.start = start;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time'},
      reps:         {name: 'Rep'},
      breath:       {name: 'Breaths'},
      pattern:      {name: 'Pattern'},
      weight:       {name: 'Lb'},
      rest:         {name: 'Rest'}
    }

    vm.criterionDisplayInfo.weight.name = 'Kg';

    refreshDisplay();

    function refreshDisplay(){
      for (var i = 0; i < vm.workout.blocks.length; i++){
        var block = vm.workout.blocks[i];
        block.showInfo = false;
        block.showDownButton = (i == vm.workout.blocks.length-1) ? false : true;
        block.showUpButton = (i == 0) ? false : true;
      }

      vm.bodyAreas = [{name: 'All Body Areas', id: null}].concat(globalDataSet.bodyAreas);
      vm.equipments = [{name: 'All Equipment', id: null},{name: 'No Equipment', id: -1}].concat(globalDataSet.equipments);
      vm.categories = [{name: 'All Categories', id: null}].concat(globalDataSet.categories);
    }

    function showBlockInfo(blockIndex){
      var block = vm.workout.blocks[blockIndex];
      block.showInfo = !block.showInfo;
      block.showInfo ? block.animationInfo.photoStart() : block.animationInfo.photoEnd();
      // do animation stuff here
    }

    function updateBlockSet(criteriaName, blockSet, block){
      workout.updateBlockSet(criteriaName, blockSet, block);
    }

    function moveBlock(blockIndex, direction){
      workout.moveBlock(blockIndex, direction);
      refreshDisplay();
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
      }
    }

    function duplicateBlock(blockIndex){
      workout.duplicateBlock(blockIndex, refreshDisplay);
    }

    function addExercises(){
      workout.addExercises(vm.selectedExercises, refreshDisplay);
      vm.selectedExercises = [];
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

    function saveWorkout(){
      workout.saveGymWorkout();
      $state.go('partner');
    }
  }

})();

