(function(){
  'use strict';

  angular
    .module('app')
    .directive("fbLoginButton", function(){
      return{
        restrict: 'E',
        link: function (scope, iElement, iAttrs){
          if (FB) {
            FB.XFBML.parse(iElement[0].parent);
          }
        }
      }
    });
})();
