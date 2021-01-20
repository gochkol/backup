(function () {
  'use strict';

  angular
    .module('app.logout')
    .controller('LogoutController', LogoutController);

  LogoutController.$inject = ['$location', 'auth', 'globalData', '$ionicHistory'];

  function LogoutController($location, auth, globalData, $ionicHistory) {
    if ($location.search().clear_cache){
      globalData.clearData();
    }
	$ionicHistory.clearHistory();
    $ionicHistory.clearCache().then(function(){
    auth.logout();
	});
  }

})();
