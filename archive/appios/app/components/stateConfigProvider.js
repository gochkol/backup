(function(){
  'use strict';

  angular
    .module('app')
    .provider('stateConfig', stateConfigProvider);

  stateConfigProvider.$inject = ['$stateProvider', 'userDataProvider'];

  function stateConfigProvider($stateProvider, userDataProvider){
    var provider = {
      initialize: initialize,
      $get: stateHelperFactory
    }

    return provider;

    function getNavView(){
      return {
        controller: 'NavController',
        controllerAs: 'nav',
        resolve: {
          userDataSet: ['userData', function(userData){
            if (!userData.isLoggedIn()){
              return {};
            }
            else if (userData.isGuest()){
              return userData.getDataSet(['user']);
            }
            else{
              return userData.getDataSet(['user', 'friends', 'friendRequestsForMe', 'friendRequestsFromMe']);
            }
          }]
        }
      }
    };

    function initialize(){
      $stateProvider.state('nav', {
        url: '/nav',
        data: {loginNotRequired: true},
        abstract: true,
        templateUrl:'app/partials/menu.html',
        controller: 'AppController as nav'
      });

      $stateProvider.state('guestNav', {
        url: '/guestNav',
        data: {loginNotRequired: true},
        abstract: true,
        templateUrl:'app/partials/guestMenu.html',
        controller: 'AppController as nav'
      });

      $stateProvider.state('login', {
        url: '/login',
        data: {loginNotRequired: true},
        controller: 'LoginController as login',
        templateUrl: 'app/login/login.html'
      })

      $stateProvider.state('nav.logout', {
        url: '/logout',
        data: {loginNotRequired: true},
        views: {
          menuContent: {
            controller: 'LogoutController as logout'
          }
        }
      })

      $stateProvider.state('reset', {
        url: '/reset',
        data: {loginNotRequired: true},
        controller: 'ResetController as reset',
        templateUrl: 'app/reset/reset.html'
      })

      $stateProvider.state('newPassword', {
        url: '/new',
        data: {loginNotRequired: true},
        controller: 'NewPasswordController as reset',
        templateUrl: 'app/reset/new.html'
      })

      $stateProvider.state('checkEmail', {
        url: '/checkEmail',
        data: {loginNotRequired: true},
        templateUrl: 'app/reset/checkEmail.html'
      })

      $stateProvider.state('nav.customizeWorkout', {
        url: '/workout/customize',
        data: {guestAccessOK: false},
        views: {
          menuContent: {
            controller: 'CustomizeWorkoutController as customize',
            templateUrl: 'app/workout/customize/customize.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user'
                ]);
              }],
              workoutData: ['workout', function(workout){
                return workout.getWorkout();
              }]
            }
          }
        }
      });

      $stateProvider.state('guestNav.customizeWorkout', {
        url: '/workout/customize',
        data: {guestAccessOK: true,
               loginNotRequired: false},
        views: {
          menuContent: {
            controller: 'CustomizeWorkoutController as customize',
            templateUrl: 'app/workout/customize/customize.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user'
                ]);
              }],
              workoutData: ['workout', function(workout){
                return workout.getWorkout();
              }]
            }
          }
        }
      });

      $stateProvider.state('nav.quickWorkout', {
        url: '/workout/quick',
        data: {guestAccessOK: false},
        views: {
          menuContent: {
            controller: 'QuickWorkoutController as quick',
            templateUrl: 'app/workout/quick/quick.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'locations'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          }
        }
      });

      $stateProvider.state('guestNav.quickWorkout', {
        url: '/workout/quick',
        data: {guestAccessOK: true,
               loginNotRequired: false},
        views: {
          menuContent: {
            controller: 'QuickWorkoutController as quick',
            templateUrl: 'app/workout/quick/quick.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'locations'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          }
        }
      });

      $stateProvider.state('nav.favorites', {
        url: '/favorites',
        views: {
          nav: getNavView(),
          menuContent: {
            controller: 'FavoritesController as favorites',
            templateUrl: 'app/favorites/favorites.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'favorites'
                ]);
              }]
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
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'bodyStats',
                  'bodyPartStats',
                  'userHistory'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
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
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'points'
                ]);
              }]
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
              userDataSet: ['userData', function(userData){
                return userData.getDataSet(['user']);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
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
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'company'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
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
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'friends',
                  'friendRequestsForMe',
                  'friendRequestsFromMe'
                ]);
              }],
              friendData: ['userData', function(userData){
                return userData.getFriend();
              }]
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
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'friends',
                  'friendRequestsForMe',
                  'friendRequestsFromMe'
                ]);
              }]
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
              userDataSet: ['userData', function(userData){
                return userData.getDataSet(['user']);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
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
              userDataSet: ['userData', function(userData){
                return userData.getDataSet(['user', 'events']);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
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
              userDataSet: ['userData', function(userData){
                return userData.getDataSet(['user', 'locations']);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          }
        }
      });

      $stateProvider.state('guestNav.guest', {
        url: '/guest',
        data: {loginNotRequired: true},
        views: {
          menuContent: {
            controller: 'GuestController as guest',
            templateUrl: 'app/guest/guest.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          }
        }
      });

      $stateProvider.state('signup', {
        url: '/signup',
        data: {loginNotRequired: true},
        controller: 'SignupController as signup',
        templateUrl: 'app/signup/signup.html',
        resolve: {
          globalDataSet: ['globalData', function(globalData){
            return globalData.getAll();
          }]
        }
      });

      $stateProvider.state('nav.exercise', {
        url: '/workout/exercise',
        data: {guestAccessOK: false},
        views: {
          menuContent: {
            controller: 'ExerciseController as exercise',
            templateUrl: 'app/exercise/exercise.html',
            resolve: {
              userDataSet: ['userData', function(userData){
              return userData.getDataSet([
                'user',
                'events',
                'bodyStats'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              workoutData: ['workout', function(workout){
                return workout.getWorkout();
              }]
            }
          }
        }
      });

      $stateProvider.state('guestNav.exercise', {
        url: '/workout/exercise',
        data: {guestAccessOK: true,
               loginNotRequired: false},
        views: {
          menuContent: {
            controller: 'ExerciseController as exercise',
            templateUrl: 'app/exercise/exercise.html',
            resolve: {
              userDataSet: ['userData', function(userData){
              return userData.getDataSet([
                'user',
                'events',
                'bodyStats'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              workoutData: ['workout', function(workout){
                return workout.getWorkout();
              }]
            }
          }
        }
      });

      $stateProvider.state('summary', {
        url: '/workout/summary',
        data: {guestAccessOK: false},
        controller: 'SummaryController as summary',
        templateUrl: 'app/workout/summary/summary.html',
          resolve: {
            globalDataSet: ['globalData', function(globalData){
            return globalData.getAll();
          }],
          userDataSet: ['userData', function(userData){
            return userData.getDataSet([
              'user',
            ]);
          }],
          workoutData: ['workout', function(workout){
            return workout.getWorkout();
          }]
        }
      });

      $stateProvider.state('guestNav.summary', {
        url: '/workout/summary',
        data: {guestAccessOK: true,
               loginNotRequired: false},
        views: {
          menuContent: {
            controller: 'SummaryController as summary',
            templateUrl: 'app/workout/summary/summary.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              userDataSet: ['userData', function(userData){
                return userData.getDataSet(['user',]);
              }],
              workoutData: ['workout', function(workout){
                return workout.getWorkout();
              }]
            }
          }
        }
      });

    }

    stateHelperFactory.$inject = ['$rootScope', '$http', '$location', 'globalData', 'userData'];

    function stateHelperFactory($rootScope, $http, $location, globalData, userData){
      var factory = {
        initialize: initialize
      }
      return factory;

      function initialize(){
        $rootScope.$on('$stateChangeSuccess', stateChanged);
      }

      function stateChanged(event, toState, toParams, fromState, fromParams){
        // this is where the state is looked at and preloading of stuff is done
        if (toState.name == 'login'){
          userData.clearData();
          globalData.getAll(true);
        }
      }


    }
  }
})();


