(function () {
  'use strict';

  angular
    .module('app.logout')
    .controller('LogoutController', LogoutController);

  LogoutController.$inject = ['$location', 'auth', 'globalData'];

  function LogoutController($location, auth, globalData) {
    if ($location.search().clear_cache){
      globalData.clearData();
    }
    auth.logout();
  }

})();
