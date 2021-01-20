(function () {
  'use strict';

  angular
    .module('app')
    .controller('MisfireController', MisfireController);

  MisfireController.$inject = ['$state', '$rootScope'];

  function MisfireController($state, $rootScope) {
    $rootScope.isLoggedIn() ? $state.go('home') : $state.go('login');
  }

})();
