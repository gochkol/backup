(function () {
  'use strict';

  angular
    .module('app.settings')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', 'angularFilepicker', 'globalData', 'globalDataSet', 'userData', 'userDataSet', 'constants', 'config', 'infoFactory'];

  function SettingsController($state, angularFilepicker, globalData, globalDataSet, userData, userDataSet, constants, config, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.usages = globalDataSet.usages;
    vm.categories = globalDataSet.categories;
    vm.constants = constants();
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.isCollapsedTwo = true;
    vm.isCollapsedThree = true;
    vm.isReadonly = false;
    vm.pickFile = pickFile;
    vm.submit = submit;

    function infoClicked(){
      vm.isCollapsed = !vm.isCollapsed;
      vm.user['settings']['help']['settings'] = vm.isCollapsed;
      userData.updateUser(vm.user);
    }

    function pickFile(){
      angularFilepicker.pickAndStore({
        mimetype: "image/*",
        multiple: false,
        imageDim: [600, 600]
      },
      {
        location: "S3",
        path: "/" + config.getEnv() + "/"
      },
      function(blob){
        vm.user.avatar_url = blob[0].url
      });
    }


    function submit(){
      userData.updateUser(vm);
      $state.go('home');
    }

  }

})();
