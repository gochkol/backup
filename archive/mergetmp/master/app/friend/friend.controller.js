(function () {
  'use strict';

  angular
    .module('app.friend')
    .controller('FriendController', FriendController);

  FriendController.$inject = ['$scope', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'friendData', 'helpers', '$state'];

  function FriendController($scope, globalData, userData, globalDataSet, userDataSet, friendData, helpers, $state){
    var vm = this;
    vm.friend = friendData;
    vm.user = userDataSet.user;
    vm.friends = userDataSet.friends;
    vm.friendRequestsForMe = userDataSet.friendRequestsForMe;
    vm.friendRequestsFromMe = userDataSet.friendRequestsFromMe;
    vm.timeString = helpers.timeString;
    vm.formatTime = helpers.formatTime;
	vm.level = globalDataSet.levelLookup[vm.friend.level_id];
    vm.isReadonly = false;
    vm.isReadonlyTwo = false;
	vm.favorites = userDataSet.favorites;
	vm.favoritesMax = 10;
	vm.maxMonth = 600;
    vm.maxDay = 50;
	vm.dProgress = (vm.dpoints / vm.maxDay)*100;
    vm.mProgress = (vm.friend.current_monthly_points / vm.maxMonth)*100;
	vm.isCollapsedPoints = true;
    vm.isCollapsedLogs = true;
    vm.isCollapsedStats = true;
    vm.isCollapsedFriends = true;
    vm.isCollapsedWorkouts = true;
    vm.predicate = 'monthly_points';
	vm.deleteFriend = deleteFriend;
    vm.createFriendRequest = createFriendRequest;
    vm.expander = expander;
    vm.workouts = {};
    vm.workoutHidden = {};
    vm.getWorkout = getWorkout;
    vm.exerciseLookup = globalDataSet.exerciseLookup;
    vm.friendsCheck= friendsCheck;
    vm.createFriendRequest = createFriendRequest;
    vm.createFavorite = createFavorite;
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time:'},
      reps:         {name: 'Reps:'},
      breath:       {name: 'Breaths:'},
      pattern:      {name: 'Pattern:'},
      weight:       {name: 'Lb:'},
      rest:         {name: 'Rest:'}
    }

	$scope.$on('$ionicView.beforeLeave', function(){
      userData.getFriends(vm);
    });
	
    for(var w in vm.friend.workouts){
      vm.workoutHidden[vm.friend.workouts[w].id] = true;
    }

    for(var f in vm.friends){
      if(vm.friends[f].id == vm.friend.id){
        for(var c in vm.friends[f]){
          vm.friend[c] = vm.friends[f][c];
        }
      }
    }
	
    function createFriendRequest(friendRequest){
      userData.createFriendRequest(vm, friendRequest);
    }
	
	function deleteFriend(friend){
      userData.deleteFriend(vm, friend);
	  $state.go("nav.friends");
    }

    function friendsCheck(f){
      for(var i in vm.friends){
        if((vm.friends[i].id == f.id) || (vm.user.id == f.id)){
          return true;
        }
      }
      for(var r in vm.friendRequestsForMe){
        if((vm.friendRequestsForMe[r].user.id == f.id)){
          return true;
        }
      }
      for(var m in vm.friendRequestsFromMe){
        if((vm.friendRequestsFromMe[m].friend.id == f.id)){
          return true;
        }
      }
      return false;
    }

    function getWorkout(workoutId){
      userData.getWorkout(vm.workouts, workoutId);
    }

    function expander(wh, wo){
      if(!vm.workouts[wo.id]){
        getWorkout(wo.id)
      }
      vm.workoutHidden[wo.id] = !vm.workoutHidden[wo.id];
    }

    function createFavorite(workout){
      userData.createFavorite(workout);
    }

  }

})();
