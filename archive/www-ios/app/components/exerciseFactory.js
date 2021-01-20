(function(){
  'use strict';

  angular
    .module('app')
    .factory('exerciser', exerciser);

  exerciser.$inject = ['$interval', '$state', '$cordovaNetwork', '$cordovaMedia', 'userData', 'workout', '$ionicLoading', '$timeout'];

  function exerciser($interval, $state, $cordovaNetwork, $cordovaMedia, userData, workout, $ionicLoading, $timeout){
    var currentBlock = userData.getStateData('currentBlock', 0);
    var currentSet = userData.getStateData('currentSet', 0);
    var caloriesBurned = userData.getStateData('caloriesBurned', 0);
    var currentTotalTime = userData.getStateData('currentTotalTime', 0);
    var userWeight = 150;
    var isSet = true;
    var sound = {start: null, end: null, warning: null};
    var intervals = [];
    var onePlay = true;
    var currentTime;
    var iOSPlayOptions = {
      numberOfLoops: 1,
      playAudioWhenScreenIsLocked : true
    }

    document.addEventListener('deviceready', function () {
      sound.start = $cordovaMedia.newMedia("content/audio/2_sec_start_sound.mp3", null, null, null);
      sound.end = $cordovaMedia.newMedia("content/audio/1_sec_end_sound.mp3", null, null, null);
      sound.warning = $cordovaMedia.newMedia("content/audio/4_sec_countdown.mp3", null, null, null);
    }, false);

    var factory = {
      getCurrentTime: getCurrentTime,
      getCurrentTotalTime: getCurrentTotalTime,
      getCurProgress: getCurProgress,
      getCaloriesBurned: getCaloriesBurned,
      getCurrentBlock: getCurrentBlock,
      getCurrentSet: getCurrentSet,
      getCurrentExercise: getCurrentExercise,
      getIsSet: getIsSet,
      getNextExercise: getNextExercise,
      getBG: getBG,
      setUserWeight: setUserWeight,
      start: start,
      stop: stop,
      end: end,
      complete: complete,
      startPauseClick: startPauseClick,
      skip: skip,
      clear: clear,
      initializeState: initializeState,
      finishWorkout: finishWorkout
    }

    return factory;

	  function getIsSet(){
	    return isSet;
	  }

    function initializeState(){
      currentBlock = userData.setStateData('currentBlock', 0);
      userData.getStateData('currentBlock');
      currentSet = userData.setStateData('currentSet', 0);
      caloriesBurned = userData.setStateData('caloriesBurned', 0);
      currentTotalTime = userData.setStateData('caloriesBurned', 0);
    }

    function getCurrentTime(vs){
      if(!currentTime){
        if(isSet){
          currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
          return currentTime;
        }else{
          currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
        }
      }else{
        return currentTime;
      }
    }

    function getCurrentTotalTime(){
      return currentTotalTime;
    }

    function getCurProgress(workout){
      return (currentBlock/workout.blocks.length)*100 + (currentSet/(workout.blocks[currentBlock].block_sets.length * workout.blocks.length))*100;
    }

    function getCaloriesBurned(){
      return caloriesBurned;
    }

    function getCurrentBlock(){
      return currentBlock;
    }

    function getCurrentSet(){
      return currentSet;
    }

    function getCurrentExercise(workout){
      if(isSet){
        return workout.blocks[currentBlock].exercise.name + " Set " + (currentSet+1);
      }else{
        return "Rest";
      }
    }

    function getNextExercise(workout){
      if((currentSet+1) >= workout.blocks[currentBlock].block_sets.length){
        if((currentBlock + 1) >= workout.blocks.length){
          return "Workout Finished";
        }else{
          return workout.blocks[currentBlock + 1].exercise.name + " Set 1" + "/" + workout.blocks[currentBlock].block_sets.length ;
        }
      }else{
        return workout.blocks[currentBlock].exercise.name + " Set " + (currentSet+2) + "/" + workout.blocks[currentBlock].block_sets.length;
      }
    }

    function getBG(workout){
      var tmpBG = [];
      for(var s in workout.blocks[currentBlock].block_sets){
        s == currentSet ? tmpBG.push("bluewell") : tmpBG.push("well");
      }
      return tmpBG;
    }

    function setUserWeight(w){
      w!=0 ? userWeight = w : userWeight = 150;
    }

    var endSound = undefined;
    function startSound(vs){
      var interval;
      if(angular.isDefined(endSound)) return;

      sound.start.play(iOSPlayOptions);
      endSound = interval = $interval(soundStopper.bind(vs), 500);
      intervals.push(interval);
    }

    function soundStopper(){
      if(onePlay){
        onePlay = false;
      }else{
        onePlay = true;
        stopSound(this);
      }
    }

    function stopSound(vs){
      if(angular.isDefined(endSound)){
        $interval.cancel(endSound);
        endSound = undefined;
        start(vs);
      }
    }

    var stop = undefined;
    function start(vs){
      var interval;
      if(angular.isDefined(stop)) return;
      vs.centerButton = "6";
      vs.cyclerStopped = false;
      stop = interval = $interval(stopper.bind(vs), 1000);
      intervals.push(interval);
    }

    function stopper(){
      var vs = this;
      var timespan = 0;
      if(isSet){
        timespan = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
        if(vs.currentTime > 1){
          vs.currentTime -= 1;
          if(vs.currentTime == 4 && vs.user.settings.sound){
            sound.warning.play(iOSPlayOptions);
          }
          vs.caloriesBurned += vs.workout.blocks[currentBlock].exercise.met * 0.000126 * userWeight;
          // TODO, below is a very hacky temporary fix.  This factory and the controller along with
          // the workoutFactpory need to be refactored and cleaned up.  The interface between the workout and the
          // exercise cycler is fuzzy at best.
          vs.workout.calories_burned = vs.caloriesBurned;
          vs.workout.workout_total_time += 1;
        }else{
          nextInterval(vs);
        }
      }else{
        timespan = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
        if(vs.currentTime > 1){
          vs.currentTime -= 1;
          if(vs.currentTime == 4 && vs.user.settings.sound){
            sound.warning.play(iOSPlayOptions);
          }
          vs.workout.workout_total_time += 1;
          vs.caloriesBurned += 2 * 0.000126 * userWeight;
          vs.workout.calories_burned = vs.caloriesBurned;
        }else{
          nextInterval(vs);
        }
      }
    }

    function end(fun){
      if(!angular.isDefined(fun)){
        fun = function(){};
      }
      if(angular.isDefined(stop)){
        $interval.cancel(stop);
        stop = undefined;
        fun();
      }

      if(angular.isDefined(endSound)){
        $interval.cancel(endSound);
        endSound = undefined;
      }

      if(sound.warning && sound.warning.stop){
        sound.warning.stop();
      }
      if(sound.end && sound.end.stop){
        sound.end.stop();
      }
    }

    function complete(vs){
      if(vs.user.settings.sound){
        sound.warning.stop();
      }
      if(isSet){
        vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time -= vs.currentTime;
        nextInterval(vs);
      }else{
        vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time -= vs.currentTime;
        vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest -= vs.currentTime;
        nextInterval(vs);
      }
    }

    function skip(vs){
      var blocks = vs.workout.blocks;
      if(blocks[currentBlock].animationInfo.photoEnd){
        blocks[currentBlock].animationInfo.photoEnd();
      }
      var block = blocks.splice(currentBlock, 1)[0];
      var needUpdate;

      blocks.push(block);
      for(var i = 0; i < blocks.length; i++){
        needUpdate = (blocks[i].rank != i+1) ? true : false;
        if(needUpdate){
          workout.updateBlock(blocks[i]);
        }
      }

      vs.color = "balanced";
      vs.navcolor = "tabs-background-balanced";
      isSet = true;
      vs.setOrRest = "Set";
      vs.doneOrSkip = "Skip";
      vs.curOrNext = false;
      if(angular.isDefined(stop)){
        startPauseClick(vs);
      }
      vs.setBG = getBG(vs.workout);
      currentSet = 0;
      userData.setStateData('currentSet', currentSet);
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.nextExercise = getNextExercise(vs.workout);
      vs.currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
      vs.curProgress = getCurProgress(vs.workout);
      vs.workout.blocks[currentBlock].animationInfo.photoStart();
      vs.skipAvailable = true;

    }

    function pause(vs){
      function changes(){
        vs.centerButton = "12";
        vs.cyclerStopped = true;
      }
      end(changes.bind(this));
    }

    function startPauseClick(vs){
      if(vs.user.settings.sound){
        sound.warning.stop();
      }
      if(angular.isDefined(stop)){
        pause(vs);
        vs.setBG[currentSet] = "calm-light-bg";
        vs.button.text = "ion-play";
        vs.button.textTwo = "Start";
        vs.button.color = "btn-success";
        vs.navcolor = "tabs-background-calm";
      }else{
        if(vs.user.settings.sound){
          startSound(vs);
        }else{
          start(vs);
        }
        if(isSet){
          vs.setBG[currentSet] = "balanced-bg";
          vs.navcolor = "tabs-background-balanced";
        }else{
          vs.setBG[currentSet] = "assertive-bg";
          vs.navcolor = "tabs-background-assertive";
        }
        vs.button.text = "ion-pause";
        vs.button.textTwo = "Pause";
        vs.button.color = "btn-primary";
        vs.skipAvailable = false;
      }
    }

    function nextInterval(vs){
      if(isSet){
        nextIfSet(vs);
      }else{
        if(currentSet == (vs.workout.blocks[currentBlock].block_sets.length - 1)){
          if(currentBlock == (vs.workout.blocks.length -1)){
            nextIfLastExercise(vs);
          }else{
            nextIfLastSet(vs);
          }
        }else{
          nextIfRest(vs);
        }
      }
    }

    function nextIfSet(vs){
      if(vs.user.settings.sound){
        sound.end.play(iOSPlayOptions);
      }
      vs.message = vs.helpers.getRandomValue(vs.globalDataSet.motivations) || "";
      vs.setBG[currentSet] = "assertive-bg";
      vs.color = "assertive";
      vs.navcolor = "tabs-background-assertive";
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.setOrRest = "Rest";
      vs.doneOrSkip = "Skip";
      vs.curOrNext = true;
      flash.classList.add('flash');
      setTimeout(function(){
        flash.setAttribute("class", "");
      }, 2000);

      vs.currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
      isSet = false;
    }

    function nextIfRest(vs){
      startPauseClick(vs);
      startPauseClick(vs);
      vs.color = "balanced";
      vs.navcolor = "tabs-background-balanced";
      isSet = true;
      vs.setOrRest = "Set";
      vs.doneOrSkip = "Skip";
      vs.curOrNext = false;
      vs.setBG[currentSet] = "calm-light-bg";
      currentSet++;
      userData.setStateData('currentSet', currentSet);
      vs.setBG[currentSet] = "balanced-bg";
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.nextExercise = getNextExercise(vs.workout);
      vs.currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
      vs.curProgress = getCurProgress(vs.workout);
    }

    function nextIfLastSet(vs){
      if(vs.workout.blocks[currentBlock].animationInfo.photoEnd){
        vs.workout.blocks[currentBlock].animationInfo.photoEnd();
      }
      vs.color = "balanced";
      vs.navcolor = "tabs-background-balanced";
      isSet = true;
      vs.setOrRest = "Set";
      vs.doneOrSkip = "Skip";
      vs.curOrNext = false;
      if(angular.isDefined(stop)){
        startPauseClick(vs);
      }
      currentBlock++;
      userData.setStateData('currentBlock', currentBlock);
      currentSet = 0;
      userData.setStateData('currentSet', currentSet);
      vs.setBG = getBG(vs.workout);
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.nextExercise = getNextExercise(vs.workout);
      vs.currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
      vs.curProgress = getCurProgress(vs.workout);
      vs.workout.blocks[currentBlock].animationInfo.photoStart();
      vs.skipAvailable = true;
      onePlay=true;
      paused=true;
      if(vs.user.settings.automatic){
        startPauseClick(vs);
      }
    }

    function nextIfLastExercise(vs){
      $ionicLoading.show({
        template: 'Finishing Workout...'
      });
      if(angular.isDefined(vs.workout.blocks[currentBlock].animationInfo.photoStop)){
        vs.workout.blocks[currentBlock].animationInfo.photoEnd();
      }
      vs.color = "balanced";
      vs.navcolor = "tabs-background-balanced";
      isSet = true;
      vs.setOrRest = "Set";
      vs.doneOrSkip = "Skip";
      vs.curOrNext = false;
      if(angular.isDefined(stop)){
        startPauseClick(vs);
      }
      currentBlock++;
      userData.setStateData('currentBlock', currentBlock);
      vs.workout.total_time_seconds = vs.workout.workout_total_time;
      workout.setWorkout(vs.workout);
      clear();
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      if($state.current.name === 'nav.exercise'){
        $state.go('summary').then(function(){$ionicLoading.hide()});
      }else{
        $state.go('guestNav.summary').then(function(){$ionicLoading.hide()});
      }
    }

    function clear(){
      for (var i = 0; i < intervals.length; i++){
        $interval.cancel(intervals[i]);
      }
      intervals.length = 0;
      currentBlock = 0;
      currentSet = 0;
      caloriesBurned = 0;
      currentTotalTime = 0;
      isSet = true;
      currentTime = 0;
      if(sound.start && sound.start.stop){
        sound.start.stop();
      }
      if(sound.end && sound.end.stop){
        sound.end.stop();
      }
      if(sound.warning && sound.warning.stop){
        sound.warning.stop();
      }
    }

    function finishWorkout(vs){
      //find out what current set and current block you are on
      var work = vs.workout;
      var block = work.blocks[currentBlock];
      var firstSet = (currentSet == 0);
      var mod=1;
      end();
      //delete all unfinished sets in the current block
      if(isSet && !firstSet){
        block.block_sets.splice(currentSet, block.block_sets.length-currentSet);
      }else{
        if(!isSet && currentSet+1 < block.block_sets.length){
          block.block_sets.splice(currentSet+1, block.block_sets.length-currentSet-1);
        }
        if(isSet && firstSet){
          mod--;
        }
      }
      workout.updateBlock(block);

      //delete all unfinished blocks in the current routine
      for(var j = (currentBlock+mod); j < work.blocks.length;){
        workout.deleteBlock(j);
      }

      //cleanup and end the workout and move to summary page
      work.total_time_seconds = work.workout_total_time;
      workout.setWorkout(work);
      clear();
      $state.go('summary');
    }

  }

})();
