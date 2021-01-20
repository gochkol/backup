(function(){
  'use strict';

  angular
    .module('app')
    .directive('udAnimatedButton', udAnimatedButton);

  udAnimatedButton.$inject = ['$timeout', '$rootScope'];

  function udAnimatedButton($timeout, $rootScope){
    var directive = {
      restrict: 'AE',
      replace: true,
      scope: {
        options: '=?'
      },
      controller: [ '$scope', function($scope) {
        $scope.options = $scope.options || {};
        $scope.options = {
          submitText: $scope.options.submitText || 'Submit',
          submittingText: $scope.options.submittingText || 'Submitting.. '
        }
      }],
      template:
        '<button type="submit" class="btn btn-primary btn-lg img-responsive clearfix">' +
          '<div class="text" style="display:inline">{{buttonText}}</div>' +
          '<div class="" style="display:inline">' +
            '<span class="fa fa-circle-o-notch fa-spin icon-spinner icon-submit hidden" style="display:inline"></span>' +
          '</div>' +
        '</button>',
      link: function(scope, element) {
        var el = element;

        var icons = {
          submitting: angular.element(el[0].querySelector('.icon-submit')),
        };

        $rootScope.$watch('showLoading', function(newValue) {
          if (newValue) {
            scope.buttonText = scope.options.submittingText;
            icons.submitting.removeClass('hidden');
          }
          else{
            scope.buttonText = scope.options.submitText;
            icons.submitting.addClass('hidden');
          }
        }, true).bind(this);

        scope.buttonText = scope.options.submitText

      }
    };
    return directive;
  }
})();
