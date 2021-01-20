(function () {
  'use strict';

  angular
    .module('app.locations')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = ['$state', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'helpers', '$ionicLoading', '$timeout'];

  function LocationsController($state, globalData, userData, globalDataSet, userDataSet, helpers, $ionicLoading, $timeout) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.blur = helpers.blur;
    vm.equipmentGroups = globalDataSet.equipmentGroups;
    vm.equipmentLookup = globalDataSet.equipmentLookup;
    vm.spaces = globalDataSet.spaces;
    vm.locations = userDataSet.locations;
    vm.namesEmpty = false;
    vm.evalName = evalName;
    vm.toggleEquipment = toggleEquipment;
    vm.submit = submit;
    vm.hiding = {'location': []};

    for(var l in vm.locations){
      vm.hiding['location'].push({'hidden': true, 'hider': []});
      for(var g in vm.equipmentGroups){
        vm.hiding['location'][l]['hider'].push(true);
      }
    }

    function submit(){
	  $ionicLoading.show({
        template: 'Saving...'
      });
	    $timeout(function () {
        $ionicLoading.hide();
      }, 5000);
	  userData.updateUserLocations(vm.locations);
	  $state.go('nav.home').then(function(){$ionicLoading.hide()});
	}

    function toggleEquipment(location, equipment_id){
      var index = location['equipment_ids'].indexOf(equipment_id);

      if (index >= 0){
        location['equipment_ids'].splice(index, 1);
      }
      else{
        location['equipment_ids'].push(equipment_id);
      }
    }

    function evalName(){
      vm.namesEmpty = false;
      for(var l in vm.locations){
        if(vm.locations[l].name === ""){
          vm.namesEmpty = true;
        }
      }
    }

    function infoClicked(){
      vm.isCollapsed = !vm.isCollapsed;
      vm.user['settings']['help']['locations'] = vm.isCollapsed;
      userData.updateUser(vm.user);
    }

  }

})();
