(function(){
  'use strict';

  angular
    .module('app')
    .filter('BAnotAvailable_F', BAnotAvailable_F);

  function BAnotAvailable_F(){

    return function(input){
      var out = [];
      angular.forEach(input, function(b_a_id){
          if((b_a_id === 1) || (b_a_id === 2) || (b_a_id === 8) || (b_a_id === 10) || (b_a_id === 12) || (b_a_id === 15) || (b_a_id === 16)){
          }else{
            out.push(b_a_id);
          }
      }, out);
      return out;
    }
  }
})();

(function(){
  'use strict';

  angular
    .module('app')
    .filter('BAnotAvailable_B', BAnotAvailable_B);

  function BAnotAvailable_B(){

    return function(input){
      var out = [];
      angular.forEach(input, function(b_a_id){
          if((b_a_id === 3) || (b_a_id === 4) || (b_a_id === 7) || (b_a_id === 8) || (b_a_id === 10) || (b_a_id === 11) || (b_a_id === 13) || (b_a_id === 15) || (b_a_id === 16) || (b_a_id === 18)){          
            out.push(b_a_id);
          }else{
          }
      }, out);
      return out;
    }
  }
})();
