(function () {
  'use strict';

  angular
    .module('app.friends')
    .controller('FriendsController', FriendsController);

  FriendsController.$inject = ['$state', '$stateParams', 'userData', 'userDataSet', 'infoFactory'];

  function FriendsController($state, $stateParams, userData, userDataSet, infoFactory){
    var vm = this;
    vm.user = userDataSet.user;
    vm.friends = userDataSet.friends;
    vm.friendRequestsForMe = userDataSet.friendRequestsForMe;
    vm.friendRequestsFromMe = userDataSet.friendRequestsFromMe;
    vm.searchText = "";
    vm.searchSubmitted = false;
    vm.friendsFromSearch = [];
    vm.search = search;
    vm.createFriendRequest = createFriendRequest;
    vm.deleteFriendRequest = deleteFriendRequest;
    vm.acceptFriendRequest = acceptFriendRequest;
    vm.declineFriendRequest = declineFriendRequest;
    vm.deleteFriend = deleteFriend;
    vm.showFriend = showFriend;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.predicate = 'monthly_points';
    vm.reverse = true;
    vm.showDay = true;
    vm.showMonth = false;
    vm.showTotal = true;
    vm.order = order;

    order('current_monthly_points');

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

    function search(){
      userData.getFriendsSearch(vm, vm.searchText);
      vm.searchSubmitted = true;
    }

    function createFriendRequest(friendRequest){
      userData.createFriendRequest(vm, friendRequest);
      userData.getFriendsSearch(vm, vm.searchText);
    }

    function deleteFriendRequest(friendRequest){
      userData.deleteFriendRequest(vm, friendRequest);
      userData.getFriendsSearch(vm, vm.searchText);
    }

    function acceptFriendRequest(friendRequest){
      userData.acceptFriendRequest(vm, friendRequest);
      userData.getFriends(vm);
    }

    function declineFriendRequest(friendRequest){
      userData.declineFriendRequest(vm, friendRequest);
    }

    function deleteFriend(friend){
      userData.deleteFriend(vm, friend);
    }

    function showFriend(friend){
      userData.stateData().currentFriendId = friend.id;
      $state.go('friend');
    }
  }

})();
