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
	vm.points = userDataSet.points;
	vm.totalPoints = vm.user['current_total_points'];
    vm.dProgress = (vm.user.current_daily_points / vm.maxDay)*100;
    vm.mProgress = (vm.user.current_monthly_points / vm.maxMonth)*100;
	vm.level = globalDataSet.levelLookup[vm.user.level_id];
    vm.levelInfo = helpers.getLevelInfo(vm.user, vm.level, globalDataSet['levels']);
    // Jes or Chris.. here is what the level object looks like
    // {"id":3,"min_points":100,"max_points":249,"name":"L3","value":3,"icon_name":"level_3.png","next_level_points":250,"icon_url":"http://d21zxgwp9hfonn.cloudfront.net/level-icons/level_3.png"}
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
	vm.getStyle = getStyle;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time:'},
      reps:         {name: 'Reps:'},
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
	
    function getStyle(){
      var transform = 'translateX(-50%)';
      return {
        'top': '23%',
        'bottom': 'auto',
        'left': '50%',
        'transform': transform,
        '-moz-transform': transform,
        '-webkit-transform': transform,
        'font-size': 15 + 'px'
      };
    };
			
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
