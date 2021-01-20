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

    function getNavView(){
      return {
        controller: 'NavController',
        controllerAs: 'nav',
        resolve: {
          userDataSet: ['userData', 'auth', function(userData, auth){
            if (!auth.isLoggedIn()){
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
      //The main web site states

      $stateProvider.state('main', {
        url: '/main',
        data: {loginNotRequired: true},
        views: {
          header: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainNav.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              globalStats: ['globalData', function(globalData){
                return globalData.getStats();
              }]
            }
          },
          content: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/main.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              globalStats: ['globalData', function(globalData){
                return globalData.getStats();
              }]
            }
          },
          footer: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainFoot.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              globalStats: ['globalData', function(globalData){
                return globalData.getStats();
              }]
            }
          }
        }
      })

      $stateProvider.state('ourCompany', {
        url: '/ourCompany',
        data: {loginNotRequired: true},
        views: {
          header: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainNav.html'
          },
          content: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/company.html'
          },
          footer: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainFoot.html'
          }
        }
      })

      $stateProvider.state('blog', {
        url: '/blog',
        data: {loginNotRequired: true},
        views: {
          header: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainNav.html'
          },
          content: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/blog.html'
          },
          footer: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainFoot.html'
          }
        }
      })
      
      $stateProvider.state('partners', {
        url: '/partners',
        data: {loginNotRequired: true},
        views: {
          header: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainNav.html'
          },
          content: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/partners.html'
          },
          footer: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainFoot.html'
          }
        }
      })
      
      $stateProvider.state('faq', {
        url: '/faq',
        data: {loginNotRequired: true},
        views: {
          header: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainNav.html'
          },
          content: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/faq.html'
          },
          footer: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainFoot.html'
          }
        }
      })

      $stateProvider.state('media', {
        url: '/media',
        data: {loginNotRequired: true},
        views: {
          header: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainNav.html'
          },
          content: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/media.html',
          },
          footer: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainFoot.html'
          }
        }
      })

      $stateProvider.state('contact', {
        url: '/contact',
        data: {loginNotRequired: true},
        views: {
          header: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainNav.html'
          },
          content: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/contact.html'
          },
          footer: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainFoot.html'
          }
        }
      })

	  $stateProvider.state('terms', {
        url: '/terms',
        data: {loginNotRequired: true},
        views: {
          header: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainNav.html'
          },
          content: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/terms.html'
          },
          footer: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainFoot.html'
          }
        }
      })

	  $stateProvider.state('privacy', {
        url: '/privacy',
        data: {loginNotRequired: true},
        views: {
          header: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainNav.html'
          },
          content: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/privacy.html'
          },
          footer: {
            controller: 'MainController',
            controllerAs: 'main',
            templateUrl: 'app/main/mainFoot.html'
          }
        }
      })


      //The main web
      $stateProvider.state('login', {
        url: '/login',
        data: {loginNotRequired: true},
        views: {
          nav: getNavView(),
          content: {
            controller: 'LoginController',
            controllerAs: 'login',
            templateUrl: 'app/login/login.html'
          }
        }
      })

      $stateProvider.state('logout', {
        url: '/logout',
        data: {loginNotRequired: true},
        views: {
          content: {
            controller: 'LogoutController',
            controllerAs: 'logout'
          }
        }
      })

      $stateProvider.state('resetPassword', {
        url: '/password/reset',
        data: {loginNotRequired: true},
        views: {
          content: {
            controller: 'ResetController',
            controllerAs: 'reset',
            templateUrl: 'app/reset/reset.html'
          }
        }
      })

      $stateProvider.state('newPassword', {
        url: '/password/new',
        data: {loginNotRequired: true},
        views: {
          content: {
            controller: 'NewPasswordController',
            controllerAs: 'reset',
            templateUrl: 'app/reset/new.html'
          }
        }
      })

      $stateProvider.state('checkEmail', {
        url: '/checkEmail',
        data: {loginNotRequired: true},
        views: {
          content: {
            templateUrl: 'app/reset/checkEmail.html'
          }
        }
      })

      $stateProvider.state('partner', {
        url: '/partner',
        data: {partnerRequired: true},
        views: {
          content: {
            controller: 'PartnerController',
            controllerAs: 'partner',
            templateUrl: 'app/partner/partner.html',
            resolve: {
              partner: ['partnerData', function(partnerData){
                return partnerData.getPartner();
              }]
            }
          }
        }
      });


      $stateProvider.state('home', {
        url: '/home',
        views: {
          nav: getNavView(),
          content: {
            controller: 'HomeController',
            controllerAs: 'home',
            templateUrl: 'app/home/home.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet(['user', 'events', 'friends'])
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              globalStats: ['globalData', function(globalData){
                return globalData.getStats();
              }]
            }
          }
        }
      });

      $stateProvider.state('gymWorkout', {
        url: '/workout/gym',
        views: {
          content: {
            controller: 'GymWorkoutController',
            controllerAs: 'gym',
            templateUrl: 'app/workout/gym/gym.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }],
              partner: ['partnerData', function(partnerData){
                return partnerData.getPartner();
              }],
              workoutData: ['workout', function(workout){
                return workout.getWorkout();
              }]
            }
          }
        }
      });

      $stateProvider.state('customizeWorkout', {
        url: '/workout/customize',
        views: {
          nav: getNavView(),
          content: {
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

      $stateProvider.state('quickWorkout', {
        url: '/workout/quick',
        views: {
          nav: getNavView(),
          content: {
            controller: 'QuickWorkoutController',
            controllerAs: 'quick',
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
          "bodyAreas@quickWorkout": {
            templateUrl: 'app/workout/quick/bodyAreas.html'
          },
          "intensity@quickWorkout": {
            templateUrl: 'app/workout/quick/intensity.html'
          },
          "locale@quickWorkout": {
            templateUrl: 'app/workout/quick/locale.html'
          },
          "time@quickWorkout": {
            templateUrl: 'app/workout/quick/time.html'
          },
          "type@quickWorkout": {
            templateUrl: 'app/workout/quick/type.html'
          }
        }
      });

      $stateProvider.state('favorites', {
        url: '/favorites',
        views: {
          nav: getNavView(),
          content: {
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
          nav: getNavView(),
          content: {
            controller: 'ProfileController',
            controllerAs: 'profile',
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
		      "userStatus@profile": {
            templateUrl: 'app/profile/userStatus.html'
          },
          "points@profile": {
            templateUrl: 'app/profile/points.html'
          },
          "bodyStats@profile": {
            templateUrl: 'app/profile/bodyStats.html'
          }
        }
      });
	  
	  $stateProvider.state('stats', {
        url: '/stats',
        views: {
          nav: getNavView(),
          content: {
            controller: 'StatsController',
            controllerAs: 'stats',
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
		  "fitnessStats@stats": {
            templateUrl: 'app/stats/fitnessStats.html'
          },
          "userQuickLogs@stats": {
            templateUrl: 'app/stats/userQuickLogs.html'
          },
		  "completedWorkoutsFree@stats": {
            templateUrl: 'app/stats/completedWorkoutsFree.html'
          },
		  "completedWorkoutsPlus@stats": {
            templateUrl: 'app/stats/completedWorkoutsPlus.html'
          },
		  "advancedStats@stats": {
            templateUrl: 'app/stats/advancedStats.html'
          }
        }
      });

      $stateProvider.state('settings', {
        url: '/settings',
        views: {
          nav: getNavView(),
          content: {
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
          nav: getNavView(),
          content: {
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
          nav: getNavView(),
          content: {
            controller: 'FriendController',
            controllerAs: 'friend',
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
          },
          "points@friend": {
            templateUrl: 'app/friend/points.html'
          },
          "quickLogs@friend": {
            templateUrl: 'app/friend/quickLogs.html'
          },
          "workouts@friend": {
            templateUrl: 'app/friend/workouts.html'
          }
        }
      });

      $stateProvider.state('friends', {
        url: '/friends',
        views: {
          nav: getNavView(),
          content: {
            controller: 'FriendsController',
            controllerAs: 'friends',
            templateUrl: 'app/friends/friends.html',
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
              }]
            }
          },
		  "incoming@friends": {
            templateUrl: 'app/friends/incoming.html'
          },
          "leaderboard@friends": {
            templateUrl: 'app/friends/leaderboard.html'
          },
		  "myFriends@friends": {
            templateUrl: 'app/friends/myFriends.html'
          },
		  "pending@friends": {
            templateUrl: 'app/friends/pending.html'
          },
		  "search@friends": {
            templateUrl: 'app/friends/search.html'
          }
        }
      });

      $stateProvider.state('quickLog', {
        url: '/quickLog',
        views: {
          nav: getNavView(),
          content: {
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

      $stateProvider.state('locations', {
        url: '/locations',
        views: {
          nav: getNavView(),
          content: {
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
        data: {loginNotRequired: true, isOAuth: false},
        views: {
          content: {
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

      $stateProvider.state('signupFacebook', {
        url: '/signupFacebook',
        data: {loginNotRequired: true, isOAuth: true, authType: 'facebook'},
        views: {
          content: {
            controller: 'SignupController',
            controllerAs: 'signup',
            templateUrl: 'app/signup/signupFacebook.html',
            resolve: {
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          }
        }
      });

      $stateProvider.state('linkFacebook', {
        url: '/linkFacebook',
        data: {loginNotRequired: true, isOAuth: true, authType: 'facebook'},
        views: {
          content: {
            controller: 'SignupController',
            controllerAs: 'signup',
            templateUrl: 'app/signup/linkFacebook.html',
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
          nav: getNavView(),
          content: {
            controller: 'ExerciseController',
            controllerAs: 'exercise',
            templateUrl: 'app/exercise/exercise.html',
            resolve: {
              userDataSet: ['userData', function(userData){
               return userData.getDataSet([
                 'user',
                 'events',
                 'bodyStats',
				         'userHistory'
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
        views: {
          content: {
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

      $stateProvider.state('account', {
        url: '/account',
        views: {
          nav: getNavView(),
          content: {
            controller: 'AccountController',
            controllerAs: 'account',
            templateUrl: 'app/account/account.html',
            resolve: {
              userDataSet: ['userData', function(userData){
                return userData.getDataSet(['user']);
              }],
              globalDataSet: ['globalData', function(globalData){
                return globalData.getAll();
              }]
            }
          },
		  "basicInfo@account": {
            templateUrl: 'app/account/basicInfo.html'
          },
		  "editBasicInfo@account": {
            templateUrl: 'app/account/editBasicInfo.html'
          },
		  "plusSignup@account": {
            templateUrl: 'app/account/plusSignup.html'
          },
		  "passwordChange@account": {
            templateUrl: 'app/account/passwordChange.html'
          }
        },
		  "viewBillingInfo@account": {
            templateUrl: 'app/account/viewBillingInfo.html'
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


