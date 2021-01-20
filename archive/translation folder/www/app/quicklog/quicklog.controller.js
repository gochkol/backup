(function () {
  'use strict';

  angular
    .module('app.quicklog')
    .controller('QuickLogController', QuickLogController);

  QuickLogController.$inject = ['$state', 'modalUtils', 'userData', 'globalDataSet', 'userDataSet', 'infoFactory'];

  function QuickLogController($state, modalUtils, userData, globalDataSet, userDataSet, infoFactory){
    var vm = this;
    vm.user = userDataSet.user;
    vm.quickActivities = globalDataSet.quickActivities;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.cancel = cancel;
    vm.request = {numberOfDaysAgo: 0};
    vm.numberOfDaysAgo = 0;
    vm.createQuickLog = createQuickLog;
    vm.daysAgo = [
      {number: 0, name: 'Today'},
      {number: 1, name: 'Yesterday'},
      {number: 2, name: '2 Days Ago'}
    ];

    function cancel(){
      $state.go('home');
    }

    function createQuickLog(){
      userData.createQuickLog(vm.request).then(
        function (quickLog){
          modalUtils.launch('greatJob', quickLog.point.sentence);
          $state.go('home');
        }
      );
    }
  }

})();

