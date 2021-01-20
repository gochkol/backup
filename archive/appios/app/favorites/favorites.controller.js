(function () {
  'use strict';

  angular
    .module('app.favorites')
    .controller('FavoritesController', FavoritesController);

  FavoritesController.$inject = ['$state', 'userData', 'userDataSet', 'workout', 'infoFactory'];

  function FavoritesController($state, userData, userDataSet, workout, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.favorites = userDataSet.favorites;
    vm.doWorkout = doWorkout;
    vm.deleteFavorite = deleteFavorite;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;

    function doWorkout(favorite){
      workout.setFavoriteRequest(favorite);
      $state.go('nav.customizeWorkout');
    }

    function deleteFavorite(index){
      var favorite = vm.favorites[index];
      userData.deleteFavorite(vm, favorite);
    }
  }
})();
