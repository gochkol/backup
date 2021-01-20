(function () {
  'use strict';

  angular
    .module('app.stats')
    .controller('StatsController', StatsController);

  StatsController.$inject = ['$filter', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'helpers', 'workout'];

  function StatsController($filter, globalData, userData, globalDataSet, userDataSet, helpers, workout) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.userHistory = userDataSet.userHistory;
    vm.formatTime = helpers.formatTime;
    vm.timeString = helpers.timeString;
    vm.exerciseLookup = globalDataSet.exerciseLookup;
    vm.expander = expander;
    vm.getWorkout = getWorkout;
    vm['hiding'] = {};
    vm.workouts = {};
    vm.workoutHidden = {};
    vm.filteredExercises = filteredExercises;
    vm.getBlockStats = getBlockStats;
    vm.displayName = '';
    vm.blockStats = [];
    vm.selectedExercise = [];
    vm.exerciseList = [];
    vm.bodyAreas = [];
    vm.equipments = [];
    vm.categories = [];
    vm.bodyAreas = [{name: 'All Body Areas', id: null}].concat(globalDataSet.bodyAreas);
    vm.equipments = [{name: 'All Equipment', id: null},{name: 'No Equipment', id: -1}].concat(globalDataSet.equipments);
    vm.categories = [{name: 'All Categories', id: null}].concat(globalDataSet.categories);
    vm.reverseOrder = true;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time:'},
      reps:         {name: 'Reps:'},
      breath:       {name: 'Breaths:'},
      pattern:      {name: 'Pattern:'},
      weight:       {name: 'Lb:'},
      rest:         {name: 'Rest:'}
    }
    if(workout.getMetric() === ""){
      workout.setMetric(vm.user.settings.units);
      if(vm.user.settings.units != "standard"){
        vm.criterionDisplayInfo.weight.name = 'Kg';
      }
    }else if(workout.getMetric() != "standard"){
      vm.criterionDisplayInfo.weight.name = 'Kg';
    }

    initialize();

    function initialize(){
      for(var w in vm.userHistory.workouts){
        vm.workoutHidden[vm.userHistory.workouts[w].id] = true;
      }
    }

    function getWorkout(workoutId){
      workout.getPastWorkout(vm.workouts, workoutId, converter(workoutId));
    }

    function converter(workoutId){
      return function(){vm.workouts[workoutId] = helpers.workoutConvert(vm.user.settings.units, true)(vm.workouts[workoutId]);}
    }

    function expander(wh, wo){
      if(!vm.workouts[wo.id]){
        getWorkout(wo.id)
      }
      vm.workoutHidden[wo.id] = !vm.workoutHidden[wo.id];
    }

    function getBlockStats(exerciseID){
      vm.displayName = vm.selectedExercise.name;
      userData.getBlockStats(vm, exerciseID, convertThenHide);
    }

    function convertThenHide(){
      vm.blockStats = helpers.blocksConvert(vm.blockStats, workout.getMetric());
    }

    function filteredExercises(){

      var keys = vm.exerciseKeys ? vm.exerciseKeys.toLowerCase().split(" ") : null;
      var exercises = globalDataSet.exercises;
      var exerciseStats = userDataSet.exerciseStats;

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
        for(var e in exerciseStats){
          if(exerciseStats[e].id == exercise.id){
            vm.exerciseList.push(exercise);
            break;
          }
        }
      }
      vm.exerciseList = vm.exerciseList.sort(function(a,b){if(a.name > b.name) return 1; if (a.name < b.name) return -1; return 0});
      return vm.exerciseList;
    }

  }

})();

