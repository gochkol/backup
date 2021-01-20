(function () {
  'use strict';

  angular
    .module('app')
    .controller('AppCtrl', AppCtrl)

  AppCtrl.$inject = ['$scope', '$ionicModal', '$timeout']

  function AppCtrl($scope, $ionicModal, $timeout) {
    $scope.app = this;
  }

})();
