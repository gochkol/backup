(function () {
  'use strict';

  angular
    .module('app.friend')
    .controller('FriendController', FriendController);

  FriendController.$inject = ['globalData', 'userData', 'userDataSet', 'friendData', 'helpers'];

  function FriendController(globalData, userData, userDataSet, friendData, helpers){
    var vm = this;
    vm.friend = friendData;
    vm.user = userDataSet.user;
    vm.friends = userDataSet.friends;
    vm.friendRequestsForMe = userDataSet.friendRequestsForMe;
    vm.friendRequestsFromMe = userDataSet.friendRequestsFromMe;
    vm.showFriendWorkout = showFriendWorkout;
    vm.timeString = helpers.timeString;
    vm.isReadonly = false;
    vm.isReadonlyTwo = false;
    vm.friendsCheck = friendsCheck;
    vm.predicate = 'monthly_points';
    vm.reverse = true;
    vm.showDay = true;
    vm.showMonth = false;
    vm.showTotal = true;
    vm.order = order;
    vm.createFriendRequest = createFriendRequest;

    order('current_monthly_points');

    function createFriendRequest(friendRequest){
      userData.createFriendRequest(vm, friendRequest);
      userData.getFriendsSearch(vm, vm.searchText);
    }


    function order(predicate){
     vm.reverse = (vm.predicate === predicate) ? !vm.reverse : true;
     vm.predicate = predicate;
      switch(predicate){
        case 'current_daily_points':
          vm.showDay = false;
          vm.showMonth = true;
          vm.showTotal = true;
          break;
        case 'current_monthly_points':
          vm.showDay = true;
          vm.showMonth = false;
          vm.showTotal = true;
          break;
        case 'current_total_points':
          vm.showDay = true;
          vm.showMonth = true;
          vm.showTotal = false;
          break;
      }
    }

    function friendsCheck(f){
      for(i in vm.friends){
        if((vm.friends[i].id == f.id) || (vm.user.id == f.id)){
          return true;
        }
      }
      for(i in $scope.friendRequestsForMe){
        if((vm.friendRequestsForMe[i].user_id == f.id) || (vm.user.id == f.id)){
          return true;
        }
      }
      for(i in $scope.friendRequestsFromMe){
        if((vm.friendRequestsFromMe[i].user_id == f.id) || (vm.user.id == f.id)){
          return true;
        }
      }
      return false;
    }

    function showFriendWorkout(workout){

    }

  }

})();
