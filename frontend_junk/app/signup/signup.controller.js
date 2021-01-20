(function(){
  'use strict';

  angular
    .module('app.signup')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['globalDataSet', 'globalData', '$modal', 'angularFilepicker', 'dateUtils', 'auth', 'config', 'constants', '$state', 'data'];

  function SignupController(globalDataSet, globalData, $modal, angularFilepicker, dateUtils, auth, config, constants, $state, data){
    var vm = this;
    vm.user = {};
    vm.usages = globalDataSet.usages;
    vm.categories = globalDataSet.categories;
    vm.constants = constants();
    vm.years = dateUtils.getYears();
    vm.months = dateUtils.getMonths(vm.years[1].value);
    vm.days = dateUtils.getDays(vm.months[0].value, vm.years[1].value);
    vm.updateDays = updateDays;
    vm.updateMonths = updateMonths;
    vm.pickFile = pickFile;
    vm.submit = submit;
    vm.linkFacebook = linkFacebook;

    var authType = $state.current.data.authType || 'updown';
    var isOAuth = (authType == 'updown') ? false : true;
    var dataOAuth = auth.getOAuthData();
    vm.user['auth_type'] = $state.current.data.authType || 'updown'


    if (isOAuth){
      vm.user['email'] = dataOAuth.email
      vm.user['first_name'] = dataOAuth['first_name'];
      vm.user['last_name'] = dataOAuth['last_name'];
      vm.user['gender'] = dataOAuth['gender'];
      vm.user['auth_type'] = 'facebook'
    }

    function updateDays(){
      vm.days = dateUtils.getDays(vm.user.birth_month, vm.user.birth_year);
    }

    function updateMonths(){
      vm.months = dateUtils.getMonths(vm.user.birth_year);
      updateDays();
    }

    function pickFile(){
      angularFilepicker.chooseFile();
    }

    function submit(){
      auth.createUser(vm.user);
    }

    function linkFacebook(){
      var status = auth.getFacebookLoginStatus();
      if (status){
        auth.linkFacebookUser(vm.user);
      }
      else
      {
        FB.login(function(response){
          auth.setFacebookResponse(response);
          if (response.status == 'connected'){
            auth.linkFacebookUser(vm.user);
          }
        }, {scope: 'public_profile, email'});
      }
    }
  }

})();
