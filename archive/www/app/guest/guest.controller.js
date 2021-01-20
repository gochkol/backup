(function(){
  'use strict';

  angular
    .module('app.guest')
    .controller('GuestController', GuestController);

  GuestController.$inject = ['globalDataSet', 'globalData', '$modal', 'auth', 'config', 'constants', '$ionicLoading', '$timeout', 'workout'];

  function GuestController(globalDataSet, globalData, $modal,  auth, config, constants, $ionicLoading, $timeout, workout){
    var vm = this;
    vm.user = {};
    vm.submit = submit;
    vm.experiences = [{value: 1, name:"Beginner"},
                      {value: 2, name:"Intermediate"},
                      {value: 3, name:"Advanced"}];

    workout.setMetric("standard");

    function submit(){
      $ionicLoading.show({
        template: 'Creating Guest...'
      });
      auth.createGuest(vm.user);
	    $timeout(function () {
        $ionicLoading.hide();
      }, 1500)
    }
  }

})();

