(function () {
  'use strict';

  angular
    .module('app.favorites')
    .controller('FavoritesController', FavoritesController);

  FavoritesController.$inject = ['$state', 'userData', 'userDataSet', 'workout', 'infoFactory', '$ionicLoading'];

  function FavoritesController($state, userData, userDataSet, workout, infoFactory, $ionicLoading) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.favorites = userDataSet.favorites;
    vm.doWorkout = doWorkout;
    vm.deleteFavorite = deleteFavorite;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
	vm.favoritesMax = 10;

    function doWorkout(favorite){
	  $ionicLoading.show({
      template: 'Opening Favorite...'
      });
      workout.setFavoriteRequest(favorite);
      $state.go('nav.customizeWorkout').then(function(){$ionicLoading.hide()});
    }

    function deleteFavorite(index){
      var favorite = vm.favorites[index];
      userData.deleteFavorite(vm, favorite);
    }
  }
})();
