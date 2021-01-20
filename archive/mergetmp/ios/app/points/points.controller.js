(function () {
  'use strict';

  angular
    .module('app.points')
    .controller('PointsController', PointsController);

  PointsController.$inject = ['userData', 'userDataSet', 'helpers', 'infoFactory'];

  function PointsController(userData, userDataSet, helpers, infoFactory){
    var vm = this;
    vm.user = userDataSet.user;
    vm.points = userDataSet.points;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.isCollapsedPoints = true;
    vm.infoClicked = infoFactory.getClicked;
    vm.maxMonth = 600;
    vm.maxDay = 50;
	vm.helpers = helpers;
    vm.thisDayPoints = vm.user['current_daily_points'];
    vm.thisMonthPoints = vm.user['current_monthly_points'];
    vm.totalPoints = vm.user['current_total_points'];
    vm.dProgress = (vm.user['current_daily_points'] / vm.maxDay)*100;
    vm.mProgress = (vm.user['current_monthly_points'] / vm.maxMonth)*100;
    vm.formatTime = helpers.formatTime;

    function infoClicked(){
      vm.isCollapsed = !vm.isCollapsed;
      vm.user['settings']['help']['points'] = vm.isCollapsed;
      userData.updateUser(vm.user);
    }
  }

})();
