(function(){
  'use strict';

  angular
    .module('app')
    .provider('stateConfig', stateConfigProvider);

  stateConfigProvider.$inject = ['$stateProvider'];

  function stateConfigProvider($stateProvider){
    var provider = {
      initialize: initialize,
      $get: stateHelperFactory
    }

    return provider;

    function initialize(){
      $stateProvider.state('login', {
        url: '/login',
        views: {
          menuContent: {
            controller: 'LoginController as login',
            templateUrl: 'app/login/login.html'
          }
        }
      })

      $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/partials/menu.html',
        controller: 'AppCtrl'
      })

      $stateProvider.state('logout', {
        url: '/logout',
        views: {
          menuContent: {
            controller: 'LogoutController',
            controllerAs: 'logout'
          }
        }
      })

      $stateProvider.state('customizeWorkout', {
        url: '/workout/customize',
        views: {
          menuContent: {
            controller: 'CustomizeWorkoutController',
            controllerAs: 'customize',
            templateUrl: 'app/workout/customize/customize.html',
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
          }
        }
      });

      $stateProvider.state('quickWorkout', {
        url: '/workout/quick',
        views: {
          menuContent: {
            controller: 'QuickWorkoutController',
            controllerAs: 'quick',
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

      $stateProvider.state('favorites', {
        url: '/favorites',
        views: {
          menuContent: {
            controller: 'FavoritesController',
            controllerAs: 'favorites',
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

      $stateProvider.state('profile', {
        url: '/profile',
        views: {
          menuContent: {
            controller: 'ProfileController',
            controllerAs: 'profile',
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

      $stateProvider.state('points', {
        url: '/points',
        views: {
          menuContent: {
            controller: 'PointsController',
            controllerAs: 'points',
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

      $stateProvider.state('settings', {
        url: '/settings',
        views: {
          menuContent: {
            controller: 'SettingsController',
            controllerAs: 'settings',
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

      $stateProvider.state('company', {
        url: '/company',
        views: {
          menuContent: {
            controller: 'CompanyController',
            controllerAs: 'company',
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

      $stateProvider.state('friend', {
        url: '/friend',
        views: {
          menuContent: {
            controller: 'FriendController',
            controllerAs: 'friend',
            templateUrl: 'app/friend/friend.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet(['user']);
              }],
              friendData: ['userData', function(userData){
                return userData.getFriend();
              }]
            }
          }
        }
      });

      $stateProvider.state('friends', {
        url: '/friends',
        views: {
          menuContent: {
            controller: 'FriendsController',
            controllerAs: 'friends',
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

      $stateProvider.state('quickLog', {
        url: '/quickLog',
        views: {
          menuContent: {
            controller: 'QuickLogController',
            controllerAs: 'quickLog',
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

      $stateProvider.state('home', {
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

      $stateProvider.state('locations', {
        url: '/locations',
        views: {
          menuContent: {
            controller: 'LocationsController',
            controllerAs: 'locations',
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

      $stateProvider.state('signup', {
        url: '/signup',
        views: {
          menuContent: {
            controller: 'SignupController',
            controllerAs: 'signup',
            templateUrl: 'app/signup/signup.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          }
        }
      });

      $stateProvider.state('exercise', {
        url: '/workout/exercise',
        views: {
          menuContent: {
            controller: 'ExerciseController',
            controllerAs: 'exercise',
            templateUrl: 'app/exercise/exercise.html',
            resolve: {
              userDataSet: ['userData', function(userData){
               return userData.getDataSet(['user', 'events']);
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
        views: {
          menuContent: {
            controller: 'SummaryController',
            controllerAs: 'summary',
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
          globalData.getAll();
        }
      }


    }
  }
})();


