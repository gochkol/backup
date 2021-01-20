(function(){
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['globalDataSet', 'globalData', '$modal', 'angularFilepicker', 'dateUtils', 'auth', 'config', 'constants'];

  function SignupController(globalDataSet, globalData, $modal, angularFilepicker, dateUtils, auth, config, constants){
    var vm = this;
    vm.user = {};
    vm.usages = globalDataSet.usages;
    vm.categories = globalDataSet.categories;
    vm.constants = constants();
    vm.years = dateUtils.getYears();
    vm.months = dateUtils.getMonths(vm.years[0]);
    vm.days = dateUtils.getDays(vm.months[0], vm.years[0]);
    vm.updateDays = updateDays;
    vm.updateMonths = updateMonths;
    vm.pickFile = pickFile;
    vm.submit = submit;

    function updateDays(){
      vm.days = dateUtils.getDays(vm.user['birth_month'], vm.user['birth_year']);
    }

    function updateMonths(){
      vm.months = dateUtils.getMonths(vm.user['birth_year']);
      updateDays();
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
      auth.createUser(vm.user);
    }
  }

})();
