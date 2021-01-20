(function(){
  'use strict';

  angular
    .module('app')
    .factory('exerciser', exerciser);

  exerciser.$inject = ['$interval', '$state', 'ngAudio', 'userData', 'workout', '$ionicLoading', '$timeout'];

  function exerciser($interval, $state, ngAudio, userData, workout, $ionicLoading, $timeout){
    var exState = {block: 0,
                   set:   0,
                   span:  0,
                   time:  0,
                   totalTime: 0,
                   isSet: true,
                   sound: true,
                   voice: true,
                   paused: true,
                   started: false
                   calories: 0,
                   weight: 0};
    var sound = {voice: {
                  start: null,
                  pause: null,
                  resume: null,
                  countdown: null,
                  begin: null,
                  switchSides: null,
                  finished: null},
                beep: {
                  start: null,
                  end: null,
                  warning: null}
                };
    var intervals = [];

    var factory = {
      startPause: startPause,
      skip,
      complete
    }

    return factory;

    function startPause(){
      //Function attached to start/pause button
      if(exState.started){
        if(exState.paused){
          begin();
        }else{
          pause();
        }
      }else{
        if(exState.paused){
          resume();
        }else{
          pause();
        }
      }
    }

    function begin(){
      //play sound on its own timer then start set/rest timer
      if(exState.sound){
        startDelay();
      }else{
        start();
      }
    }

    function pause(){
      //stop set/rest timer and play sound and pause sounds
      stop();
    }

    function resume(){
      //play sound on its own timer then start set/rest timer and resume sounds
      if(exState.sound){
        startDelay();
      }else{
        start();
      }
    }

    //START Delay for sounds
    var endDelay = undefined;
    function startDelay(){
      if(angular.isDefined(endDelay)) return;
      endDelay = $interval(stopDelay, 1000);
    }

    function stopDelay(){
      if(angular.isDefined(endDelay)){
        $interval.cancel(endDelay);
        endDelay = undefined;
        start();
      }
    }
    //END Delay for sounds

    //START countdown timer
    var end = undefined;
    function start(){
      if(angular.isDefined(end)) return;
      end = $interval(cycle, 10);
    }

    function cycle(){
      if(exState.time > 0){
        exState.time--;
      }else{
        nextCycle();
      }
    }

    function stop(){
      if(angular.isDefined(end)){
        $interval.cancel(end);
        end = undefined;
      }
    }

    function nextCycle(){
      if(exState.isSet){
        nextRest();
      }else if(exState.currentSet < "number of sets"){
        nextSet();
      }else{
        nextBlock();
      }
    }

    function nextRest(){
      exState.isSet = false;
      exState.time = currentblock currentset rest;
    }

    function nextSet(){
      exState.isSet = true;
      exState.currentSet++;
      exState.time = currentblock current set time-rest;
    }

    function nextBlock(){
      exState.isSet = true;
      exState.currentSet = 0;
      exState.currentBlock++;
      exState.time = currentblock current set time-rest;
    }
    //END countdown timer

    function skip(){

    }

    function complete(){

    }

  }

})();
