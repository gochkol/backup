angular.module( 'profile', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('profile', {
    url: '/profile',
    controller: 'ProfileCtrl',
    templateUrl: 'profile/profile.html'
  });
  $stateProvider.state('signup', {
    url: '/signup',
    controller: 'ProfileCtrl',
    templateUrl: 'profile/signup.html'
  });
})
.controller( 'ProfileCtrl', function ProfileController( $scope, $http, store, $state, Data) {

  $scope.profileHider = false;
  
  if ($scope.isLoggedIn()){
    $scope.user = Data.getUser();
    $scope.usages = Data.getUsages();
    if(!$scope.user){
      $http.get(Data.backendURL('/v1/profile', { skipAuthorization: true })).success(function(data){
        $scope.user = data;
        Data.setUser(data);
      });
    }
    if(!$scope.usages){
      $http.get(Data.backendURL('/v1/usages'), { skipAuthorization: false}).then(function (result){
        $scope.usages = result.data;
        Data.setUsages(result.data);
      });
    }
    $scope.page_title = "Profile";
    $scope.profileHider = true;
  }
  else{
    $http.get(Data.backendURL('/v1/usages'), { skipAuthorization: true }).then(function (result){
      $scope.usages = result.data;
    });
    $scope.page_title = "Signup";
  }

  $scope.submit = function() {
    var target = Data.backendURL('/v1/profile');
    Data.setUser($scope.user);
    if ($scope.isLoggedIn()){
      $http({
        url: target,
        method: 'PATCH',
        data: $scope.user
      }).then(function(response) {
        store.set('jwt', response.data.auth_token);
        Data.setUser($scope.user);
        $state.go('home');
      }, function(response) {
        alert(response.data.errors);
      });
    }else{
      $http({
        url: target,
        method: 'POST',
        skipAuthorization: true,
        data: $scope.user
     }).then(function(response) {
        store.set('jwt', response.data.auth_token);
        Data.setUser($scope.user);
        $state.go('home');
     }, function(response) {
        alert(response.data.errors);
     });
    } 
  }

});

angular.module( 'profile')
.controller('ModalDemoCtrl', function ($scope, $modal, $log, $state, store, Data, $http) {

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'profile/welcome.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  if ($scope.isLoggedIn()){
    $scope.user = Data.getUser();
    $scope.usages = Data.getUsages();
    if(!$scope.user){
      $http.get(Data.backendURL('/v1/profile', { skipAuthorization: true })).success(function(data){
        $scope.user = data;
        Data.setUser(data);
      });
    }
    if(!$scope.usages){
      $http.get(Data.backendURL('/v1/usages'), { skipAuthorization: false}).then(function (result){
        $scope.usages = result.data;
        Data.setUsages(result.data);
      });
    }
    $scope.page_title = "Profile";
    $scope.profileHider = true;
  }
  else{
    $http.get(Data.backendURL('/v1/usages'), { skipAuthorization: true }).then(function (result){
      $scope.usages = result.data;
    });
    $scope.page_title = "Signup";
  }

  $scope.submit = function() {
    var target = Data.backendURL('/v1/profile');
    Data.setUser($scope.user);
    if ($scope.isLoggedIn()){
      $http({
        url: target,
        method: 'PATCH',
        data: $scope.user
      }).then(function(response) {
        store.set('jwt', response.data.auth_token);
        Data.setUser($scope.user);
      }, function(response) {
        alert(response.data.errors);
      });
    }else{
      $http({
        url: target,
        method: 'POST',
        skipAuthorization: true,
        data: $scope.user
     }).then(function(response) {
        store.set('jwt', response.data.auth_token);
        Data.setUser($scope.user);
     }, function(response) {
        alert(response.data.errors);
     });
    } 
  }

});



// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module( 'profile')
.controller('ModalInstanceCtrl', function ($scope, $state, $modalInstance) {

  $scope.home = function(){
    $state.go('home');
    $modalInstance.dismiss('cancel');
  }
  
  
 
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});
