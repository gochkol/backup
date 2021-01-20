angular.module( 'review', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('review_workout', {
    url: '/review',
    controller: 'ReviewCtrl',
    templateUrl: 'review/review_workout.html'
  });

  $stateProvider.state('review_post', {
    url: '/summary',
    controller: 'ReviewCtrl',
    templateUrl: 'review/review_post.html'
  });

})
.controller( 'ReviewCtrl', function ReviewController( $scope, $http, store, $state, $sce, $interval, Data) {

//WARNING ON RELOAD
  window.onbeforeunload = function() {
  return "Reloading will end the workout. Are you sure?";
};

//Set Data values
  $scope.workout = Data.getWorkout() || store.get('workout');
  $scope.isCollapsed = true;
  $scope.isReadonly = false;
  $cookies.workout = Data.getWorkout() || $cookies.workout;
  if(!$scope.workout){
    Data.addToStateHistory('quick_workout');
    $state.go('loading')
  }
  $scope.blocks = $scope.workout.blocks; 

  var bi = 0;
//Setup workout photo cycler
  var photo_order = [];
  var photo_timing = [];
  var photo_current = 0;
  var first_loop = true;
  var loop_back = 0;

  function setupPhoto(bi){    
    var animate = null;
    if(angular.isObject($scope.blocks[bi].block_sets[0].exercise.animation)){
      if(angular.isObject($scope.blocks[bi].block_sets[0].exercise.animation.images) && ($scope.blocks[bi].block_sets[0].exercise.animation.images.length > 0)){
        $scope.photo = $scope.blocks[bi].block_sets[0].exercise.animation.images[0];
        var split_loop_back = $scope.blocks[bi].block_sets[0].exercise.animation.sequence.split("__");
        loop_back = parseInt(split_loop_back[1]) - 1;
        animate = split_loop_back[0].split("_");
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

  var photo_stop;
  $scope.photo_start = function(){
    //Don't start a timer if it is already going
    if(angular.isDefined(photo_stop)) return;
    
    setupPhoto(bi);
    
    photo_stop = $interval(function(){
      if(!first_loop){
        if(photo_current < ($scope.blocks[bi].block_sets[0].exercise.animation.images.length - 1)){
          photo_current++;
          $scope.photo = $scope.blocks[bi].block_sets[0].exercise.animation.images[photo_current];
        }else{
          photo_current = loop_back;
          $scope.photo = $scope.blocks[bi].block_sets[0].exercise.animation.images[photo_current];        
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

  $scope.$on('$destroy', function(){
    //Make sure interval is destroyed too
    photo_end();
  });

//Values to Array
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
          if(b == 'rest'){
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
          if(b == 'rest'){
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
          if(b == 'rest'){
            $scope.workout.blocks[y].block_sets[z].exercise.criterion[b] = x[y][z][m];
          }
          m++;
        }, $scope.workout.blocks[y].block_sets[z].exercise.criterion);
      }
    }
  }

  $scope.values = to_val_AAA();
  $scope.criterion = to_cri_AAA();

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
  }

  $scope.updateTime = function(x, y, z){
    var time = 0;
    var rate = 0;
    var input = 0;

    if($scope.values[x][y][z]){
      input = $scope.criterion[x][y][z]
      if(input === 'duration'){
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.time = $scope.values[x][y][z] + $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.duration = $scope.values[x][y][z];
      }
      if(input === 'reps'){
        time = $scope.workout.blocks[x].block_sets[y].exercise.criterion.time - $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest;
        rate = time / $scope.workout.blocks[x].block_sets[y].exercise.criterion.reps;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.time = (rate * $scope.values[x][y][z]) + $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.reps = $scope.values[x][y][z];    
      }
      if(input === 'distance'){
        time = $scope.workout.blocks[x].block_sets[y].exercise.criterion.time - $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest;
        rate = time / $scope.workout.blocks[x].block_sets[y].exercise.criterion.distance;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.time = (rate * $scope.values[x][y][z]) + $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.distance = $scope.values[x][y][z];
      }
      if(input === 'breath'){
        time = $scope.workout.blocks[x].block_sets[y].exercise.criterion.time - $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest;
        rate = time / $scope.workout.blocks[x].block_sets[y].exercise.criterion.breath;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.time = (rate * $scope.values[x][y][z]) + $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.breath = $scope.values[x][y][z];
      }
      if(input === 'pattern'){
        time = $scope.workout.blocks[x].block_sets[y].exercise.criterion.time - $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest;
        rate = time / $scope.workout.blocks[x].block_sets[y].exercise.criterion.pattern;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.time = (rate * $scope.values[x][y][z]) + $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.pattern = $scope.values[x][y][z];
      }
      if(input === 'rest'){
        time = $scope.workout.blocks[x].block_sets[y].exercise.criterion.time - $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.time = $scope.values[x][y][z] + time;
        $scope.workout.blocks[x].block_sets[y].exercise.criterion.rest = $scope.values[x][y][z];
      }
      $scope.workout.workout_total_time = getWorkoutTotalTime($scope.workout);
    }
  };

  var getWorkoutTotalTime = function(work){
    var total = 0;
    for(x in work.blocks){
      for(y in work.blocks[x].block_sets){
        total += work.blocks[x].block_sets[y].exercise.criterion.time;
      }
    }
    return total;
  }
  

  $scope.favorite = function(){
    if ($scope.workout.name == null) {
      $scope.workout.name = "Workout";
    }
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
//Turning on and off the show exercise
  $scope.hide_exercise = [];
  for(b in $scope.workout.blocks){
    $scope.hide_exercise.push(true);

  }
  $scope.showExercise = function(b_i){
    bi = b_i;
    $scope.hide_exercise[b_i] = false;
    setupPhoto(b_i);
    $scope.photo_start();
  };

  $scope.hideExercise = function(b_i){
    bi = b_i;
    $scope.hide_exercise[b_i] = true;
    photo_end();
  };

//Button Functionality
  $scope.start = function(){
    fromAAA($scope.values);
    $scope.workout.finished = false;
    $http({
      url: Data.backendURL('/v1/workout'),
      method: 'PATCH',
      skipAuthorization: false,
      data: $scope.workout
    }).then(function(response) {
      $scope.workout.current_block = 0;
      $scope.workout.workout_total_time = 0;
      Data.setWorkout($scope.workout);
      $state.go('exercise');
    }, function(response) {
      alert(response.data.errors);
    });
  }

  $scope.finish = function(){
    fromAAA($scope.values);
    $scope.workout.finished = true;
    $http({
      url: Data.backendURL('/v1/workout'),
      method: 'PATCH',
      skipAuthorization: false,
      data: $scope.workout
    }).then(function(response) {
      $scope.workout.current_block = 0;
      $scope.workout.workout_total_time = 0;
      Data.setWorkout({});
      $state.go('home');
    }, function(response) {
      alert(response.data.errors);
    });
  }
})
.filter('modeFilter', function(){

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
          out[criteria] = value;
        }
    }, out);
    return out;
  }
});
