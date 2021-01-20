(function () {
  'use strict';

  angular
    .module('app', [
      // Angular modules
      'angular-jwt',
      'angular-storage',

      // 3rd Party Modules
      'n3-line-chart',
      'ui.bootstrap',
      'ui.router',
      'ngAudio',
      'angularUtils.directives.dirPagination',
      'angulike',
      'pascalprecht.translate',
      'ngSanitize',
      'angular-svg-round-progress',

      // Application modules
      'app.home',
      'app.login',
      'app.reset',
      'app.settings',
      'app.stats',
      'app.signup',
      'app.logout',
      'app.profile',
      'app.locations',
      'app.modal',
      'app.friend',
      'app.friends',
      'app.company',
      'app.favorites',
      'app.exercise',
      'app.quicklog',
      'app.nav',
      'app.workout',
      'app.main',
      'app.account',
      'app.partner'

    ]);
})();


