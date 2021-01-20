(function(){
  'use strict';

  angular
    .module('app')
    .factory('workoutUtils', workoutUtils);

  workoutUtils.$inject = ['$http'];

  function workoutUtils($http){
    var workout;
    var workoutRequest;

    var factory = {
      getWorkout: getWorkout,
      getWorkoutRequest: getWorkoutRequest,
      makeWorkout: makeWorkout
    }

    return factory;

    function getWorkout(){
      return workout;
    }

    function getWorkoutRequest(){
      return workoutRequest;
    }

    function makeWorkout(workout){
      $http({
        'url': GlobalDataFactory.backendURL('/v1/workout'),
        'method': 'POST',
        'skipAuthorization': false,
        'data': workoutRequest})
      .then(
        function(response) {
          routine = response.data;
          routine.workout_total_time = getWorkoutTotalTime(routine);
          Data.setWorkout(routine);},
        function(response){
          alert(response.data.errors);
        });
    }

  }

})();
