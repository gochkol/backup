(function(){
  'use strict';

  angular
    .module('app')
    .provider('userData', userDataProvider);

  userDataProvider.$inject = [];

  function userDataProvider(){
    var dataStore = null;
    var provider = {
      getAuthToken: getAuthToken,
      $get: userData
    };

    return provider;

    function getAuthToken(){
      return dataStore.get('authToken');
    };

    userData.$inject = ['$http', '$location', '$q', 'jwtHelper', 'store', 'config', 'data', 'helpers', 'modalUtils', 'Upload'];

    function userData($http, $location, $q, jwtHelper, store, config, data, helpers, modalUtils, Upload) {
      var dataInfo = [];
      var dataInfoLookup = {};
      var user = {};
      var factory = {
        initialize: initialize,
        clearData: clearData,
        getAuthToken: getAuthToken,
        setAuthToken: setAuthToken,
        getStateData: getStateData,
        setStateData: setStateData,
        isLoggedIn: isLoggedIn,
        login: login,
        facebookLink: facebookLink,
        facebookLogin: facebookLogin,

        create: create,
        createQuickLog: createQuickLog,
        createEventComment: createEventComment,
        createFavorite: createFavorite,
        createFriendRequest: createFriendRequest,
        acceptFriendRequest: acceptFriendRequest,
        joinCompany: joinCompany,
        leaveCompany: leaveCompany,

        updateBodyStats: updateBodyStats,
        updateBodyPartStats: updateBodyPartStats,
        updateUser: updateUser,
        updateUserStatus: updateUserStatus,
        updateUserLocations: updateUserLocations,

        getDataSet: getDataSet,
        getBodyStatHistory: getBodyStatHistory,
        getBodyPartStatHistory: getBodyPartStatHistory,
        getWeight: getWeight,
        getEventComments: getEventComments,
        getEvents: getEvents,
        getFriend: getFriend,
        getFriends: getFriends,
        getFriendsFromSearch: getFriendsFromSearch,
        getBlockStats: getBlockStats,

        deleteFavorite: deleteFavorite,
        deleteFriend: deleteFriend,
        declineFriendRequest: declineFriendRequest,
        deleteEventComment: deleteEventComment,
        deleteFriendRequest: deleteFriendRequest,

        uploadAvatar: uploadAvatar,

        redeemCard: redeemCard,

        resetPassword: resetPassword,
        newPassword: newPassword
      };

      dataStore = store.getNamespacedStore(config.options.userStoreName);

      return factory;

      function initialize(){
        dataInfo = [
          {name: 'user', target: 'user', store: true, transform: helpers.mergeDefaultSettings},
          {name: 'auth', target: 'auth', store: false},
          {name: 'facebook_auth', target: 'facebook_auth', store: false},
          {name: 'facebook_link', target: 'facebook_link', store: false},
          {name: 'events', target: 'users/events', store: true},
          {name: 'favorites', target: 'users/favorites', store: false},
          {name: 'eventComments', target: 'users/event_comments', store: false},
          {name: 'locations', target: 'users/locations', store: true},
          {name: 'bodyStats', target: 'users/body_stats', store: true},
          {name: 'bodyPartStats', target: 'users/body_part_stats', store: false},
          {name: 'bodyStatHistory', target: 'users/body_stats_stream', store: false},
          {name: 'bodyPartStatHistory', target: 'users/body_part_stats_stream'},
          {name: 'company', target: 'users/company', store: true},
          {name: 'companyJoin', target: 'users/join_company', store: false},
          {name: 'companyLeave', target: 'users/leave_company', store: false},
          {name: 'userHistory', target: 'users/history', store: true},
          {name: 'friend', target: 'users/friend', store: true},
          {name: 'friends', target: 'users/friends', store: true},
          {name: 'friendRequestsForMe', target: 'users/friend_requests', params: {friend_request_type: 'for_me'}, store: true},
          {name: 'friendRequestsFromMe', target: 'users/friend_requests', params: {friend_request_type: 'from_me'}, store: true},
          {name: 'friendRequestAccept', target: 'users/friend_requests_accept', store: false},
          {name: 'friendRequestDecline', target: 'users/friend_requests_decline', store: false},
          {name: 'friendsFromSearch', target: 'users/friends_search', store: false},
          {name: 'points', target: 'users/points', store: true},
          {name: 'quickLog', target: 'users/quick_logs', store: false},
          {name: 'password', target: 'password', store: false},
          {name: 'workout', target: 'workout', store: false},
          {name: 'blockStats', target: 'users/block_stats', store: false},
          {name: 'exerciseStats', target: 'users/exercise_stats', store: false},
          {name: 'token_changes', target: 'users/token_changes', store: false},
          {name: 'gym', target: 'users/gym', store: false},
          {name: 'gymMembers', target: 'users/gym_members', store: false},
          {name: 'gymEvents', target: 'users/gym_events', store: false},
          {name: 'gymWorkouts', target: 'users/gym_workouts', store: false},
          {name: 'updownWorkouts', target: 'users/updown_workouts', store: false},
          {name: 'rewards', target: 'users/rewards', store: false},
          {name: 'rewardCard', target: 'users/redeem_reward_card', store: false},
        ]

        for(var i = 0; i < dataInfo.length; i++){
          dataInfo[i].url = config.getUserUrl();
          var info = dataInfo[i];
          dataInfoLookup[info.name] = info;
        }
        data.initStoredData(dataStore, dataInfo);
      }

      function clearData(){
        for (var i = 0; i < dataInfo.length; i++){
          if (dataInfo[i].store){
            dataStore.set(dataInfo[i].name, null);
          }
        }
        dataStore.set('authToken', undefined);
        dataStore.set('stateData', undefined);
      }

      function getStateData(name, defaultValue){
        var stateData = dataStore.get('stateData');

        if (!stateData){
          dataStore.set('stateData', {});
          stateData = dataStore.get('stateData');
        }

        if (stateData[name] == undefined){
          stateData[name] = (defaultValue != undefined) ? defaultValue : null;
          dataStore.set('stateData', stateData);
        }

        return stateData[name];
      }

      function setStateData(name, value){
        var stateData = dataStore.get('stateData');

        if (!stateData){
          dataStore.set('stateData', {});
          stateData = dataStore.get('stateData');
        }
        stateData[name] = value;
        dataStore.set('stateData', stateData);
        return stateData[name];
      }

      function get(dataName, params){
        return data.getData(dataInfoLookup[dataName], params);
      }

      function destroy(dataName, params){
        return data.deleteData(dataInfoLookup[dataName], params);
      }

      function create(dataName, params){
        return data.postData(dataInfoLookup[dataName], params);
      }

      function login(params){
        return data.postLogin(dataInfoLookup['auth'], params);
      }

      function facebookLogin(params){
        return data.postLogin(dataInfoLookup['facebook_auth'], params);
      }

      function facebookLink(params){
        return data.postLogin(dataInfoLookup['facebook_link'], params);
      }

      function update(dataName, params){
        return data.patchData(dataInfoLookup[dataName], params);
      }

      function actionThenBind(actionFunction, vm, dataName, params, refreshNames, refreshFunction, transformFunction){
        refreshNames = refreshNames || [];

        actionFunction(dataName, params).then(
          function(responseData){
            if (vm[dataName] != undefined){
              vm[dataName] = transformFunction ? transformFunction(responseData) : responseData;
            }
            for (var i = 0; i < refreshNames.length; i++){
              actionThenBind(get, vm, refreshNames[i]);
            }
            if (refreshFunction){
              refreshFunction();
            }
          }
        );
      }

      function redeemCard(cardId, afterRedemption){
        var params = {id: cardId}
        return data.postData(dataInfoLookup['rewardCard'], params, null, afterRedemption);
      }

      /////////////////////////////////////////
      // CREATEs
      /////////////////////////////////////////
      function createEventComment(event, commentText){
        var params = {event_id: event.id, comment_text: commentText};
        create('eventComments', params).then(
          function (responseData){
            getEventComments(event);
          }
        );
        event.comment_count++;
      }

      function createFavorite(workout){
        var params = {workout_id: workout.id, name: workout.name};
        create('favorites', params).then(
		      function (){
			      modalUtils.launch('Favorite');
		      });
      }

      function uploadAvatar(vm, file, uploadingStatus){
        var info = dataInfoLookup['user'];
        var url = config.getUserUrl() + info.target
        var params = {url: url, method: 'PATCH', data: {avatar_file: file}};

        uploadingStatus = true;
        Upload.upload(params).then(
          function(response){
            uploadingStatus = false;
            vm.user = response.data;
          },
          function(response){
            uploadingStatus = false;
            modalUtils.launch('error', 'Could not upload avatar');
          }
        );
        return false;
      }

      function createQuickLog(vm, request, refreshFunction){
        var params = {
          number_of_days_ago: request.numberOfDaysAgo,
          quick_activity_id: request.quickActivityId,
          duration: request.duration,
          desc: request.description,
          calories_burned: request.caloriesBurned,
		      distance_miles: request.distanceMiles
        }
        actionThenBind(create, vm, 'quickLog', params, [], refreshFunction);
      }

      function createFriendRequest(vm, friend, refreshFunction){
        var params = {friend_id: friend.id};
        actionThenBind(create, vm, 'friendRequestsFromMe', params, [], refreshFunction);
      }

      function acceptFriendRequest(vm, friendRequest){
        var params = {user_id: friendRequest.user.id};
        actionThenBind(create, vm, 'friendRequestAccept', params, ['friends', 'friendRequestsForMe']);
      }

      function joinCompany(vm, signupCode){
        var params = {signup_code: signupCode};
        actionThenBind(create, vm, 'companyJoin', params, ['company']);
      }

      function leaveCompany(vm, company){
        var params = {company_id: company.id};
        actionThenBind(destroy, vm, 'companyLeave', params, ['company']);
      }


      /////////////////////////////////////////
      // UPDATEs
      /////////////////////////////////////////
      function updateBodyStats(vm, bodyStats){
        actionThenBind(update, vm, 'bodyStats', {body_stats: bodyStats});
      }

      function updateBodyPartStats(vm, bodyPartStats){
        actionThenBind(update, vm, 'bodyPartStats', {body_part_stats: bodyPartStats});
      }

      function updateUserLocations(locations){
        update('locations', {locations: locations});
      }

      function updateUser(vm, refreshFunction){
        actionThenBind(update, vm, 'user', vm.user, null, refreshFunction);
      }

      function updateUserStatus(vm, status){
        var params = {current_status: status};
        actionThenBind(update, vm, 'user', params, ['events']);
      }


      /////////////////////////////////////////
      // GETs
      /////////////////////////////////////////
      function getDataSet(dataNames){
        var dataInfos = [];
        for (var i = 0; i < dataNames.length; i++){
          dataInfos.push(dataInfoLookup[dataNames[i]]);
        }
        return data.getDataSet(dataInfos);
      }

      function getBodyStatHistory(vm, bodyStat, refresher){
        var params = {value: bodyStat.value};
        actionThenBind(get, vm, 'bodyStatHistory', params, null, refresher, transformStats);
      }

      function transformStats(dataIn){
        var dataOut = [];
        for (var i = 1; i < dataIn.length; i++){
          var data = dataIn[i];
          dataOut.push({x: new Date(data['created_at']), value: data['data']});
        }

        return dataOut;
      }

      function getBodyPartStatHistory(vm, bodyPartStat, refresher){
        var params = {body_part_id: bodyPartStat.body_part_id};
        actionThenBind(get, vm, 'bodyPartStatHistory', params, null, refresher, transformStats);
      }

      function getWeight(){
//        var bodyStats = getStateData('bodyStats');
//        for(var b in bodyStats){
//          if(bodyStats[b].value === 'weight'){
//            return bodyStats[b].data;
//          }
//        }
        return 150;
      }

      function getBlockStats(vm, exerciseID, refresher){
        var params = {exercise_id: exerciseID};
        actionThenBind(get, vm, 'blockStats', params, null, refresher);
      }

      function getWorkout(workouts, workoutId, transformer){
        var params = {id: workoutId};
        get('workout', params).then(
          function (responseData){
            workouts[workoutId] = responseData;
            transformer();
          }
        );
      }

      function getEventComments(event){
        var params = {event_id: event.id};
        get('eventComments', params).then(
          function (responseData){
            event.comments = responseData;
          }
        );
      }

      function getEvents(vm, force){
        actionThenBind(get, vm, 'events');
      }

      function getFriend(friendId){
        friendId = friendId ? friendId : this.getStateData('currentFriendId');
        return get('friend', {friend_id: friendId});
      }

      function getFriends(vm){
        actionThenBind(get, vm, 'friends');
      }

      function getFriendsFromSearch(vm, searchText){
        var params = {search_text: searchText};
        actionThenBind(get, vm, 'friendsFromSearch', params);
      }

      /////////////////////////////////////////
      // DESTROYs
      /////////////////////////////////////////
      function deleteFavorite(vm, favorite){
        var params = {favorite_id: favorite.id};
        actionThenBind(destroy, vm, 'favorites', params);
      }

      function deleteFriend(vm, friend){
        var params = {friend_id: friend.id};
        actionThenBind(destroy, vm, 'friends', params);
      }

      function declineFriendRequest(vm, friendRequest, refreshFunction){
        var params = {user_id: friendRequest.user.id};
        actionThenBind(destroy, vm, 'friendRequestDecline', params, ['friendRequestsForMe'], refreshFunction);
      }

      function deleteEventComment(event, comment){
        var params = {event_id: event.id, comment_id: comment.id};
        destroy('eventComments', params).then(
          function (responseData){
            getEventComments(event);
          }
        )
        event.comment_count--;
      }

      function deleteFriendRequest(vm, friendRequest, refreshFunction){
        var params = {friend_id: friendRequest.friend.id};
        actionThenBind(destroy, vm, 'friendRequestsFromMe', params, [], refreshFunction);
      }

      function resetPassword(email){
        return create('password', {email: email});
      }

      function newPassword(params){
        return update('password', params);
      }

      function setAuthToken(authToken){
        dataStore.set('authToken', authToken);
      }

      function isLoggedIn(){
        var token = getAuthToken();
         if (!token || jwtHelper.isTokenExpired(token)){
           return false;
         }
         else{
           return true;
         }
      }
    }
  }
})();



