(function(){
  'use strict';

  angular
    .module('app')
    .filter('criterionDisplay', criterionDisplay);

  criterionDisplay.$inject = ['$state']

  function criterionDisplay($state){
    return function(input){
      var output = {};

      for (var key in input){
        switch (key){
          case 'rest':
            if($state.current.name === 'exercise'){break;}
          case 'duration':
          case 'reps':
          case 'breath':
          case 'pattern':
          case 'weight':
            {output[key] = input[key];}
            break;
        }
      }
      return output;
    }
  }
})();

