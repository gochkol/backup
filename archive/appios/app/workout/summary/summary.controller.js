(function () {
  'use strict';

  angular
    .module('app.workout.summary')
    .controller('SummaryController', SummaryController);

  SummaryController.$inject = ['$scope', '$state', 'userData', 'userDataSet', 'globalDataSet', 'workout', 'workoutData', 'helpers', 'infoFactory', 'modalUtils'];

  function SummaryController($scope, $state, userData, userDataSet, globalDataSet, workout, workoutData, helpers, infoFactory, modalUtils){
    var vm = this;
    vm.user = userDataSet.user;
    vm.isGuest = userData.isGuest();
    vm.workout = workoutData;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.isReadonly = false;
    vm.finish = finish;
    vm.createFavorite = createFavorite;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time:'},
      reps:         {name: 'Reps:'},
      breath:       {name: 'Breaths:'},
      pattern:      {name: 'Pattern:'},
      weight:       {name: 'Lbs:'},
      rest:         {name: 'Rest:'}
    }

    function finish(){
      if (userData.getGuestStatus()){
        modalUtils.launch('guestFinishWorkout', goToLogin);
      }
      else{
        workout.updateWorkout(afterFinish);
      }
    }

    function goToLogin(){
      $state.go('login');
    }

    function afterFinish(responseData){
      modalUtils.launch('greatJob', responseData.point.sentence);
      workout.clear();
      $state.go('nav.home');
    }

    function createFavorite(){
      if(!vm.isReadonly){
        userData.createFavorite(vm.workout);
        vm.isReadonly = !vm.isReadonly;
        document.getElementById("favoriteIconSummary").classList.add('energized');
      }
    }
  }

})();
