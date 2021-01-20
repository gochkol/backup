(function(){
  'use strict';

  angular
    .module('app')
    .directive('ngReallyClick', [ngReallyClick]);

  function ngReallyClick(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
  }
})();
