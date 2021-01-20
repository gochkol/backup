(function () {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$state', '$scope', '$modal', '$ionicLoading', '$timeout', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'helpers', 'workout', '$ionicSlideBoxDelegate', 'modalUtils'];

  function HomeController($state, $scope, $modal, $ionicLoading, $timeout, globalData, userData, globalDataSet, userDataSet, helpers, workout, $ionicSlideBoxDelegate, modalUtils) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.friends = userDataSet.friends;
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
    // Jes or Chris.. here is what the level object looks like
    // {"id":3,"min_points":100,"max_points":249,"name":"L3","value":3,"icon_name":"level_3.png","next_level_points":250,"icon_url":"http://d21zxgwp9hfonn.cloudfront.net/level-icons/level_3.png"}
    vm.helpers = helpers;
    vm.blur = helpers.blur;
    vm.showComments = showComments;
    vm.workouts ={};
    vm.workoutHidden = {};
    vm.expander = expander;
    vm.exerciseLookup = globalDataSet.exerciseLookup;
    vm.statusString;
    vm.submitComment = submitComment;
    vm.removeComment = removeComment;
    vm.updateStatus = updateStatus;
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

    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };

    $scope.$on('$ionicView.beforeEnter', function(){
      userData.getEvents(vm);
      userData.getFriends(vm);
    });

    $scope.$on('$ionicView.beforeLeave', function(){
      userData.getEvents(vm);
      userData.getFriends(vm);
    });

    function slideChanged (index){
      slideIndex = index;
    }

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
      cordova.plugins.Keyboard.close();
    }

    function removeComment(event, comment){
      userData.deleteEventComment(event, comment);
    }

    function updateStatus(){
      vm.user.current_status = vm.statusString;
      userData.updateUserStatus(vm, vm.user.current_status);
      var form = document.getElementById("statusForm")
      form.reset();
      cordova.plugins.Keyboard.close();
    }

    function getStyle(){
      var transform = 'translateX(-50%)';
      return {
        'top': '24.8%',
        'bottom': 'auto',
        'left': '49.7%',
        'transform': transform,
        '-moz-transform': transform,
        '-webkit-transform': transform,
        'font-size': 15 + 'px'
      };
    }

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

    function quickWorkout() {
      document.getElementById("workoutButton").classList.add('grayscale');
      $ionicLoading.show({
        template: 'Opening Workout...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $state.go('nav.quickWorkout').then(function(){$ionicLoading.hide()});
    }

    function quickLog () {
      document.getElementById("quickLogButton").classList.add('grayscale');
      $ionicLoading.show({
        template: 'Opening Activity Log...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      $state.go('nav.quickLog').then(function(){$ionicLoading.hide()});
    }

  }

})();
