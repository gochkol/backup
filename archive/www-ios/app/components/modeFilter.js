(function(){
  'use strict';

  angular
    .module('app')
    .filter('modeFilter', modeFilter);

  function modeFilter(){

    return function(input){
      var out = {};
      angular.forEach(input, function(value, criteria){
          if(criteria == 'duration'){
            if(value === ""){
            }else{
              out[criteria] = value;
            }
          }
          if(criteria == 'reps'){
            out[criteria] = value;
          }
          if(criteria == 'distance'){
            out[criteria] = value;
          }
          if(criteria == 'breath'){
            out[criteria] = value;
          }
          if(criteria == 'pattern'){
            out[criteria] = value;
          }
          if(criteria == 'weight'){
            out[criteria] = value;
          }
          if(criteria == 'rest'){
            out[criteria] = value;
          }
      }, out);
      return out;
    }
  }
})();
