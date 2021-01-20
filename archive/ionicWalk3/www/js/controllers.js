angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicHistory) {
})

// This controls the walkthrough functionality
.controller('IntroCtrl', function($scope, $state, $timeout, $ionicSlideBoxDelegate, $localStorage, $ionicHistory, $ionicModal) {
  
  // Called to navigate to the main app
  $scope.startApp = function() {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.dash');
  };

  //Called each time the slide changes
  $scope.slideChanged = function(index) {
    if(index !== 0) {
      $scope.first = true;
    } else {
      $scope.first = false;
    }
  };

  $ionicModal.fromTemplateUrl('login.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

})

.controller('DashCtrl', function($scope, $localStorage, $ionicHistory, $state) {
  $localStorage.intro = true;

  $scope.intro = function() {
    delete $localStorage.intro;
    $state.go('app.intro');
  };

});
