(function () {
  'use strict';

  angular
    .module('app', [
      'ui.router',

      'app.header',
      'app.graph',
      'app.footer',
      'app.login',
      'app.ledgers',
      'app.funds',
      'app.donations',
      'app.packages',
      'app.retrival',
      'app.accounts',
      'app.minutes',
      'app.budget',
      'app.market'

    ]);
})();

