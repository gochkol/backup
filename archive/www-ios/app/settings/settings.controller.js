(function () {
  'use strict';

  angular
    .module('app.settings')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', 'Upload', 'globalData', 'globalDataSet', 'userData', 'userDataSet', 'constants', 'config', '$ionicLoading', '$timeout', 'helpers', 'workout'];

  function SettingsController($state, Upload, globalData, globalDataSet, userData, userDataSet, constants, config, $ionicLoading, $timeout, helpers, workout) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.modifiers = vm.user.modifiers;
    vm.usages = globalDataSet.usages;
    vm.avatarImage = null;
    vm.blur = helpers.blur;
    vm.avatarUploading = false;
    vm.experiences = [{value: 1, name:"Beginner"},
                      {value: 2, name:"Intermediate"},
                      {value: 3, name:"Advanced"}];
    vm.categories = globalDataSet.categories;
    vm.constants = constants();
    vm.isCollapsedInfo = true;
    vm.isCollapsedInfoTwo = true;
    vm.isCollapsedInfoThree = true;
    vm.isCollapsedPW = true;
    vm.isCollapsedEmail = true;
    vm.isCollapsedTwo = true;
    vm.isCollapsedThree = true;
    vm.isReadonly = false;
    vm.submit = submit;
    vm.uploadAvatar = uploadAvatar;
    vm.setModifier = {};
    vm.restModifier = {};
    vm.user.settings.automatic = vm.user.settings.automatic || false;


    if(vm.modifiers){
      for(var m in vm.modifiers){
        if(vm.modifiers[m].modifier_type == "set"){
          vm.setModifier = vm.modifiers[m];
        }else if(vm.modifiers[m].modifier_type == "rest"){
          vm.restModifier = vm.modifiers[m];
        }
      }
    }else {
      vm.modifiers = {
                     };
    }

    function submit(){
      for(var m in vm.modifiers){
        if(vm.modifiers[m].modifier_type == "set"){
          vm.modifiers[m] = vm.setModifier;
        }else if(vm.modifiers[m].modifier_type == "rest"){
          vm.modifiers[m] = vm.restModifier;
        }
      }
      if(workout.getMetric() != vm.user.settings.units){
        workout.setMetric(vm.user.settings.units);
      }
	    $ionicLoading.show({
        template: 'Saving...'
      });
	    $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
	    uploadAvatar();
      userData.updateUser(vm);
      $state.go('nav.home').then(function(){$ionicLoading.hide()});
    }

    function uploadAvatar(){
      userData.uploadAvatar(vm, vm.avatarFile, vm.avatarUploading);
    }

  }

})();
