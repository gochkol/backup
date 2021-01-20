(function () {
  'use strict';

  angular
    .module('app.favorites')
    .controller('FavoritesController', FavoritesController);

  FavoritesController.$inject = ['$state', 'userData', 'userDataSet', 'workout'];

  function FavoritesController($state, userData, userDataSet, workout) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.favorites = userDataSet.favorites;
    vm.doWorkout = doWorkout;
    vm.deleteFavorite = deleteFavorite;
	vm.favoritesMax = vm.user.content_level === 'plus' ? 50 : 10;

    function doWorkout(favorite){
      workout.setFavoriteRequest(favorite);
      $state.go('customizeWorkout');
    }

    function deleteFavorite(index){
      var favorite = vm.favorites[index];
      userData.deleteFavorite(vm, favorite);
    }
  }
})();
