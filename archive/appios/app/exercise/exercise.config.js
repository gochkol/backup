(function () {
  'use strict';

  angular
    .module('app.exercise')
    .config(ExerciseConfig)

  ExerciseConfig.$inject = ['$stateProvider'];

  function ExerciseConfig($stateProvider) {
    $stateProvider.state('exercise', {
      url: '/exercise',
      controller: 'ExerciseController',
      controllerAs: 'exercise',
      templateUrl: 'app/exercise/exercise.html'
    });
  }

})();
