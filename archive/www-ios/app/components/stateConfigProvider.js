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
      //Nav setups
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

      //Login/Logout States
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

      //Reset Password states
      $stateProvider.state('reset', {
        cache: false,
        url: '/reset',
        data: {loginNotRequired: true},
        controller: 'ResetController as reset',
        templateUrl: 'app/reset/reset.html'
      })

      $stateProvider.state('newPassword', {
        cache: false,
        url: '/new',
        data: {loginNotRequired: true},
        controller: 'NewPasswordController as reset',
        templateUrl: 'app/reset/new.html'
      })

      $stateProvider.state('checkEmail', {
        cache: false,
        url: '/checkEmail',
        data: {loginNotRequired: true},
        templateUrl: 'app/reset/checkEmail.html'
      })

      //Signup
      $stateProvider.state('signup', {
        cache: false,
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

      //Guest Specific States
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

      $stateProvider.state('guestNav.exercise', {
        cache: false,
        url: '/workout/exercise',
        data: {guestAccessOK: true},
        views: {
          menuContent: {
            controller: 'ExerciseController as exercise',
            templateUrl: 'app/exercise/exercise.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'userHistory',
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

      $stateProvider.state('guestNav.summary', {
        cache: false,
        url: '/workout/summary',
        data: {guestAccessOK: true},
        views: {
          menuContent: {
            controller: 'SummaryController as summary',
            templateUrl: 'app/workout/summary/summary.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'userHistory'
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
        cache: false,
        url: '/workout/customize',
        data: {guestAccessOK: true},
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
                  'user',
				  'userHistory'
                ]);
              }],
              workoutData: ['workout', function(workout){
                return workout.getWorkout();
              }]
            }
          }
        }
      });

      $stateProvider.state('guestNav.quickWorkout', {
        cache: false,
        url: '/workout/quick',
        data: {guestAccessOK: true},
        views: {
          menuContent: {
            controller: 'QuickWorkoutController as quick',
            templateUrl: 'app/workout/quick/quick.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'locations',
                  'userHistory'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          },
          "bodyAreas@guestNav.quickWorkout": {
            templateUrl: 'app/workout/quick/bodyAreas.html'
          },
          "intensity@guestNav.quickWorkout": {
            templateUrl: 'app/workout/quick/intensity.html'
          },
          "locale@guestNav.quickWorkout": {
            templateUrl: 'app/workout/quick/locale.html'
          },
          "time@guestNav.quickWorkout": {
            templateUrl: 'app/workout/quick/time.html'
          },
          "type@guestNav.quickWorkout": {
            templateUrl: 'app/workout/quick/type.html'
          }
        }
      });


      //Normal Workout States
      $stateProvider.state('nav.exercise', {
        cache: false,
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
				'userHistory',
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
        cache: false,
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
			  'userHistory',
			  'favorites'
            ]);
          }],
          workoutData: ['workout', function(workout){
            return workout.getWorkout();
          }]
        }
      });

      $stateProvider.state('nav.customizeWorkout', {
        cache: false,
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
                  'user',
				  'userHistory',
				  'favorites'
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
                  'locations',
				          'userHistory'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          },
          "bodyAreas@nav.quickWorkout": {
            templateUrl: 'app/workout/quick/bodyAreas.html'
          },
          "intensity@nav.quickWorkout": {
            templateUrl: 'app/workout/quick/intensity.html'
          },
          "locale@nav.quickWorkout": {
            templateUrl: 'app/workout/quick/locale.html'
          },
          "time@nav.quickWorkout": {
            templateUrl: 'app/workout/quick/time.html'
          },
          "type@nav.quickWorkout": {
            templateUrl: 'app/workout/quick/type.html'
          }
        }
      });

      //Normal Non-Workout States
      $stateProvider.state('nav.favorites', {
        url: '/favorites',
        views: {
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
                  'points',
                  'bodyStats',
                  'bodyPartStats',
                  'userHistory'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          },
          "points@nav.profile": {
            templateUrl: 'app/profile/points.html'
          },
          "bodyStats@nav.profile": {
            templateUrl: 'app/profile/bodyStats.html'
          }
        }
      });

      $stateProvider.state('nav.stats', {
        url: '/stats',
        views: {
          menuContent: {
            controller: 'StatsController as stats',
            templateUrl: 'app/stats/stats.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'userHistory',
                  'exerciseStats'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          },
          "fitnessStats@nav.stats": {
            templateUrl: 'app/stats/fitnessStats.html'
          },
          "workouts@nav.stats": {
            templateUrl: 'app/stats/workouts.html'
          },
          "exerciseStats@nav.stats": {
            templateUrl: 'app/stats/exerciseStats.html'
          }
        }
      });

      $stateProvider.state('nav.settings', {
		    cache: false,
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
          },
          "companyLeaderboard@nav.company": {
            templateUrl: 'app/company/companyLeaderboard.html'
          },
          "departmentsLeaderboard@nav.company": {
            templateUrl: 'app/company/departmentsLeaderboard.html'
          },
          "departmentLeaderboard@nav.company": {
            templateUrl: 'app/company/departmentLeaderboard.html'
          },
          "memberLeaderboard@nav.company": {
            templateUrl: 'app/company/memberLeaderboard.html'
          },
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
				  'favorites',
                  'friends',
                  'friendRequestsForMe',
                  'friendRequestsFromMe'
                ]);
              }],
              friendData: ['userData', function(userData){
                return userData.getFriend();
              }]
            }
          },
          "header@nav.friend": {
            templateUrl: 'app/friend/header.html'
          },
          "points@nav.friend": {
            templateUrl: 'app/friend/points.html'
          },
          "stats@nav.friend": {
            templateUrl: 'app/friend/stats.html'
          },
          "workouts@nav.friend": {
            templateUrl: 'app/friend/workouts.html'
          },
          "quickLogs@nav.friend": {
            templateUrl: 'app/friend/quickLogs.html'
          },
          "friends@nav.friend": {
            templateUrl: 'app/friend/friends.html'
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
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          },
          "leaderboard@nav.friends": {
            templateUrl: 'app/friends/leaderboard.html'
          },
          "myfriends@nav.friends": {
            templateUrl: 'app/friends/myfriends.html'
          },
          "find@nav.friends": {
            templateUrl: 'app/friends/find.html'
          },
          "requests@nav.friends": {
            templateUrl: 'app/friends/requests.html'
          },
          "pending@nav.friends": {
            templateUrl: 'app/friends/pending.html'
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
                return userData.getDataSet(['user', 'events', 'friends']);
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


