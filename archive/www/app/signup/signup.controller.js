(function(){
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['globalDataSet', 'globalData', '$modal', 'dateUtils', 'auth', 'config', 'constants', '$timeout', '$ionicLoading', 'helpers'];

  function SignupController(globalDataSet, globalData, $modal, dateUtils, auth, config, constants, $timeout, $ionicLoading, helpers){
    var vm = this;
    vm.user = {};
    vm.blur = helpers.blur;
    vm.usages = globalDataSet.usages;
    vm.categories = globalDataSet.categories;
    vm.constants = constants();
    vm.years = dateUtils.getYears();
    vm.months = dateUtils.getMonths(vm.years[1].value);
    vm.days = dateUtils.getDays(vm.months[0].value, vm.years[1].value);
    vm.updateDays = updateDays;
    vm.updateMonths = updateMonths;
    vm.isCollapsedInfo = true;
    vm.submit = submit;
    vm.experiences = [{value: 1, name:"Beginner"},
                      {value: 2, name:"Intermediate"},
                      {value: 3, name:"Advanced"}];

    function updateDays(){
      vm.days = dateUtils.getDays(vm.user['birth_month'], vm.user['birth_year']);
    }

    function updateMonths(){
      vm.months = dateUtils.getMonths(vm.user['birth_year']);
      updateDays();
    }

    function submit(){
	  $ionicLoading.show({
      template: 'Getting Things Ready...'
      });
      auth.createUser(vm.user);
    }
  }

})();
