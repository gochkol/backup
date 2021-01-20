(function(){
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['helpers', 'globalDataSet', 'globalData', '$modal', 'dateUtils', 'auth', 'config', 'constants', '$timeout', '$ionicLoading'];

  function SignupController(helpers, globalDataSet, globalData, $modal, dateUtils, auth, config, constants, $timeout, $ionicLoading){
    var vm = this;
    vm.user = {};
    vm.blur = helpers.blur;
    vm.avatarImage = null;
    vm.avatarUploading = false;
    vm.usages = globalDataSet.usages;
    vm.categories = globalDataSet.categories;
    vm.constants = constants();
    vm.years = dateUtils.getYears();
    vm.months = dateUtils.getMonths(vm.years[0]);
    vm.days = dateUtils.getDays(vm.months[0], vm.years[0]);
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
