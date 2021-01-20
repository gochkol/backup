(function (){
  'use strict';

  angular
    .module('app.nav')
    .controller('NavController', NavController);

  NavController.$inject = ['$state'];

  function NavController($state){
    var vm = this;
    vm.isCollapsed = true;
    vm.checkState = checkState;

    function checkState(s){
      if(s === $state.current.name){
        return "active";
      }else{
        return "";
      }
    }
  }

})();

