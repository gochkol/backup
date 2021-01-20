(function(){
  'use strict';

  angular
    .module('app')
    .factory('exerciser', exerciser);

  exerciser.$inject = ['$interval', '$state', '$cordovaNetwork', 'ngAudio', 'userData', 'workout', '$ionicLoading', '$timeout'];

  function exerciser($interval, $state, $cordovaNetwork, ngAudio, userData, workout, $ionicLoading, $timeout){
    var exState = {currentBlock: 0,
                   currentSet:   0,
                   currentTime:  0,
                   currentTotalTime: 0,
                   isSet: true,
                   sound: true,
                   voice: true,
                   paused: true,
                   started: false};
    var caloriesBurned = 0
    var userWeight = 0;
    var sound = {};
    var intervals = [];
    //Beep Audio
    sound.startBeep = ngAudio.load("content/audio/2_sec_start_sound.mp3");
    sound.endBeep = ngAudio.load("content/audio/1_sec_end_sound.mp3");
    sound.warningBeep = ngAudio.load("content/audio/4_sec_countdown.mp3");
    //Voice Audio
    sound.start = ngAudio.load("content/audio/start.mp3");
    sound.pause = ngAudio.load("content/audio/workout_paused.mp3");
    sound.resume = ngAudio.load("content/audio/workout_resumed.mp3");
    sound.countdown = ngAudio.load("content/audio/5_to_1.mp3");
    sound.begin = ngAudio.load("content/audio/begin.mp3");
    sound.rest = ngAudio.load("content/audio/rest.mp3");
    //sound.switchSides = ngAudio.load("content/audio/rest.mp3");
    //sound.finished = ngAudio.load("content/audio/rest.mp3");

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
      complete: complete,
      startPauseClick: startPauseClick,
      skip: skip,
      clear: clear,
      initializeState: initializeState,
      finishWorkout: finishWorkout,
      setAudioSettings: setAudioSettings
    }

    return factory;

    //Audio functions
    function playStart(){
      if(!exState.sound){return;};
      if(exState.currentSet == 0){
        if(exState.voice){
          sound.start.play();
        }else{
          sound.startBeep.play();
        }
      }else{
        if(exState.voice){
          sound.begin.play();
        }else{
          sound.startBeep.play();
        }
      }
    }

    function playWarning(){
      if(!exState.sound){return;};
      if(exState.voice){
        sound.countdown.play();
      }else{
        sound.warningBeep.play();
      }
    }

    function playEnd(){
      if(!exState.sound){return;};
      if(exState.voice){
        sound.rest.play();
      }else{
        sound.endBeep.play();
      }
    }

    function playPause(){
      if(!exState.sound){return;};
      if(exState.voice){
        sound.pause.play();
      }else{
        sound.endBeep.play();
      }

    }

    function playResume(){
      if(!exState.sound){return;};
      if(exState.voice){
        sound.resume.play();
      }else{
        sound.startBeep.play();
      }
    }

    function playSwitch(){
      if(!exState.sound){return;};
      if(exState.voice){
        sound.countdown.play();
      }else{
        sound.warningBeep.play();
      }
    }


    function getCurrentTime(vs){
      if(vs.workout.blocks.length == 0){
        exState.currentTime = 0;
        return exState.currentTime;
      }else{
        var cur = vs.workout['blocks'][exState.currentBlock]['block_sets'][exState.currentSet].criterion;
      }

      if(!exState.currentTime){
        if(!exState.isSet){
          exState.currentTime = cur.time - cur.rest;
        }else{
          exState.currentTime = cur.rest;
        }
      }

      return exState.currentTime;
    }

    function getCurrentTotalTime(){
      return exState.currentTotalTime;
    }

    function getCurProgress(workout){
      return (exState.currentBlock/workout.blocks.length)*100 + (exState.currentSet/(workout.blocks[exState.currentBlock].block_sets.length * workout.blocks.length))*100;
    }

    function getCaloriesBurned(){
      return caloriesBurned;
    }

    function getCurrentBlock(){
      return exState.currentBlock;
    }

    function getCurrentSet(){
      return exState.currentSet;
    }

    function getCurrentExercise(workout){
      if(exState.isSet){
        return workout.blocks[exState.currentBlock].exercise.name + " Set " + (exState.currentSet+1);
      }else{
        return "Rest";
      }
    }

    function getIsSet(){
      return exState.isSet;
    }

    function getNextExercise(workout){
      if(workout.blocks.length != 0){
        var blocks = workout.blocks;
        var curBlock = workout.blocks[exState.currentBlock];
        var nextBlock = workout.blocks[exState.currentBlock+1];

        if((exState.currentSet+1) >= curBlock.block_sets.length){
          if((exState.currentBlock + 1) >= blocks.length){
            return "Workout Finished";
          }else{
            if(nextBlock.block_sets[0].criterion.reps != undefined){
              if(nextBlock.block_sets[0].criterion.weight != undefined){
                return nextBlock.exercise.name + " Set 1" + "/" + nextBlock.block_sets.length + " (Reps: " + nextBlock.block_sets[0].criterion.reps + "," + " Weight: " + nextBlock.block_sets[0].criterion.weight + ")";
              }else{
                return nextBlock.exercise.name + " Set 1" + "/" + nextBlock.block_sets.length + " (Reps: " + nextBlock.block_sets[0].criterion.reps + ")";
              }
            }else{
              if(nextBlock.block_sets[0].criterion.weight != undefined){
                return nextBlock.exercise.name + " Set 1" + "/" + nextBlock.block_sets.length + " (Duration: " + nextBlock.block_sets[0].criterion.duration + " sec," + " Weight: " + nextBlock.block_sets[0].criterion.weight + ")";
              }else{
                return nextBlock.exercise.name + " Set 1" + "/" + nextBlock.block_sets.length + " (Duration: " + nextBlock.block_sets[0].criterion.duration + " sec)";
              }
            }
          }
        }else{
          return curBlock.exercise.name + " Set " + (exState.currentSet+2) + "/" + curBlock.block_sets.length;
        }
      }else{
        return "No Exercises";
      }
    }

    function getBG(workout){
      var tmpBG = [];
      for(var s in workout.blocks[exState.currentBlock].block_sets){
        s == exState.currentSet ? tmpBG.push("bluewell") : tmpBG.push("well");
      }
      return tmpBG;
    }

    function setUserWeight(w){
      w!=0 ? userWeight = w : userWeight = 150;
    }

    //Start of Delay for sounds before timer starts
    var endDelay = undefined;
    function soundDelay(vs){
      if(angular.isDefined(endDelay)) return;
      playStart();
      endDelay = $interval(stopDelay.bind(vs), 1000);
    }

    function stopDelay(){
      if(angular.isDefined(endDelay)){
        $interval.cancel(endDelay);
        endDelay = undefined;
        start(this);
      }
    }
    //End of Delay for sounds before timer starts

    //Start of Timer for workout countdown
    var stop = undefined;
    function start(vs){
      if(angular.isDefined(stop)) return;
      vs.centerButton = "6";
      vs.cyclerStopped = false;
      stop = $interval(stopper.bind(vs), 10);
    }

    function stopper(){
      var vs = this;
      var timespan = 0;
      var criterion = vs.workout.blocks[exState.currentBlock].block_sets[exState.currentSet].criterion;
      exState.isSet ? timespan = 100*(criterion.time - criterion.rest) : timespan = 100*criterion.rest;
      //Old Version
      if(exState.currentTime > 0){
        exState.currentTime--;
        vs.currentTime = (exState.currentTime - (exState.currentTime%100))/100;
        addCals(vs);
        if(halfTime(timespan, exState.currentTime) && isIso(vs)){
          playSwitch(vs);
        }
        if(dangerZone()){
          playWarning();
        }
      }else{
        nextInterval(vs);
      }
    }

    function end(){
      if(angular.isDefined(stop)){
        $interval.cancel(stop);
        stop = undefined;
      }
    }

    function halfTime(span, time){
      if(span > time+time && exState.notHalf){
       exState.notHalf = false;
       return true;
      }else{
        exState.notHalf = true;
        return false;
      }
    }

    function isIso(vs){
      if(vs.workout.blocks[exState.currentBlock].exercise.name.includes('(ISO)')){
        return true;
      }else{
        return false;
      }
    }

    function dangerZone(){
      if(exState.currentTime == 500 && !exState.inDanger){
        exState.inDanger = true;
        return true;
      }else{
        exState.inDanger = false;
        return false;
      }
    }

    function addCals(vs){
      var met = 0;
      exState.isSet ? met = vs.workout.blocks[exState.currentBlock].exercise.met : 2.0;
      vs.caloriesBurned += met * 0.000126 * userWeight;
    }
    //End of Timer for workout countdown

    function complete(){
      //Ends current set or rest and starts the next period
    }

    function startPauseClick(vs){
      //Starts of pauses the cycler
      if(angular.isDefined(stop)){
        //this happens when the timer is going
        end();
        playPause();
        stylePaused(vs);
      }else{
        //this happens when the timer is stopped
        soundDelay(vs);
        styleStarted(vs);
      }
    }

    function stylePaused(vs){
      vs.centerButton = "12";
      vs.cyclerStopped = true;
      vs.setBG[exState.currentSet] = "calm-light-bg";
      vs.button.text = "ion-play";
      vs.button.textTwo = "Start";
      vs.button.color = "btn-success";
      vs.navcolor = "tabs-background-calm";
    }

    function styleStarted(vs){
      if(exState.isSet){
        vs.setBG[exState.currentSet] = "balanced-bg";
        vs.navcolor = "tabs-background-balanced";
      }else{
        vs.setBG[exState.currentSet] = "assertive-bg";
        vs.navcolor = "tabs-background-assertive";
      }
      vs.button.text = "ion-pause";
      vs.button.textTwo = "Pause";
      vs.button.color = "btn-primary";
      vs.skipAvailable = false;
    }

    function nextInterval(vs){
      if(exState.isSet){
        nextIfSet(vs);
      }else{
        if(exState.currentSet == (vs.workout.blocks[exState.currentBlock].block_sets.length - 1)){
          if(exState.currentBlock == (vs.workout.blocks.length -1)){
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
      vs.message = vs.helpers.getRandomValue(vs.globalDataSet.motivations) || "";
      vs.setBG[exState.currentSet] = "assertive-bg";
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
      vs.currentTime = vs.workout.blocks[exState.currentBlock].block_sets[exState.currentSet].criterion.rest;
      exState.isSet = false;
    }

    function nextIfRest(vs){
      vs.color = "balanced";
      vs.navcolor = "tabs-background-balanced";
      exState.isSet = true;
      vs.setOrRest = "Set";
      vs.doneOrSkip = "Skip";
      vs.curOrNext = false;
      vs.setBG[exState.currentSet] = "calm-light-bg-opacity";
      exState.currentSet++;
      vs.setBG[exState.currentSet] = "balanced-bg";
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.nextExercise = getNextExercise(vs.workout);
      vs.currentTime = vs.workout.blocks[exState.currentBlock].block_sets[exState.currentSet].criterion.time - vs.workout.blocks[exState.currentBlock].block_sets[exState.currentSet].criterion.rest;
      vs.curProgress = getCurProgress(vs.workout);
    }

    function nextIfLastSet(vs){
      if(vs.workout.blocks[exState.currentBlock].animationInfo.photoEnd){
        vs.workout.blocks[exState.currentBlock].animationInfo.photoEnd();
      }
      vs.color = "balanced";
      vs.navcolor = "tabs-background-balanced";
      exState.isSet = true;
      vs.setOrRest = "Set";
      vs.doneOrSkip = "Skip";
      vs.curOrNext = false;
      exState.currentBlock++;
      exState.currentSet = 0;
      vs.setBG = getBG(vs.workout);
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.nextExercise = getNextExercise(vs.workout);
      vs.currentTime = vs.workout.blocks[exState.currentBlock].block_sets[exState.currentSet].criterion.time - vs.workout.blocks[exState.currentBlock].block_sets[exState.currentSet].criterion.rest;
      vs.curProgress = getCurProgress(vs.workout);
      vs.workout.blocks[exState.currentBlock].animationInfo.photoStart();
      vs.skipAvailable = true;
    }

    function nextIfLastExercise(vs){
      if(angular.isDefined(vs.workout.blocks[exState.currentBlock].animationInfo.photoStop)){
        vs.workout.blocks[exState.currentBlock].animationInfo.photoEnd();
      }
      vs.color = "balanced";
      vs.navcolor = "tabs-background-balanced";
      exState.isSet = true;
      vs.setOrRest = "Set";
      vs.doneOrSkip = "Skip";
      vs.curOrNext = false;
      exState.currentBlock++;
      vs.workout.total_time_seconds = vs.workout.workout_total_time;
      workout.setWorkout(vs.workout);
      clear();
    }

    function skip(){
      //Moves current exercise to the end
    }

    function clear(){
      //Clears all data and resets exerciser
    }

    function initializeState(){
      //Initalizes exercise state
      exState.currentBlock = userData.setStateData('currentBlock', 0);
      exState.currentSet = userData.setStateData('currentSet', 0);
      exState.caloriesBurned = userData.setStateData('caloriesBurned', 0);
      exState.currentTotalTime = userData.setStateData('caloriesBurned', 0);
    }

    function finishWorkout(vs){
      //Ends workout and removes all uncompleted exercises
      var work = vs.workout;
      var block = work.blocks[exState.currentBlock];
      var firstSet = (exState.currentSet == 0);
      var mod=1;
      end();
      //delete all unfinished sets in the current block
      if(exState.isSet && !firstSet){
        block.block_sets.splice(exState.currentSet, block.block_sets.length-exState.currentSet);
      }else{
        if(!exState.isSet && exState.currentSet+1 < block.block_sets.length){
          block.block_sets.splice(exState.currentSet+1, block.block_sets.length-exState.currentSet-1);
        }
        if(exState.isSet && firstSet){
          mod--;
        }
      }
      workout.updateBlock(block);

      //delete all unfinished blocks in the current routine
      for(var j = (exState.currentBlock+mod); j < work.blocks.length;){
        workout.deleteBlock(j);
      }

      //cleanup and end the workout and move to summary page
      work['total_time_seconds'] = work['workout_total_time'];
      workout.setWorkout(work);
      clear();
      vm.shower = 'summary';
    }

    function setAudioSettings(settings){
      exState.sound = settings.sound;
      settings.voice === "voice" ? exState.voice = true : exState.voice = false;
    }

  }

})();
