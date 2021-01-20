(function (){
  'use strict';

  angular
    .module('app.nav')
    .controller('NavController', NavController);

  NavController.$inject = ['$state', 'userDataSet'];

  function NavController($state, userDataSet){
    var vm = this;
    vm.showTryDemoLink = $state.current.name == 'main';
    vm.checkState = checkState;
    vm.user = userDataSet.user;
    vm.friendRequestsForMe = userDataSet.friendRequestsForMe;

	
    function checkState(s){
      if(s === $state.current.name){
        return "active";
      }else{
        return "";
      }
    }
  }

})();

