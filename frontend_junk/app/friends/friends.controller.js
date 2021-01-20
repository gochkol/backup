(function () {
  'use strict';

  angular
    .module('app.friends')
    .controller('FriendsController', FriendsController);

  FriendsController.$inject = ['$state', '$stateParams', 'globalData', 'userData', 'globalDataSet', 'userDataSet'];

  function FriendsController($state, $stateParams, globalData, userData, globalDataSet, userDataSet){
    var vm = this;

    vm.user = userDataSet.user;
    vm.friends = userDataSet.friends;
    vm.friendRequestsForMe = userDataSet.friendRequestsForMe;
    vm.friendRequestsFromMe = userDataSet.friendRequestsFromMe;
    vm.friendsFromSearch = [];
    vm.search = search;
    vm.createFriendRequest = createFriendRequest;
    vm.deleteFriendRequest = deleteFriendRequest;
    vm.acceptFriendRequest = acceptFriendRequest;
    vm.declineFriendRequest = declineFriendRequest;
    vm.deleteFriend = deleteFriend;
    vm.showFriend = showFriend;
    vm.order = order;
    vm.invert = invert;
    vm.level = globalDataSet.levelLookup;
    vm.searchText = "";
    vm.searchSubmitted = false;
    vm.predicate = 'monthly_points';
    vm.reverse = true;
    vm.showDay = true;
    vm.showMonth = false;
    vm.showTotal = true;
    vm.personClick = personClick;
    vm.ordering = {daily: "",
                   monthly: "",
                   total: ""}
    order('current_monthly_points');

    function invert(friend){
      return !(friend.id == vm.user.id);
    }

    function order(predicate){
      vm.reverse = (vm.predicate === predicate) ? !vm.reverse : true;
      vm.predicate = predicate;
      switch(predicate){
        case 'current_daily_points':
          vm.showDay = false;
          vm.showMonth = true;
          vm.showTotal = true;
		  vm.ordering.daily = "active"
          vm.ordering.monthly = "";
          vm.ordering.total = "";
          break;
        case 'current_monthly_points':
          vm.showDay = true;
          vm.showMonth = false;
          vm.showTotal = true;
		  vm.ordering.daily = "";
          vm.ordering.monthly = "active";
          vm.ordering.total = "";
          break;
        case 'current_total_points':
          vm.showDay = true;
          vm.showMonth = true;
          vm.showTotal = false;
		  vm.ordering.daily = "";
          vm.ordering.monthly = "";
          vm.ordering.total = "active"
          break;
      }
    }
    
    function personClick(f){
      if(f.id != vm.user.id){
        showFriend(f);
      }
    }
	
    function search(){
      userData.getFriendsFromSearch(vm, vm.searchText);
      vm.searchSubmitted = true;
    }

    function createFriendRequest(friendRequest){
      userData.createFriendRequest(vm, friendRequest, search);
    }

    function deleteFriendRequest(friendRequest){
      userData.deleteFriendRequest(vm, friendRequest, search);
    }

    function acceptFriendRequest(friendRequest){
      userData.acceptFriendRequest(vm, friendRequest);
    }

    function declineFriendRequest(friendRequest){
      userData.declineFriendRequest(vm, friendRequest);
    }

    function deleteFriend(friend){
      userData.deleteFriend(vm, friend);
    }

    function showFriend(friend){
      userData.setStateData('currentFriendId', friend.id);
      $state.go('friend');
    }
  }

})();
