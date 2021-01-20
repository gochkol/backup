(function(){
  'use strict';

  angular
    .module('app')
    .factory('workout', workout);

  workout.$inject = ['$q', '$rootScope', '$interval', 'modalUtils', 'data', 'globalData'];

  function workout($q, $rootScope, $interval, modalUtils, data, globalData) {
    var dataInfo;
    var dataInfoLookup = {};
    var quickRequest = null;
    var requestType;
    var favoriteId = null;
    var globalDataSet;
    var exerciseLookup;
    var workout;
    var factory = {
      initialize: initialize,
      setCustomRequest: setCustomRequest,
      setQuickRequest: setQuickRequest,
      setFavoriteRequest: setFavoriteRequest,
      getWorkout: getWorkout,
      updateBlockSet: updateBlockSet,
      updateBlock: updateBlock,
      updateWorkout: updateWorkout,
      clearWorkout: clearWorkout,
      deleteBlock: deleteBlock,
      moveBlock: moveBlock,
      swapBlock: swapBlock,
      duplicateBlock: duplicateBlock,
      addRandomBlock: addRandomBlock,
      addExercises: addExercises,
      deleteLastSet: deleteLastSet,
      duplicateLastSet: duplicateLastSet
    }
    return factory;

    function initialize(){
      dataInfo = [
        {name: 'quickWorkout', bind_as: 'workout', target: 'quick_workout', store: true},
        {name: 'customWorkout', bind_as: 'workout', target: 'custom_workout', store: true},
        {name: 'favoriteWorkout', bind_as: 'workout', target: 'favorite_workout', store: true},
        {name: 'workout', bind_as: 'workout', target: 'workout'},
        {name: 'block', target: 'block'},
        {name: 'swapBlock', target: 'swap'},
        {name: 'duplicateBlock', target: 'duplicate'},
        {name: 'randomBlock', target: 'random'},
        {name: 'addExercises', target: 'add_exercises'}
      ]

      for(var i = 0; i < dataInfo.length; i++){
        var info = dataInfo[i];
        dataInfoLookup[info.name] = info;
      }
    }

    function initializeWorkout(){
      addExerciseIds();
      addEquipmentIds();
      addPhotos();
      addExerciseToBlocks();
      calculateTotalTime();
    }

    function moveBlock(blockIndex, direction){
      var blocks = workout.blocks;
      var increment = direction === 'down' ? 1 : -1;
      var block = blocks.splice(blockIndex, 1)[0];

      blocks.splice(blockIndex+increment, 0, block);
      for (var i = 0; i < blocks.length; i++){
        var needUpdate = (blocks[i].rank != i+1) ? true : false;
        blocks[i].rank = i+1;
        if (needUpdate){
          updateBlock(blocks[i]);
        }
      }
    }

    function swapBlock(blockIndex, callAfter){
      var block = workout.blocks[blockIndex];

      data.postData(dataInfoLookup['swapBlock'], {block_id: block.id}).then(
        function(responseData){
          workout.blocks[blockIndex] = responseData.block;
          initializeWorkout();
          callAfter();
        }
      );
    }

    function deleteLastSet(blockIndex){
      var block = workout.blocks[blockIndex];

      block.block_sets.splice(block.block_sets.length-1, 1);
      updateBlock(block);
      initializeWorkout();
    }

    function duplicateLastSet(blockIndex){
      var block = workout.blocks[blockIndex];
      var blockSet = block.block_sets[block.block_sets.length-1];
      var newBlockSet = JSON.parse(JSON.stringify(blockSet));

      block.block_sets.push(newBlockSet);
      updateBlock(block);
      initializeWorkout();
    }

    function duplicateBlock(blockIndex, callAfter){
      var block = workout.blocks[blockIndex];

      data.postData(dataInfoLookup['duplicateBlock'], {block_id: block.id}).then(
        function(responseData){
          workout.blocks.splice(blockIndex, 0, responseData.block);
          initializeWorkout();
          callAfter();
        }
      );
    }

    function addExercises(exercises, callAfter){
      var exerciseIds = [];

      for (var i = 0; i < exercises.length; i++){
        exerciseIds.push(exercises[i].id);
      }

      data.postData(dataInfoLookup['addExercises'], {workout_id: workout.id, exercise_ids: exerciseIds}).then(
        function(responseData){
          for (var i = 0; i < responseData.blocks.length; i++){
            var block = responseData.blocks[i];
            workout.blocks.push(block);
          }
          initializeWorkout();
          callAfter();
        }
      );
    }

    function addRandomBlock(callAfter){
      data.postData(dataInfoLookup['randomBlock'], {workout_id: workout.id}).then(
        function(responseData){
          workout.blocks.push(responseData.block);
          initializeWorkout();
          callAfter();
        }
      );
    }

    function deleteBlock(blockIndex){
      var block = workout.blocks[blockIndex];
      data.deleteData(dataInfoLookup['block'], {block_id: block.id});
      workout.blocks.splice(blockIndex, 1);
      initializeWorkout();
    }

    function updateBlock(block){
      data.patchData(dataInfoLookup['block'], {block: block});
      initializeWorkout();
    }


    function updateBlockSet(criteriaName, blockSet, block){
      var criterion = blockSet.criterion;

      switch (criteriaName){
        case 'reps':
        case 'breath':
        case 'pattern':
        case 'duration':
          criterion.time = criterion.rate * criterion[criteriaName] + criterion.rest;
          break;
        case 'rest':
          criterion.time = criterion[criterion.mode] * criterion.rate + criterion[criteriaName];
          break;
      }
      updateBlock(block);
    }

    function updateWorkout(){
      for(var b in workout.blocks){
        data.patchData(dataInfoLookup['block'], {block:workout.blocks[b]});
      }
      initializeWorkout();
    }

    function clearWorkout(){
      workout = undefined;
    }

    function calculateTotalTime(){
      var total_time = 0;
      for (var i = 0; i < workout.blocks.length; i++){
        var block = workout.blocks[i];
        for (var j = 0; j < block.block_sets.length; j++){
          var block_set = block.block_sets[j];
          total_time += block_set.criterion.time;
        }
      }
      workout.total_time_seconds = total_time;
    }

    function addExerciseIds(){
      var exerciseIdLookup = {};
      for (var i = 0; i < workout.blocks.length; i++){
        var exerciseId = workout.blocks[i].block_sets[0].exercise_id;
        exerciseIdLookup[exerciseId] = 1;
      }
      workout.exercise_ids = Object.keys(exerciseIdLookup);
    }

    function addExerciseToBlocks(){
      for (var i = 0; i < workout.blocks.length; i++){
        var block = workout.blocks[i];
        block.exercise = exerciseLookup[block.block_sets[0].exercise_id];
      }
    }

    function addEquipmentIds(){
      var equipmentLookup = {};

      workout.equipment_ids = [];
      for (var i = 0; i < workout.exercise_ids.length; i++){
        var exercise = exerciseLookup[workout.exercise_ids[i]];
        for (var j = 0; j < exercise.equipment_ids.length; j++){
          equipmentLookup[exercise.equipment_ids[j]] = true;
        }
      }

      for (var key in equipmentLookup){
        workout.equipment_ids.push(key*1);
      }
    }

    function addPhotos(){
      for (var i = 0; i < workout.blocks.length; i++){
        var blockSet = workout.blocks[i].block_sets[0];
        var exercise = globalDataSet.exerciseLookup[blockSet.exercise_id];
        var animationSequence = exercise.animation.sequence;
        var split = animationSequence.split('__');
        var animationInfo = {
          current: 0,
          firstLoop: true,
          images: exercise.animation.images,
          imageOrder: [],
          imageTiming: [],
          loopBack: parseInt(split[1]) - 1,
          photoStart: photoStart,
          photoStop: undefined,
          photoEnd: photoEnd,
          stopper: stopper
        };

        split = split[0].split('_');
        for (var j = 0; j < split.length/2; j++){
          animationInfo.imageOrder.push(split[j*2]);
          animationInfo.imageTiming.push(split[j*2+1]);
        }

        function photoStart(){
          if(angular.isDefined(this.photoStop)) return;
          this.photoStop = $interval(this.stopper.bind(this), this.imageTiming[this.current]);
        }

        function stopper(){
          if(this.firstLoop){this.firstLoop = false;}
          if(this.current < this.images.length-1){
            this.current += 1;
          }else{
            this.current = this.loopBack;
          }
        }

        function photoEnd(){
          if(angular.isDefined(this.photoStop)){
            $interval.cancel(this.photoStop);
            this.photoStop = undefined;
          }
        }

        workout.blocks[i].animationInfo = animationInfo;
      }
    }

    function setQuickRequest(request){
      requestType = 'quickWorkout';
      quickRequest = request;
      favoriteId = null;
    }

    function setCustomRequest(){
      requestType = 'customWorkout';
      quickRequest = null;
      favoriteId = null;
    }

    function setFavoriteRequest(favorite){
      requestType = 'favoriteWorkout';
      quickRequest = null;
      favoriteId = favorite.id;
    }

    function getWorkout(){
      var deferred = $q.defer();

      if(!workout){
        globalData.getAll().then(
          function(dataSet){
            globalDataSet = dataSet;
            exerciseLookup = dataSet.exerciseLookup;
            deferred.resolve(createWorkout());
          }
        );
        return deferred.promise;
      }else{
        return workout;
      }
    }

    function createWorkout(){
      var postData = {};

      switch(requestType){
      case 'customWorkout':
        postData ={};
        break;
      case 'quickWorkout':
        postData = {
          body_area_ids: quickRequest.bodyAreaIds,
          total_time: quickRequest.workoutTime,
          category_id: quickRequest.categoryId,
          location_id: quickRequest.locationId,
          intensity: quickRequest.intensity
        };
        break;
      case 'favoriteWorkout':
        postData = {favorite_id: favoriteId};
        break;
      }

      return data.postData(dataInfoLookup[requestType], postData, handleWorkoutError).then(
        function(responseData){
          workout = responseData;
          workout.custom = (requestType == 'customWorkout') ? true : false;
          initializeWorkout();
          return workout;
        }
      );
    }

    function handleWorkoutError(response){
      modalUtils.launch('error', 'Could not create workout');
    }
  }
})();


