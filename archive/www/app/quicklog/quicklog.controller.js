(function () {
  'use strict';

  angular
    .module('app.quicklog')
    .controller('QuickLogController', QuickLogController);

  QuickLogController.$inject = ['$state', '$filter', 'helpers', 'modalUtils', 'userData', 'globalDataSet', 'userDataSet', 'workout', '$ionicScrollDelegate', '$timeout', '$ionicLoading'];

  function QuickLogController($state, $filter, helpers, modalUtils, userData, globalDataSet, userDataSet, workout, $ionicScrollDelegate, $timeout, $ionicLoading){
    var vm = this;
    vm.user = userDataSet.user;
    vm.metric = workout.getMetric();
    vm.quickActivities = globalDataSet.quickActivities;
    vm.isCollapsed = true;
    vm.cancel = cancel;
    vm.request = {numberOfDaysAgo: 0};
    vm.numberOfDaysAgo = 0;
    vm.createQuickLog = createQuickLog;
    vm.blur = helpers.blur;
    vm.quickLog = {};
    vm.scrollBottom = scrollBottom;
    vm.daysAgo = [
      {number: 0, name: 'Today'},
      {number: 1, name: 'Yesterday'},
      {number: 2, name: '2 Days Ago'}
    ];

    function cancel(){
      $state.go('nav.home');
    }

    function scrollBottom(){
      $timeout(function(){
        $ionicScrollDelegate.scrollBottom();
      }, 500);
    }

    function createQuickLog(){
      if(vm.metric !== "standard"){
        if(vm.request.distanceMiles){
          vm.request.distanceMiles = helpers.km_to_mi(vm.request.distanceMiles);
        }
      }
      userData.createQuickLog(vm, vm.request, finishQuickLog);
      $ionicLoading.show({
        template: 'Logging...'
      });
      $timeout(function () {
        $ionicLoading.hide();
      }, 3000);
    }

    function finishQuickLog(){
      var temp = [], simp = "";
      if(vm.metric !== "standard" && vm.request.distanceMiles){
        temp = vm.quickLog.point.sentence.split(" ");
        temp[temp.length-1] = "kilometers";
        temp[temp.length-2] = $filter('number')(helpers.mi_to_km(parseFloat(temp[temp.length-2])), 2);
        for(var i in temp){
          simp = simp+temp[i]+" ";
        }
        vm.quickLog.point.sentence = simp;
      }
      modalUtils.launch('greatJob', vm.quickLog.point.sentence);
      {$state.go('nav.home').then(function(){$ionicLoading.hide()})};
    }
  }

})();

