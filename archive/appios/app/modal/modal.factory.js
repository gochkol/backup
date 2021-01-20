(function(){
  'use strict';

  angular
    .module('app.modal')
    .factory('modalUtils', modalUtils);

  modalUtils.$inject = ['$modal', '$state'];

  function modalUtils($modal, $state){
    var openModalTypes = {};

    var factory = {
      launch: launch
    }

    return factory;

    function launch(templateType, data){
      var thisOpenType;
      var modalInstance;
      var modalData = {};
      var modalConfig = {
        controller: 'ModalController',
        resolve: {modalData: modalData}
      }

      switch (templateType){
        case 'error':
          modalConfig.templateUrl = 'app/modal/modalError.html';
          modalData.error_message = data || "Something went wrong";
          thisOpenType = templateType + modalData.error_message;
          break;
        case 'guestFinishWorkout':
          modalConfig.templateUrl = 'app/modal/modalGuestFinishWorkout.html';
          thisOpenType = templateType;
          break;
        case 'welcomeGuest':
          modalConfig.templateUrl = 'app/modal/modalWelcomeGuest.html';
          thisOpenType = templateType;
          break;
        case 'welcomeAfterSignup':
          modalConfig.templateUrl = 'app/modal/modalWelcomeAfterSignup.html';
          thisOpenType = templateType;
          break;
        case 'greatJob':
          modalConfig.templateUrl = 'app/modal/modalGreatJob.html';
          modalData.sentence = data;
          thisOpenType =  templateType;
          break;
        case 'youSure':
          modalConfig.templateUrl = 'app/modal/modalYouSure.html';
          thisOpenType = templateType;
          break;
      }

      if (openModalTypes[thisOpenType]){
        return;
      }
      else{
        openModalTypes[thisOpenType] = true;
      }

      modalInstance = $modal.open(modalConfig);
      modalInstance.result.then(
        function(resultData){
          openModalTypes[thisOpenType] = false;
          if (templateType === 'youSure' || templateType === 'guestFinishWorkout'){
            data();
          }
        },
        function(data){
          openModalTypes[thisOpenType] = false;
        }
      );
    }
  }

})();




