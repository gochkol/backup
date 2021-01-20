(function () {
  'use strict';

  angular
    .module('app.quicklog')
    .controller('QuickLogController', QuickLogController);

  QuickLogController.$inject = ['$state', 'helpers', 'modalUtils', 'userData', 'globalDataSet', 'userDataSet', '$ionicScrollDelegate', '$timeout', '$ionicLoading'];

  function QuickLogController($state, helpers, modalUtils, userData, globalDataSet, userDataSet, $ionicScrollDelegate, $timeout, $ionicLoading){
    var vm = this;
    vm.user = userDataSet.user;
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
      userData.createQuickLog(vm, vm.request, finishQuickLog);
	  $ionicLoading.show({
        template: 'Logging...'
      });
	  $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
    }

    function finishQuickLog(){
      modalUtils.launch('greatJob', vm.quickLog.point.sentence);
      {$state.go('nav.home').then(function(){$ionicLoading.hide()})};
    }
  }

})();

