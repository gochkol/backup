(function(){
  'use strict';

  angular
    .module('app')
    .provider('userData', userDataProvider);

  function userDataProvider(){
    var dataStore;
    var provider = {
      getAuthToken: getAuthToken,
      $get: userData
    }

    return provider

    function getAuthToken(){
      return dataStore.get('authToken');
    }

    userData.$inject = ['$http', '$location', '$q', 'store', 'config', 'data', 'helpers'];

    function userData($http, $location, $q, store, config, data, helpers) {
      var dataInfo = [];
      var dataInfoLookup = {};
      var user = {};
      var factory = {
        initialize: initialize,
        clearData: clearData,
        getAuthToken: getAuthToken,
        setAuthToken: setAuthToken,
        stateData: stateData,

        create: create,
        createQuickLog: createQuickLog,
        createEventComment: createEventComment,
        createFavorite: createFavorite,
        createFriendRequest: createFriendRequest,
        acceptFriendRequest: acceptFriendRequest,
        joinCompany: joinCompany,

        updateBodyStats: updateBodyStats,
        updateBodyPartStats: updateBodyPartStats,
        updateUser: updateUser,
        updateUserStatus: updateUserStatus,
        updateUserLocations: updateUserLocations,

        getDataSet: getDataSet,
        getBodyStatHistory: getBodyStatHistory,
        getBodyPartStatHistory: getBodyPartStatHistory,
        getWorkout: getWorkout,
        getEventComments: getEventComments,
        getEvents: getEvents,
        getFriend: getFriend,
        getFriends: getFriends,
        getFriendsSearch: getFriendsSearch,

        deleteFavorite: deleteFavorite,
        deleteFriend: deleteFriend,
        declineFriendRequest: declineFriendRequest,
        deleteEventComment: deleteEventComment,
        deleteFriendRequest: deleteFriendRequest,

        initializeStateData: initializeStateData
      };
      dataStore = store.getNamespacedStore(config.options.userStoreName);

      return factory;

      function initialize(){
        dataInfo = [
          {name: 'user', bind_as: 'user', target: 'user', store: true, transform: helpers.mergeDefaultSettings},
          {name: 'auth', target: 'auth', store: false},
          {name: 'events', bind_as: 'events', target: 'users/events', store: true},
          {name: 'favorites', bind_as: 'favorites', target: 'users/favorites', store: false},
          {name: 'eventComments', bind_as: 'comments', target: 'users/event_comments', store: false},
          {name: 'locations', target: 'users/locations', store: true},
          {name: 'bodyStats', bind_as: 'bodyStats', target: 'users/body_stats', store: true},
          {name: 'bodyPartStats', bind_as: 'bodyPartStats', target: 'users/body_part_stats', store: false},
          {name: 'bodyStatHistory', bind_as: 'bodyStatHistory', target: 'users/body_stats_stream', store: false},
          {name: 'bodyPartStatHistory', bind_as: 'bodyPartStatHistory', target: 'users/body_part_stats_stream'},
          {name: 'company', target: 'users/company', store: true},
          {name: 'companyJoin', bind_as: 'company', target: 'users/join_company', store: false},
          {name: 'userHistory', target: 'users/history', store: true},
          {name: 'friend', target: 'users/friend', store: false},
          {name: 'friends', bind_as: 'friends', target: 'users/friends', store: true},
          {name: 'friendRequestsForMe', bind_as: 'friendRequestsForMe', target: 'users/friend_requests', params: {friend_request_type: 'for_me'}, store: true},
          {name: 'friendRequestsFromMe', bind_as: 'friendRequestsFromMe', target: 'users/friend_requests', params: {friend_request_type: 'from_me'}, store: true},
          {name: 'friendRequestAccept', bind_as: 'friendRequestsForMe', target: 'users/friend_requests_accept', store: false},
          {name: 'friendRequestDecline', bind_as: 'friendRequestsForMe', target: 'users/friend_requests_decline', store: false},
          {name: 'friendsSearch', bind_as: 'friendsFromSearch', target: 'users/friends_search', store: false},
          {name: 'points', bind_as: 'points', target: 'users/points', store: true},
          {name: 'quickLogs', bind_as: 'points', target: 'users/quick_logs', store: false}
        ]

        for(var i = 0; i < dataInfo.length; i++){
          var info = dataInfo[i];
          dataInfoLookup[info.name] = info;
        }
        data.initStoredData(dataStore, dataInfo);
        initializeStateData();
      }

      function clearData(){
        for (var i = 0; i < dataInfo.length; i++){
          if (dataInfo[i].store){
            dataStore.set(dataInfo[i].name, null);
          }
        }
      }

      function getAuthToken(){
        return dataStore.get('authToken');
      }

      function setAuthToken(authToken){
        dataStore.set('authToken', authToken);
      }

      function stateData(){
        return dataStore.get('stateData');
      }


      /////////////////////////////////////////
      // CREATEs
      /////////////////////////////////////////
      function create(dataName, postData){
        return data.postData(dataInfoLookup[dataName], postData);
      }

      function createThenBind(dataName, params, bindObject){
        create(dataName, params).then(
          function(responseData){
            bindObject[dataInfoLookup[dataName].bind_as] = responseData;
          }
        );
      }

      function createEventComment(event, commentText){
        var params = {event_id: event.id, comment_text: commentText};
        createThenBind('eventComments', params, event);
        event.comment_count++;
      }

      function createFavorite(workout){
        var params = {workout_id: workout.id, name: workout.name};
        create('favorites', params);
      }

      function createQuickLog(request){
        var params = {
          number_of_days_ago: request.numberOfDaysAgo,
          quick_activity_id: request.quickActivityId,
          duration: request.duration,
          desc: request.description,
          calories_burned: request.caloriesBurned
        }
        return create('quickLogs', params);
      }

      function createFriendRequest(vm, friend){
        var params = {friend_id: friend.id};
        createThenBind('friendRequestsFromMe', params, vm);
      }

      function acceptFriendRequest(vm, friendRequest){
        var params = {user_id: friendRequest.user.id};
        createThenBind('friendRequestAccept', params, vm);
      }

      function joinCompany(vm, signupCode){
        var params = {signup_code: signupCode};
        createThenBind('companyJoin', params, vm);
      }

      /////////////////////////////////////////
      // UPDATEs
      /////////////////////////////////////////
      function update(dataName, params){
        return data.patchData(dataInfoLookup[dataName], params);
      }

      function updateThenBind(dataName, params, bindObject){
        update(dataName, params).then(
          function(responseData){
            bindObject[dataInfoLookup[dataName].bind_as] = responseData;
          }
        );
      }

      function updateBodyStats(bodyStats){
        update('bodyStats', {body_stats: bodyStats});
      }

      function updateBodyPartStats(bodyPartStats){
        update('bodyPartStats', {body_part_stats: bodyPartStats});
      }

      function updateUserLocations(locations){
        update('locations', {locations: locations});
      }

      function updateUser(vm){
        updateThenBind('user', vm.user, vm);
      }

      function updateUserStatus(vm){
        var params = {current_status: vm.user.current_status};
        update('user', params).then(
          function(responseData){
            vm.user = responseData;
            getEvents(vm, true);
          }
        );
      }


      /////////////////////////////////////////
      // GETs
      /////////////////////////////////////////
      function get(dataName, params, force){
        return data.getData(dataInfoLookup[dataName], params, force);
      }

      function getThenBind(dataName, params, bindObject, force){
        get(dataName, params, force).then(
          function(responseData){
            bindObject[dataInfoLookup[dataName].bind_as] = responseData;
            if(dataName === 'bodyStatHistory'){
              var tmpObj = {};
              tmpObj['dataDisplay'] = [];
              for(var d in bindObject[dataName]){
                tmpObj['dataDisplay'].push({'x': new Date(bindObject[dataName][d]['created_at']), 'value': bindObject[dataName][d]['data']});
              }
              tmpObj['dataDisplay'].shift();
              for(var v in bindObject['hiding']){
                v != params['value'] ? bindObject['hiding'][v] = true : bindObject['hiding'][params['value']] = !bindObject['hiding'][params['value']];
              }
              bindObject[dataName] = {};
              bindObject[dataName] = tmpObj;
            }else if(dataName === 'bodyPartStatHistory'){
              var tmpObj = {};
              tmpObj['dataDisplay'] = [];
              for(var d in bindObject[dataName]){
                tmpObj['dataDisplay'].push({'x': new Date(bindObject[dataName][d]['created_at']), 'value': bindObject[dataName][d]['data']});
              }
              tmpObj['dataDisplay'].shift();
              for(var v in bindObject['hiding']){
                v != params['body_part_id'] ? bindObject['hiding'][v] = true : bindObject['hiding'][params['body_part_id']] = !bindObject['hiding'][params['body_part_id']];
              }
              bindObject[dataName] = {};
              bindObject[dataName] = tmpObj;
            }
          }
        );
      }

      function getDataSet(dataNames){
        var dataInfos = [];
        for (var i = 0; i < dataNames.length; i++){
          dataInfos.push(dataInfoLookup[dataNames[i]]);
        }
        return data.getDataSet(dataInfos);
      }

      function getBodyStatHistory(vm, bodyStat){
        var params = {value: bodyStat.value};
        getThenBind('bodyStatHistory', params, vm);
      }

      function getBodyPartStatHistory(vm, bodyPartStat){
        var params = {body_part_id: bodyPartStat.body_part_id};
        getThenBind('bodyPartStatHistory', params, vm);
      }

      function getWorkout(vm, h){
        var params = {id: h.id};
        getThenBind('workout', params, vm);
      }

      function getEventComments(event){
        var params = {event_id: event.id};
        getThenBind('eventComments', params, event);
      }

      function getEvents(vm, force){
        getThenBind('events', {}, vm, force);
      }

      function getFriend(friendId){
        friendId = friendId ? friendId : stateData().currentFriendId;
        return get('friend', {friend_id: friendId});
      }

      function getFriends(vm){
        getThenBind('friends', {}, vm);
      }

      function getFriendsSearch(vm, searchText){
        var params = {search_text: searchText};
        getThenBind('friendsSearch', params, vm);
      }

      /////////////////////////////////////////
      // DESTROYs
      /////////////////////////////////////////
      function destroy(dataName, params){
        return data.deleteData(dataInfoLookup[dataName], params);
      }

      function deleteThenBind(dataName, params, bindObject){
        destroy(dataName, params).then(
          function(responseData){
            bindObject[dataInfoLookup[dataName].bind_as] = responseData;
          }
        );
      }

      function deleteFavorite(vm, favorite){
        var params = {favorite_id: favorite.id};
        deleteThenBind('favorites', params, vm);
      }

      function deleteFriend(vm, friend){
        var params = {friend_id: friend.id};
        deleteThenBind('friends', params, vm);
      }

      function declineFriendRequest(vm, friendRequest){
        var params = {user_id: friendRequest.user.id};
        deleteThenBind('friendRequestDecline', params, vm);
      }

      function deleteEventComment(event, comment){
        var params = {event_id: event.id, comment_id: comment.id};
        deleteThenBind('eventComments', params, event);
        event.comment_count--;
      }

      function deleteFriendRequest(vm, friendRequest){
        var params = {friend_id: friendRequest.friend.id};
        deleteThenBind('friendRequestsFromMe', params, vm);
      }

      function initializeStateData(){
        if (!dataStore.get('stateData')){
          dataStore.set('stateData', {});
        }
      }

    }
  }
})();


