(function () {
  'use strict';

  angular
    .module('app.workout.summary')
    .controller('SummaryController', SummaryController);

  SummaryController.$inject = ['$scope', '$state', 'userData', 'userDataSet', 'globalDataSet', 'workout', 'workoutData', 'helpers', 'infoFactory', 'modalUtils', '$ionicHistory', '$ionicLoading', '$timeout'];

  function SummaryController($scope, $state, userData, userDataSet, globalDataSet, workout, workoutData, helpers, infoFactory, modalUtils, $ionicHistory, $ionicLoading, $timeout){
    var vm = this;
    vm.user = userDataSet.user;
    vm.userHistory = userDataSet.userHistory;
    vm.isGuest = userData.isGuest();
    vm.workout = workoutData;
    vm.updateBlockSet = workout.updateBlockSet;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.blur = helpers.blur;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.isReadonly = false;
    vm.finish = finish;
    vm.createFavorite = createFavorite;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time'},
      reps:         {name: 'Rep'},
      breath:       {name: 'Breaths'},
      pattern:      {name: 'Pattern'},
      weight:       {name: 'Lbs'},
      rest:         {name: 'Rest'}
    }

    function finish(){
	  $ionicLoading.show({
      template: 'Learning...'
      });
      if (userData.getGuestStatus()){
		    $ionicLoading.hide();
        modalUtils.launch('guestFinishWorkout');
        $state.go('login');
      }
      else{
        workout.updateWorkout(afterFinish);
      }
    }

    function goToLogin(){
      $state.go('login');
    }

    function afterFinish(responseData){
	  $ionicLoading.show({
      template: 'Learning...'
      });
	  $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
      modalUtils.launch('greatJob', helpers.pointSentence(responseData.point))
      workout.clear();
      $ionicHistory.clearCache().then(function(){$state.go('nav.home')}).then(function(){$ionicLoading.hide()});
    }

    function createFavorite(){
      if(!vm.isReadonly){
        userData.createFavorite(vm.workout);
        //vm.isReadonly = !vm.isReadonly;
        document.getElementById("favoriteIconSummary").classList.add('energized');
      }
    }
  }

})();
