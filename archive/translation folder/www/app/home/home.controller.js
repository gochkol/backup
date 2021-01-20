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
    vm.maxDay = 45;
    vm.dProgress = (vm.user.current_daily_points / vm.maxDay)*100;
    vm.mProgress = (vm.user.current_monthly_points / vm.maxMonth)*100;
    vm.helpers = helpers;
    vm.showComments = showComments;
    vm.submitComment = submitComment;
    vm.removeComment = removeComment;
    vm.updateStatus = updateStatus;
    vm.customWorkout = customWorkout;

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
      userData.updateUserStatus(vm);
      var form = document.getElementById("statusForm")
      form.reset();
    }

    function customWorkout(){
      workout.setCustomRequest();
      $state.go('customizeWorkout');
    }
  }

})();
