(function(){
  'use strict';

  angular
    .module('app.modal')
    .factory('modalUtils', modalUtils);

  modalUtils.$inject = ['$modal'];

  function modalUtils($modal){
    var currentOpen = '';

    var factory = {
      launch: launch
    }

    return factory;

    function launch(templateType, data){
      var modalInstance;
      var modalData = {};
      var thisOpen = '';
      var modalConfig = {
        controller: 'ModalController',
        resolve: {modalData: modalData}
      }

      switch (templateType){
        case 'error':
          modalConfig.templateUrl = 'app/modal/modalError.html';
          modalData.error_message = data || "Something went wrong";
          thisOpen = templateType + modalData.error_message;

          break;
        case 'welcomeAfterSignup':
          modalConfig.templateUrl = 'app/modal/modalWelcomeAfterSignup.html';
          thisOpen = templateType;
          break;
        case 'greatJob':
          modalConfig.templateUrl = 'app/modal/modalGreatJob.html';
          modalData.sentence = data;
          thisOpen =  templateType;
          break;
        default:
          return;
      }

      if (thisOpen == currentOpen){
        return;
      }
      else{
        currentOpen = thisOpen;
      }

      modalInstance = $modal.open(modalConfig);
      modalInstance.result.then(
        function(resultData){
          currentOpen = '';
        },
        function(data){
          currentOpen = '';
        });
    }
  }

})();




