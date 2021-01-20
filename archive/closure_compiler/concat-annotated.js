(function () {
  'use strict';
  angular.module('app', [
    'angular-jwt',
    'angular-storage',
    'ionic',
    'n3-line-chart',
    'ui.bootstrap',
    'ui.router',
    'ngAudio',
    'angularUtils.directives.dirPagination',
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
    'app.workout',
    'app.reset'
  ]);
}());
(function () {
  'use strict';
  angular.module('app').config(appConfig);
  appConfig.$inject = [
    '$urlRouterProvider',
    '$stateProvider',
    '$ionicConfigProvider',
    'jwtInterceptorProvider',
    '$httpProvider',
    'configProvider',
    'stateConfigProvider',
    'userDataProvider'
  ];
  function appConfig($urlRouterProvider, $stateProvider, $ionicConfigProvider, jwtInterceptorProvider, $httpProvider, configProvider, stateConfigProvider, userDataProvider) {
    $urlRouterProvider.otherwise(otherwiseRoute);
    jwtInterceptorProvider.tokenGetter = function () {
      return userDataProvider.getAuthToken();
    };
    $httpProvider.interceptors.push('jwtInterceptor');
    $ionicConfigProvider.views.maxCache(0);
    configProvider.setOptions({
      cacheCheckWaitSeconds: 3600,
      globalStoreName: 'UpDownData.v1.global',
      userStoreName: 'UpDownData.v1.user'
    });
    stateConfigProvider.initialize();
  }
  otherwiseRoute.$inject = [
    '$injector',
    '$location'
  ];
  function otherwiseRoute($injector, $location) {
    var $rootScope = $injector.get('$rootScope');
    var $state = $injector.get('$state');
    //IMPORTANT - KEEP THIS COMMENTED OUT UNTIL FIX IS IN
    var gotoState = $rootScope.isLoggedIn() ? 'nav.home' : 'login';
    $state.go(gotoState);
  }
}());
(function () {
  'use strict';
  angular.module('app').controller('AppController', AppController);
  AppController.$inject = [
    '$scope',
    'globalData'
  ];
  function AppController($scope, globalData) {
    $scope.$on('$routeChangeSuccess', function (e, nextRoute) {
      if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
        $scope.pageTitle = nextRoute.$$route.pageTitle;
      }
    });
  }
}());
(function () {
  'use strict';
  angular.module('app').run(appRun);
  appRun.$inject = [
    '$ionicPlatform',
    '$rootScope',
    '$state',
    '$window',
    'store',
    'jwtHelper',
    'config',
    'globalData',
    'stateConfig',
    'userData',
    'angularFilepicker',
    'workout',
    'modalUtils',
    'exerciser'
  ];
  function appRun($ionicPlatform, $rootScope, $state, $window, store, jwtHelper, config, globalData, stateConfig, userData, angularFilepicker, workout, modalUtils, exerciser) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
    var statesThatDontRequireAuth = [
        'login',
        'signup',
        'reset',
        'misfire'
      ];
    $rootScope.isLoggedIn = isLoggedIn;
    $rootScope.isInTransition = false;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      if ((!toState.data || !toState.data.loginNotRequired) && !$rootScope.isLoggedIn()) {
        event.preventDefault();
        $state.go('login');
      } else if (fromState.name == 'nav.customizeWorkout' && toState.name != 'nav.exercise' || fromState.name == 'nav.exercise' && toState.name != 'summary' || fromState.name == 'summary' && toState.name != 'nav.home') {
        if ($rootScope.isInTransition) {
          $rootScope.isInTransition = false;
        } else {
          event.preventDefault();
          modalUtils.launch('youSure', function () {
            $rootScope.isInTransition = true;
            workout.clear();
            exerciser.clear();
            if (toState.name == 'nav.customizeWorkout' || toState.name == 'nav.exercise') {
              $state.go('nav.home');
            } else {
              $state.go(toState.name);
            }
          });
        }
        ;
      }
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, errorText) {
      event.preventDefault();
      errorText = errorText || 'Could not transition to desired page.';
      modalUtils.launch('error', errorText);
      $state.go('nav.home');
    });
    $window.onbeforeunload = function (event) {
      var states = [
          'nav.customizeWorkout',
          'nav.exercise',
          'summary'
        ];
      if (states.indexOf($state.current.name) >= 0) {
        return 'Are you sure you want to leave?  If so, changes will most likely be lost.';
      }
    };
    angularFilepicker.setKey('Ap4XIwSo4SZuHDiHiSFrjz');
    config.initialize();
    globalData.initialize();
    userData.initialize();
    stateConfig.initialize();
    workout.initialize();
    function isLoggedIn() {
      var token = userData.getAuthToken();
      if (!token || jwtHelper.isTokenExpired(token)) {
        return false;
      } else {
        return true;
      }
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.company').controller('CompanyController', CompanyController);
  CompanyController.$inject = [
    'userData',
    'userDataSet',
    'infoFactory'
  ];
  function CompanyController(userData, userDataSet, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.company = userDataSet.company;
    vm.joinCompany = joinCompany;
    vm.leaveCompany = leaveCompany;
    vm.signupCode = '';
    vm.departments = vm.company.departments;
    vm.teams = [];
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.isCollapsedCompany = true;
    vm.isCollapsedDept = true;
    vm.isCollapsedFocus = true;
    vm.isCollapsedPer = true;
    vm.infoClicked = infoFactory.getClicked;
    vm.members = [];
    for (var d in vm.departments) {
      vm.departments[d].members = [];
      for (var t in vm.departments[d].teams) {
        vm.teams.push(vm.departments[d].teams[t]);
        for (var m in vm.departments[d].teams[t].members) {
          vm.members.push(vm.departments[d].teams[t].members[m]);
          vm.departments[d].members.push(vm.departments[d].teams[t].members[m]);
          vm.departments[d].teams[t].daily_points += vm.departments[d].teams[t].members[m].daily_points;
          vm.departments[d].teams[t].monthly_points += vm.departments[d].teams[t].members[m].monthly_points;
          vm.departments[d].teams[t].total_points += vm.departments[d].teams[t].members[m].total_points;
          vm.departments[d].daily_points += vm.departments[d].teams[t].members[m].daily_points;
          vm.departments[d].monthly_points += vm.departments[d].teams[t].members[m].monthly_points;
          vm.departments[d].total_points += vm.departments[d].teams[t].members[m].total_points;
          vm.departments[d].totalPointsPerMember = vm.departments[d].total_points / vm.departments[d].members.length;
          vm.departments[d].dailyPointsPerMember = vm.departments[d].daily_points / vm.departments[d].members.length;
          vm.departments[d].monthlyPointsPerMember = vm.departments[d].monthly_points / vm.departments[d].members.length;
        }
      }
    }
    vm.focused = 0;
    vm.focus = focus;
    vm.companyPredicate = 'monthly_points';
    vm.companyReverse = true;
    vm.companyShowDay = true;
    vm.companyShowMonth = false;
    vm.companyShowTotal = true;
    vm.orderCompany = orderCompany;
    vm.departmentsPredicate = 'monthly_points';
    vm.departmentsReverse = true;
    vm.departmentsShowDay = true;
    vm.departmentsShowMonth = false;
    vm.departmentsShowTotal = true;
    vm.orderDepartments = orderDepartments;
    vm.departmentsTwoPredicate = 'monthlyPointsPerMember';
    vm.departmentsTwoReverse = true;
    vm.departmentsTwoShowDay = true;
    vm.departmentsTwoShowMonth = false;
    vm.departmentsTwoShowTotal = true;
    vm.orderDepartmentsTwo = orderDepartmentsTwo;
    vm.departmentPredicate = 'monthly_points';
    vm.departmentReverse = true;
    vm.departmentShowDay = true;
    vm.departmentShowMonth = false;
    vm.departmentShowTotal = true;
    vm.orderDepartment = orderDepartment;
    //    orderCompany('monthly_points');
    //    orderDepartments('monthly_points');
    //    orderDepartment('monthly_points');
    function focus(department) {
      for (var d in vm.departments) {
        if (vm.departments[d] === department) {
          vm.focused = d;
        }
      }
    }
    function orderCompany(predicate) {
      vm.companyReverse = vm.companyPredicate === predicate ? !vm.companyReverse : true;
      vm.companyPredicate = predicate;
      switch (predicate) {
      case 'daily_points':
        vm.companyShowDay = false;
        vm.companyShowMonth = true;
        vm.companyShowTotal = true;
        break;
      case 'monthly_points':
        vm.companyShowDay = true;
        vm.companyShowMonth = false;
        vm.companyShowTotal = true;
        break;
      case 'total_points':
        vm.companyShowDay = true;
        vm.companyShowMonth = true;
        vm.companyShowTotal = false;
        break;
      }
    }
    function orderDepartments(predicate) {
      vm.departmentsReverse = vm.departmentsPredicate === predicate ? !vm.departmentsReverse : true;
      vm.departmentsPredicate = predicate;
      switch (predicate) {
      case 'daily_points':
        vm.departmentsShowDay = false;
        vm.departmentsShowMonth = true;
        vm.departmentsShowTotal = true;
        break;
      case 'monthly_points':
        vm.departmentsShowDay = true;
        vm.departmentsShowMonth = false;
        vm.departmentsShowTotal = true;
        break;
      case 'total_points':
        vm.departmentsShowDay = true;
        vm.departmentsShowMonth = true;
        vm.departmentsShowTotal = false;
        break;
      }
    }
    function orderDepartmentsTwo(predicate) {
      vm.departmentsTwoReverse = vm.departmentsTwoPredicate === predicate ? !vm.departmentsTwoReverse : true;
      vm.departmentsTwoPredicate = predicate;
      switch (predicate) {
      case 'dailyPointsPerMember':
        vm.departmentsTwoShowDay = false;
        vm.departmentsTwoShowMonth = true;
        vm.departmentsTwoShowTotal = true;
        break;
      case 'monthlyPointsPerMember':
        vm.departmentsTwoShowDay = true;
        vm.departmentsTwoShowMonth = false;
        vm.departmentsTwoShowTotal = true;
        break;
      case 'totalPointsPerMember':
        vm.departmentsTwoShowDay = true;
        vm.departmentsTwoShowMonth = true;
        vm.departmentsTwoShowTotal = false;
        break;
      }
    }
    function orderDepartment(predicate) {
      vm.departmentReverse = vm.departmentPredicate === predicate ? !vm.departmentReverse : true;
      vm.departmentPredicate = predicate;
      switch (predicate) {
      case 'daily_points':
        vm.departmentShowDay = false;
        vm.departmentShowMonth = true;
        vm.departmentShowTotal = true;
        break;
      case 'monthly_points':
        vm.departmentShowDay = true;
        vm.departmentShowMonth = false;
        vm.departmentShowTotal = true;
        break;
      case 'total_points':
        vm.departmentShowDay = true;
        vm.departmentShowMonth = true;
        vm.departmentShowTotal = false;
        break;
      }
    }
    function joinCompany() {
      userData.joinCompany(vm, vm.signupCode);
    }
    function leaveCompany() {
      userData.leaveCompany(vm, vm.company);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.company', []);
}());
(function () {
  'use strict';
  angular.module('app').service('angularFilepicker', angularFilepicker);
  angularFilepicker.$inject = ['$window'];
  function angularFilepicker($window) {
    return $window.filepicker;
  }
}());
(function () {
  'use strict';
  angular.module('app').filter('BAnotAvailable_F', BAnotAvailable_F);
  function BAnotAvailable_F() {
    return function (input) {
      var out = [];
      angular.forEach(input, function (b_a_id) {
        if (b_a_id === 1 || b_a_id === 2 || b_a_id === 8 || b_a_id === 10 || b_a_id === 12 || b_a_id === 15 || b_a_id === 16) {
        } else {
          out.push(b_a_id);
        }
      }, out);
      return out;
    };
  }
}());
(function () {
  'use strict';
  angular.module('app').filter('BAnotAvailable_B', BAnotAvailable_B);
  function BAnotAvailable_B() {
    return function (input) {
      var out = [];
      angular.forEach(input, function (b_a_id) {
        if (b_a_id === 3 || b_a_id === 4 || b_a_id === 8 || b_a_id === 10 || b_a_id === 11 || b_a_id === 13 || b_a_id === 15 || b_a_id === 16 || b_a_id === 18) {
          out.push(b_a_id);
        } else {
        }
      }, out);
      return out;
    };
  }
}());
(function () {
  'use strict';
  angular.module('app').directive('udAnimatedButton', udAnimatedButton);
  udAnimatedButton.$inject = [
    '$timeout',
    '$rootScope'
  ];
  function udAnimatedButton($timeout, $rootScope) {
    var directive = {
        restrict: 'AE',
        replace: true,
        scope: { options: '=?' },
        controller: [
          '$scope',
          function ($scope) {
            $scope.options = $scope.options || {};
            $scope.options = {
              submitText: $scope.options.submitText || 'Submit',
              submittingText: $scope.options.submittingText || 'Submitting.. '
            };
          }
        ],
        template: '<button type="submit" class="btn btn-primary btn-lg img-responsive clearfix">' + '<div class="text" style="display:inline">{{buttonText}}</div>' + '<div class="" style="display:inline">' + '<span class="fa fa-circle-o-notch fa-spin icon-spinner icon-submit hidden" style="display:inline"></span>' + '</div>' + '</button>',
        link: function (scope, element) {
          var el = element;
          var icons = { submitting: angular.element(el[0].querySelector('.icon-submit')) };
          $rootScope.$watch('showLoading', function (newValue) {
            if (newValue) {
              scope.buttonText = scope.options.submittingText;
              icons.submitting.removeClass('hidden');
            } else {
              scope.buttonText = scope.options.submitText;
              icons.submitting.addClass('hidden');
            }
          }, true).bind(this);
          scope.buttonText = scope.options.submitText;
        }
      };
    return directive;
  }
}());
(function () {
  'use strict';
  angular.module('app').constant('constants', constants);
  constants.$inject = [];
  function constants() {
    return {
      'DEFAULT_SETTINGS': {
        'remember': false,
        'email': '',
        'units': 'standard',
        'help': {
          'all': false,
          'home': false,
          'profile': false,
          'locations': false,
          'company': false,
          'friends': false,
          'points': false,
          'settings': false,
          'favorites': false,
          'quickWorkout': false,
          'reviewWorkout': false,
          'exercise': false,
          'reviewPost': false
        },
        'minimizeExerciseImage': true,
        'minimizeWorkoutHistory': true,
        'sound': true,
        'theme': 'UpDown'
      },
      'COUNTRIES': [
        {
          'country_code': 'US',
          'name': 'United States'
        },
        {
          'country_code': 'AF',
          'name': 'Afghanistan'
        },
        {
          'country_code': 'AX',
          'name': 'Aland Islands'
        },
        {
          'country_code': 'AL',
          'name': 'Albania'
        },
        {
          'country_code': 'DZ',
          'name': 'Algeria'
        },
        {
          'country_code': 'AS',
          'name': 'American Samoa'
        },
        {
          'country_code': 'AD',
          'name': 'Andorra'
        },
        {
          'country_code': 'AO',
          'name': 'Angola'
        },
        {
          'country_code': 'AI',
          'name': 'Anguilla'
        },
        {
          'country_code': 'AQ',
          'name': 'Antarctica'
        },
        {
          'country_code': 'AG',
          'name': 'Antigua and Barbuda'
        },
        {
          'country_code': 'AR',
          'name': 'Argentina'
        },
        {
          'country_code': 'AM',
          'name': 'Armenia'
        },
        {
          'country_code': 'AW',
          'name': 'Aruba'
        },
        {
          'country_code': 'AU',
          'name': 'Australia'
        },
        {
          'country_code': 'AT',
          'name': 'Austria'
        },
        {
          'country_code': 'AZ',
          'name': 'Azerbaijan'
        },
        {
          'country_code': 'BS',
          'name': 'Bahamas'
        },
        {
          'country_code': 'BH',
          'name': 'Bahrain'
        },
        {
          'country_code': 'BD',
          'name': 'Bangladesh'
        },
        {
          'country_code': 'BB',
          'name': 'Barbados'
        },
        {
          'country_code': 'BY',
          'name': 'Belarus'
        },
        {
          'country_code': 'BE',
          'name': 'Belgium'
        },
        {
          'country_code': 'BZ',
          'name': 'Belize'
        },
        {
          'country_code': 'BJ',
          'name': 'Benin'
        },
        {
          'country_code': 'BM',
          'name': 'Bermuda'
        },
        {
          'country_code': 'BT',
          'name': 'Bhutan'
        },
        {
          'country_code': 'BO',
          'name': 'Bolivia, Plurinational State of'
        },
        {
          'country_code': 'BQ',
          'name': 'Bonaire, Sint Eustatius and Saba'
        },
        {
          'country_code': 'BA',
          'name': 'Bosnia and Herzegovina'
        },
        {
          'country_code': 'BW',
          'name': 'Botswana'
        },
        {
          'country_code': 'BV',
          'name': 'Bouvet Island'
        },
        {
          'country_code': 'BR',
          'name': 'Brazil'
        },
        {
          'country_code': 'IO',
          'name': 'British Indian Ocean Territory'
        },
        {
          'country_code': 'BN',
          'name': 'Brunei Darussalam'
        },
        {
          'country_code': 'BG',
          'name': 'Bulgaria'
        },
        {
          'country_code': 'BF',
          'name': 'Burkina Faso'
        },
        {
          'country_code': 'BI',
          'name': 'Burundi'
        },
        {
          'country_code': 'KH',
          'name': 'Cambodia'
        },
        {
          'country_code': 'CM',
          'name': 'Cameroon'
        },
        {
          'country_code': 'CA',
          'name': 'Canada'
        },
        {
          'country_code': 'CV',
          'name': 'Cape Verde'
        },
        {
          'country_code': 'KY',
          'name': 'Cayman Islands'
        },
        {
          'country_code': 'CF',
          'name': 'Central African Republic'
        },
        {
          'country_code': 'TD',
          'name': 'Chad'
        },
        {
          'country_code': 'CL',
          'name': 'Chile'
        },
        {
          'country_code': 'CN',
          'name': 'China'
        },
        {
          'country_code': 'CX',
          'name': 'Christmas Island'
        },
        {
          'country_code': 'CC',
          'name': 'Cocos (Keeling) Islands'
        },
        {
          'country_code': 'CO',
          'name': 'Colombia'
        },
        {
          'country_code': 'KM',
          'name': 'Comoros'
        },
        {
          'country_code': 'CG',
          'name': 'Congo'
        },
        {
          'country_code': 'CD',
          'name': 'Congo, the Democratic Republic of the'
        },
        {
          'country_code': 'CK',
          'name': 'Cook Islands'
        },
        {
          'country_code': 'CR',
          'name': 'Costa Rica'
        },
        {
          'country_code': 'CI',
          'name': 'Cote d\'Ivoire'
        },
        {
          'country_code': 'HR',
          'name': 'Croatia'
        },
        {
          'country_code': 'CU',
          'name': 'Cuba'
        },
        {
          'country_code': 'CW',
          'name': 'Curacao'
        },
        {
          'country_code': 'CY',
          'name': 'Cyprus'
        },
        {
          'country_code': 'CZ',
          'name': 'Czech Republic'
        },
        {
          'country_code': 'DK',
          'name': 'Denmark'
        },
        {
          'country_code': 'DJ',
          'name': 'Djibouti'
        },
        {
          'country_code': 'DM',
          'name': 'Dominica'
        },
        {
          'country_code': 'DO',
          'name': 'Dominican Republic'
        },
        {
          'country_code': 'EC',
          'name': 'Ecuador'
        },
        {
          'country_code': 'EG',
          'name': 'Egypt'
        },
        {
          'country_code': 'SV',
          'name': 'El Salvador'
        },
        {
          'country_code': 'GQ',
          'name': 'Equatorial Guinea'
        },
        {
          'country_code': 'ER',
          'name': 'Eritrea'
        },
        {
          'country_code': 'EE',
          'name': 'Estonia'
        },
        {
          'country_code': 'ET',
          'name': 'Ethiopia'
        },
        {
          'country_code': 'FK',
          'name': 'Falkland Islands (Malvinas)'
        },
        {
          'country_code': 'FO',
          'name': 'Faroe Islands'
        },
        {
          'country_code': 'FJ',
          'name': 'Fiji'
        },
        {
          'country_code': 'FI',
          'name': 'Finland'
        },
        {
          'country_code': 'FR',
          'name': 'France'
        },
        {
          'country_code': 'GF',
          'name': 'French Guiana'
        },
        {
          'country_code': 'PF',
          'name': 'French Polynesia'
        },
        {
          'country_code': 'TF',
          'name': 'French Southern Territories'
        },
        {
          'country_code': 'GA',
          'name': 'Gabon'
        },
        {
          'country_code': 'GM',
          'name': 'Gambia'
        },
        {
          'country_code': 'GE',
          'name': 'Georgia'
        },
        {
          'country_code': 'DE',
          'name': 'Germany'
        },
        {
          'country_code': 'GH',
          'name': 'Ghana'
        },
        {
          'country_code': 'GI',
          'name': 'Gibraltar'
        },
        {
          'country_code': 'GR',
          'name': 'Greece'
        },
        {
          'country_code': 'GL',
          'name': 'Greenland'
        },
        {
          'country_code': 'GD',
          'name': 'Grenada'
        },
        {
          'country_code': 'GP',
          'name': 'Guadeloupe'
        },
        {
          'country_code': 'GU',
          'name': 'Guam'
        },
        {
          'country_code': 'GT',
          'name': 'Guatemala'
        },
        {
          'country_code': 'GG',
          'name': 'Guernsey'
        },
        {
          'country_code': 'GN',
          'name': 'Guinea'
        },
        {
          'country_code': 'GW',
          'name': 'Guinea-Bissau'
        },
        {
          'country_code': 'GY',
          'name': 'Guyana'
        },
        {
          'country_code': 'HT',
          'name': 'Haiti'
        },
        {
          'country_code': 'HM',
          'name': 'Heard Island and McDonald Islands'
        },
        {
          'country_code': 'VA',
          'name': 'Holy See (Vatican City State)'
        },
        {
          'country_code': 'HN',
          'name': 'Honduras'
        },
        {
          'country_code': 'HK',
          'name': 'Hong Kong'
        },
        {
          'country_code': 'HU',
          'name': 'Hungary'
        },
        {
          'country_code': 'IS',
          'name': 'Iceland'
        },
        {
          'country_code': 'IN',
          'name': 'India'
        },
        {
          'country_code': 'ID',
          'name': 'Indonesia'
        },
        {
          'country_code': 'IR',
          'name': 'Iran, Islamic Republic of'
        },
        {
          'country_code': 'IQ',
          'name': 'Iraq'
        },
        {
          'country_code': 'IE',
          'name': 'Ireland'
        },
        {
          'country_code': 'IM',
          'name': 'Isle of Man'
        },
        {
          'country_code': 'IL',
          'name': 'Israel'
        },
        {
          'country_code': 'IT',
          'name': 'Italy'
        },
        {
          'country_code': 'JM',
          'name': 'Jamaica'
        },
        {
          'country_code': 'JP',
          'name': 'Japan'
        },
        {
          'country_code': 'JE',
          'name': 'Jersey'
        },
        {
          'country_code': 'JO',
          'name': 'Jordan'
        },
        {
          'country_code': 'KZ',
          'name': 'Kazakhstan'
        },
        {
          'country_code': 'KE',
          'name': 'Kenya'
        },
        {
          'country_code': 'KI',
          'name': 'Kiribati'
        },
        {
          'country_code': 'KP',
          'name': 'Korea, Democratic People\'s Republic of'
        },
        {
          'country_code': 'KR',
          'name': 'Korea, Republic of'
        },
        {
          'country_code': 'KW',
          'name': 'Kuwait'
        },
        {
          'country_code': 'KG',
          'name': 'Kyrgyzstan'
        },
        {
          'country_code': 'LA',
          'name': 'Lao People\'s Democratic Republic'
        },
        {
          'country_code': 'LV',
          'name': 'Latvia'
        },
        {
          'country_code': 'LB',
          'name': 'Lebanon'
        },
        {
          'country_code': 'LS',
          'name': 'Lesotho'
        },
        {
          'country_code': 'LR',
          'name': 'Liberia'
        },
        {
          'country_code': 'LY',
          'name': 'Libya'
        },
        {
          'country_code': 'LI',
          'name': 'Liechtenstein'
        },
        {
          'country_code': 'LT',
          'name': 'Lithuania'
        },
        {
          'country_code': 'LU',
          'name': 'Luxembourg'
        },
        {
          'country_code': 'MO',
          'name': 'Macao'
        },
        {
          'country_code': 'MK',
          'name': 'Macedonia, the former Yugoslav Republic of'
        },
        {
          'country_code': 'MG',
          'name': 'Madagascar'
        },
        {
          'country_code': 'MW',
          'name': 'Malawi'
        },
        {
          'country_code': 'MY',
          'name': 'Malaysia'
        },
        {
          'country_code': 'MV',
          'name': 'Maldives'
        },
        {
          'country_code': 'ML',
          'name': 'Mali'
        },
        {
          'country_code': 'MT',
          'name': 'Malta'
        },
        {
          'country_code': 'MH',
          'name': 'Marshall Islands'
        },
        {
          'country_code': 'MQ',
          'name': 'Martinique'
        },
        {
          'country_code': 'MR',
          'name': 'Mauritania'
        },
        {
          'country_code': 'MU',
          'name': 'Mauritius'
        },
        {
          'country_code': 'YT',
          'name': 'Mayotte'
        },
        {
          'country_code': 'MX',
          'name': 'Mexico'
        },
        {
          'country_code': 'FM',
          'name': 'Micronesia, Federated States of'
        },
        {
          'country_code': 'MD',
          'name': 'Moldova, Republic of'
        },
        {
          'country_code': 'MC',
          'name': 'Monaco'
        },
        {
          'country_code': 'MN',
          'name': 'Mongolia'
        },
        {
          'country_code': 'ME',
          'name': 'Montenegro'
        },
        {
          'country_code': 'MS',
          'name': 'Montserrat'
        },
        {
          'country_code': 'MA',
          'name': 'Morocco'
        },
        {
          'country_code': 'MZ',
          'name': 'Mozambique'
        },
        {
          'country_code': 'MM',
          'name': 'Myanmar'
        },
        {
          'country_code': 'NA',
          'name': 'Namibia'
        },
        {
          'country_code': 'NR',
          'name': 'Nauru'
        },
        {
          'country_code': 'NP',
          'name': 'Nepal'
        },
        {
          'country_code': 'NL',
          'name': 'Netherlands'
        },
        {
          'country_code': 'NC',
          'name': 'New Caledonia'
        },
        {
          'country_code': 'NZ',
          'name': 'New Zealand'
        },
        {
          'country_code': 'NI',
          'name': 'Nicaragua'
        },
        {
          'country_code': 'NE',
          'name': 'Niger'
        },
        {
          'country_code': 'NG',
          'name': 'Nigeria'
        },
        {
          'country_code': 'NU',
          'name': 'Niue'
        },
        {
          'country_code': 'NF',
          'name': 'Norfolk Island'
        },
        {
          'country_code': 'MP',
          'name': 'Northern Mariana Islands'
        },
        {
          'country_code': 'NO',
          'name': 'Norway'
        },
        {
          'country_code': 'OM',
          'name': 'Oman'
        },
        {
          'country_code': 'PK',
          'name': 'Pakistan'
        },
        {
          'country_code': 'PW',
          'name': 'Palau'
        },
        {
          'country_code': 'PS',
          'name': 'Palestinian Territory, Occupied'
        },
        {
          'country_code': 'PA',
          'name': 'Panama'
        },
        {
          'country_code': 'PG',
          'name': 'Papua New Guinea'
        },
        {
          'country_code': 'PY',
          'name': 'Paraguay'
        },
        {
          'country_code': 'PE',
          'name': 'Peru'
        },
        {
          'country_code': 'PH',
          'name': 'Philippines'
        },
        {
          'country_code': 'PN',
          'name': 'Pitcairn'
        },
        {
          'country_code': 'PL',
          'name': 'Poland'
        },
        {
          'country_code': 'PT',
          'name': 'Portugal'
        },
        {
          'country_code': 'PR',
          'name': 'Puerto Rico'
        },
        {
          'country_code': 'QA',
          'name': 'Qatar'
        },
        {
          'country_code': 'RE',
          'name': 'Reunion'
        },
        {
          'country_code': 'RO',
          'name': 'Romania'
        },
        {
          'country_code': 'RU',
          'name': 'Russian Federation'
        },
        {
          'country_code': 'RW',
          'name': 'Rwanda'
        },
        {
          'country_code': 'BL',
          'name': 'Saint Barthelemy'
        },
        {
          'country_code': 'SH',
          'name': 'Saint Helena, Ascension and Tristan da Cunha'
        },
        {
          'country_code': 'KN',
          'name': 'Saint Kitts and Nevis'
        },
        {
          'country_code': 'LC',
          'name': 'Saint Lucia'
        },
        {
          'country_code': 'MF',
          'name': 'Saint Martin (French part)'
        },
        {
          'country_code': 'PM',
          'name': 'Saint Pierre and Miquelon'
        },
        {
          'country_code': 'VC',
          'name': 'Saint Vincent and the Grenadines'
        },
        {
          'country_code': 'WS',
          'name': 'Samoa'
        },
        {
          'country_code': 'SM',
          'name': 'San Marino'
        },
        {
          'country_code': 'ST',
          'name': 'Sao Tome and Principe'
        },
        {
          'country_code': 'SA',
          'name': 'Saudi Arabia'
        },
        {
          'country_code': 'SN',
          'name': 'Senegal'
        },
        {
          'country_code': 'RS',
          'name': 'Serbia'
        },
        {
          'country_code': 'SC',
          'name': 'Seychelles'
        },
        {
          'country_code': 'SL',
          'name': 'Sierra Leone'
        },
        {
          'country_code': 'SG',
          'name': 'Singapore'
        },
        {
          'country_code': 'SX',
          'name': 'Sint Maarten (Dutch part)'
        },
        {
          'country_code': 'SK',
          'name': 'Slovakia'
        },
        {
          'country_code': 'SI',
          'name': 'Slovenia'
        },
        {
          'country_code': 'SB',
          'name': 'Solomon Islands'
        },
        {
          'country_code': 'SO',
          'name': 'Somalia'
        },
        {
          'country_code': 'ZA',
          'name': 'South Africa'
        },
        {
          'country_code': 'GS',
          'name': 'South Georgia and the South Sandwich Islands'
        },
        {
          'country_code': 'SS',
          'name': 'South Sudan'
        },
        {
          'country_code': 'ES',
          'name': 'Spain'
        },
        {
          'country_code': 'LK',
          'name': 'Sri Lanka'
        },
        {
          'country_code': 'SD',
          'name': 'Sudan'
        },
        {
          'country_code': 'SR',
          'name': 'Suriname'
        },
        {
          'country_code': 'SJ',
          'name': 'Svalbard and Jan Mayen'
        },
        {
          'country_code': 'SZ',
          'name': 'Swaziland'
        },
        {
          'country_code': 'SE',
          'name': 'Sweden'
        },
        {
          'country_code': 'CH',
          'name': 'Switzerland'
        },
        {
          'country_code': 'SY',
          'name': 'Syrian Arab Republic'
        },
        {
          'country_code': 'TW',
          'name': 'Taiwan, Province of China'
        },
        {
          'country_code': 'TJ',
          'name': 'Tajikistan'
        },
        {
          'country_code': 'TZ',
          'name': 'Tanzania, United Republic of'
        },
        {
          'country_code': 'TH',
          'name': 'Thailand'
        },
        {
          'country_code': 'TL',
          'name': 'Timor-Leste'
        },
        {
          'country_code': 'TG',
          'name': 'Togo'
        },
        {
          'country_code': 'TK',
          'name': 'Tokelau'
        },
        {
          'country_code': 'TO',
          'name': 'Tonga'
        },
        {
          'country_code': 'TT',
          'name': 'Trinidad and Tobago'
        },
        {
          'country_code': 'TN',
          'name': 'Tunisia'
        },
        {
          'country_code': 'TR',
          'name': 'Turkey'
        },
        {
          'country_code': 'TM',
          'name': 'Turkmenistan'
        },
        {
          'country_code': 'TC',
          'name': 'Turks and Caicos Islands'
        },
        {
          'country_code': 'TV',
          'name': 'Tuvalu'
        },
        {
          'country_code': 'UG',
          'name': 'Uganda'
        },
        {
          'country_code': 'UA',
          'name': 'Ukraine'
        },
        {
          'country_code': 'AE',
          'name': 'United Arab Emirates'
        },
        {
          'country_code': 'GB',
          'name': 'United Kingdom'
        },
        {
          'country_code': 'UM',
          'name': 'United States Minor Outlying Islands'
        },
        {
          'country_code': 'UY',
          'name': 'Uruguay'
        },
        {
          'country_code': 'UZ',
          'name': 'Uzbekistan'
        },
        {
          'country_code': 'VU',
          'name': 'Vanuatu'
        },
        {
          'country_code': 'VE',
          'name': 'Venezuela, Bolivarian Republic of'
        },
        {
          'country_code': 'VN',
          'name': 'Viet Nam'
        },
        {
          'country_code': 'VG',
          'name': 'Virgin Islands, British'
        },
        {
          'country_code': 'VI',
          'name': 'Virgin Islands, U.S.'
        },
        {
          'country_code': 'WF',
          'name': 'Wallis and Futuna'
        },
        {
          'country_code': 'EH',
          'name': 'Western Sahara'
        },
        {
          'country_code': 'YE',
          'name': 'Yemen'
        },
        {
          'country_code': 'ZM',
          'name': 'Zambia'
        },
        {
          'country_code': 'ZW',
          'name': 'Zimbabwe'
        }
      ]
    };
  }
}());
(function () {
  'use strict';
  angular.module('app').factory('auth', auth);
  auth.$inject = [
    '$http',
    '$state',
    '$q',
    'store',
    'globalData',
    'userData',
    'modalUtils'
  ];
  function auth($http, $state, $q, store, globalData, userData, modalUtils) {
    var factory = {
        createUser: createUser,
        login: login,
        logout: logout
      };
    return factory;
    function createUser(user) {
      userData.create('user', user).then(function (data) {
        userData.setAuthToken(data.auth_token);
        modalUtils.launch('welcomeAfterSignup');
        $state.go('nav.home');
      }, function (data) {
        modalUtils.launch('error', data.errors);
      });
    }
    function login(user) {
      userData.create('auth', user).then(function (data) {
        userData.setAuthToken(data.auth_token);
        $state.go('nav.home');
      }, function (data) {
        modalUtils.launch('error', data.errors);
      });
    }
    function logout() {
      userData.clearData();
      $state.go('login');
    }
  }
}());
(function () {
  'use strict';
  angular.module('app').provider('config', configProvider);
  function configProvider() {
    var baseUrl = 'none';
    var env;
    var options = {
        cacheCheckWaitSeconds: 60,
        globalStoreName: 'UpDownData.v1.global',
        userStoreName: 'UpDownData.v1.user'
      };
    var provider = {
        getOptions: getOptions,
        setOptions: setOptions,
        $get: configFactory
      };
    return provider;
    function getOptions() {
      return options;
    }
    function setOptions(newOptions) {
      // these option should be mereged in
      options = newOptions;
    }
    function configFactory($http, $location) {
      var config = {
          getBaseUrl: getBaseUrl,
          getEnv: getEnv,
          options: options,
          initialize: initialize
        };
      return config;
      function initialize() {
        setBaseUrl();
        setEnv();
      }
      function getBaseUrl() {
        return baseUrl;
      }
      function setBaseUrl() {
        baseUrl = 'https://updowntech-production.herokuapp.com/api/v1/';  //    baseUrl = 'https://updowntech-staging.herokuapp.com/api/v1/';
      }
      //      function setBaseUrl(){
      //        var url = $location.absUrl();
      //
      //        if(url.indexOf("localhost") != -1) {
      //          if(url.indexOf("localhost:3000") != -1) {
      //            baseUrl = 'http://localhost:3001/api/v1/';
      //          }
      //          else {
      //            baseUrl = 'https://updowntech-staging.herokuapp.com/api/v1/';
      //          }
      //        }
      //        else if (url.indexOf("staging") != -1) {
      //          baseUrl = 'https://updowntech-staging.herokuapp.com/api/v1/';
      //        }
      //        else {
      //          baseUrl = 'https://updowntech-production.herokuapp.com/api/v1/';
      //        }  
      //     }
      function getEnv() {
        return env;
      }
      function setEnv() {
        env = 'production';  //      env = "staging";
                             //      var url = $location.absUrl();
                             //
                             //        if(url.indexOf("localhost") != -1){
                             //          env = "development";
                             //        }
                             //        else if (url.indexOf("staging") != -1) {
                             //          env = "staging";
                             //        }
                             //        else {
                             //          env = "production";
                             //        }
      }
    }
  }
}());
(function () {
  'use strict';
  angular.module('app').filter('criterionDisplay', criterionDisplay);
  criterionDisplay.$inject = ['$state'];
  function criterionDisplay($state) {
    return function (input) {
      var output = [];
      for (var key in input) {
        switch (key) {
        case 'reps':
          output[0] = key;
          break;
        case 'duration':
          output[1] = key;
          break;
        case 'breath':
          output[2] = key;
          break;
        case 'pattern':
          output[3] = key;
          break;
        case 'weight':
          output[4] = key;
          break;
        case 'rest':
          if ($state.current.name != 'nav.exercise') {
            output[5] = key;
          }
          break;
        }
      }
      return output.filter(function (e) {
        return e;
      });
    };
  }
}());
(function () {
  'use strict';
  angular.module('app').factory('data', data);
  data.$inject = [
    '$http',
    '$location',
    '$q',
    'store',
    'config',
    '$rootScope',
    'modalUtils'
  ];
  function data($http, $location, $q, store, config, $rootScope, modalUtils) {
    var countLoading = 0;
    var isProcessing = false;
    var storedDataInfo = {};
    var factory = {
        initialize: initialize,
        initStoredData: initStoredData,
        getData: getData,
        getDataSet: getDataSet,
        postData: postData,
        patchData: patchData,
        deleteData: deleteData
      };
    initialize();
    return factory;
    function initialize() {
      $rootScope.showLoading = false;
    }
    function initStoredData(dataStore, dataInfo) {
      for (var i = 0; i < dataInfo.length; i++) {
        if (dataInfo[i].store) {
          dataInfo[i].dataStore = dataStore;
          data = dataStore.get(dataInfo[i].name);
          if (!data) {
            data = {};
            data.response_data = null;
            data.errors = 'Not loaded';
            data.lastCheck = 0;
            dataStore.set(dataInfo[i].name, data);
          }
        }
      }
    }
    function getData(info, params, forceCheck) {
      var deferred = $q.defer();
      var data = info.store ? info.dataStore.get(info.name) : null;
      var timeT = Math.floor(new Date().getTime() / 1000);
      var reload = data && info.waitCache && timeT - data.lastCheck < config.options.cacheCheckWaitSeconds ? false : true;
      if (data && !reload && !forceCheck) {
        deferred.resolve(data.response_data);
      } else {
        deferred.resolve(loadData(info, params));
      }
      return deferred.promise;
    }
    function getDataSet(dataInfos, forceCheck) {
      var deferred = $q.defer();
      var promises = [];
      var dataSet = {};
      for (var i = 0; i < dataInfos.length; i++) {
        promises.push(getData(dataInfos[i], {}, forceCheck));
      }
      $q.all(promises).then(function (data) {
        for (var i = 0; i < dataInfos.length; i++) {
          dataSet[dataInfos[i].name] = data[i];
          if (dataInfos[i].lookup) {
            dataSet[dataInfos[i].lookup] = createLookup(data[i]);
          }
        }
        deferred.resolve(dataSet);
      });
      return deferred.promise;
    }
    function createLookup(dataArray) {
      var lookup = {};
      for (var i = 0; i < dataArray.length; i++) {
        lookup[dataArray[i].id] = dataArray[i];
      }
      return lookup;
    }
    function loadData(info, params) {
      var deferred = $q.defer();
      var data = info.store ? info.dataStore.get(info.name) : null;
      var timeT = Math.floor(new Date().getTime() / 1000);
      var requestOptions = {
          method: 'GET',
          url: config.getBaseUrl() + info.target,
          skipAuthorization: info.skipAuthorization || false,
          params: info.params || params || {}
        };
      if (data) {
        requestOptions.headers = { 'If-None-Match': data.etag };
      }
      addLoading();
      $http(requestOptions).then(function (response) {
        if (info.transform) {
          response.data = info.transform(response.data);
        }
        if (data) {
          data.response_data = response.data;
          data.etag = response.headers().etag;
          data.errors = null;
          data.lastCheck = timeT;
          info.dataStore.set(info.name, data);
        }
        removeLoading();
        deferred.resolve(response.data);
      }, function (response) {
        if (!response.status) {
          if (data) {
            data.response_data = null;
            data.etag = '';
            data.errors = 'Could not connect';
            data.lastCheck = 0;
            info.dataStore.set(info.name, data);
          }
          modalUtils.launch('error', 'Could not connect to the server. Please try again shortly');
          removeLoading();
          deferred.reject(response.data);
        } else if (response.status == 304) {
          if (data) {
            data.lastCheck = timeT;
            info.dataStore.set(info.name, data);
            removeLoading();
            deferred.resolve(data.response_data);
          } else {
            removeLoading();
            modalUtils.launch('error', 'Could not load \'' + info.name + '\' data.');
            deferred.reject(response.data);
          }
        } else {
          if (data) {
            data.response_data = null;
            data.etag = '';
            data.errors = response.data['errors'];
            data.lastCheck = 0;
            info.dataStore.set(info.name, data);
          }
          removeLoading();
          modalUtils.launch('error', 'Could not load \'' + info.name + '\' data.');
          deferred.reject(response.data);
        }
      });
      return deferred.promise;
    }
    function patchData(info, params) {
      var deferred = $q.defer();
      var data = info.store ? info.dataStore.get(info.name) : null;
      var timeT = Math.floor(new Date().getTime() / 1000);
      var requestOptions = {
          method: 'PATCH',
          url: config.getBaseUrl() + info.target,
          skipAuthorization: false,
          data: params
        };
      addLoading();
      $http(requestOptions).then(function (response) {
        if (data) {
          data.response_data = response.data;
          data.etag = response.headers().etag;
          data.errors = null;
          data.lastCheck = timeT;
          info.dataStore.set(info.name, data);
        }
        removeLoading();
        deferred.resolve(response.data);
      }, function (response) {
        if (response.data && response.data.errors) {
          modalUtils.launch('error', response.data.errors);
        } else {
          modalUtils.launch('error', 'Could not connect to the server. Please try again shortly');
        }
        removeLoading();
        deferred.reject(response.data);
      });
      return deferred.promise;
    }
    function postData(info, postData, handleError) {
      var deferred = $q.defer();
      var requestOptions = {
          method: 'POST',
          url: config.getBaseUrl() + info.target,
          skipAuthorization: false,
          data: postData
        };
      addProcessing();
      $http(requestOptions).then(function (response) {
        deferred.resolve(response.data);
        removeProcessing();
      }, function (response) {
        if (handleError) {
          handleError(response);
        } else {
          if (response.data && response.data.errors) {
            modalUtils.launch('error', response.data.errors);
          } else {
            modalUtils.launch('error', 'Could not connect to the server. Please try again shortly');
          }
        }
        deferred.reject(response.data);
        removeProcessing();
      });
      return deferred.promise;
    }
    function deleteData(info, params) {
      var deferred = $q.defer();
      var requestOptions = {
          method: 'DELETE',
          url: config.getBaseUrl() + info.target,
          skipAuthorization: false,
          params: params
        };
      addProcessing();
      $http(requestOptions).then(function (response) {
        deferred.resolve(response.data);
        removeProcessing();
      }, function (response) {
        modalUtils.launch('error', 'Could not connect to the server. Please try again shortly');
        deferred.reject(response.data);
        removeProcessing();
      });
      return deferred.promise;
    }
    function addLoading() {
      countLoading++;
      $rootScope.showLoading = true;
    }
    function removeLoading() {
      if (--countLoading === 0) {
        $rootScope.showLoading = false;
      }
    }
    function addProcessing() {
      isProcessing = true;
      $rootScope.isProcessing = true;
    }
    function removeProcessing() {
      isProcessing = false;
      $rootScope.isProcessing = false;
    }
  }
}());
(function () {
  'use strict';
  angular.module('app').factory('dateUtils', dateUtils);
  dateUtils.$inject = [];
  function dateUtils() {
    var ageLimit = 13;
    var date = new Date();
    var days, months, years;
    var factory = {
        days: days,
        months: months,
        years: years,
        getMonths: getMonths,
        getYears: getYears,
        getDays: getDays
      };
    var defaultDays = [];
    for (var x = 0; x < 4; x++) {
      defaultDays.push([]);
      for (var y = 0; y < 28 + x; y++) {
        defaultDays[x].push({ value: y + 1 });
      }
    }
    var defaultMonths = [
        {
          name: 'January',
          value: '1'
        },
        {
          name: 'February',
          value: '2'
        },
        {
          name: 'March',
          value: '3'
        },
        {
          name: 'April',
          value: '4'
        },
        {
          name: 'May',
          value: '5'
        },
        {
          name: 'June',
          value: '6'
        },
        {
          name: 'July',
          value: '7'
        },
        {
          name: 'August',
          value: '8'
        },
        {
          name: 'September',
          value: '9'
        },
        {
          name: 'October',
          value: '10'
        },
        {
          name: 'November',
          value: '11'
        },
        {
          name: 'December',
          value: '12'
        }
      ];
    var defaultYears = [];
    for (var startYear = date.getFullYear() - ageLimit; startYear > 1900; startYear--) {
      defaultYears.push({ value: startYear });
    }
    return factory;
    function getDays(month, year) {
      if (year.value != date.getFullYear() - ageLimit) {
        switch (month.value) {
        case '1':
          return defaultDays[3];
          break;
        case '2':
          if (year % 4 != 0) {
            return defaultDays[0];
          } else if (year % 100 != 0) {
            return defaultDays[1];
          } else if (year % 400 != 0) {
            return defaultDays[0];
          } else {
            return defaultDays[1];
          }
          break;
        case '3':
          return defaultDays[3];
          break;
        case '4':
          return defaultDays[2];
          break;
        case '5':
          return defaultDays[3];
          break;
        case '6':
          return defaultDays[2];
          break;
        case '7':
          return defaultDays[3];
          break;
        case '8':
          return defaultDays[3];
          break;
        case '9':
          return defaultDays[2];
          break;
        case '10':
          return defaultDays[3];
          break;
        case '11':
          return defaultDays[2];
          break;
        case '12':
          return defaultDays[3];
          break;
        default:
          return defaultDays[3];
        }
      } else if (parseFloat(month.value) < date.getMonth() + 1) {
        switch (month.value) {
        case '1':
          return defaultDays[3];
          break;
        case '2':
          if (year % 4 != 0) {
            return defaultDays[0];
          } else if (year % 100 != 0) {
            return defaultDays[1];
          } else if (year % 400 != 0) {
            return defaultDays[0];
          } else {
            return defaultDays[1];
          }
          break;
        case '3':
          return defaultDays[3];
          break;
        case '4':
          return defaultDays[2];
          break;
        case '5':
          return defaultDays[3];
          break;
        case '6':
          return defaultDays[2];
          break;
        case '7':
          return defaultDays[3];
          break;
        case '8':
          return defaultDays[3];
          break;
        case '9':
          return defaultDays[2];
          break;
        case '10':
          return defaultDays[3];
          break;
        case '11':
          return defaultDays[2];
          break;
        case '12':
          return defaultDays[3];
          break;
        default:
          return defaultDays[3];
        }
      } else if (parseFloat(month.value) == date.getMonth() + 1) {
        var tempDays = [];
        for (x = 1; x < date.getDate; x++) {
          tempMonth.push({ value: x.toString() });
        }
        return tempDays;
      } else {
        return [];
      }
    }
    function getMonths(year) {
      if (year.value != date.getFullYear() - ageLimit) {
        return defaultMonths;
      } else {
        var tempMonths = [];
        for (var e in defaultMonths) {
          if (e <= date.getMonth) {
            tempMonths.push(defaultMonths[e]);
          }
        }
        return tempMonths;
      }
    }
    function getYears() {
      return defaultYears;
    }
  }
}());
(function () {
  'use strict';
  angular.module('app').factory('exerciser', exerciser);
  exerciser.$inject = [
    '$interval',
    '$state',
    'userData',
    'ngAudio',
    'workout'
  ];
  function exerciser($interval, $state, userData, ngAudio, workout) {
    var currentBlock = userData.getStateData('currentBlock', 0);
    var currentSet = userData.getStateData('currentSet', 0);
    var caloriesBurned = userData.getStateData('caloriesBurned', 0);
    var currentTotalTime = userData.getStateData('currentTotalTime', 0);
    var userWeight = 150;
    var isSet = true;
    var sound = {};
    var intervals = [];
    sound.start = ngAudio.load('content/audio/2_sec_start_sound.mp3');
    sound.end = ngAudio.load('content/audio/1_sec_end_sound.mp3');
    sound.warning = ngAudio.load('content/audio/4_sec_countdown.mp3');
    var onePlay = true;
    var currentTime;
    var factory = {
        getCurrentTime: getCurrentTime,
        getCurrentTotalTime: getCurrentTotalTime,
        getCurProgress: getCurProgress,
        getCaloriesBurned: getCaloriesBurned,
        getCurrentBlock: getCurrentBlock,
        getCurrentSet: getCurrentSet,
        getCurrentExercise: getCurrentExercise,
        getNextExercise: getNextExercise,
        getBG: getBG,
        setUserWeight: setUserWeight,
        start: start,
        stop: stop,
        end: end,
        complete: complete,
        startPauseClick: startPauseClick,
        skip: skip,
        clear: clear,
        initializeState: initializeState
      };
    return factory;
    function initializeState() {
      currentBlock = userData.setStateData('currentBlock', 0);
      userData.getStateData('currentBlock');
      currentSet = userData.setStateData('currentSet', 0);
      caloriesBurned = userData.setStateData('caloriesBurned', 0);
      currentTotalTime = userData.setStateData('caloriesBurned', 0);
    }
    function getCurrentTime(vs) {
      if (!currentTime) {
        if (isSet) {
          currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
          return currentTime;
        } else {
          currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
        }
      } else {
        return currentTime;
      }
    }
    function getCurrentTotalTime() {
      return currentTotalTime;
    }
    function getCurProgress(workout) {
      return currentBlock / workout.blocks.length * 100 + currentSet / (workout.blocks[currentBlock].block_sets.length * workout.blocks.length) * 100;
    }
    function getCaloriesBurned() {
      return caloriesBurned;
    }
    function getCurrentBlock() {
      return currentBlock;
    }
    function getCurrentSet() {
      return currentSet;
    }
    function getCurrentExercise(workout) {
      if (isSet) {
        return workout.blocks[currentBlock].exercise.name + ' Set ' + (currentSet + 1);
      } else {
        return 'Rest';
      }
    }
    function getNextExercise(workout) {
      if (currentSet + 1 >= workout.blocks[currentBlock].block_sets.length) {
        if (currentBlock + 1 >= workout.blocks.length) {
          return 'Workout Finished';
        } else {
          return workout.blocks[currentBlock + 1].exercise.name + ' Set 1' + '/' + workout.blocks[currentBlock].block_sets.length;
        }
      } else {
        return workout.blocks[currentBlock].exercise.name + ' Set ' + (currentSet + 2) + '/' + workout.blocks[currentBlock].block_sets.length;
      }
    }
    function getBG(workout) {
      var tmpBG = [];
      for (var s in workout.blocks[currentBlock].block_sets) {
        s == currentSet ? tmpBG.push('bluewell') : tmpBG.push('well');
      }
      return tmpBG;
    }
    function setUserWeight(w) {
      w != 0 ? userWeight = w : userWeight = 150;
    }
    var endSound = undefined;
    function startSound(vs) {
      var interval;
      if (angular.isDefined(endSound))
        return;
      sound.start.play();
      endSound = interval = $interval(soundStopper.bind(vs), 500);
      intervals.push(interval);
    }
    function soundStopper() {
      if (onePlay) {
        onePlay = false;
      } else {
        onePlay = true;
        stopSound(this);
      }
    }
    function stopSound(vs) {
      if (angular.isDefined(endSound)) {
        $interval.cancel(endSound);
        endSound = undefined;
        start(vs);
      }
    }
    var stop = undefined;
    function start(vs) {
      var interval;
      if (angular.isDefined(stop))
        return;
      vs.centerButton = '6';
      vs.cyclerStopped = false;
      stop = interval = $interval(stopper.bind(vs), 1000);
      intervals.push(interval);
    }
    function stopper() {
      var vs = this;
      var timespan = 0;
      if (isSet) {
        timespan = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
        if (vs.currentTime > 1) {
          vs.currentTime -= 1;
          if (vs.currentTime == 4 && vs.user.settings.sound) {
            sound.warning.play();
          }
          vs.caloriesBurned += vs.workout.blocks[currentBlock].exercise.met * 0.000126 * userWeight;
          // TODO, below is a very hacky temporary fix.  This factory and the controller along with
          // the workoutFactpory need to be refactored and cleaned up.  The interface between the workout and the
          // exercise cycler is fuzzy at best.
          vs.workout.calories_burned = vs.caloriesBurned;
          vs.workout.workout_total_time += 1;
        } else {
          nextInterval(vs);
        }
      } else {
        timespan = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
        if (vs.currentTime > 1) {
          vs.currentTime -= 1;
          if (vs.currentTime == 4 && vs.user.settings.sound) {
            sound.warning.play();
          }
          vs.workout.workout_total_time += 1;
          vs.caloriesBurned += 2 * 0.000126 * userWeight;
          vs.workout.calories_burned = vs.caloriesBurned;
        } else {
          nextInterval(vs);
        }
      }
    }
    function end(fun) {
      if (!angular.isDefined(fun)) {
        fun = function () {
        };
      }
      if (angular.isDefined(stop)) {
        $interval.cancel(stop);
        stop = undefined;
        fun();
      }
      if (angular.isDefined(endSound)) {
        $interval.cancel(endSound);
        endSound = undefined;
      }
      sound.warning.stop();
      sound.end.stop();
    }
    function complete(vs) {
      if (vs.user.settings.sound) {
        sound.warning.pause();
        sound.warning.stop();
      }
      if (isSet) {
        vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time -= vs.currentTime;
        nextInterval(vs);
      } else {
        vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time -= vs.currentTime;
        vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest -= vs.currentTime;
        nextInterval(vs);
      }
    }
    function skip(vs) {
      var blocks = vs.workout.blocks;
      var block = blocks.splice(currentBlock, 1)[0];
      var needUpdate;
      blocks.push(block);
      for (var i = 0; i < blocks.length; i++) {
        needUpdate = blocks[i].rank != i + 1 ? true : false;
        if (needUpdate) {
          workout.updateBlock(blocks[i]);
        }
      }
    }
    function pause(vs) {
      function changes() {
        vs.centerButton = '12';
        vs.cyclerStopped = true;
      }
      end(changes.bind(this));
    }
    function startPauseClick(vs) {
      if (vs.user.settings.sound) {
        sound.warning.pause();
        sound.warning.stop();
      }
      if (angular.isDefined(stop)) {
        pause(vs);
        vs.setBG[currentSet] = 'calm-light-bg';
        vs.button.text = 'ion-play';
        vs.button.textTwo = 'Start';
        vs.button.color = 'btn-success';
        vs.navcolor = 'tabs-background-calm';
      } else {
        if (vs.user.settings.sound) {
          startSound(vs);
        } else {
          start(vs);
        }
        if (isSet) {
          vs.setBG[currentSet] = 'balanced-bg';
          vs.navcolor = 'tabs-background-balanced';
        } else {
          vs.setBG[currentSet] = 'assertive-bg';
          vs.navcolor = 'tabs-background-assertive';
        }
        vs.button.text = 'ion-pause';
        vs.button.textTwo = 'Pause';
        vs.button.color = 'btn-primary';
        vs.skipAvailable = false;
      }
    }
    function nextInterval(vs) {
      if (isSet) {
        nextIfSet(vs);
      } else {
        if (currentSet == vs.workout.blocks[currentBlock].block_sets.length - 1) {
          if (currentBlock == vs.workout.blocks.length - 1) {
            nextIfLastExercise(vs);
          } else {
            nextIfLastSet(vs);
          }
        } else {
          nextIfRest(vs);
        }
      }
    }
    function nextIfSet(vs) {
      if (vs.user.settings.sound) {
        sound.end.play();
      }
      vs.message = vs.helpers.getRandomValue(vs.globalDataSet.motivations) || '';
      vs.setBG[currentSet] = 'assertive-bg';
      vs.color = 'assertive';
      vs.navcolor = 'tabs-background-assertive';
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.setOrRest = 'Rest';
      vs.doneOrSkip = 'Skip';
      vs.curOrNext = true;
      flash.classList.add('flash');
      setTimeout(function () {
        flash.setAttribute('class', '');
      }, 2000);
      vs.currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
      isSet = false;
    }
    function nextIfRest(vs) {
      startPauseClick(vs);
      startPauseClick(vs);
      vs.color = 'balanced';
      vs.navcolor = 'tabs-background-balanced';
      isSet = true;
      vs.setOrRest = 'Set';
      vs.doneOrSkip = 'Skip';
      vs.curOrNext = false;
      vs.setBG[currentSet] = 'calm-light-bg';
      currentSet++;
      userData.setStateData('currentSet', currentSet);
      vs.setBG[currentSet] = 'balanced-bg';
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.nextExercise = getNextExercise(vs.workout);
      vs.currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
      vs.curProgress = getCurProgress(vs.workout);
    }
    function nextIfLastSet(vs) {
      if (vs.workout.blocks[currentBlock].animationInfo.photoEnd) {
        vs.workout.blocks[currentBlock].animationInfo.photoEnd();
      }
      vs.color = 'balanced';
      vs.navcolor = 'tabs-background-balanced';
      isSet = true;
      vs.setOrRest = 'Set';
      vs.doneOrSkip = 'Skip';
      vs.curOrNext = false;
      if (angular.isDefined(stop)) {
        startPauseClick(vs);
      }
      currentBlock++;
      userData.setStateData('currentBlock', currentBlock);
      currentSet = 0;
      userData.setStateData('currentSet', currentSet);
      vs.setBG = getBG(vs.workout);
      vs.workoutName = getCurrentExercise(vs.workout);
      vs.nextExercise = getNextExercise(vs.workout);
      vs.currentTime = vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.time - vs.workout.blocks[currentBlock].block_sets[currentSet].criterion.rest;
      vs.curProgress = getCurProgress(vs.workout);
      vs.workout.blocks[currentBlock].animationInfo.photoStart();
      vs.skipAvailable = true;
    }
    function nextIfLastExercise(vs) {
      if (angular.isDefined(vs.workout.blocks[currentBlock].animationInfo.photoStop)) {
        vs.workout.blocks[currentBlock].animationInfo.photoEnd();
      }
      vs.color = 'balanced';
      vs.navcolor = 'tabs-background-balanced';
      isSet = true;
      vs.setOrRest = 'Set';
      vs.doneOrSkip = 'Skip';
      vs.curOrNext = false;
      if (angular.isDefined(stop)) {
        startPauseClick(vs);
      }
      currentBlock++;
      userData.setStateData('currentBlock', currentBlock);
      vs.workout.total_time_seconds = vs.workout.workout_total_time;
      workout.setWorkout(vs.workout);
      clear();
      $state.go('summary');
    }
    function clear() {
      for (var i = 0; i < intervals.length; i++) {
        $interval.cancel(intervals[i]);
      }
      intervals.length = 0;
      currentBlock = 0;
      currentSet = 0;
      caloriesBurned = 0;
      currentTotalTime = 0;
      isSet = true;
      currentTime = 0;
      sound.start.stop();
      sound.end.stop();
      sound.warning.stop();
    }
  }
}());
(function () {
  'use strict';
  angular.module('app').factory('globalData', globalData);
  globalData.$inject = [
    '$http',
    '$location',
    '$q',
    'store',
    'config',
    'data'
  ];
  function globalData($http, $location, $q, store, config, data) {
    var dataStore = store.getNamespacedStore(config.options.globalStoreName);
    var dataInfo = [];
    var dataInfoLookup = {};
    var factory = {
        initialize: initialize,
        getAll: getAll,
        get: get,
        clearData: clearData
      };
    return factory;
    function initialize() {
      dataInfo = [
        {
          name: 'bodyAreas',
          store: true,
          target: 'body_areas'
        },
        {
          name: 'bodyAreasNested',
          store: true,
          target: 'body_areas',
          params: { nested: true }
        },
        {
          name: 'quickActivities',
          store: true,
          target: 'quick_activities'
        },
        {
          name: 'categories',
          store: true,
          target: 'categories'
        },
        {
          name: 'equipmentGroups',
          store: true,
          target: 'equipments',
          transform: makeEquipementGroups
        },
        {
          name: 'equipments',
          lookup: 'equipmentLookup',
          store: true,
          target: 'equipments'
        },
        {
          name: 'motivations',
          store: true,
          target: 'messages',
          params: { message_type: 'feel_good' }
        },
        {
          name: 'spaces',
          store: true,
          target: 'spaces'
        },
        {
          name: 'tips',
          store: true,
          target: 'messages',
          params: { message_type: 'tip' }
        },
        {
          name: 'usages',
          store: true,
          target: 'usages'
        },
        {
          name: 'exercises',
          lookup: 'exerciseLookup',
          store: true,
          target: 'exercises'
        }
      ];
      for (var i = 0; i < dataInfo.length; i++) {
        var info = dataInfo[i];
        info.skipAuthorization = true;
        info.waitCache = true;
        dataInfoLookup[info.name] = info;
      }
      data.initStoredData(dataStore, dataInfo);
    }
    function getAll(forceCheck) {
      return data.getDataSet(dataInfo, forceCheck);
    }
    function clearData() {
      for (var i = 0; i < dataInfo.length; i++) {
        if (dataInfo[i].store) {
          dataStore.set(dataInfo[i].name, null);
        }
      }
    }
    function get(dataName) {
      return data.getData(dataStore, dataName);
    }
    function makeEquipementGroups(equipments) {
      var equipmentGroups = [];
      var groups = {};
      for (var i = 0; i < equipments.length; i++) {
        var e = equipments[i];
        var eg = e.equipment_group;
        groups[eg.id] = groups[eg.id] ? groups[eg.id] : {
          id: eg.id,
          name: eg.name,
          equipments: []
        };
        groups[eg.id].equipments.push({
          id: e.id,
          name: e.name
        });
      }
      for (var key in groups) {
        equipmentGroups.push(groups[key]);
      }
      return equipmentGroups;
    }
  }
}());
(function () {
  'use strict';
  angular.module('app').factory('helpers', helpers);
  helpers.$inject = ['constants'];
  function helpers(constants) {
    var factory = {
        modeDisplay: modeDisplay,
        getRandomValue: getRandomValue,
        eventSentence: eventSentence,
        mergeDefaultSettings: mergeDefaultSettings,
        secondsToString: secondsToString,
        timeString: timeString,
        formatTime: formatTime,
        firstLetter: firstLetter
      };
    return factory;
    function secondsToString(timeSeconds) {
      var hours = parseInt(timeSeconds / 3600);
      var minutes = parseInt((timeSeconds - hours * 3600) / 60);
      var seconds = (timeSeconds - hours * 3600) % 60;
      var timeString = '';
      timeString = hours ? hours + 'h ' : '';
      timeString += minutes ? minutes + 'm ' : '0m ';
      timeString += seconds ? seconds + 's' : '0s';
      return timeString;
    }
    function mergeDefaultSettings(responseData) {
      var userSettings = responseData.settings || {};
      var defaultSettings = constants().DEFAULT_SETTINGS;
      for (var level1 in defaultSettings) {
        userSettings[level1] = userSettings[level1] == undefined ? defaultSettings[level1] : userSettings[level1];
        if (defaultSettings[level1].constructor === Object) {
          for (var level2 in defaultSettings[level1]) {
            userSettings[level1][level2] = userSettings[level1][level2] == undefined ? defaultSettings[level1][level2] : userSettings[level1][level2];
          }
        }
      }
      responseData.settings = userSettings;
      return responseData;
    }
    function getRandomValue(values) {
      return typeof values != 'undefined' && values != null && values.length > 0 ? values[Math.floor(Math.random() * values.length)].text : '';
    }
    function eventSentence(event) {
      var ed = event.event_data;
      switch (event.event_type) {
      case 'finish_quick_log':
        if (!ed.quick_log) {
          return event.sentence;
        } else {
          return ed.quick_log.user.first_name + ' ' + ed.quick_log.user.last_name + ' did ' + ed.quick_log.duration + ' minutes of ' + ed.quick_log.quick_activity.name + '.';
        }
      case 'update_status':
        if (!ed.user) {
          return event.sentence;
        } else {
          return ed.user.first_name + ' ' + ed.user.last_name + ': \'' + ed.user.current_status + '\'';
        }
      case 'finish_workout':
        if (!ed.workout) {
          return event.sentence;
        } else {
          return ed.workout.user.first_name + ' ' + ed.workout.user.last_name + ' finished ' + ed.workout.name + '.';
        }
      default:
        return event.sentence;
      }
    }
    function modeDisplay(input) {
      var out = '';
      if (input === 'duration') {
        out = 'Time(s):';
      }
      if (input === 'reps') {
        out = 'Reps:';
      }
      if (input === 'distance') {
        out = 'Distance(ft):';
      }
      if (input === 'breath') {
        out = 'Breaths:';
      }
      if (input === 'pattern') {
        out = 'Pattern:';
      }
      if (input === 'weight') {
        out = 'Wt.(lbs):';
      }
      if (input === 'rest') {
        out = 'Rest(s):';
      }
      return out;
    }
    function timeString(time) {
      var hours = 0;
      var minutes = 0;
      var seconds = 0;
      var timestring = '';
      while (time >= 60) {
        while (time >= 3600) {
          time -= 3600;
          hours++;
        }
        if (time >= 60) {
          time -= 60;
          minutes++;
        }
      }
      seconds = time;
      if (hours > 0) {
        timestring += hours + ':';
        if (minutes > 9) {
          timestring += minutes + ':';
        } else {
          timestring += '0' + minutes + ':';
        }
        if (seconds > 9) {
          timestring += seconds;
        } else {
          timestring += '0' + seconds;
        }
      } else {
        if (minutes > 9) {
          timestring += minutes + ':';
        } else {
          timestring += minutes + ':';
        }
        if (seconds > 9) {
          timestring += seconds;
        } else {
          timestring += '0' + seconds;
        }
      }
      return timestring;
    }
    function formatTime(t) {
      if (!t) {
        return '';
      } else {
        var outTime = '';
        var nowTime = new Date();
        var date_time = t.split('T');
        var date = date_time[0];
        var time = date_time[1];
        var y_m_d = date.split('-');
        var year = parseInt(y_m_d[0], 10);
        var month = parseInt(y_m_d[1], 10);
        var day = parseInt(y_m_d[2], 10);
        var H_M_S_MS = time.split(',');
        var H_M_S = H_M_S_MS[0];
        var h_m_s = H_M_S.split(':');
        var hours = parseInt(h_m_s[0], 10);
        var minutes = parseInt(h_m_s[1], 10);
        var seconds = parseInt(h_m_s[2], 10);
        var date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          };
        var old = nowTime.getTime() - date.getTime();
        old = old / 1000;
        old = Math.round(old);
        if (old < 60) {
          outTime = old + 's ago';
        } else if (old < 120) {
          outTime = '1 min ago';
        } else if (old < 3600) {
          outTime = Math.round(old / 60) + ' mins ago';
        } else if (old < 7200) {
          outTime = '1hr ago';
        } else if (old < 86400) {
          outTime = Math.round(old / 3600) + ' hrs ago';
        } else if (old < 172800) {
          outTime = '1 day ago';
        } else if (old < 604800) {
          outTime = Math.round(old / 86400) + ' days ago';
        } else if (old < 1209600) {
          outTime = '1 week ago';
        } else if (old < 2419200) {
          outTime = Math.round(old / 604800) + ' weeks ago';
        } else {
          outTime = date.toLocaleTimeString('en-us', options);
        }
        return outTime;
      }
    }
    function firstLetter(name) {
      return name.charAt(0);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app').factory('infoFactory', infoFactory);
  infoFactory.$inject = [
    '$state',
    'userData'
  ];
  function infoFactory($state, userData) {
    var factory = {
        getClicked: getClicked,
        getCollapsed: getCollapsed
      };
    return factory;
    function getClicked(binding, index) {
      binding.isCollapsed[index] = !binding.isCollapsed[index];
      binding.user.settings.help[$state.current.name] = binding.isCollapsed[index];
      userData.updateUser(binding);
    }
    function getCollapsed(user) {
      switch ($state.current.name) {
      case 'nav.profile':
        return [user.settings.help.profile || user.settings.help.all];
      case 'nav.locations':
        return [user.settings.help.locations || user.settings.help.all];
      case 'nav.friends':
        return [user.settings.help.friends || user.settings.help.all];
      case 'nav.company':
        return [user.settings.help.company || user.settings.help.all];
      case 'nav.friend':
        return [user.settings.help.friend || user.settings.help.all];
      case 'nav.points':
        return [user.settings.help.points || user.settings.help.all];
      case 'nav.settings':
        return [user.settings.help.settings || user.settings.help.all];
      case 'nav.quick':
        return [user.settings.help.quick || user.settings.help.all];
      case 'nav.customizeWorkout':
        return [user.settings.help.customizeWorkout || user.settings.help.all];
      case 'nav.exercise':
        return [user.settings.help.exercise || user.settings.help.all];
      case 'nav.review':
        return [user.settings.help.review || user.settings.help.all];
      case 'nav.favorites':
        return [user.settings.help.favorites || user.settings.help.all];
      case 'nav.log':
        return [user.settings.help.log || user.settings.help.all];
      default:
        return [user.settings.help.all];
      }
    }
  }
}());
(function () {
  'use strict';
  angular.module('app').filter('modeFilter', modeFilter);
  function modeFilter() {
    return function (input) {
      var out = {};
      angular.forEach(input, function (value, criteria) {
        if (criteria == 'duration') {
          if (value === '') {
          } else {
            out[criteria] = value;
          }
        }
        if (criteria == 'reps') {
          out[criteria] = value;
        }
        if (criteria == 'distance') {
          out[criteria] = value;
        }
        if (criteria == 'breath') {
          out[criteria] = value;
        }
        if (criteria == 'pattern') {
          out[criteria] = value;
        }
        if (criteria == 'weight') {
          out[criteria] = value;
        }
        if (criteria == 'rest') {
          out[criteria] = value;
        }
      }, out);
      return out;
    };
  }
}());
(function () {
  'use strict';
  angular.module('app').directive('ngReallyClick', [ngReallyClick]);
  function ngReallyClick() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('click', function () {
          var message = attrs.ngReallyMessage;
          if (message && confirm(message)) {
            scope.$apply(attrs.ngReallyClick);
          }
        });
      }
    };
  }
}());
(function () {
  'use strict';
  angular.module('app').provider('stateConfig', stateConfigProvider);
  stateConfigProvider.$inject = ['$stateProvider'];
  function stateConfigProvider($stateProvider) {
    var provider = {
        initialize: initialize,
        $get: stateHelperFactory
      };
    return provider;
    function initialize() {
      $stateProvider.state('nav', {
        url: '/nav',
        data: { loginNotRequired: true },
        abstract: true,
        templateUrl: 'app/partials/menu.html',
        controller: 'AppController as nav'
      });
      $stateProvider.state('login', {
        url: '/login',
        data: { loginNotRequired: true },
        controller: 'LoginController as login',
        templateUrl: 'app/login/login.html'
      });
      $stateProvider.state('nav.logout', {
        url: '/logout',
        data: { loginNotRequired: true },
        views: { menuContent: { controller: 'LogoutController as logout' } }
      });
      $stateProvider.state('reset', {
        url: '/reset',
        data: { loginNotRequired: true },
        controller: 'ResetController as reset',
        templateUrl: 'app/reset/reset.html'
      });
      $stateProvider.state('newPassword', {
        url: '/new',
        data: { loginNotRequired: true },
        controller: 'NewPasswordController as reset',
        templateUrl: 'app/reset/new.html'
      });
      $stateProvider.state('checkEmail', {
        url: '/checkEmail',
        data: { loginNotRequired: true },
        templateUrl: 'app/reset/checkEmail.html'
      });
      $stateProvider.state('nav.customizeWorkout', {
        url: '/workout/customize',
        views: {
          menuContent: {
            controller: 'CustomizeWorkoutController as customize',
            templateUrl: 'app/workout/customize/customize.html',
            resolve: {
              globalDataSet: [
                'globalData',
                function (globalData) {
                  return globalData.getAll();
                }
              ],
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet(['user']);
                }
              ],
              workoutData: [
                'workout',
                function (workout) {
                  return workout.getWorkout();
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.quickWorkout', {
        url: '/workout/quick',
        views: {
          menuContent: {
            controller: 'QuickWorkoutController as quick',
            templateUrl: 'app/workout/quick/quick.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet([
                    'user',
                    'locations'
                  ]);
                }
              ],
              globalDataSet: [
                'globalData',
                function (globalData) {
                  return globalData.getAll();
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.favorites', {
        url: '/favorites',
        views: {
          menuContent: {
            controller: 'FavoritesController as favorites',
            templateUrl: 'app/favorites/favorites.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet([
                    'user',
                    'favorites'
                  ]);
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.profile', {
        url: '/profile',
        views: {
          menuContent: {
            controller: 'ProfileController as profile',
            templateUrl: 'app/profile/profile.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet([
                    'user',
                    'bodyStats',
                    'bodyPartStats',
                    'userHistory'
                  ]);
                }
              ],
              globalDataSet: [
                'globalData',
                function (globalData) {
                  return globalData.getAll();
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.points', {
        url: '/points',
        views: {
          menuContent: {
            controller: 'PointsController as points',
            templateUrl: 'app/points/points.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet([
                    'user',
                    'points'
                  ]);
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.settings', {
        url: '/settings',
        views: {
          menuContent: {
            controller: 'SettingsController as settings',
            templateUrl: 'app/settings/settings.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet(['user']);
                }
              ],
              globalDataSet: [
                'globalData',
                function (globalData) {
                  return globalData.getAll();
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.company', {
        url: '/company',
        views: {
          menuContent: {
            controller: 'CompanyController as company',
            templateUrl: 'app/company/company.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet([
                    'user',
                    'company'
                  ]);
                }
              ],
              globalDataSet: [
                'globalData',
                function (globalData) {
                  return globalData.getAll();
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.friend', {
        url: '/friend',
        views: {
          menuContent: {
            controller: 'FriendController as friend',
            templateUrl: 'app/friend/friend.html',
            resolve: {
              globalDataSet: [
                'globalData',
                function (globalData) {
                  return globalData.getAll();
                }
              ],
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet([
                    'user',
                    'friends',
                    'friendRequestsForMe',
                    'friendRequestsFromMe'
                  ]);
                }
              ],
              friendData: [
                'userData',
                function (userData) {
                  return userData.getFriend();
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.friends', {
        url: '/friends',
        views: {
          menuContent: {
            controller: 'FriendsController as friends',
            templateUrl: 'app/friends/friends.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet([
                    'user',
                    'friends',
                    'friendRequestsForMe',
                    'friendRequestsFromMe'
                  ]);
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.quickLog', {
        url: '/quickLog',
        views: {
          menuContent: {
            controller: 'QuickLogController as quickLog',
            templateUrl: 'app/quicklog/quicklog.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet(['user']);
                }
              ],
              globalDataSet: [
                'globalData',
                function (globalData) {
                  return globalData.getAll();
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.home', {
        url: '/home',
        views: {
          menuContent: {
            controller: 'HomeController as home',
            templateUrl: 'app/home/home.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet([
                    'user',
                    'events'
                  ]);
                }
              ],
              globalDataSet: [
                'globalData',
                function (globalData) {
                  return globalData.getAll();
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('nav.locations', {
        url: '/locations',
        views: {
          menuContent: {
            controller: 'LocationsController as locations',
            templateUrl: 'app/locations/locations.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet([
                    'user',
                    'locations'
                  ]);
                }
              ],
              globalDataSet: [
                'globalData',
                function (globalData) {
                  return globalData.getAll();
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('signup', {
        url: '/signup',
        data: { loginNotRequired: true },
        controller: 'SignupController as signup',
        templateUrl: 'app/signup/signup.html',
        resolve: {
          globalDataSet: [
            'globalData',
            function (globalData) {
              return globalData.getAll();
            }
          ]
        }
      });
      $stateProvider.state('nav.exercise', {
        url: '/workout/exercise',
        views: {
          menuContent: {
            controller: 'ExerciseController as exercise',
            templateUrl: 'app/exercise/exercise.html',
            resolve: {
              userDataSet: [
                'userData',
                function (userData) {
                  return userData.getDataSet([
                    'user',
                    'events',
                    'bodyStats'
                  ]);
                }
              ],
              globalDataSet: [
                'globalData',
                function (globalData) {
                  return globalData.getAll();
                }
              ],
              workoutData: [
                'workout',
                function (workout) {
                  return workout.getWorkout();
                }
              ]
            }
          }
        }
      });
      $stateProvider.state('summary', {
        url: '/workout/summary',
        controller: 'SummaryController as summary',
        templateUrl: 'app/workout/summary/summary.html',
        resolve: {
          globalDataSet: [
            'globalData',
            function (globalData) {
              return globalData.getAll();
            }
          ],
          userDataSet: [
            'userData',
            function (userData) {
              return userData.getDataSet(['user']);
            }
          ],
          workoutData: [
            'workout',
            function (workout) {
              return workout.getWorkout();
            }
          ]
        }
      });
    }
    stateHelperFactory.$inject = [
      '$rootScope',
      '$http',
      '$location',
      'globalData',
      'userData'
    ];
    function stateHelperFactory($rootScope, $http, $location, globalData, userData) {
      var factory = { initialize: initialize };
      return factory;
      function initialize() {
        $rootScope.$on('$stateChangeSuccess', stateChanged);
      }
      function stateChanged(event, toState, toParams, fromState, fromParams) {
        // this is where the state is looked at and preloading of stuff is done
        if (toState.name == 'login') {
          userData.clearData();
          globalData.getAll(true);
        }
      }
    }
  }
}());
(function () {
  'use strict';
  angular.module('app').provider('userData', userDataProvider);
  function userDataProvider() {
    var dataStore;
    var provider = {
        getAuthToken: getAuthToken,
        $get: userData
      };
    return provider;
    function getAuthToken() {
      return dataStore.get('authToken');
    }
    userData.$inject = [
      '$http',
      '$location',
      '$q',
      'store',
      'config',
      'data',
      'helpers'
    ];
    function userData($http, $location, $q, store, config, data, helpers) {
      var dataInfo = [];
      var dataInfoLookup = {};
      var user = {};
      var factory = {
          initialize: initialize,
          clearData: clearData,
          getAuthToken: getAuthToken,
          setAuthToken: setAuthToken,
          getStateData: getStateData,
          setStateData: setStateData,
          create: create,
          createQuickLog: createQuickLog,
          createEventComment: createEventComment,
          createFavorite: createFavorite,
          createFriendRequest: createFriendRequest,
          acceptFriendRequest: acceptFriendRequest,
          joinCompany: joinCompany,
          leaveCompany: leaveCompany,
          updateBodyStats: updateBodyStats,
          updateBodyPartStats: updateBodyPartStats,
          updateUser: updateUser,
          updateUserStatus: updateUserStatus,
          updateUserLocations: updateUserLocations,
          getDataSet: getDataSet,
          getBodyStatHistory: getBodyStatHistory,
          getBodyPartStatHistory: getBodyPartStatHistory,
          getWeight: getWeight,
          getWorkout: getWorkout,
          getEventComments: getEventComments,
          getEvents: getEvents,
          getFriend: getFriend,
          getFriends: getFriends,
          getFriendsFromSearch: getFriendsFromSearch,
          deleteFavorite: deleteFavorite,
          deleteFriend: deleteFriend,
          declineFriendRequest: declineFriendRequest,
          deleteEventComment: deleteEventComment,
          deleteFriendRequest: deleteFriendRequest,
          resetPassword: resetPassword,
          newPassword: newPassword
        };
      dataStore = store.getNamespacedStore(config.options.userStoreName);
      return factory;
      function initialize() {
        dataInfo = [
          {
            name: 'user',
            target: 'user',
            store: true,
            transform: helpers.mergeDefaultSettings
          },
          {
            name: 'auth',
            target: 'auth',
            store: false
          },
          {
            name: 'events',
            target: 'users/events',
            store: true
          },
          {
            name: 'favorites',
            target: 'users/favorites',
            store: false
          },
          {
            name: 'eventComments',
            target: 'users/event_comments',
            store: false
          },
          {
            name: 'locations',
            target: 'users/locations',
            store: true
          },
          {
            name: 'bodyStats',
            target: 'users/body_stats',
            store: true
          },
          {
            name: 'bodyPartStats',
            target: 'users/body_part_stats',
            store: false
          },
          {
            name: 'bodyStatHistory',
            target: 'users/body_stats_stream',
            store: false
          },
          {
            name: 'bodyPartStatHistory',
            target: 'users/body_part_stats_stream'
          },
          {
            name: 'company',
            target: 'users/company',
            store: true
          },
          {
            name: 'companyJoin',
            target: 'users/join_company',
            store: false
          },
          {
            name: 'companyLeave',
            target: 'users/leave_company',
            store: false
          },
          {
            name: 'userHistory',
            target: 'users/history',
            store: true
          },
          {
            name: 'friend',
            target: 'users/friend',
            store: true
          },
          {
            name: 'friends',
            target: 'users/friends',
            store: true
          },
          {
            name: 'friendRequestsForMe',
            target: 'users/friend_requests',
            params: { friend_request_type: 'for_me' },
            store: true
          },
          {
            name: 'friendRequestsFromMe',
            target: 'users/friend_requests',
            params: { friend_request_type: 'from_me' },
            store: true
          },
          {
            name: 'friendRequestAccept',
            target: 'users/friend_requests_accept',
            store: false
          },
          {
            name: 'friendRequestDecline',
            target: 'users/friend_requests_decline',
            store: false
          },
          {
            name: 'friendsFromSearch',
            target: 'users/friends_search',
            store: false
          },
          {
            name: 'points',
            target: 'users/points',
            store: true
          },
          {
            name: 'quickLog',
            target: 'users/quick_logs',
            store: false
          },
          {
            name: 'password',
            target: 'password',
            store: false
          },
          {
            name: 'workout',
            target: 'workout',
            store: false
          }
        ];
        for (var i = 0; i < dataInfo.length; i++) {
          var info = dataInfo[i];
          dataInfoLookup[info.name] = info;
        }
        data.initStoredData(dataStore, dataInfo);
      }
      function clearData() {
        for (var i = 0; i < dataInfo.length; i++) {
          if (dataInfo[i].store) {
            dataStore.set(dataInfo[i].name, null);
          }
        }
        dataStore.set('authToken', undefined);
        dataStore.set('stateData', undefined);
      }
      function getAuthToken() {
        return dataStore.get('authToken');
      }
      function setAuthToken(authToken) {
        dataStore.set('authToken', authToken);
      }
      function getStateData(name, defaultValue) {
        var stateData = dataStore.get('stateData');
        if (!stateData) {
          dataStore.set('stateData', {});
          stateData = dataStore.get('stateData');
        }
        if (stateData[name] == undefined) {
          stateData[name] = defaultValue != undefined ? defaultValue : null;
          dataStore.set('stateData', stateData);
        }
        return stateData[name];
      }
      function setStateData(name, value) {
        var stateData = dataStore.get('stateData');
        if (!stateData) {
          dataStore.set('stateData', {});
          stateData = dataStore.get('stateData');
        }
        stateData[name] = value;
        dataStore.set('stateData', stateData);
        return stateData[name];
      }
      function get(dataName, params) {
        return data.getData(dataInfoLookup[dataName], params);
      }
      function destroy(dataName, params) {
        return data.deleteData(dataInfoLookup[dataName], params);
      }
      function create(dataName, params) {
        return data.postData(dataInfoLookup[dataName], params);
      }
      function update(dataName, params) {
        return data.patchData(dataInfoLookup[dataName], params);
      }
      function actionThenBind(actionFunction, vm, dataName, params, refreshNames, refreshFunction, transformFunction) {
        refreshNames = refreshNames || [];
        actionFunction(dataName, params).then(function (responseData) {
          if (vm[dataName] != undefined) {
            vm[dataName] = transformFunction ? transformFunction(responseData) : responseData;
          }
          for (var i = 0; i < refreshNames.length; i++) {
            actionThenBind(get, vm, refreshNames[i]);
          }
          if (refreshFunction) {
            refreshFunction();
          }
        });
      }
      /////////////////////////////////////////
      // CREATEs
      /////////////////////////////////////////
      function createEventComment(event, commentText) {
        var params = {
            event_id: event.id,
            comment_text: commentText
          };
        create('eventComments', params).then(function (responseData) {
          getEventComments(event);
        });
        event.comment_count++;
      }
      function createFavorite(workout) {
        var params = {
            workout_id: workout.id,
            name: workout.name
          };
        create('favorites', params);
      }
      function createQuickLog(vm, request, refreshFunction) {
        var params = {
            number_of_days_ago: request.numberOfDaysAgo,
            quick_activity_id: request.quickActivityId,
            duration: request.duration,
            desc: request.description,
            calories_burned: request.caloriesBurned
          };
        actionThenBind(create, vm, 'quickLog', params, [], refreshFunction);
      }
      function createFriendRequest(vm, friend, refreshFunction) {
        var params = { friend_id: friend.id };
        actionThenBind(create, vm, 'friendRequestsFromMe', params, [], refreshFunction);
      }
      function acceptFriendRequest(vm, friendRequest) {
        var params = { user_id: friendRequest.user.id };
        actionThenBind(create, vm, 'friendRequestAccept', params, [
          'friends',
          'friendRequestsForMe'
        ]);
      }
      function joinCompany(vm, signupCode) {
        var params = { signup_code: signupCode };
        actionThenBind(create, vm, 'companyJoin', params, ['company']);
      }
      function leaveCompany(vm, company) {
        var params = { company_id: company.id };
        actionThenBind(destroy, vm, 'companyLeave', params, ['company']);
      }
      /////////////////////////////////////////
      // UPDATEs
      /////////////////////////////////////////
      function updateBodyStats(vm, bodyStats) {
        actionThenBind(update, vm, 'bodyStats', { body_stats: bodyStats });
      }
      function updateBodyPartStats(vm, bodyPartStats) {
        actionThenBind(update, vm, 'bodyPartStats', { body_part_stats: bodyPartStats });
      }
      function updateUserLocations(locations) {
        update('locations', { locations: locations });
      }
      function updateUser(vm) {
        actionThenBind(update, vm, 'user', vm.user);
      }
      function updateUserStatus(vm, status) {
        var params = { current_status: status };
        actionThenBind(update, vm, 'user', params, ['events']);
      }
      /////////////////////////////////////////
      // GETs
      /////////////////////////////////////////
      function getDataSet(dataNames) {
        var dataInfos = [];
        for (var i = 0; i < dataNames.length; i++) {
          dataInfos.push(dataInfoLookup[dataNames[i]]);
        }
        return data.getDataSet(dataInfos);
      }
      function getBodyStatHistory(vm, bodyStat) {
        var params = { value: bodyStat.value };
        actionThenBind(get, vm, 'bodyStatHistory', params, null, null, transformStats);
      }
      function transformStats(dataIn) {
        var dataOut = [];
        for (var i = 1; i < dataIn.length; i++) {
          var data = dataIn[i];
          dataOut.push({
            x: new Date(data['created_at']),
            value: data['data']
          });
        }
        return dataOut;
      }
      function getBodyPartStatHistory(vm, bodyPartStat) {
        var params = { body_part_id: bodyPartStat.body_part_id };
        actionThenBind(get, vm, 'bodyPartStatHistory', params, null, null, transformStats);
      }
      function getWeight() {
        //        var bodyStats = getStateData('bodyStats');
        //        for(var b in bodyStats){
        //          if(bodyStats[b].value === 'weight'){
        //            return bodyStats[b].data;
        //          }
        //        }
        return 150;
      }
      function getWorkout(workouts, workoutId) {
        var params = { id: workoutId };
        get('workout', params).then(function (responseData) {
          workouts[workoutId] = responseData;
        });
      }
      function getEventComments(event) {
        var params = { event_id: event.id };
        get('eventComments', params).then(function (responseData) {
          event.comments = responseData;
        });
      }
      function getEvents(vm, force) {
        actionThenBind(get, vm, 'events');
      }
      function getFriend(friendId) {
        friendId = friendId ? friendId : this.getStateData('currentFriendId');
        return get('friend', { friend_id: friendId });
      }
      function getFriends(vm) {
        actionThenBind(get, vm, 'friends');
      }
      function getFriendsFromSearch(vm, searchText) {
        var params = { search_text: searchText };
        actionThenBind(get, vm, 'friendsFromSearch', params);
      }
      /////////////////////////////////////////
      // DESTROYs
      /////////////////////////////////////////
      function deleteFavorite(vm, favorite) {
        var params = { favorite_id: favorite.id };
        actionThenBind(destroy, vm, 'favorites', params);
      }
      function deleteFriend(vm, friend) {
        var params = { friend_id: friend.id };
        actionThenBind(destroy, vm, 'friends', params);
      }
      function declineFriendRequest(vm, friendRequest, refreshFunction) {
        var params = { user_id: friendRequest.user.id };
        actionThenBind(destroy, vm, 'friendRequestDecline', params, ['friendRequestsForMe'], refreshFunction);
      }
      function deleteEventComment(event, comment) {
        var params = {
            event_id: event.id,
            comment_id: comment.id
          };
        destroy('eventComments', params).then(function (responseData) {
          getEventComments(event);
        });
        event.comment_count--;
      }
      function deleteFriendRequest(vm, friendRequest, refreshFunction) {
        var params = { friend_id: friendRequest.friend.id };
        actionThenBind(destroy, vm, 'friendRequestsFromMe', params, [], refreshFunction);
      }
      function resetPassword(email) {
        return create('password', { email: email });
      }
      function newPassword(params) {
        return update('password', params);
      }
    }
  }
}());
(function () {
  'use strict';
  angular.module('app').factory('workout', workout);
  workout.$inject = [
    '$q',
    '$rootScope',
    '$interval',
    'modalUtils',
    'data',
    'globalData',
    'userData'
  ];
  function workout($q, $rootScope, $interval, modalUtils, data, globalData, userData) {
    var dataInfo;
    var dataInfoLookup = {};
    var quickRequest = null;
    var requestType = null;
    ;
    var favoriteId = null;
    var globalDataSet;
    var exerciseLookup;
    var workout;
    var intervals = [];
    var factory = {
        getExerciseLookup: getExerciseLookup,
        initialize: initialize,
        setCustomRequest: setCustomRequest,
        setQuickRequest: setQuickRequest,
        setFavoriteRequest: setFavoriteRequest,
        getWorkout: getWorkout,
        updateBlockSet: updateBlockSet,
        updateBlock: updateBlock,
        updateWorkout: updateWorkout,
        setWorkout: setWorkout,
        clear: clear,
        deleteBlock: deleteBlock,
        moveBlock: moveBlock,
        swapBlock: swapBlock,
        duplicateBlock: duplicateBlock,
        addRandomBlock: addRandomBlock,
        addExercises: addExercises,
        deleteLastSet: deleteLastSet,
        duplicateLastSet: duplicateLastSet
      };
    return factory;
    function getExerciseLookup() {
      return exerciseLookup;
    }
    function initialize() {
      dataInfo = [
        {
          name: 'quickWorkout',
          bind_as: 'workout',
          target: 'quick_workout',
          store: true
        },
        {
          name: 'customWorkout',
          bind_as: 'workout',
          target: 'custom_workout',
          store: true
        },
        {
          name: 'favoriteWorkout',
          bind_as: 'workout',
          target: 'favorite_workout',
          store: true
        },
        {
          name: 'workout',
          bind_as: 'workout',
          target: 'workout'
        },
        {
          name: 'block',
          target: 'block'
        },
        {
          name: 'swapBlock',
          target: 'swap'
        },
        {
          name: 'duplicateBlock',
          target: 'duplicate'
        },
        {
          name: 'randomBlock',
          target: 'random'
        },
        {
          name: 'addExercises',
          target: 'add_exercises'
        }
      ];
      for (var i = 0; i < dataInfo.length; i++) {
        var info = dataInfo[i];
        dataInfoLookup[info.name] = info;
      }
    }
    function initializeWorkout() {
      addExerciseIds();
      addEquipmentIds();
      addPhotos();
      addExerciseToBlocks();
      calculateTotalTime();
    }
    function moveBlock(blockIndex, direction) {
      var blocks = workout.blocks;
      var increment = direction === 'down' ? 1 : -1;
      var block = blocks.splice(blockIndex, 1)[0];
      blocks.splice(blockIndex + increment, 0, block);
      for (var i = 0; i < blocks.length; i++) {
        var needUpdate = blocks[i].rank != i + 1 ? true : false;
        blocks[i].rank = i + 1;
        if (needUpdate) {
          updateBlock(blocks[i]);
        }
      }
    }
    function swapBlock(blockIndex, callAfter) {
      var block = workout.blocks[blockIndex];
      data.postData(dataInfoLookup['swapBlock'], { block_id: block.id }).then(function (responseData) {
        workout.blocks[blockIndex] = responseData.block;
        initializeWorkout();
        callAfter();
      });
    }
    function deleteLastSet(blockIndex) {
      var block = workout.blocks[blockIndex];
      block.block_sets.splice(block.block_sets.length - 1, 1);
      updateBlock(block);
      initializeWorkout();
    }
    function duplicateLastSet(blockIndex) {
      var block = workout.blocks[blockIndex];
      var blockSet = block.block_sets[block.block_sets.length - 1];
      var newBlockSet = JSON.parse(JSON.stringify(blockSet));
      block.block_sets.push(newBlockSet);
      updateBlock(block);
      initializeWorkout();
    }
    function duplicateBlock(blockIndex, callAfter) {
      var block = workout.blocks[blockIndex];
      data.postData(dataInfoLookup['duplicateBlock'], { block_id: block.id }).then(function (responseData) {
        workout.blocks.splice(blockIndex, 0, responseData.block);
        initializeWorkout();
        callAfter();
      });
    }
    function addExercises(exercises, callAfter) {
      var exerciseIds = [];
      for (var i = 0; i < exercises.length; i++) {
        exerciseIds.push(exercises[i].id);
      }
      data.postData(dataInfoLookup['addExercises'], {
        workout_id: workout.id,
        exercise_ids: exerciseIds
      }).then(function (responseData) {
        for (var i = 0; i < responseData.blocks.length; i++) {
          var block = responseData.blocks[i];
          workout.blocks.push(block);
        }
        initializeWorkout();
        callAfter();
      });
    }
    function addRandomBlock(callAfter) {
      data.postData(dataInfoLookup['randomBlock'], { workout_id: workout.id }).then(function (responseData) {
        workout.blocks.push(responseData.block);
        initializeWorkout();
        callAfter();
      });
    }
    function deleteBlock(blockIndex) {
      var block = workout.blocks[blockIndex];
      data.deleteData(dataInfoLookup['block'], { block_id: block.id });
      workout.blocks.splice(blockIndex, 1);
      initializeWorkout();
    }
    function updateBlock(block) {
      data.patchData(dataInfoLookup['block'], { block: block });
      initializeWorkout();
    }
    function updateBlockSet(criteriaName, blockSet, block) {
      var criterion = blockSet.criterion;
      switch (criteriaName) {
      case 'reps':
      case 'breath':
      case 'pattern':
      case 'duration':
        criterion.time = criterion.rate * criterion[criteriaName] + criterion.rest;
        break;
      case 'rest':
        criterion.time = criterion[criterion.mode] * criterion.rate + criterion[criteriaName];
        break;
      }
      updateBlock(block);
    }
    function updateWorkout(finishFunction) {
      workout['finished'] = true;
      data.patchData(dataInfoLookup['workout'], workout).then(function (responseData) {
        if (finishFunction) {
          finishFunction(responseData);
        }
      });
    }
    function setWorkout(work) {
      workout = work;
    }
    function clear() {
      for (var i = 0; i < intervals.length; i++) {
        $interval.cancel(intervals[i]);
      }
      intervals.length = 0;
      workout = null;
      userData.setStateData('workout', null);
      requestType = null;
      quickRequest = null;
      favoriteId = null;
    }
    function calculateTotalTime() {
      var total_time = 0;
      for (var i = 0; i < workout.blocks.length; i++) {
        var block = workout.blocks[i];
        for (var j = 0; j < block.block_sets.length; j++) {
          var block_set = block.block_sets[j];
          total_time += block_set.criterion.time;
        }
      }
      workout.total_time_seconds = total_time;
    }
    function addExerciseIds() {
      var exerciseIdLookup = {};
      for (var i = 0; i < workout.blocks.length; i++) {
        var exerciseId = workout.blocks[i].block_sets[0].exercise_id;
        exerciseIdLookup[exerciseId] = 1;
      }
      workout.exercise_ids = Object.keys(exerciseIdLookup);
    }
    function addExerciseToBlocks() {
      for (var i = 0; i < workout.blocks.length; i++) {
        var block = workout.blocks[i];
        block.exercise = exerciseLookup[block.block_sets[0].exercise_id];
      }
    }
    function addEquipmentIds() {
      var equipmentLookup = {};
      workout.equipment_ids = [];
      for (var i = 0; i < workout.exercise_ids.length; i++) {
        var exercise = exerciseLookup[workout.exercise_ids[i]];
        for (var j = 0; j < exercise.equipment_ids.length; j++) {
          equipmentLookup[exercise.equipment_ids[j]] = true;
        }
      }
      for (var key in equipmentLookup) {
        workout.equipment_ids.push(key * 1);
      }
    }
    function addPhotos() {
      for (var i = 0; i < workout.blocks.length; i++) {
        var blockSet = workout.blocks[i].block_sets[0];
        var exercise = globalDataSet.exerciseLookup[blockSet.exercise_id];
        var animationSequence = exercise.animation.sequence;
        var split = animationSequence.split('__');
        var animationInfo = {
            current: 0,
            firstLoop: true,
            images: exercise.animation.images,
            imageOrder: [],
            imageTiming: [],
            loopBack: parseInt(split[1]) - 1,
            photoStart: photoStart,
            photoStop: undefined,
            photoEnd: photoEnd,
            stopper: stopper
          };
        split = split[0].split('_');
        for (var j = 0; j < split.length / 2; j++) {
          animationInfo.imageOrder.push(split[j * 2]);
          animationInfo.imageTiming.push(split[j * 2 + 1]);
        }
        workout.blocks[i].animationInfo = animationInfo;
      }
    }
    function photoStart() {
      var interval;
      if (angular.isDefined(this.photoStop))
        return;
      this.photoStop = interval = $interval(this.stopper.bind(this), this.imageTiming[this.current]);
      intervals.push(interval);
    }
    function stopper() {
      if (this.firstLoop) {
        this.firstLoop = false;
      }
      if (this.current < this.images.length - 1) {
        this.current += 1;
      } else {
        this.current = this.loopBack;
      }
    }
    function photoEnd() {
      if (angular.isDefined(this.photoStop)) {
        $interval.cancel(this.photoStop);
        this.photoStop = undefined;
      }
    }
    function setQuickRequest(request) {
      requestType = 'quickWorkout';
      quickRequest = request;
      favoriteId = null;
      workout = null;
    }
    function setCustomRequest() {
      requestType = 'customWorkout';
      quickRequest = null;
      favoriteId = null;
      workout = null;
    }
    function setFavoriteRequest(favorite) {
      requestType = 'favoriteWorkout';
      quickRequest = null;
      favoriteId = favorite.id;
      workout = null;
    }
    function getWorkout() {
      var deferred = $q.defer();
      if (!requestType) {
        deferred.reject('Workout could not be retrieved');
      } else if (workout) {
        deferred.resolve(workout);
      } else {
        globalData.getAll().then(function (dataSet) {
          globalDataSet = dataSet;
          exerciseLookup = dataSet.exerciseLookup;
          deferred.resolve(createWorkout());
        });
      }
      return deferred.promise;
    }
    function createWorkout() {
      var postData = {};
      switch (requestType) {
      case 'customWorkout':
        postData = {};
        break;
      case 'quickWorkout':
        postData = {
          body_area_ids: quickRequest.bodyAreaIds,
          total_time: quickRequest.workoutTime,
          category_id: quickRequest.categoryId,
          location_id: quickRequest.locationId,
          intensity: quickRequest.intensity
        };
        break;
      case 'favoriteWorkout':
        postData = { favorite_id: favoriteId };
        break;
      }
      return data.postData(dataInfoLookup[requestType], postData, handleWorkoutError).then(function (responseData) {
        workout = {};
        workout.custom = requestType == 'customWorkout' ? true : false;
        workout = responseData;
        initializeWorkout();
        userData.setStateData('workout', workout);
        return workout;
      });
    }
    function handleWorkoutError(response) {
      modalUtils.launch('error', 'Could not create workout');
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.exercise').config(ExerciseConfig);
  ExerciseConfig.$inject = ['$stateProvider'];
  function ExerciseConfig($stateProvider) {
    $stateProvider.state('exercise', {
      url: '/exercise',
      controller: 'ExerciseController',
      controllerAs: 'exercise',
      templateUrl: 'app/exercise/exercise.html'
    });
  }
}());
(function () {
  'use strict';
  angular.module('app.exercise').controller('ExerciseController', ExerciseController);
  ExerciseController.$inject = [
    '$scope',
    '$state',
    'globalData',
    'userData',
    'globalDataSet',
    'userDataSet',
    'workout',
    'workoutData',
    'helpers',
    'infoFactory',
    'exerciser',
    'modalUtils'
  ];
  function ExerciseController($scope, $state, globalData, userData, globalDataSet, userDataSet, workout, workoutData, helpers, infoFactory, exerciser, modalUtils) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.workout = workoutData;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.isCollapsed = false;
    vm.infoClicked = infoFactory.getClicked;
    vm.color = 'balanced';
    vm.navcolor = 'tabs-background-calm';
    vm.timeString = helpers.timeString;
    vm.curOrNext = false;
    vm.centerButton = '12';
    vm.button = {};
    vm.button.color = 'btn-success';
    vm.button.text = 'ion-play';
    vm.button.textTwo = 'Start';
    vm.startPauseClick = exerciser.startPauseClick;
    vm.complete = exerciser.complete;
    vm.doneOrSkip = 'Skip';
    vm.setOrRest = 'Set';
    vm.currentTime = exerciser.getCurrentTime(vm);
    vm.currentTotalTime = exerciser.getCurrentTotalTime();
    vm.workout.workout_total_time = vm.currentTotalTime;
    vm.setBG = exerciser.getBG(vm.workout);
    vm.message = '';
    vm.workoutName = exerciser.getCurrentExercise(vm.workout);
    vm.nextExercise = exerciser.getNextExercise(vm.workout);
    vm.curProgress = exerciser.getCurProgress(vm.workout);
    vm.caloriesBurned = exerciser.getCaloriesBurned();
    vm.skipAvailable = true;
    vm.skip = skip;
    vm.cyclerStopped = true;
    vm.getCurrentBlock = exerciser.getCurrentBlock;
    vm.getCurrentSet = exerciser.getCurrentSet;
    vm.bodyStats = userDataSet.bodyStats;
    vm.criterionDisplayInfo = {
      duration: { name: 'Time:' },
      reps: { name: 'Reps:' },
      breath: { name: 'Breaths:' },
      pattern: { name: 'Pattern:' },
      weight: { name: 'Lbs:' },
      rest: { name: 'Rest:' }
    };
    for (var b in vm.bodyStats) {
      if (vm.bodyStats[b].value == 'weight') {
        exerciser.setUserWeight(vm.bodyStats[b].data);
      }
    }
    function skip() {
      exerciser.skip(vm);
      vm.workoutName = exerciser.getCurrentExercise(vm.workout);
      vm.nextExercise = exerciser.getNextExercise(vm.workout);
      vm.curProgress = exerciser.getCurProgress(vm.workout);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.exercise', []);
}());
(function () {
  'use strict';
  angular.module('app.favorites').controller('FavoritesController', FavoritesController);
  FavoritesController.$inject = [
    '$state',
    'userData',
    'userDataSet',
    'workout',
    'infoFactory'
  ];
  function FavoritesController($state, userData, userDataSet, workout, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.favorites = userDataSet.favorites;
    vm.doWorkout = doWorkout;
    vm.deleteFavorite = deleteFavorite;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    function doWorkout(favorite) {
      workout.setFavoriteRequest(favorite);
      $state.go('nav.customizeWorkout');
    }
    function deleteFavorite(index) {
      var favorite = vm.favorites[index];
      userData.deleteFavorite(vm, favorite);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.favorites', []);
}());
(function () {
  'use strict';
  angular.module('app.friend').controller('FriendController', FriendController);
  FriendController.$inject = [
    'globalData',
    'userData',
    'globalDataSet',
    'userDataSet',
    'friendData',
    'helpers'
  ];
  function FriendController(globalData, userData, globalDataSet, userDataSet, friendData, helpers) {
    var vm = this;
    vm.friend = friendData;
    vm.user = userDataSet.user;
    vm.friends = userDataSet.friends;
    vm.friendRequestsForMe = userDataSet.friendRequestsForMe;
    vm.friendRequestsFromMe = userDataSet.friendRequestsFromMe;
    vm.timeString = helpers.timeString;
    vm.formatTime = helpers.formatTime;
    vm.isReadonly = false;
    vm.isReadonlyTwo = false;
    vm.isCollapsedLogs = true;
    vm.isCollapsedStats = true;
    vm.isCollapsedFriends = true;
    vm.isCollapsedWorkouts = true;
    vm.predicate = 'monthly_points';
    vm.createFriendRequest = createFriendRequest;
    vm.expander = expander;
    vm.workouts = {};
    vm.workoutHidden = {};
    vm.getWorkout = getWorkout;
    vm.exerciseLookup = globalDataSet.exerciseLookup;
    vm.friendsCheck = friendsCheck;
    vm.createFriendRequest = createFriendRequest;
    vm.createFavorite = createFavorite;
    vm.criterionDisplayInfo = {
      duration: { name: 'Time:' },
      reps: { name: 'Rep:' },
      breath: { name: 'Breaths:' },
      pattern: { name: 'Pattern:' },
      weight: { name: 'Lb:' },
      rest: { name: 'Rest:' }
    };
    for (var w in vm.friend.workouts) {
      vm.workoutHidden[vm.friend.workouts[w].id] = true;
    }
    for (var f in vm.friends) {
      if (vm.friends[f].id == vm.friend.id) {
        for (var c in vm.friends[f]) {
          vm.friend[c] = vm.friends[f][c];
        }
      }
    }
    function createFriendRequest(friendRequest) {
      userData.createFriendRequest(vm, friendRequest);
    }
    function friendsCheck(f) {
      for (var i in vm.friends) {
        if (vm.friends[i].id == f.id || vm.user.id == f.id) {
          return true;
        }
      }
      for (var r in vm.friendRequestsForMe) {
        if (vm.friendRequestsForMe[r].friend.id == f.id || vm.user.id == f.id) {
          return true;
        }
      }
      for (var m in vm.friendRequestsFromMe) {
        if (vm.friendRequestsFromMe[m].friend.id == f.id || vm.user.id == f.id) {
          return true;
        }
      }
      return false;
    }
    function getWorkout(workoutId) {
      userData.getWorkout(vm.workouts, workoutId);
    }
    function expander(wh, wo) {
      if (!vm.workouts[wo.id]) {
        getWorkout(wo.id);
      }
      vm.workoutHidden[wo.id] = !vm.workoutHidden[wo.id];
    }
    function createFavorite(workout) {
      userData.createFavorite(workout);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.friend', []);
}());
(function () {
  'use strict';
  angular.module('app.friends').controller('FriendsController', FriendsController);
  FriendsController.$inject = [
    '$state',
    '$stateParams',
    'userData',
    'userDataSet',
    'infoFactory'
  ];
  function FriendsController($state, $stateParams, userData, userDataSet, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.friends = userDataSet.friends;
    vm.friendRequestsForMe = userDataSet.friendRequestsForMe;
    vm.friendRequestsFromMe = userDataSet.friendRequestsFromMe;
    vm.friendsFromSearch = [];
    vm.search = search;
    vm.createFriendRequest = createFriendRequest;
    vm.deleteFriendRequest = deleteFriendRequest;
    vm.acceptFriendRequest = acceptFriendRequest;
    vm.declineFriendRequest = declineFriendRequest;
    vm.deleteFriend = deleteFriend;
    vm.showFriend = showFriend;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.isCollapsedLeaders = true;
    vm.isCollapsedFriends = true;
    vm.isCollapsedRequests = true;
    vm.isCollapsedPending = true;
    vm.infoClicked = infoFactory.getClicked;
    vm.order = order;
    vm.invert = invert;
    vm.searchText = '';
    vm.searchSubmitted = false;
    vm.predicate = 'monthly_points';
    vm.reverse = true;
    vm.showDay = true;
    vm.showMonth = false;
    vm.showTotal = true;
    order('current_monthly_points');
    function invert(friend) {
      return !(friend.id == vm.user.id);
    }
    function order(predicate) {
      vm.reverse = vm.predicate === predicate ? !vm.reverse : true;
      vm.predicate = predicate;
      switch (predicate) {
      case 'current_daily_points':
        vm.showDay = false;
        vm.showMonth = true;
        vm.showTotal = true;
        break;
      case 'current_monthly_points':
        vm.showDay = true;
        vm.showMonth = false;
        vm.showTotal = true;
        break;
      case 'current_total_points':
        vm.showDay = true;
        vm.showMonth = true;
        vm.showTotal = false;
        break;
      }
    }
    function search() {
      userData.getFriendsFromSearch(vm, vm.searchText);
      vm.searchSubmitted = true;
    }
    function createFriendRequest(friendRequest) {
      userData.createFriendRequest(vm, friendRequest, search);
    }
    function deleteFriendRequest(friendRequest) {
      userData.deleteFriendRequest(vm, friendRequest, search);
    }
    function acceptFriendRequest(friendRequest) {
      userData.acceptFriendRequest(vm, friendRequest);
    }
    function declineFriendRequest(friendRequest) {
      userData.declineFriendRequest(vm, friendRequest);
    }
    function deleteFriend(friend) {
      userData.deleteFriend(vm, friend);
    }
    function showFriend(friend) {
      userData.setStateData('currentFriendId', friend.id);
      $state.go('nav.friend');
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.friends', []);
}());
(function () {
  'use strict';
  angular.module('app.home').controller('HomeController', HomeController);
  HomeController.$inject = [
    '$state',
    '$scope',
    '$modal',
    'globalData',
    'userData',
    'globalDataSet',
    'userDataSet',
    'helpers',
    'workout'
  ];
  function HomeController($state, $scope, $modal, globalData, userData, globalDataSet, userDataSet, helpers, workout) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.events = userDataSet.events;
    vm.randomTip = helpers.getRandomValue(globalDataSet.tips);
    vm.formatTime = helpers.formatTime;
    vm.maxMonth = 600;
    vm.maxDay = 50;
    vm.dProgress = vm.user.current_daily_points / vm.maxDay * 100;
    vm.mProgress = vm.user.current_monthly_points / vm.maxMonth * 100;
    vm.helpers = helpers;
    vm.showComments = showComments;
    vm.statusString;
    vm.submitComment = submitComment;
    vm.removeComment = removeComment;
    vm.updateStatus = updateStatus;
    vm.customWorkout = customWorkout;
    function showComments(event) {
      event.show = event.show ? false : true;
      if (event.show) {
        userData.getEventComments(event);
      }
    }
    function submitComment(event) {
      userData.createEventComment(event, event.commentText);
      var form = document.getElementById('commentForm');
      form.reset();
    }
    function removeComment(event, comment) {
      userData.deleteEventComment(event, comment);
    }
    function updateStatus() {
      vm.user.current_status = vm.statusString;
      userData.updateUserStatus(vm, vm.user.current_status);
      var form = document.getElementById('statusForm');
      form.reset();
    }
    function customWorkout() {
      workout.setCustomRequest();
      $state.go('nav.customizeWorkout');
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.home', []);
}());
(function () {
  'use strict';
  angular.module('app.locations').controller('LocationsController', LocationsController);
  LocationsController.$inject = [
    '$state',
    'globalData',
    'userData',
    'globalDataSet',
    'userDataSet',
    'infoFactory'
  ];
  function LocationsController($state, globalData, userData, globalDataSet, userDataSet, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.equipmentGroups = globalDataSet.equipmentGroups;
    vm.equipmentLookup = globalDataSet.equipmentLookup;
    vm.spaces = globalDataSet.spaces;
    vm.locations = userDataSet.locations;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.namesEmpty = false;
    vm.evalName = evalName;
    vm.toggleEquipment = toggleEquipment;
    vm.submit = submit;
    vm.hiding = { 'location': [] };
    for (var l in vm.locations) {
      vm.hiding['location'].push({
        'hidden': true,
        'hider': []
      });
      for (var g in vm.equipmentGroups) {
        vm.hiding['location'][l]['hider'].push(true);
      }
    }
    function submit() {
      userData.updateUserLocations(vm.locations);
      $state.go('nav.home');
    }
    function toggleEquipment(location, equipment_id) {
      var index = location['equipment_ids'].indexOf(equipment_id);
      if (index >= 0) {
        location['equipment_ids'].splice(index, 1);
      } else {
        location['equipment_ids'].push(equipment_id);
      }
    }
    function evalName() {
      vm.namesEmpty = false;
      for (var l in vm.locations) {
        if (vm.locations[l].name === '') {
          vm.namesEmpty = true;
        }
      }
    }
    function infoClicked() {
      vm.isCollapsed = !vm.isCollapsed;
      vm.user['settings']['help']['locations'] = vm.isCollapsed;
      userData.updateUser(vm.user);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.locations', []);
}());
(function () {
  'use strict';
  angular.module('app.login').controller('LoginController', LoginController);
  LoginController.$inject = [
    '$scope',
    '$state',
    'globalData',
    'auth'
  ];
  function LoginController($scope, $state, globalData, auth) {
    var vm = this;
    vm.isReadOnly = false;
    vm.user = {
      'email': '',
      'password': ''
    };
    vm.login = login;
    function login() {
      vm.isReadOnly = true;
      auth.login(vm.user);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.login', []);
}());
(function () {
  'use strict';
  angular.module('app.logout').controller('LogoutController', LogoutController);
  LogoutController.$inject = [
    '$location',
    'auth',
    'globalData'
  ];
  function LogoutController($location, auth, globalData) {
    if ($location.search().clear_cache) {
      globalData.clearData();
    }
    auth.logout();
  }
}());
(function () {
  'use strict';
  angular.module('app.logout', []);
}());
(function () {
  'use strict';
  angular.module('app.modal').controller('ModalController', ModalController);
  ModalController.$inject = [
    '$scope',
    '$state',
    '$modalInstance',
    'modalData'
  ];
  function ModalController($scope, $state, $modalInstance, modalData) {
    var vm = $scope;
    vm.data = modalData;
    vm.ok = ok;
    vm.cancel = cancel;
    vm.isReadonlytwo = false;
    function ok() {
      $modalInstance.close();
    }
    function cancel() {
      $modalInstance.dismiss();
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.modal').factory('modalUtils', modalUtils);
  modalUtils.$inject = [
    '$modal',
    '$state'
  ];
  function modalUtils($modal, $state) {
    var currentOpen = '';
    var factory = { launch: launch };
    return factory;
    function launch(templateType, data) {
      var modalInstance;
      var modalData = {};
      var thisOpen = '';
      var modalConfig = {
          controller: 'ModalController',
          resolve: { modalData: modalData }
        };
      switch (templateType) {
      case 'error':
        modalConfig.templateUrl = 'app/modal/modalError.html';
        modalData.error_message = data || 'Something went wrong';
        thisOpen = templateType + modalData.error_message;
        break;
      case 'welcomeAfterSignup':
        modalConfig.templateUrl = 'app/modal/modalWelcomeAfterSignup.html';
        thisOpen = templateType;
        break;
      case 'greatJob':
        modalConfig.templateUrl = 'app/modal/modalGreatJob.html';
        modalData.sentence = data;
        thisOpen = templateType;
        break;
      case 'youSure':
        modalConfig.templateUrl = 'app/modal/modalYouSure.html';
        thisOpen = templateType;
        break;
      }
      if (thisOpen == currentOpen) {
        return;
      } else {
        currentOpen = thisOpen;
      }
      modalInstance = $modal.open(modalConfig);
      modalInstance.result.then(function (resultData) {
        currentOpen = '';
        if (templateType == 'youSure') {
          data();
        }
      }, function (data) {
        currentOpen = '';
      });
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.modal', []);
}());
(function () {
  'use strict';
  angular.module('app.points').controller('PointsController', PointsController);
  PointsController.$inject = [
    'userData',
    'userDataSet',
    'helpers',
    'infoFactory'
  ];
  function PointsController(userData, userDataSet, helpers, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.points = userDataSet.points;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.isCollapsedPoints = true;
    vm.infoClicked = infoFactory.getClicked;
    vm.maxMonth = 600;
    vm.maxDay = 50;
    vm.thisDayPoints = vm.user['current_daily_points'];
    vm.thisMonthPoints = vm.user['current_monthly_points'];
    vm.totalPoints = vm.user['current_total_points'];
    vm.dProgress = vm.user['current_daily_points'] / vm.maxDay * 100;
    vm.mProgress = vm.user['current_monthly_points'] / vm.maxMonth * 100;
    vm.formatTime = helpers.formatTime;
    function infoClicked() {
      vm.isCollapsed = !vm.isCollapsed;
      vm.user['settings']['help']['points'] = vm.isCollapsed;
      userData.updateUser(vm.user);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.points', []);
}());
(function () {
  'use strict';
  angular.module('app.profile').controller('ProfileController', ProfileController);
  ProfileController.$inject = [
    'globalData',
    'userData',
    'globalDataSet',
    'userDataSet',
    'helpers',
    'infoFactory'
  ];
  function ProfileController(globalData, userData, globalDataSet, userDataSet, helpers, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.bodyStats = userDataSet.bodyStats;
    vm.bodyPartStats = userDataSet.bodyPartStats;
    vm.bodyStatHistory = [];
    vm.bodyPartStatHistory = [];
    vm.userHistory = userDataSet.userHistory;
    vm.formatTime = helpers.formatTime;
    vm.timeString = helpers.timeString;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.isCollapsedLogs = true;
    vm.isCollapsedStats = true;
    vm.isCollapsedBody = true;
    vm.isCollapsedWorkouts = true;
    vm.infoClicked = infoFactory.getClicked;
    vm.options = options;
    vm.expander = expander;
    vm.getWorkout = getWorkout;
    vm.nameFilter = nameFilter;
    vm.unitsFilter = unitsFilter;
    vm.displayBodyStatHistory = displayBodyStatHistory;
    vm.displayBodyPartStatHistory = displayBodyPartStatHistory;
    vm.submitStats = submitStats;
    vm.exerciseLookup = globalDataSet.exerciseLookup;
    vm['hiding'] = {};
    vm.workouts = {};
    vm.workoutHidden = {};
    vm.criterionDisplayInfo = {
      duration: { name: 'Time:' },
      reps: { name: 'Rep:' },
      breath: { name: 'Breaths:' },
      pattern: { name: 'Pattern:' },
      weight: { name: 'Lb:' },
      rest: { name: 'Rest:' }
    };
    initialize();
    function displayBodyStatHistory(bodyStat) {
      vm.options = options;
      userData.getBodyStatHistory(vm, bodyStat);
      for (var h in vm.hiding) {
        vm.hiding[h] = true;
      }
      vm.hiding[bodyStat['value']] = vm.hiding[bodyStat['value']] ? false : true;
    }
    function displayBodyPartStatHistory(bodyPartStat) {
      vm.options = options;
      userData.getBodyPartStatHistory(vm, bodyPartStat);
      for (var h in vm.hiding) {
        vm.hiding[h] = true;
      }
      vm.hiding[bodyPartStat['body_part_id']] = vm.hiding[bodyPartStat['body_part_id']] ? false : true;
    }
    function nameFilter(input) {
      var out = '';
      if (input === 'height') {
        out = 'Height';
      }
      if (input === 'weight') {
        out = 'Weight';
      }
      if (input === 'bmi') {
        out = 'BMI';
      }
      if (input === 'body_fat') {
        out = 'Body Fat %';
      }
      if (input === 'resting_heart_rate') {
        out = 'Resting Heart Rate';
      }
      return out;
    }
    function unitsFilter(input) {
      var out = '';
      if (vm.user['settings']['units'] === 'standard') {
        if (input === 'height') {
          out = '(inches)';
        }
        if (input === 'weight') {
          out = '(lbs)';
        }
      } else {
        if (input === 'height') {
          out = '(cm)';
        }
        if (input === 'weight') {
          out = '(kg)';
        }
      }
      if (input === 'bmi') {
        out = '(calculated)';
      }
      if (input === 'resting_heart_rate') {
        out = '(BPM)';
      }
      return out;
    }
    function initialize() {
      for (var b in vm.bodyStats) {
        vm.hiding[vm.bodyStats[b]['value']] = true;  //vm.bodyStatsHistory[vm.bodyStats[b].value] = [];
      }
      for (var b in vm.bodyPartStats) {
        vm.hiding[vm.bodyPartStats[b]['body_part_id']] = true;  //vm.bodyPartStatsHistory[vm.bodyPartStats[b].id] = [];
      }
      for (var w in vm.userHistory.workouts) {
        vm.workoutHidden[vm.userHistory.workouts[w].id] = true;
      }
    }
    var options = {
        axes: {
          x: {
            type: 'date',
            innerTicks: true,
            ticks: 4
          },
          y: {
            type: 'linear',
            min: 0,
            innerTicks: true
          }
        },
        margin: { left: 100 },
        series: [{
            y: 'value',
            axis: 'y',
            color: '#11C1F3',
            thickness: '2px',
            type: 'area',
            label: 'A time series'
          }],
        lineMode: 'linear',
        tension: 0.7,
        tooltip: { mode: 'scrubber' },
        drawLegend: false,
        drawDots: true,
        hideOverflow: false,
        columnsHGap: 5
      };
    function getWorkout(workoutId) {
      userData.getWorkout(vm.workouts, workoutId);
    }
    function submitStats() {
      userData.updateBodyStats(vm, vm.bodyStats);
      userData.updateBodyPartStats(vm, vm.bodyPartStats);
    }
    function expander(wh, wo) {
      if (!vm.workouts[wo.id]) {
        getWorkout(wo.id);
      }
      vm.workoutHidden[wo.id] = !vm.workoutHidden[wo.id];
    }
    function infoClicked() {
      vm.isCollapsed = !vm.isCollapsed;
      vm.user['settings']['help']['profile'] = vm.isCollapsed;
      userData.updateUser(vm.user);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.profile', []);
}());
(function () {
  'use strict';
  angular.module('app.quicklog').controller('QuickLogController', QuickLogController);
  QuickLogController.$inject = [
    '$state',
    'modalUtils',
    'userData',
    'globalDataSet',
    'userDataSet',
    'infoFactory'
  ];
  function QuickLogController($state, modalUtils, userData, globalDataSet, userDataSet, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.quickActivities = globalDataSet.quickActivities;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.cancel = cancel;
    vm.request = { numberOfDaysAgo: 0 };
    vm.numberOfDaysAgo = 0;
    vm.createQuickLog = createQuickLog;
    vm.quickLog = {};
    vm.daysAgo = [
      {
        number: 0,
        name: 'Today'
      },
      {
        number: 1,
        name: 'Yesterday'
      },
      {
        number: 2,
        name: '2 Days Ago'
      }
    ];
    function cancel() {
      $state.go('nav.home');
    }
    function createQuickLog() {
      userData.createQuickLog(vm, vm.request, finishQuickLog);
    }
    function finishQuickLog() {
      modalUtils.launch('greatJob', vm.quickLog.point.sentence);
      $state.go('nav.home');
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.quicklog', []);
}());
(function () {
  'use strict';
  angular.module('app.reset').controller('NewPasswordController', NewPasswordController);
  NewPasswordController.$inject = [
    '$http',
    '$location',
    '$state',
    'userData',
    'modalUtils'
  ];
  function NewPasswordController($http, $location, $state, userData, modalUtils) {
    var vm = this;
    vm.email = '';
    vm.password = '';
    vm.passwordConfirmation = '';
    vm.newPassword = newPassword;
    function newPassword() {
      var params = {
          email: vm.email,
          password: vm.password,
          password_confirmation: vm.passwordConfirmation,
          password_reset_code: $location.search().password_reset_code
        };
      userData.newPassword(params).then(function (responseData) {
        userData.setAuthToken(responseData.auth_token);
        $state.go('nav.home');
      });
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.reset').controller('ResetController', ResetController);
  ResetController.$inject = [
    '$http',
    'userData'
  ];
  function ResetController($http, userData) {
    var vm = this;
    vm.email = '';
    vm.emailSent = false;
    vm.reset = reset;
    function reset() {
      vm.emailSent = true;
      userData.resetPassword(vm.email);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.reset', []);
}());
(function () {
  'use strict';
  angular.module('app.settings').controller('SettingsController', SettingsController);
  SettingsController.$inject = [
    '$state',
    'angularFilepicker',
    'globalData',
    'globalDataSet',
    'userData',
    'userDataSet',
    'constants',
    'config',
    'infoFactory'
  ];
  function SettingsController($state, angularFilepicker, globalData, globalDataSet, userData, userDataSet, constants, config, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.usages = globalDataSet.usages;
    vm.experiences = [
      {
        value: 1,
        name: 'Beginner'
      },
      {
        value: 2,
        name: 'Intermediate'
      },
      {
        value: 3,
        name: 'Advanced'
      }
    ];
    vm.categories = globalDataSet.categories;
    vm.constants = constants();
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.isCollapsedInfo = true;
    vm.isCollapsedPW = true;
    vm.isCollapsedEmail = true;
    vm.infoClicked = infoFactory.getClicked;
    vm.isCollapsedTwo = true;
    vm.isCollapsedThree = true;
    vm.isReadonly = false;
    vm.pickFile = pickFile;
    vm.submit = submit;
    function pickFile() {
      angularFilepicker.pickAndStore({
        mimetype: 'image/*',
        multiple: false,
        imageDim: [
          600,
          600
        ]
      }, {
        location: 'S3',
        path: '/' + config.getEnv() + '/'
      }, function (blob) {
        vm.user.avatar_url = blob[0].url;
      });
    }
    function submit() {
      userData.updateUser(vm);
      $state.go('nav.home');
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.settings', []);
}());
(function () {
  'use strict';
  angular.module('app.signup').controller('SignupController', SignupController);
  SignupController.$inject = [
    'globalDataSet',
    'globalData',
    '$modal',
    'angularFilepicker',
    'dateUtils',
    'auth',
    'config',
    'constants'
  ];
  function SignupController(globalDataSet, globalData, $modal, angularFilepicker, dateUtils, auth, config, constants) {
    var vm = this;
    vm.user = {};
    vm.usages = globalDataSet.usages;
    vm.categories = globalDataSet.categories;
    vm.constants = constants();
    vm.years = dateUtils.getYears();
    vm.months = dateUtils.getMonths(vm.years[0]);
    vm.days = dateUtils.getDays(vm.months[0], vm.years[0]);
    vm.updateDays = updateDays;
    vm.updateMonths = updateMonths;
    vm.isCollapsedInfo = true;
    vm.pickFile = pickFile;
    vm.submit = submit;
    vm.experiences = [
      {
        value: 1,
        name: 'Beginner'
      },
      {
        value: 2,
        name: 'Intermediate'
      },
      {
        value: 3,
        name: 'Advanced'
      }
    ];
    function updateDays() {
      vm.days = dateUtils.getDays(vm.user['birth_month'], vm.user['birth_year']);
    }
    function updateMonths() {
      vm.months = dateUtils.getMonths(vm.user['birth_year']);
      updateDays();
    }
    function pickFile() {
      angularFilepicker.pickAndStore({
        mimetype: 'image/*',
        multiple: false,
        imageDim: [
          600,
          600
        ]
      }, {
        location: 'S3',
        path: '/' + config.getEnv() + '/'
      }, function (blob) {
        vm.user.avatar_url = blob[0].url;
      });
    }
    function submit() {
      auth.createUser(vm.user);
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.signup', []);
}());
(function () {
  'use strict';
  angular.module('app.workout', [
    'app.workout.customize',
    'app.workout.quick',
    'app.workout.summary'
  ]);
}());
(function () {
  'use strict';
  angular.module('app.workout.customize').controller('CustomizeWorkoutController', CustomizeWorkoutController);
  CustomizeWorkoutController.$inject = [
    '$scope',
    '$state',
    'userData',
    'userDataSet',
    'globalDataSet',
    'workout',
    'workoutData',
    'helpers',
    'infoFactory',
    'exerciser',
    'modalUtils'
  ];
  function CustomizeWorkoutController($scope, $state, userData, userDataSet, globalDataSet, workout, workoutData, helpers, infoFactory, exerciser, modalUtils) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.workout = workoutData;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.isReadonly = false;
    vm.showBlockInfo = showBlockInfo;
    vm.updateBlockSet = updateBlockSet;
    vm.moveBlock = moveBlock;
    vm.moveItem = moveItem;
    vm.showReorder = false;
    vm.deleteBlock = deleteBlock;
    vm.swapBlock = swapBlock;
    vm.duplicateBlock = duplicateBlock;
    vm.addRandomBlock = addRandomBlock;
    vm.exerciseList = [];
    vm.filteredExercises = filteredExercises;
    vm.createFavorite = createFavorite;
    vm.bodyAreas = [];
    vm.equipments = [];
    vm.categories = [];
    vm.addExerciseHidden = vm.workout.workout_type === 'custom';
    vm.addExercises = addExercises;
    vm.deleteLastSet = deleteLastSet;
    vm.duplicateLastSet = duplicateLastSet;
    vm.start = start;
    vm.criterionDisplayInfo = {
      duration: { name: 'Time:' },
      reps: { name: 'Rep:' },
      breath: { name: 'Breaths:' },
      pattern: { name: 'Pattern:' },
      weight: { name: 'Lb:' },
      rest: { name: 'Rest:' }
    };
    refreshDisplay();
    function refreshDisplay() {
      for (var i = 0; i < vm.workout.blocks.length; i++) {
        var block = vm.workout.blocks[i];
        block.showInfo = false;
        block.showDownButton = i == vm.workout.blocks.length - 1 ? false : true;
        block.showUpButton = i == 0 ? false : true;
      }
      vm.bodyAreas = [{
          name: 'All Body Areas',
          id: null
        }].concat(globalDataSet.bodyAreas);
      vm.equipments = [{
          name: 'All Equipment',
          id: null
        }].concat(globalDataSet.equipments);
      vm.categories = [{
          name: 'All Categories',
          id: null
        }].concat(globalDataSet.categories);
    }
    function showBlockInfo(blockIndex) {
      var block = vm.workout.blocks[blockIndex];
      block.showInfo = !block.showInfo;
      block.showInfo ? block.animationInfo.photoStart() : block.animationInfo.photoEnd();  // do animation stuff here
    }
    function updateBlockSet(criteriaName, blockSet, block) {
      workout.updateBlockSet(criteriaName, blockSet, block);
    }
    function moveBlock(blockIndex, direction) {
      workout.moveBlock(blockIndex, direction);
      refreshDisplay();
    }
    function moveItem(block, fromIndex, toIndex) {
      vm.workout.blocks.splice(fromIndex, 1);
      vm.workout.blocks.splice(toIndex, 0, block);
    }
    function deleteLastSet(blockIndex) {
      workout.deleteLastSet(blockIndex);
      refreshDisplay();
    }
    function duplicateLastSet(blockIndex) {
      workout.duplicateLastSet(blockIndex);
      refreshDisplay();
    }
    function createFavorite() {
      if (!vm.isReadonly) {
        userData.createFavorite(vm.workout);
        vm.isReadonly = !vm.isReadonly;
        document.getElementById('favoriteIcon').classList.add('energized');
      }
    }
    function swapBlock(blockIndex) {
      workout.swapBlock(blockIndex, refreshDisplay);
    }
    function duplicateBlock(blockIndex) {
      workout.duplicateBlock(blockIndex, refreshDisplay);
    }
    function addExercises() {
      workout.addExercises(vm.selectedExercises, refreshDisplay);
      vm.selectedExercises = [];
    }
    function addRandomBlock() {
      workout.addRandomBlock(refreshDisplay);
    }
    function deleteBlock(blockIndex) {
      workout.deleteBlock(blockIndex);
      refreshDisplay();
    }
    function filteredExercises() {
      var keys = vm.exerciseKeys ? vm.exerciseKeys.toLowerCase().split(' ') : null;
      var exercises = globalDataSet.exercises;
      vm.exerciseList = [];
      for (var i = 0; i < exercises.length; i++) {
        var exercise = exercises[i];
        if (vm.selectedBodyArea && vm.selectedBodyArea.id != null && vm.selectedBodyArea.id != exercise.primary_body_area_id) {
          continue;
        }
        if (vm.selectedEquipment && vm.selectedEquipment.id != null && exercise.equipment_ids.indexOf(vm.selectedEquipment.id) < 0) {
          continue;
        }
        if (vm.selectedCategory && vm.selectedCategory.id != null && exercise.category_ids.indexOf(vm.selectedCategory.id) < 0) {
          continue;
        }
        if (keys) {
          var hasKeys = true;
          for (var j = 0; j < keys.length; j++) {
            if (exercise.keys.indexOf(keys[j]) < 0) {
              hasKeys = false;
              break;
            }
          }
          if (!hasKeys) {
            continue;
          }
        }
        vm.exerciseList.push(exercise);
      }
      vm.exerciseList = vm.exerciseList.sort(function (a, b) {
        if (a.name > b.name)
          return 1;
        if (a.name < b.name)
          return -1;
        return 0;
      });
      return vm.exerciseList;
    }
    function start() {
      exerciser.initializeState();
      $state.go('nav.exercise');
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.workout.customize', []);
}());
(function () {
  'use strict';
  angular.module('app.workout.quick').controller('QuickWorkoutController', QuickWorkoutController);
  QuickWorkoutController.$inject = [
    '$state',
    'globalDataSet',
    'userData',
    'userDataSet',
    'workout',
    'infoFactory'
  ];
  function QuickWorkoutController($state, globalDataSet, userData, userDataSet, workout, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.locations = userDataSet.locations;
    vm.categories = globalDataSet.categories;
    vm.bodyAreasNested = globalDataSet.bodyAreasNested;
    vm.request = {
      'bodyAreaIds': [],
      'intensity': vm.user.intensity,
      'workoutTime': 20,
      'locationId': vm.locations[0].id,
      'categoryId': 2
    };
    vm.submitRequest = submitRequest;
    vm.show = {
      'l0': false,
      'l1': false,
      'l2': false
    };
    vm.toggleBodyArea = toggleBodyArea;
    vm.toggleCategory = toggleCategory;
    vm.baMissing = false;
    vm.isReadonly = false;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    function submitRequest() {
      workout.setQuickRequest(vm.request);
      $state.go('nav.customizeWorkout');
    }
    function toggleCategory(categoryId) {
      // this needs to be cleaned up along with the filters
      switch (categoryId) {
      case 4:
        for (var s in vm.show) {
          vm.show[s] = true;
        }
        vm.request.bodyAreaIds.length == 0 ? vm.baMissing = true : vm.baMissing = false;
        break;
      case 5:
        for (var s in vm.show) {
          vm.show[s] = true;
        }
        vm.request.bodyAreaIds.length == 0 ? vm.baMissing = true : vm.baMissing = false;
        break;
      default:
        for (var s in vm.show) {
          vm.show[s] = false;
        }
        vm.baMissing = false;
      }
    }
    function toggleBodyArea(bodyArea, level) {
      var checked = vm.request.bodyAreaIds.indexOf(bodyArea.id) == -1;
      var base = vm.bodyAreasNested[0];
      if (checked) {
        vm.request.bodyAreaIds.push(bodyArea.id);
        if (bodyArea.children != undefined) {
          for (var i in bodyArea.children) {
            var b = bodyArea.children[i];
            if (vm.request.bodyAreaIds.indexOf(b.id) == -1) {
              vm.request.bodyAreaIds.push(b.id);
            }
            if (b.children != undefined) {
              for (var j in b.children) {
                var c = b.children[j];
                if (vm.request.bodyAreaIds.indexOf(c.id) == -1) {
                  vm.request.bodyAreaIds.push(c.id);
                }
              }
            }
          }
        }
      } else if (level == 0) {
        vm.request.bodyAreaIds = [];
      } else if (level == 1) {
        if (vm.request.bodyAreaIds.indexOf(base.id) != -1) {
          vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(base.id), 1);
        }
        vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(bodyArea.id), 1);
        for (var i in bodyArea.children) {
          var a = bodyArea.children[i];
          if (vm.request.bodyAreaIds.indexOf(a.id) != -1) {
            vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(a.id), 1);
          }
        }
      } else {
        if (vm.request.bodyAreaIds.indexOf(base.id) != -1) {
          vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(base.id), 1);
        }
        for (var i in base.children) {
          var a = base.children[i];
          var found = false;
          for (var j in a.children) {
            var b = a.children[j];
            if (b.id == bodyArea.id) {
              if (vm.request.bodyAreaIds.indexOf(a.id) != -1) {
                vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(a.id), 1);
              }
              vm.request.bodyAreaIds.splice(vm.request.bodyAreaIds.indexOf(b.id), 1);
            }
          }
        }
      }
      vm.request.bodyAreaIds.length == 0 ? vm.baMissing = true : vm.baMissing = false;
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.workout.quick', []);
}());
(function () {
  'use strict';
  angular.module('app.workout.summary').controller('SummaryController', SummaryController);
  SummaryController.$inject = [
    '$scope',
    '$state',
    'userData',
    'userDataSet',
    'globalDataSet',
    'workout',
    'workoutData',
    'helpers',
    'infoFactory',
    'modalUtils'
  ];
  function SummaryController($scope, $state, userData, userDataSet, globalDataSet, workout, workoutData, helpers, infoFactory, modalUtils) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.workout = workoutData;
    vm.globalDataSet = globalDataSet;
    vm.helpers = helpers;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.isReadonly = false;
    vm.finish = finish;
    vm.createFavorite = createFavorite;
    vm.criterionDisplayInfo = {
      duration: { name: 'Time:' },
      reps: { name: 'Reps:' },
      breath: { name: 'Breaths:' },
      pattern: { name: 'Pattern:' },
      weight: { name: 'Lbs:' },
      rest: { name: 'Rest:' }
    };
    function finish() {
      workout.updateWorkout(afterFinish);
    }
    function afterFinish(responseData) {
      modalUtils.launch('greatJob', responseData.point.sentence);
      workout.clear();
      $state.go('nav.home');
    }
    function createFavorite() {
      if (!vm.isReadonly) {
        userData.createFavorite(vm.workout);
        vm.isReadonly = !vm.isReadonly;
        document.getElementById('favoriteIconSummary').classList.add('energized');
      }
    }
  }
}());
(function () {
  'use strict';
  angular.module('app.workout.summary', []);
}());
