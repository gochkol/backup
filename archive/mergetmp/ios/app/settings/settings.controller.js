(function () {
  'use strict';

  angular
    .module('app.settings')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', 'helpers', 'Upload', 'globalData', 'globalDataSet', 'userData', 'userDataSet', 'constants', 'config', 'infoFactory', '$ionicLoading', '$timeout'];

  function SettingsController($state, helpers, Upload, globalData, globalDataSet, userData, userDataSet, constants, config, infoFactory, $ionicLoading, $timeout) {
    var vm = this;
    vm.user = userDataSet.user;
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
    vm.isCollapsedPW = true;
    vm.isCollapsedEmail = true;
    vm.infoClicked = infoFactory.getClicked;
    vm.isCollapsedTwo = true;
    vm.isCollapsedThree = true;
    vm.isReadonly = false;
    vm.submit = submit;
    vm.uploadAvatar = uploadAvatar;

    function submit(){
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
