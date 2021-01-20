(function () {
  'use strict';

  angular
    .module('app.settings')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', 'Upload', 'globalData', 'globalDataSet', 'userData', 'userDataSet', 'constants', 'config', 'infoFactory', '$ionicLoading', '$timeout', 'helpers'];

  function SettingsController($state, Upload, globalData, globalDataSet, userData, userDataSet, constants, config, infoFactory, $ionicLoading, $timeout, helpers) {
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
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.isCollapsedInfo = true;
    vm.isCollapsedInfoTwo = true;
    vm.isCollapsedPW = true;
    vm.isCollapsedEmail = true;
    vm.infoClicked = infoFactory.getClicked;
    vm.isCollapsedTwo = true;
    vm.isCollapsedThree = true;
    vm.isReadonly = false;
    vm.submit = submit;
    vm.uploadAvatar = uploadAvatar;
    vm.setModifier = {};
    vm.restModifier = {};


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
