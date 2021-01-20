(function(){
  'use strict';

  angular
    .module('app')
    .filter('criterionDisplay', criterionDisplay);

  criterionDisplay.$inject = ['$state']

  function criterionDisplay($state){
    return function(input){
      var output = [];

      for (var key in input){
        switch (key){
          case 'reps':
            output[0] = key;
            break;
          case 'duration':
            output[1] = key;
            break;
          case 'breath':
            output[2] = key;
            break;
          case 'pattern':
            output[3] = key;
            break;
          case 'weight':
            output[4] = key;
            break;
          case 'rest':
            if ($state.current.name != 'nav.exercise'){
              output[5] = key;
            }
            break;
        }
      }
      return output.filter(function(e){ return e});
    }
  }
})();

