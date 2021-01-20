(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$state', '$scope', '$modal', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'helpers', 'workout'];

  function HomeController($state, $scope, $modal, globalData, userData, globalDataSet, userDataSet, helpers, workout) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.events = userDataSet.events;
    vm.randomTip = helpers.getRandomValue(globalDataSet.tips);
    vm.formatTime = helpers.formatTime;
    vm.maxMonth = 600;
    vm.maxDay = 50;
    vm.dProgress = (vm.user.current_daily_points / vm.maxDay)*100;
    vm.mProgress = (vm.user.current_monthly_points / vm.maxMonth)*100;
    vm.helpers = helpers;
    vm.showComments = showComments;
    vm.workouts ={};
    vm.workoutHidden = {};
    vm.expander = expander;
    vm.exerciseLookup = globalDataSet.exerciseLookup;
    vm.statusString;
    vm.submitComment = submitComment;
    vm.removeComment = removeComment;
    vm.updateStatus = updateStatus;
    vm.customWorkout = customWorkout;
    vm.createFavorite = createFavorite;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time:'},
      reps:         {name: 'Rep:'},
      breath:       {name: 'Breaths:'},
      pattern:      {name: 'Pattern:'},
      weight:       {name: 'Lb:'},
      rest:         {name: 'Rest:'}
    };

    function showComments(event){
      event.show = (event.show) ? false : true;
      if (event.show){
        userData.getEventComments(event);
      }
    }

    function submitComment(event){
      userData.createEventComment(event, event.commentText);
      var form = document.getElementById("commentForm")
      form.reset();
    }

    function removeComment(event, comment){
      userData.deleteEventComment(event, comment);
    }

    function updateStatus(){
      vm.user.current_status = vm.statusString;
      userData.updateUserStatus(vm, vm.user.current_status);
      var form = document.getElementById("statusForm")
      form.reset();
    }

    function customWorkout(){
      workout.setCustomRequest();
      $state.go('nav.customizeWorkout');
    }

    function getWorkout(workoutId){
      userData.getWorkout(vm.workouts, workoutId);
    }

    function expander(wh, wo){
      if(!vm.workouts[wo.id]){
        getWorkout(wo.id)
      }
      vm.workoutHidden[wo.id] = !vm.workoutHidden[wo.id];
    }

    function createFavorite(workout){
      userData.createFavorite(workout);
    }

  }

})();
