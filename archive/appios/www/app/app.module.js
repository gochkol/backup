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
      'ngCordova',
      'ngAudio',
      'angularUtils.directives.dirPagination',
      'angular-svg-round-progress',
      'ngFileUpload',

      // Application modules
      'app.home',
      'app.guest',
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
      'app.workout',
      'app.reset'

    ]);
})();


