(function(){
  'use strict';

  angular
    .module('app')
    .service('angularFilepicker', angularFilepicker);

  angularFilepicker.$inject = ['$window'];

  function angularFilepicker($window){
    return $window.filepicker;
  }

})();
