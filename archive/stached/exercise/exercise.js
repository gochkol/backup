angular.module( 'exercise', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('exercise', {
    url: '/exercise',
    controller: 'ExerciseCtrl',
    templateUrl: 'exercise/exercise.html'
  });
})
.controller( 'ExerciseCtrl', function ExerciseController( $scope, $http, store, $state, $sce, $interval, Data, ngAudio) {
  
  $scope.isCollapsed = false;

//WARNING ON RELOAD
  window.onbeforeunload = function() {
    return "Reloading will end the workout. Are you sure?";
  };
  $scope.$on('$destroy', function(e){
    window.onbeforeunload = undefined;
  });
  $scope.$on('$stateChangeStart', function(e){
    window.onbeforeunload = undefined;
  });

//WARNING ON RELOAD

//--------------------------------------------------------------------------------------------------------------------------------
// Load All necessary data and intialize data values
//--------------------------------------------------------------------------------------------------------------------------------
  $scope.workout = Data.getWorkout();
  if(!$scope.workout){
    Data.addToStateHistory('home');
    $state.go('loading');
  }
  $scope.timeString = function(time){
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    var timestring = "";
    
    while(time >= 60){
      while(time >= 3600){
        time -= 3600;
        hours++
      }
      if(time >= 60){
        time -= 60;
        minutes++;
      }
    }
    seconds = time;

    if(hours > 0){
      timestring += hours + ":"; 
      if(minutes > 9){
        timestring += minutes + ":";
      }else{
        timestring += "0" + minutes + ":";
      }
      if(seconds > 9){
        timestring += seconds;
      }else{
        timestring += "0" +seconds;
      } 
    }else{
      if(minutes > 9){
        timestring += minutes + ":";
      }else{
        timestring += minutes + ":";
      }
      if(seconds > 9){
        timestring += seconds;
      }else{
        timestring += "0" +seconds;
      }
    }

    return timestring;
  };
  $scope.blocks = $scope.workout.blocks;
  $scope.workout.current_set = 0;
  $scope.workout_name = $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.name;
  $scope.total_time_string = '0:00';
  var current_time = $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.time - $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.rest;
  $scope.current_time_string = $scope.timeString(current_time);
  $scope.color = "greentext";
  $scope.sets = $scope.workout.blocks[$scope.workout.current_block].block_sets;
  $scope.calories_burned = 0; 
  var body_stats = Data.getBody_stats();
  for(bs in body_stats){
    if(body_stats[bs].value === 'weight'){ 
      $scope.user_weight = body_stats[bs].data || 150;
    }
  }
  $scope.user_weight = $scope.user_weight || 150;
//Button position setting
  $scope.center_button = "12";
  $scope.cycler_stopped = true;
  $scope.cur_or_next = true;
//Current Exercise Name logic
  function getCurrentExercise(c_block, c_set, set){
    if(set){
      return $scope.workout.blocks[c_block].block_sets[c_set].exercise.name + " Set " + (c_set+1);
    }else{
      return "Rest"
    }
  }
  var isSet = true;
  $scope.workout_name = getCurrentExercise($scope.workout.current_block, $scope.workout.current_set, isSet);
//Next Exercise Name logic
  function getNextExercise(c_block, c_set){
    var name = "";

    if((c_set+1) >= $scope.sets.length){
      if((c_block + 1) >= $scope.blocks.length){
        name = "Workout Finished";
      }else{
        name = $scope.blocks[c_block + 1].block_sets[0].exercise.name + " Set 1" + "/" + $scope.sets.length ;
      }
    }else{
        name = $scope.sets[c_set + 1].exercise.name + " Set " + (c_set+2) + "/" + $scope.sets.length;
    }
    return name;
  }
  $scope.next_exercise = getNextExercise($scope.workout.current_block, $scope.workout.current_set);
//Set sets background color
  var getBG = function(){
    $scope.setBG = [];
    var first = true;
    for(set in $scope.sets){
      if(first){
        first = false;
        $scope.setBG.push("bluewell");
      }else{
        $scope.setBG.push("well");
      }
    }
  }
  getBG();
//Button States
  $scope.button = {};
  $scope.button.text = "Start";
  $scope.button.color = "btn-success";

//--------------------------------------------------------------------------------------------------------------------------------
// Set up arrays for data handling
//--------------------------------------------------------------------------------------------------------------------------------
  function to_val_AAA(){
    var k = [];
    for(y in $scope.blocks){
      k.push([]);
      for(z in $scope.blocks[y].block_sets){
        k[y].push([]);
        angular.forEach($scope.blocks[y].block_sets[z].exercise.criterion, function(a, b){
          if(b == 'duration'){
            if(a === ""){
            }else{
              k[y][z].push(a);
            }
          }
          if(b == 'reps'){
            k[y][z].push(a);
          }
          if(b == 'distance'){
            k[y][z].push(a);
          }
          if(b == 'breath'){
            k[y][z].push(a);
          }
          if(b == 'pattern'){
            k[y][z].push(a);
          }
          if(b == 'weight'){
            k[y][z].push(a);
          }
        }, k[y][z]);
      }
    }
    return k;
  }

  function to_cri_AAA(){
    var k = [];
    for(y in $scope.blocks){
      k.push([]);
      for(z in $scope.blocks[y].block_sets){
        k[y].push([]);
        angular.forEach($scope.blocks[y].block_sets[z].exercise.criterion, function(a, b){
          if(b == 'duration'){
            if(a === ""){
            }else{
              k[y][z].push(b);
            }
          }
          if(b == 'reps'){
            k[y][z].push(b);
          }
          if(b == 'distance'){
            k[y][z].push(b);
          }
          if(b == 'breath'){
            k[y][z].push(b);
          }
          if(b == 'pattern'){
            k[y][z].push(b);
          }
          if(b == 'weight'){
            k[y][z].push(b);
          }
        }, k[y][z]);
      }
    }
    return k;
  }

  function fromAAA(x){
    for(y in $scope.blocks){
      for(z in $scope.blocks[y].block_sets){
        var m = 0;
        angular.forEach($scope.blocks[y].block_sets[z].exercise.criterion, function(a, b){
          if(b == 'duration'){
            if(a === ""){
            }else{
              $scope.workout.blocks[y].block_sets[z].exercise.criterion[b] = x[y][z][m];
            }
          }
          if(b == 'reps'){
            $scope.workout.blocks[y].block_sets[z].exercise.criterion[b] = x[y][z][m];
          }
          if(b == 'distance'){
            $scope.workout.blocks[y].block_sets[z].exercise.criterion[b] = x[y][z][m];
          }
          if(b == 'breath'){
            $scope.workout.blocks[y].block_sets[z].exercise.criterion[b] = x[y][z][m];
          }
          if(b == 'pattern'){
            $scope.workout.blocks[y].block_sets[z].exercise.criterion[b] = x[y][z][m];
          }
          if(b == 'weight'){
            $scope.workout.blocks[y].block_sets[z].exercise.criterion[b] = x[y][z][m];
          }
          m++;
        }, $scope.workout.blocks[y].block_sets[z].exercise.criterion);
      }
    }
  }

  $scope.values = to_val_AAA();
  $scope.criterion = to_cri_AAA();

//--------------------------------------------------------------------------------------------------------------------------------
// Photo Cycler
//--------------------------------------------------------------------------------------------------------------------------------
//Setup workout photo cycler
  var photo_order = [];
  var photo_timing = [];
  var photo_current = 0;
  var first_loop = true;
  var loop_back = 0;

  var setupPhoto = function(){
    var animate = null;
    if(angular.isObject($scope.sets[$scope.workout.current_set].exercise.animation)){
      if(angular.isObject($scope.sets[$scope.workout.current_set].exercise.animation.images) && ($scope.sets[$scope.workout.current_set].exercise.animation.images.length > 0)){
        if(($scope.workout.current_set == ($scope.sets.length-1)) && ($scope.workout.current_block < ($scope.workout.blocks.length -1))){
          $scope.photo = $scope.workout.blocks[$scope.workout.current_block+1].block_sets[0].exercise.animation.images[0];
          var split_loop_back = $scope.blocks[$scope.workout.current_block+1].block_sets[0].exercise.animation.sequence.split("__");
          loop_back = parseInt(split_loop_back[1]) - 1;
          animate = split_loop_back[0].split("_");
        }else{
          $scope.photo = $scope.sets[$scope.workout.current_set].exercise.animation.images[0];
          var split_loop_back = $scope.sets[$scope.workout.current_set].exercise.animation.sequence.split("__");
          loop_back = parseInt(split_loop_back[1]) - 1;
          animate = split_loop_back[0].split("_");
        }
      }else{
        $scope.photo = 'images/barbellbench.png';
      }
    }else{
      $scope.photo = 'images/barbellbench.png';
    }

    photo_order = [];
    photo_timing = [];
    photo_current = 0;
    first_loop = true;
    for(a in animate){
      var even = a % 2; 
      if(even < 1){
        photo_order.push(parseInt(animate[a]));
      }else{
        photo_timing.push(parseInt(animate[a]));
      }
    }
  }
  setupPhoto();

  var photo_stop;
  $scope.photo_start = function(){
    //Don't start a timer if it is already going
    if(angular.isDefined(photo_stop)) return;

    photo_stop = $interval(function(){
      if(!first_loop){
        if(photo_current < ($scope.sets[$scope.workout.current_set].exercise.animation.images.length - 1)){
          photo_current++;
          if(($scope.workout.current_set == ($scope.sets.length-1)) && ($scope.workout.current_block < ($scope.workout.blocks.length -1)) && !isSet){
            $scope.photo = $scope.workout.blocks[$scope.workout.current_block+1].block_sets[0].exercise.animation.images[photo_current];
          }else{
            $scope.photo = $scope.sets[$scope.workout.current_set].exercise.animation.images[photo_current];
          }
        }else{
          photo_current = loop_back;
          if(($scope.workout.current_set == ($scope.sets.length-1)) && ($scope.workout.current_block < ($scope.workout.blocks.length -1)) && !isSet){
            $scope.photo = $scope.workout.blocks[$scope.workout.current_block+1].block_sets[0].exercise.animation.images[photo_current];
          }else{
            $scope.photo = $scope.sets[$scope.workout.current_set].exercise.animation.images[photo_current];
          }       
        }
      }else{
        first_loop = false;
      }
    }, photo_timing[photo_current]);
  };

  var photo_end = function(){
    if(angular.isDefined(photo_stop)){
      $interval.cancel(photo_stop);
      photo_stop = undefined;
    }
  }

//--------------------------------------------------------------------------------------------------------------------------------
// Start Stop Sound logic
//--------------------------------------------------------------------------------------------------------------------------------
  $scope.sound = {};
  $scope.sound.start = ngAudio.load("audio/2_sec_start_sound.mp3");
  $scope.sound.end = ngAudio.load("audio/1_sec_end_sound.mp3");
  $scope.sound.warning = ngAudio.load("audio/4_sec_countdown.mp3");
  var onePlay = true;

  var stop_sound;
  var start_sound = function(){
    if(angular.isDefined(stop_sound)) return;

    $scope.sound.start.play();
    stop_sound = $interval(function(){
      if(onePlay){
        onePlay = false;
      }else{
        onePlay = true;
        stopSound();
      }
    }, 500);
  };
  
  var stopSound = function(){
    if(angular.isDefined(stop_sound)){
      $interval.cancel(stop_sound);
      stop_sound = undefined;
      $scope.start();
    }
  }

//--------------------------------------------------------------------------------------------------------------------------------
// Exercise Cycler main logic
//--------------------------------------------------------------------------------------------------------------------------------
  var current_total_time = 0;
  $scope.set_or_rest = "Set";
  $scope.cur_or_next = false;
  var timespan = 0;
  var firstStart = true;

  var stop;
  $scope.start = function(){
    //Don't start a timer if it is already going
    if(angular.isDefined(stop)) return;

    $scope.center_button = "6";
    $scope.cycler_stopped = false;
    
    stop = $interval(function(){
      //If we are in a set
      if(isSet){
        timespan = $scope.sets[$scope.workout.current_set].exercise.criterion.time - $scope.sets[$scope.workout.current_set].exercise.criterion.rest;
        if(current_time > 1){
          current_time--;
          if(current_time == 4){
            $scope.sound.warning.play();
          }
          $scope.calories_burned += ($scope.sets[$scope.workout.current_set].exercise.met * 0.000126 * $scope.user_weight);
          current_total_time++;
          $scope.total_time_string = $scope.timeString(current_total_time);
          $scope.current_time_string = $scope.timeString(current_time);  
        }else{
          nextInterval();
        }
      //If we are in rest 
      }else{
        timespan = $scope.sets[$scope.workout.current_set].exercise.criterion.rest;
        if(current_time > 1){
          current_time--;
          if(current_time == 4){
            $scope.sound.warning.play();
          }
          current_total_time++;
          $scope.calories_burned += (2 * 0.000126 * 180);
          $scope.total_time_string = $scope.timeString(current_total_time);
          $scope.current_time_string = $scope.timeString(current_time);   
        }else{
          nextInterval();
        } 
      }
   
  
    }, 1000);
  };

//Complete button Function        
  $scope.complete = function(){
    if(isSet){
      $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.time -= current_time; 
      nextInterval();
    }else{
      $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.time -= current_time;
      $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.rest -= current_time;
      nextInterval();
    }
  };

//Pause Function
  $scope.pause = function(){
    if(angular.isDefined(stop)){
      $interval.cancel(stop);
      stop = undefined;
      $scope.center_button = "12";
      $scope.cycler_stopped = true;
    }
  };

//Unified Start/Pause Button function
  $scope.s_p_click = function(){
    if(angular.isDefined(stop)){
      $scope.pause();
      $scope.setBG[$scope.workout.current_set] = "bluewell";
      $scope.button.text = "Start";
      $scope.button.color = "btn-success";
    }else{
      start_sound();
      if(isSet){
        $scope.setBG[$scope.workout.current_set] = "greenwell";
      }else{
        $scope.setBG[$scope.workout.current_set] = "redwell";
      }
      $scope.button.text = "Pause";
      $scope.button.color = "btn-danger";
    }
  };

//Setup for looping into the next interval from sets to rest, from rest to next set, and from last set rest to first set of next block
  function nextInterval(){
    //Always Patch Values
    patchDB();

    //If it is a set move to rest
    if(isSet){
      nextIfSet();

    //If Rest
    }else{
      if($scope.workout.current_set == ($scope.sets.length - 1)){
        if($scope.workout.current_block == ($scope.workout.blocks.length - 1)){
          nextIfLastExercise();
        }else{
          nextIfLastSet();
        }
      }else{
        nextIfRest();
      }
    }
  }

  function nextIfSet(){
      //Play Set end sound and Add to Workout Total Time
      $scope.sound.end.play(); 
      $scope.workout.workout_total_time += $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.time - $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.rest;

      //Layout Format Switch to Rest
      $scope.setBG[$scope.workout.current_set] = "redwell";
      $scope.color = "redtext";
      $scope.workout_name = getCurrentExercise($scope.workout.current_block, $scope.workout.current_set, isSet);
      $scope.set_or_rest = "Rest";
      $scope.cur_or_next = true;

      //Reset Timer and Refresh Strings
      current_time = $scope.sets[$scope.workout.current_set].exercise.criterion.rest;
      $scope.total_time_string = $scope.timeString(current_total_time);
      $scope.current_time_string = $scope.timeString(current_time);  
      isSet = false;
      if(($scope.workout.current_set == ($scope.sets.length-1)) && ($scope.workout.current_block < ($scope.workout.blocks.length -1))){
        setupPhoto();
      }
  }

  function nextIfRest(){
      //Pause Set, Play Set Start Sound, Start Set and Add to Workout Total Time
      $scope.s_p_click();
      $scope.s_p_click();
      $scope.workout.workout_total_time += $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.rest;

      $scope.color = "greentext";  
      isSet = true;
      $scope.set_or_rest = "Set";
      $scope.cur_or_next = false;
      $scope.setBG[$scope.workout.current_set] = "well";
      $scope.workout.current_set++;
      $scope.setBG[$scope.workout.current_set] = "greenwell";
      $scope.workout_name = getCurrentExercise($scope.workout.current_block, $scope.workout.current_set, isSet);
      $scope.next_exercise = getNextExercise($scope.workout.current_block, $scope.workout.current_set);
      
      //Reset Timer and Refresh Strings
      current_time = $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.time - $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.rest;
      $scope.total_time_string = $scope.timeString(current_total_time);
      $scope.current_time_string = $scope.timeString(current_time);
      $scope.cur_progress = ($scope.workout.current_block/$scope.workout.blocks.length)*100;
  }

  function nextIfLastSet(){
      //Pause Set, Play Set Start Sound, Start Set and Add to Workout Total Time
      $scope.workout.workout_total_time += $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.rest;

      $scope.color = "greentext";  
      isSet = true;
      $scope.set_or_rest = "Set";
      $scope.cur_or_next = false;
      if(angular.isDefined(stop)){
        $scope.s_p_click();
      }
      $scope.workout.current_block++;
      $scope.workout.current_set = 0;
      $scope.sets = $scope.workout.blocks[$scope.workout.current_block].block_sets;
      getBG();
      setupPhoto();
      $scope.workout_name = getCurrentExercise($scope.workout.current_block, $scope.workout.current_set, isSet);
      $scope.next_exercise = getNextExercise($scope.workout.current_block, $scope.workout.current_set);

      current_time = $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.time - $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.rest;
      $scope.total_time_string = $scope.timeString(current_total_time);
      $scope.current_time_string = $scope.timeString(current_time);
      $scope.cur_progress = ($scope.workout.current_block/$scope.workout.blocks.length)*100;
  }

  function nextIfLastExercise(){  
      $scope.workout.workout_total_time += $scope.workout.blocks[$scope.workout.current_block].block_sets[$scope.workout.current_set].exercise.criterion.rest;
      
      $scope.color = "greentext";
      $scope.total_time_string = $scope.timeString(current_total_time);
      $scope.current_time_string = $scope.timeString(current_time);  
      isSet = true;
      $scope.set_or_rest = "Set";
      $scope.cur_or_next = false;
      if(angular.isDefined(stop)){
        $scope.s_p_click();
      }
      $scope.workout.current_block++;
      Data.addToStateHistory('review_post');
      $state.go('loading');
      $scope.cur_progress = ($scope.workout.current_block/$scope.workout.blocks.length)*100;
  }

//Update Database if values change
  var patchDB = function(){
    fromAAA($scope.values);
    $scope.workout.calories_burned = $scope.calories_burned;
    Data.setWorkout($scope.workout);
  };

//--------------------------------------------------------------------------------------------------------------------------------
// Other necessary functionality
//--------------------------------------------------------------------------------------------------------------------------------

//Favorite Button
  $scope.favorite = function(){
    $http({
      url: Data.backendURL('/v1/favorite'),
      method: 'POST',
      skipAuthorization: false,
      data: {routine_id: $scope.workout.routine_id, name: $scope.workout.name}
    }).then(function(response) {
    }, function(response) {
      alert(response.data.errors);
    });

  };

//Cleanup of Intervals
  $scope.$on('$destroy', function(){
    //Make sure interval is destroyed too
    $scope.pause();
    photo_end();
    stopSound();
  });

  $scope.modeDisplay = function(input){
    var out = "";
    if(input === 'duration'){
      out = "Time(sec):";
    }
    if(input === 'reps'){
      out = "Reps:";
    }
    if(input === 'distance'){
      out = "Distance(ft):";
    }
    if(input === 'breath'){
      out = "Breaths:";
    }
    if(input === 'pattern'){
      out = "Pattern:";
    }
    if(input === 'weight'){
      out = "Weight(lbs):";
    }
    if(input === 'rest'){
      out = "Rest(sec):";
    }
    return out;
  }

})
.filter('ex_modeFilter', function(){

  return function(input){
    var out = {};
    angular.forEach(input, function(value, criteria){
        if(criteria == 'duration'){
          if(value === ""){
          }else{
            out[criteria] = value;
          }
        }
        if(criteria == 'reps'){
          out[criteria] = value;
        }
        if(criteria == 'distance'){
          out[criteria] = value;
        }
        if(criteria == 'breath'){
          out[criteria] = value;
        }
        if(criteria == 'pattern'){
          out[criteria] = value;
        }
        if(criteria == 'weight'){
          out[criteria] = value;
        }
        if(criteria == 'rest'){
         }
    }, out);
    return out;
  }
});

