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
        cache: false,
        url: '/nav',
        data: {loginNotRequired: true},
        abstract: true,
        templateUrl:'app/partials/menu.html',
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

      //Tutorial state
      $stateProvider.state('tutorial', {
        cache: false,
        url: '/tutorial',
        data: {loginNotRequired: true},
        params: {state: null},
        controller: 'TutorialController as tutorial',
        templateUrl: 'app/tutorial/tutorial.html'
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
        data: {loginNotRequired: true,
               isOAuth: false,
               },
        controller: 'SignupController as signup',
        templateUrl: 'app/signup/signup.html',
        resolve: {
          globalDataSet: ['globalData', function(globalData){
            return globalData.getAll();
          }]
        }
      });

      $stateProvider.state('signupFacebook', {
        cache: false,
        url: '/signupFacebook',
        data: {loginNotRequired: true, isOAuth: true, authType: 'facebook'},
        controller: 'SignupController as signup',
        templateUrl: 'app/signup/signupFacebook.html',
        resolve: {
          globalDataSet: ['globalData', function(globalData){
            return globalData.getAll();
          }]
        }
      });

      $stateProvider.state('linkFacebook', {
        cache: false,
        url: '/linkFacebook',
        data: {loginNotRequired: true, isOAuth: true, authType: 'facebook'},
        controller: 'SignupController as signup',
        templateUrl: 'app/signup/linkFacebook.html',
        resolve: {
          globalDataSet: ['globalData', function(globalData){
            return globalData.getAll();
          }]
        }
      });

      //Normal Workout States
      $stateProvider.state('nav.workout', {
        cache: false,
        url: '/workout',
        views: {
          menuContent: {
            controller: 'WorkoutController as workout',
            templateUrl: 'app/workout/workout.html',
            resolve: {
              userDataSet: ['userData', function(userData){
              return userData.getDataSet([
                'user',
                'userHistory',
                'events',
                'bodyStats',
                'favorites'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              workoutData: ['workout', function(workout){
                return workout.getWorkout();
              }]
            }
          },
          "customizeSimple@nav.workout": {
            templateUrl: 'app/workout/customizeSimple.html'
          },
          "customizeAdvance@nav.workout": {
            templateUrl: 'app/workout/customizeAdvance.html'
          },
          "exercise@nav.workout": {
            templateUrl: 'app/workout/exercise.html'
          },
          "summary@nav.workout": {
            templateUrl: 'app/workout/summary.html'
          }
        }
      });

      $stateProvider.state('nav.quickWorkout', {
        url: '/quick',
        views: {
          menuContent: {
            controller: 'QuickWorkoutController as quick',
            templateUrl: 'app/quick/quick.html',
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
            templateUrl: 'app/quick/bodyAreas.html'
          },
          "intensity@nav.quickWorkout": {
            templateUrl: 'app/quick/intensity.html'
          },
          "locale@nav.quickWorkout": {
            templateUrl: 'app/quick/locale.html'
          },
          "time@nav.quickWorkout": {
            templateUrl: 'app/quick/time.html'
          },
          "type@nav.quickWorkout": {
            templateUrl: 'app/quick/type.html'
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
                  'favorites',
                  'gymWorkouts'
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
          },
          "levels@nav.profile": {
            templateUrl: 'app/profile/levels.html'
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

      $stateProvider.state('nav.tokens', {
        url: '/tokens',
        views: {
          menuContent: {
            controller: 'TokensController as token',
            templateUrl: 'app/tokens/tokens.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'token_changes',
                  'rewards'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          },
          "tokensTab@nav.tokens": {
            templateUrl: 'app/tokens/tokensTab.html'
          },
          "rewardsTab@nav.tokens": {
            templateUrl: 'app/tokens/rewardsTab.html'
          }
        }
      });

      $stateProvider.state('nav.myGym', {
        cache: false,
        url: '/myGym',
        views: {
          menuContent: {
            controller: 'MyGymController as gc',
            templateUrl: 'app/myGym/myGym.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'gym', 'gymMembers', 'gymWorkouts'
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          },
          "gymInfo@nav.myGym": {
            templateUrl: 'app/myGym/gymInfo.html'
          },
          "gymMembers@nav.myGym": {
            templateUrl: 'app/myGym/gymMembers.html'
          },
          "gymWorkouts@nav.myGym": {
            templateUrl: 'app/myGym/gymWorkouts.html'
          }
        }
      });

      $stateProvider.state('nav.library', {
        url: '/library',
        views: {
          menuContent: {
            controller: 'LibraryController as library',
            templateUrl: 'app/library/library.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet([
                  'user',
                  'userHistory',
                  'exerciseStats',
                  'favorites',
                  'gymWorkouts',
                  'updownWorkouts',
                ]);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          },
          "favorites@nav.library": {
            templateUrl: 'app/library/favorites.html'
          },
          "updown@nav.library": {
            templateUrl: 'app/library/updown.html'
          },
          "gym@nav.library": {
            templateUrl: 'app/library/gym.html'
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
                return userData.getDataSet(['user', 'locations']);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          },
          "settingsPrefs@nav.settings": {
            templateUrl: 'app/settings/settingsPrefs.html'
          },
          "settingsLocales@nav.settings": {
            templateUrl: 'app/settings/settingsLocales.html'
          },
          "settingsAccount@nav.settings": {
            templateUrl: 'app/settings/settingsAccount.html'
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
          },
          "activity@nav.quickLog": {
            templateUrl: 'app/quicklog/activity.html'
          },
          "details@nav.quickLog": {
            templateUrl: 'app/quicklog/details.html'
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
          },
          "homeMain@nav.home": {
            templateUrl: 'app/home/homeMain.html'
          },
          "homeFriends@nav.home": {
            templateUrl: 'app/home/homeFriends.html'
          },
          "homeFeed@nav.home": {
            templateUrl: 'app/home/homeFeed.html'
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


