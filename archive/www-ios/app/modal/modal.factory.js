(function(){
  'use strict';

  angular
    .module('app.modal')
    .factory('modalUtils', modalUtils);

  modalUtils.$inject = ['$modal', '$state'];

  function modalUtils($modal, $state){
    var openModalTypes = {};
    var lastLevel = null;
    var bonusHit = null;

    var factory = {
      launch: launch,
      checkLevelBonus: checkLevelBonus
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
        case 'warningMessage':
		      modalConfig.templateUrl = 'app/modal/modalWarningMessage.html';
          modalData.sentence = data;
          thisOpenType = templateType;
          break;
        case 'youSure':
          modalConfig.templateUrl = 'app/modal/modalYouSure.html';
          thisOpenType = templateType;
          break;
        case 'Favorite':
          modalConfig.templateUrl = 'app/modal/modalFavorite.html';
          thisOpenType = templateType;
          break;
        case 'LevelBonus':
          modalConfig.templateUrl = 'app/modal/modalLevelBonus.html';
          modalData.level = data.level;
          modalData.goal = data.goal;
          thisOpenType = templateType;
          break;
        case 'Level':
          modalConfig.templateUrl = 'app/modal/modalLevel.html';
          modalData.level = data.level;
          thisOpenType = templateType;
          break;
        case 'Bonus':
          modalConfig.templateUrl = 'app/modal/modalBonus.html';
          modalData.goal = data.goal;
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
          if (templateType == 'youSure'){
            data();
          }
        },
        function(data){
          openModalTypes[thisOpenType] = false;
        }
      );
    }

    function checkLevelBonus(level, week, goal){
      var launchLevel = false;
      var launchBonus = false;

      if(!lastLevel){
        lastLevel = level;
      }else{
        if(lastLevel != level){
          launchLevel = true;
          lastLevel = level;
        }
      }
      if(bonusHit === null){
        bonusHit = (week >= goal);
      }else{
        if(bonusHit != (week >= goal)){
          launchBonus = true;
          bonusHit = (week >= goal);
        }
      }

      if(launchLevel && launchBonus){
        launch('LevelBonus', {'level': level, 'week': week, 'goal': goal});
      }else if(launchLevel){
        launch('Level', {'level': level});
      }else if(launchBonus){
        launch('Bonus', {'week': week, 'goal': goal});
      }
    }

  }

})();




