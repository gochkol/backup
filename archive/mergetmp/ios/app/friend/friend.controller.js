(function () {
  'use strict';

  angular
    .module('app.friend')
    .controller('FriendController', FriendController);

  FriendController.$inject = ['globalData', 'userData', 'globalDataSet', 'userDataSet', 'friendData', 'helpers'];

  function FriendController(globalData, userData, globalDataSet, userDataSet, friendData, helpers){
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
    vm.isCollapsedLogs = true;
    vm.isCollapsedStats = true;
    vm.isCollapsedFriends = true;
    vm.isCollapsedWorkouts = true;
    vm.predicate = 'monthly_points';
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

    function friendsCheck(f){
      for(var i in vm.friends){
        if((vm.friends[i].id == f.id) || (vm.user.id == f.id)){
          return true;
        }
      }
      for(var r in vm.friendRequestsForMe){
        if((vm.friendRequestsForMe[r].friend.id == f.id) || (vm.user.id == f.id)){
          return true;
        }
      }
      for(var m in vm.friendRequestsFromMe){
        if((vm.friendRequestsFromMe[m].friend.id == f.id) || (vm.user.id == f.id)){
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
