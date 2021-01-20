(function () {
  'use strict';

  angular
    .module('app', [
      // Angular modules
      'angular-jwt',
      'angular-storage',

      // 3rd Party Modules
      'ionic',
      'n3-line-chart',
      'ui.bootstrap',
      'ui.router',
      'ngAudio',
      'angularUtils.directives.dirPagination',

      // Application modules
      'app.home',
      'app.login',
      'app.settings',
      'app.signup',
      'app.logout',
      'app.profile',
      'app.locations',
      'app.modal',
      'app.points',
      'app.friend',
      'app.friends',
      'app.company',
      'app.favorites',
      'app.exercise',
      'app.quicklog',
      'app.nav',
      'app.workout'

    ]);
})();


