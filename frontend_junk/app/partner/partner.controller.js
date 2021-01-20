(function () {
  'use strict';

  angular
    .module('app.partner')
    .controller('PartnerController', PartnerController);

  PartnerController.$inject = ['$state', 'partner', 'partnerData', 'workout'];

  function PartnerController($state, partner, partnerData, workout){
    var vm = this;
    vm.partner = partner;
    vm.gym = null;
    vm.createWorkout = createWorkout;

    function createWorkout(){
      var gymID = partner['gyms'][0]['id'];
      //workout.setGymRequest(gymID);
      partnerData.setStateData('currentGymID', partner['gyms'][0]['id']);
      $state.go('gymWorkout');
    }
  }

})();

