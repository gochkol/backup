(function () {
  'use strict';

  angular
    .module('app.settings')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', 'globalData', 'globalDataSet', 'userData', 'userDataSet', 'constants', 'config', 'infoFactory'];

  function SettingsController($state, globalData, globalDataSet, userData, userDataSet, constants, config, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.usages = globalDataSet.usages;
    vm.avatarImage = null;
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
      userData.updateUser(vm);
      $state.go('nav.home');
    }

    function uploadAvatar(){
      userData.uploadAvatar(vm, vm.avatarFile, vm.avatarUploading);
    }

  }

})();
