(function () {
  'use strict';

  angular
    .module('app.settings')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$state', 'angularFilepicker', 'globalData', 'globalDataSet', 'userData', 'userDataSet', 'constants', 'config', 'workout'];

  function SettingsController($state, angularFilepicker, globalData, globalDataSet, userData, userDataSet, constants, config, workout) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.modifiers = vm.user.modifiers;
    vm.usages = globalDataSet.usages;
    vm.categories = globalDataSet.categories;
    vm.constants = constants();
    vm.pickFile = pickFile;
    vm.submit = submit;
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

    function getModType(user, type){
      for (var i = 0; i < user.modifiers.length; i++){
        if (user.modifiers[i].modifier_type == type){
          return user.modifiers[i]
        }
      }
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
      userData.updateUser(vm);
      $state.go('home');
    }

  }

})();
