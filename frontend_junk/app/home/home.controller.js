(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$state', '$scope', '$modal', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'helpers', 'workout', 'modalUtils','auth', 'globalStats'];

  function HomeController($state, $scope, $modal, globalData, userData, globalDataSet, userDataSet, helpers, workout, modalUtils, auth, globalStats) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.fbLogin = auth.getFacebookLoginStatus();
    vm.friends = userDataSet.friends;
    vm.stats = globalStats;
    vm.predicate = 'monthly_points';
    vm.reverse = true;
    vm.events = userDataSet.events;
    vm.randomTip = helpers.getRandomValue(globalDataSet.tips);
    vm.formatTime = helpers.formatTime;
    vm.maxDay = 50;
  	vm.points = userDataSet.points;
  	vm.totalPoints = vm.user['current_total_points'];
    vm.dProgress = (vm.user.current_daily_points / vm.maxDay)*100;
    vm.weeklyColor = "#00BFFF";
    vm.levelFriend = globalDataSet.levelLookup;
    vm.level = globalDataSet.levelLookup[vm.user.level_id];
    vm.levelInfo = helpers.getLevelInfo(vm.user, vm.level, globalDataSet['levels']);
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
    vm.quickWorkout = quickWorkout;
    vm.quickLog = quickLog;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time:'},
      reps:         {name: 'Reps:'},
      breath:       {name: 'Breaths:'},
      pattern:      {name: 'Pattern:'},
      weight:       {name: 'Lb:'},
      rest:         {name: 'Rest:'}
    };

    if(workout.getMetric() === ""){
      workout.setMetric(vm.user.settings.units);
      vm.metric = vm.user.settings.units;
      if(vm.user.settings.units != "standard"){
        vm.criterionDisplayInfo.weight.name = 'Kg';
      }
    }else if(workout.getMetric() != "standard"){
      vm.criterionDisplayInfo.weight.name = 'Kg';
      vm.metric = workout.getMetric();
    }else{
      vm.metric = workout.getMetric();
    }

    modalUtils.checkLevelBonus(vm.level, vm.user.current_weekly_points, vm.user.current_weekly_points_goal_value);

    order('current_monthly_points');

    if(vm.user.current_weekly_points >= vm.user.current_weekly_points_goal_value){
		  vm.weeklyColor = '#33cd5f'
	  } else {
		  vm.weeklyColor = '#00BFFF'
	  };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };

    function slideChanged (index){
      slideIndex = index;
    }

    vm.myModel = {
      Url: "https://www.updowntech.com",
      Name: "Check out Updown! It builds personalized workouts for you instantly and you can share workouts with friends.",
      ImageUrl: ""
    };

    function showComments(event){
      event.show = (event.show) ? false : true;
      if (event.show){
        userData.getEventComments(event);
      }
    }

    function submitComment(event){
      userData.createEventComment(event, event.commentText);
    }

    function removeComment(event, comment){
      userData.deleteEventComment(event, comment);
    }

    function updateStatus(){
      vm.user.current_status = vm.statusString;
      userData.updateUserStatus(vm, vm.user.current_status);
      var form = document.getElementById("statusForm");
      form.reset();
    }

  	function getStyle(){
                var transform = 'translateX(-50%)';

                return {
                    'top': '22%',
                    'bottom': 'auto',
                    'left': '50%',
                    'transform': transform,
                    '-moz-transform': transform,
                    '-webkit-transform': transform,
                    'font-size': 15 + 'px'
                };
            };

	  function order(predicate){
      vm.reverse = (vm.predicate === predicate) ? !vm.reverse : true;
      vm.predicate = predicate;
      switch(predicate){
        case 'current_monthly_points':
          vm.showDay = true;
          vm.showMonth = false;
          vm.showTotal = true;
          break;
      }
    }

    function customWorkout(){
      workout.setCustomRequest();
      $state.go('customizeWorkout');
    }

    function quickWorkout() {
      document.getElementById("workoutButton").classList.add('grayscale');
    }

    function quickLog () {
      document.getElementById("quickLogButton").classList.add('grayscale');
    }

    function getWorkout(workoutId){
      workout.getPastWorkout(vm.workouts, workoutId, converter(workoutId));
    }

    function converter(workoutId){
      return function(){vm.workouts[workoutId] = helpers.workoutConvert(vm.user.settings.units, true)(vm.workouts[workoutId]);}
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
