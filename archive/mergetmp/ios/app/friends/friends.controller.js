(function () {
  'use strict';

  angular
    .module('app.friends')
    .controller('FriendsController', FriendsController);

  FriendsController.$inject = ['$state', '$stateParams', 'userData', 'userDataSet', 'infoFactory', 'globalData', 'globalDataSet'];

  function FriendsController($state, $stateParams, userData, userDataSet, infoFactory, globalData, globalDataSet){
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
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.isCollapsedLeaders = true;
    vm.isCollapsedFriends = true;
    vm.isCollapsedRequests = true;
    vm.isCollapsedPending = true;
    vm.infoClicked = infoFactory.getClicked;
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
      $state.go('nav.friend');
    }
  }

})();
