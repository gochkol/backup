(function () {
  'use strict';

  angular
    .module('app.workout.quick')
    .controller('QuickWorkoutController', QuickWorkoutController);

  QuickWorkoutController.$inject = ['$state', 'globalDataSet', 'userData', 'userDataSet', 'workout', 'infoFactory'];

  function QuickWorkoutController($state, globalDataSet, userData, userDataSet, workout, infoFactory){
    var vm = this;
    vm.user = userDataSet.user;
    vm.locations = userDataSet.locations;
    vm.categories = globalDataSet.categories;
    vm.bodyAreasNested = globalDataSet.bodyAreasNested;
    vm.request = {'bodyAreaIds': [], 'intensity': 7, 'workoutTime': 20, 'locationId': vm.locations[0].id, 'categoryId': 2};
    vm.submitRequest = submitRequest;
    vm.show = {'l0': false, 'l1': false, 'l2': false};
    vm.toggleBodyArea = toggleBodyArea;
    vm.toggleCategory = toggleCategory;
    vm.baMissing = false;
    vm.isReadonly = false;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    
    function submitRequest(){
      vm.isReadonly = true;
      workout.setQuickRequest(vm.request);
      $state.go('customizeWorkout');
    }

    function toggleCategory(categoryId){
      // this needs to be cleaned up along with the filters
      switch(categoryId){
        case 4:
          for(var s in vm.show){vm.show[s] = true;}
          vm.request.bodyAreaIds.length == 0 ? vm.baMissing = true : vm.baMissing = false;
          break;
        case 5:
          for(var s in vm.show){vm.show[s] = true;}
          vm.request.bodyAreaIds.length == 0 ? vm.baMissing = true : vm.baMissing = false;
          break;
        default:
          for(var s in vm.show){vm.show[s] = false;}
          vm.baMissing = false;
      }
    }

    function toggleBodyArea(bodyArea, level){
      var checked = (vm.request.bodyAreaIds.indexOf(bodyArea.id) == -1);
      var base = vm.bodyAreasNested[0];
      if(checked){
        vm.request.bodyAreaIds.push(bodyArea.id);
        if(bodyArea.children != undefined){
          for(var i in bodyArea.children){
            var b = bodyArea.children[i];
            if(vm.request.bodyAreaIds.indexOf(b.id) == -1){
              vm.request.bodyAreaIds.push(b.id);
            }
            if(b.children != undefined){
              for(var j in b.children){
                var c = b.children[j];
                if(vm.request.bodyAreaIds.indexOf(c.id) == -1){
                  vm.request.bodyAreaIds.push(c.id);
                }
              }
            }
          }
        }
      }else if(level == 0){
        vm.request.bodyAreaIds = [];
      }else if(level == 1){
        if(vm.request.bodyAreaIds.indexOf(base.id) != -1){
          vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(base.id), 1);
        }
        vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(bodyArea.id), 1);
        for(var i in bodyArea.children){
          var a = bodyArea.children[i];
          if(vm.request.bodyAreaIds.indexOf(a.id) != -1){
            vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(a.id), 1);
          }
        }
      }else{
        if(vm.request.bodyAreaIds.indexOf(base.id) != -1){
          vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(base.id), 1);
        }
        for(var i in base.children){
          var a = base.children[i];
          var found = false;
          for(var j in a.children){
            var b = a.children[j];
            if(b.id == bodyArea.id){
              if(vm.request.bodyAreaIds.indexOf(a.id) != -1){
                vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(a.id), 1);
              }
              vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(b.id), 1);
            }
          }
        }
      }
      vm.request.bodyAreaIds.length == 0 ? vm.baMissing = true : vm.baMissing = false;
    }
  }
})();

