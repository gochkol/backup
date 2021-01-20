angular.module('updown.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

 
})


.controller( 'LoginCtrl', function LoginController( $scope, $http, store, $state, Data) {

//--------------------------------------------------------------------------------------------------------------------------------
// Set Up Variable and get user from cookie if remembered
//--------------------------------------------------------------------------------------------------------------------------------
  if(!Data.getUsages()){
    $http.get(Data.backendURL('/v1/usages'), { skipAuthorization: true }).then(function (result){
      $scope.usages = result.data;
      Data.setUsages($scope.usages);
    });
  }
  $scope.isReadonly = false;
  $scope.settings = store.get('settings') || Data.getSettings();
  $scope.settings ? $scope.remember = $scope.settings.remember : $scope.remember = false;
  $scope.remember ? $scope.user = {'email': store.get(settings).email, 'password': ""} || {} : $scope.user = {};
  var user = null;

//--------------------------------------------------------------------------------------------------------------------------------
// Login button Pressed
//--------------------------------------------------------------------------------------------------------------------------------
  $scope.login = function(){
    $scope.isReadonly=true;
    var target = Data.backendURL('/v1/auth');
    $http({
      url: target,
      method: 'POST',
      skipAuthorization: true,
      data: $scope.user
    }).then(function(response) {
      store.set('jwt', response.data.auth_token);
      $http.get(Data.backendURL('/v1/profile', { skipAuthorization: true })).success(function(data){
        user = data;
        if(!user.settings){
          $scope.settings = Data.getSettings();
          user.settings = $scope.settings;
          target = Data.backendURL('/v1/profile');
          $http({
            url: target,
            method: 'PATCH',
            data: user
          }).then(function(response) {
            $scope.user = user;
            $scope.isReadonly = true;
            store.set('jwt', response.data.auth_token);
            Data.setUser($scope.user);
            $state.go('home');
          }, function(response) {
            alert(response.data.errors);
          });
        }else{
          $state.go('home');
        }
      });
    }, function(response) {
      alert(response.data.errors);
      $scope.isReadonly = false;
    });
  }
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
