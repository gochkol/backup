(function () {
  'use strict';

  angular
    .module('app.friends')
    .controller('FriendsController', FriendsController);

  FriendsController.$inject = ['$state', '$scope', '$stateParams', 'userData', 'userDataSet', 'infoFactory', 'globalData', 'globalDataSet', '$ionicLoading', '$timeout', 'helpers'];

  function FriendsController($state, $scope, $stateParams, userData, userDataSet, infoFactory, globalData, globalDataSet, $ionicLoading, $timeout, helpers){
    var vm = this;

    vm.user = userDataSet.user;
    vm.blur = helpers.blur;
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
    vm.isCollapsedLeaders = false;
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
    vm.personClick = personClick;
    vm.ordering = {daily: "",
                   monthly: "",
                   total: ""}
    order('current_monthly_points');

	$scope.$on('$ionicView.beforeEnter', function(){
      userData.getFriends(vm);
    });

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
	  $ionicLoading.show({
      template: 'Opening Friend...'
      });
	  $timeout(function () {
        $ionicLoading.hide();
        }, 5000);
	  userData.setStateData('currentFriendId', friend.id);
      $state.go('nav.friend').then(function(){$ionicLoading.hide()});
    }
  }

})();
