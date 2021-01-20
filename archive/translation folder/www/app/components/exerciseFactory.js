(function(){
  'use strict';

  angular
    .module('app')
    .factory('exerciseFactory', exerciseFactory);

  exerciseFactory.$inject = ['$interval', '$state', 'store', 'ngAudio'];

  function exerciseFactory($interval, $state, store, ngAudio){
    var currentBlock = store.get('currentBlock') || 0;
    var currentSet = store.get('currentSet') || 0;
    var caloriesBurned = store.get('caloriesBurned') || 0;
    var userWeight = 0;
    var isSet = true;
    var sound = {};
    sound.start = ngAudio.load("content/audio/2_sec_start_sound.mp3");
    sound.end = ngAudio.load("content/audio/1_sec_end_sound.mp3");
    sound.warning = ngAudio.load("content/audio/4_sec_countdown.mp3");
    var onePlay = true;
    var currentTotalTime = store.get('currentTotalTime') || 0;
    var currentTime;

    var factory = {
      getCurrentTime: getCurrentTime,
      getCurrentTotalTime: getCurrentTotalTime,
      getCurProgress: getCurProgress,
      getCaloriesBurned: getCaloriesBurned,
      getCurrentBlock: getCurrentBlock,
      getCurrentSet: getCurrentSet,
      getCurrentExercise: getCurrentExercise,
      getNextExercise: getNextExercise,
      getBG: getBG,
      start: start,
      stop: stop,
      end: end,
      complete: complete,
      startPauseClick: startPauseClick,
      skip: skip
    }

    return factory;

    function getCurrentTime(vs){
      if(!currentTime){
        if(isSet){
          currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time;
          return currentTime;
        }else{
          currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
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

    var endSound = undefined;
    function startSound(vs){
      if(angular.isDefined(endSound)) return;

      sound.start.play();
      endSound = $interval(soundStopper.bind(vs), 500);
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
      if(angular.isDefined(stop)) return;
      vs.centerButton = "6";
      vs.cyclerStopped = false;
      stop = $interval(stopper.bind(vs), 1000);
    }

    function stopper(){
      var vs = this;
      var timespan = 0;
      if(isSet){
        timespan = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
        if(vs.currentTime > 1){
          vs.currentTime -= 1;
          if(vs.currentTime == 4 && vs.user.settings.sound){
            sound.warning.play();
          }
          vs.caloriesBurned += vs.workout.blocks[currentBlock].exercise.met * 0.000126 * userWeight;
          vs.workout.workout_total_time += 1;
        }else{
          nextInterval(vs);
        }
      }else{
        timespan = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
        if(vs.currentTime > 1){
          vs.currentTime -= 1;
          if(vs.currentTime == 4 && vs.user.settings.sound){
            sound.warning.play();
          }
          vs.workout.workout_total_time += 1;
          vs.calorieBurned += 2 * 0.000126 * userWeight;
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
    }

    function complete(vs){
      if(vs.user.settings.sound){
        sound.warning.pause();
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

    function skip(){
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
        sound.warning.pause();
        sound.warning.stop();
      }
      if(angular.isDefined(stop)){
        pause(vs);
        vs.setBG[currentSet] = "bluewell";
        vs.button.text = "start";
        vs.button.color = "btn-success";
      }else{
        if(vs.user.settings.sound){
          startSound(vs);
        }else{
          this.start();
        }
        if(isSet){
          vs.setBG[currentSet] = "greenwell";
        }else{
          vs.setBG[currentSet] = "redwell";
        }
        vs.button.text = "pause";
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
        sound.end.play();
      }
     vs.setBG[currentSet] = "redwell";
      vs.color = "redtext";
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.setOrRest = "Rest";
      vs.doneOrSkip = "skip";
      vs.curOrNext = true;
      vs.message = vs.helpers.getRandomValue(vs.globalDataSet.messages) || "";
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
      vs.color = "greentext";
      isSet = true;
      vs.setOrRest = "Set";
      vs.doneOrSkip = "skip";
      vs.curOrNext = false;
      vs.setBG[currentSet] = "well";
      currentSet++;
      vs.setBG[currentSet] = "greenwell";
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.nextExercise = getNextExercise(vs.workout);
      vs.currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
      vs.curProgress = getCurProgress(vs.workout);
    }

    function nextIfLastSet(vs){
      vs.workout.blocks[currentBlock].animationInfo.photoEnd();
      vs.color = "greentext";
      isSet = true;
      vs.setOrRest = "Set";
      vs.doneOrSkip = "skip";
      vs.curOrNext = false;
      if(angular.isDefined(stop)){
        startPauseClick(vs);
      }
      currentBlock++;
      currentSet = 0;
      vs.setBG = getBG(vs.workout);
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.nextExercise = getNextExercise(vs.workout);
      vs.currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
      vs.curProgress = getCurProgress(vs.workout);
      vs.workout.blocks[currentBlock].animationInfo.photoStart();
      vs.skipAvailable = true;
    }

    function nextIfLastExercise(vs){
      vs.workout.blocks[currentBlock].animationInfo.photoEnd();
      vs.color = "greentext";
      isSet = true;
      vs.setOrRest = "Set";
      vs.doneOrSkip = "skip";
      vs.curOrNext = false;
      if(angular.isDefined(stop)){
        startPauseClick(vs);
      }
      currentBlock++;
      $state.go('summary');
    }

  }

})();
