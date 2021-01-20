(function () {
  'use strict';

  angular
    .module('app.quicklog')
    .controller('QuickLogController', QuickLogController);

  QuickLogController.$inject = ['$state', 'modalUtils', 'userData', 'globalDataSet', 'userDataSet', 'workout', 'helpers'];

  function QuickLogController($state, modalUtils, userData, globalDataSet, userDataSet, workout, helpers){
    var vm = this;
    vm.user = userDataSet.user;
    vm.metric = workout.getMetric();
    vm.quickActivities = globalDataSet.quickActivities;
    vm.cancel = cancel;
    vm.request = {numberOfDaysAgo: 0};
    vm.numberOfDaysAgo = 0;
    vm.createQuickLog = createQuickLog;
    vm.quickLog = {};
    vm.daysAgo = [
      {number: 0, name: 'Today'},
      {number: 1, name: 'Yesterday'},
      {number: 2, name: '2 Days Ago'}
    ];

    function cancel(){
      $state.go('home');
    }

    function createQuickLog(){
      if(vm.metric !== "standard"){
        if(vm.request.distanceMiles){
          vm.request.distanceMiles = helpers.km_to_mi(vm.request.distanceMiles);
        }
      }
      userData.createQuickLog(vm, vm.request, finishQuickLog);
    }

    function finishQuickLog(){
      var temp = [];
      if(vm.metric !== "standard" && vm.request.distanceMiles){
        temp = vm.quickLog.point.sentence.split(" ");
        temp[temp.length-1] = "kilometers";
        temp[temp.length-2] = helpers.mi_to_km(parseFloat(temp[temp.length-2]));
        for(var i in temp){
          temp[i] = temp[i]+" ";
        }
        vm.quickLog.point.sentence = String.prototype.concat(...temp);
      }
      modalUtils.launch('greatJob', helpers.pointSentence(vm.quickLog.point));
      $state.go('home');
    }
  }

})();

