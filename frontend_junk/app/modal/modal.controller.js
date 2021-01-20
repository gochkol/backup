(function () {
  'use strict';

  angular
    .module('app.modal')
    .controller('ModalController', ModalController);

  ModalController.$inject = ['$scope', '$state', '$modalInstance', 'modalData', 'globalData', 'auth'];

  function ModalController($scope, $state, $modalInstance, modalData, globalData, auth) {
    var vm = $scope;
    vm.data = modalData;
    vm.ok = ok;
	  vm.returnHome = returnHome;
    vm.cancel = cancel;
    vm.isReadonlytwo = false;
    if(vm.data.goal){
      vm.data.bonus = Math.round(vm.data.goal*0.25);
    }
	  vm.user = {'email': '', 'password': ''};
    vm.login = login;
	  vm.forgotPW = forgotPW;
	  vm.signup = signup;
    vm.fbShare = fbShare;
    vm.fbShareLevel = fbShareLevel;
    vm.fbShareGoal = fbShareGoal;
    
    function fbShare(event){
      FB.ui({
        method: 'feed',
        link: 'https://www.updowntech.com/',
        caption: event.sentence,
      }, function(response){});
    }

    
    function fbShareLevel(event){
      FB.ui({
        method: 'feed',
        link: 'https://www.updowntech.com/',
        caption: 'I reached level ' + event.level.value + ' in the Updown Fitness app!'
      }, function(response){});
    }
    
    function fbShareGoal(event){
      FB.ui({
        method: 'feed',
        link: 'https://www.updowntech.com/',
        caption: 'I hit my weekly points goal in the Updown Fitness app!'
      }, function(response){});
    }
    
    function login() {
      auth.login(vm.user);
	    $state.go('home');
	    $modalInstance.close();
    }

    function forgotPW() {
	    $modalInstance.close();
	    $state.go('resetPassword');
	  }

    function signup() {
	    $modalInstance.close();
	    $state.go('signup');
	  }

    function ok(){
      $modalInstance.close();
    }

    function returnHome() {
      $modalInstance.close();
      $state.go('home');
    }

    function cancel(){
      $modalInstance.dismiss();
    }

  }
})();


