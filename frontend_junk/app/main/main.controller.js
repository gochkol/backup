(function () {
  'use strict';

  angular
    .module('app.main')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', '$state', 'globalData', 'auth', 'modalUtils', 'constants', 'globalStats'];

  function MainController($scope, $state, globalData, auth, modalUtils, constants, globalStats) {
    var vm = this;
    vm.loginModal = loginModal;
    vm.isCollapsed = true;
    vm.collapsedOne = false;
    vm.collapsedTwo = false;
    vm.collapsedThree = false;
    vm.collapsedFour = false;
    vm.blog = constants().BLOG;
    vm.stats = globalStats;

    $scope.myInterval = 4000;
    $scope.slides = [
      {
      image: 'https://www.updowntech.com/content/images/slide_1_main.png'
      },
        {
      image: 'https://www.updowntech.com/content/images/slide_2_smart.png'
      },
      {
      image: 'https://www.updowntech.com/content/images/slide_3_social.png'
      },
        {
      image: 'https://www.updowntech.com/content/images/slide_4_personal.png'
      }
    ];

    $scope.twoslides = [
      {
        image: 'https://www.updowntech.com/content/images/mike.jpg',
        person: 'Mike Freise',
        role: 'Co-Founder, Design'
      },
      {
        image: 'https://www.updowntech.com/content/images/chris.jpg',
        person: 'Chris Freise',
        role: 'Co-Founder, CEO'
      },
      {
        image: 'https://www.updowntech.com/content/images/jes.jpg',
        person: 'Jes Greenwood',
        role: 'Co-Founder, Engineering'
      },
      {
        image: 'https://www.updowntech.com/content/images/johan.jpg',
        person: 'Johan Kellum',
        role: 'Engineering'
	    }
    ];

    function loginModal(){
      modalUtils.launch('login');
    }

    function checkState(s){
      if(s === $state.current.name){
        return "active";
      }else{
        return "";
      }
    }
  }
})();
