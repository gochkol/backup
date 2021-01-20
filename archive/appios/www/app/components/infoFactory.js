(function(){
  'use strict';

  angular
    .module('app')
    .factory('infoFactory', infoFactory);

  infoFactory.$inject = ['$state', 'userData'];

  function infoFactory($state, userData){

    var factory = {
      getClicked: getClicked,
      getCollapsed: getCollapsed
    }

    return factory;

    function getClicked(binding, index){
      binding.isCollapsed[index] = !binding.isCollapsed[index];
      binding.user.settings.help[$state.current.name] = binding.isCollapsed[index];
      userData.updateUser(binding);
    }

    function getCollapsed(user){
      switch($state.current.name){
        case('nav.profile'):
          return [(user.settings.help.profile || user.settings.help.all)];
        case('nav.locations'):
          return [(user.settings.help.locations || user.settings.help.all)];
        case('nav.friends'):
          return [(user.settings.help.friends || user.settings.help.all)];
        case('nav.company'):
          return [(user.settings.help.company || user.settings.help.all)];
        case('nav.friend'):
          return [(user.settings.help.friend || user.settings.help.all)];
        case('nav.points'):
          return [(user.settings.help.points || user.settings.help.all)];
        case('nav.settings'):
          return [(user.settings.help.settings || user.settings.help.all)];
        case('nav.quick'):
          return [(user.settings.help.quick || user.settings.help.all)];
        case('nav.customizeWorkout'):
          return [(user.settings.help.customizeWorkout || user.settings.help.all)];
        case('nav.exercise'):
          return [(user.settings.help.exercise || user.settings.help.all)];
        case('nav.review'):
          return [(user.settings.help.review || user.settings.help.all)];
        case('nav.favorites'):
          return [(user.settings.help.favorites || user.settings.help.all)];
        case('nav.log'):
          return [(user.settings.help.log || user.settings.help.all)];

        default:
          return [(user.settings.help.all)];
      }
    }

  }

})();
