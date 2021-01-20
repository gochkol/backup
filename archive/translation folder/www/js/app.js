// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'updown' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'updown.controllers' is found in controllers.js


angular.module('updown', ['ionic', 'updown.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

//    .state('login', {
//    url: '/login',
//    templateUrl: 'templates/logindep.html',
//    controller: 'LoginCtrl'
//  })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
      }
    }
  })

  .state('app.signup', {
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('app.quick_workout', {
    url: '/quick_workout',
    views: {
      'menuContent': {
        templateUrl: 'templates/quick_workout.html'
      }
    }
  })

  .state('app.preview', {
    url: '/preview',
    views: {
      'menuContent': {
        templateUrl: 'templates/preview.html'
      }
    }
  })

  .state('app.exercise', {
    url: '/exercise',
    views: {
      'menuContent': {
        templateUrl: 'templates/exercise.html'
      }
    }
  })

  .state('app.review', {
    url: '/review',
    views: {
      'menuContent': {
        templateUrl: 'templates/review.html'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html'
      }
    }
  })

  .state('app.friends', {
    url: '/friends',
    views: {
      'menuContent': {
        templateUrl: 'templates/friends.html'
      }
    }
  })

  .state('app.friend', {
    url: '/friend',
    views: {
      'menuContent': {
        templateUrl: 'templates/friend.html'
      }
    }
  })

  .state('app.teams', {
    url: '/teams',
    views: {
      'menuContent': {
        templateUrl: 'templates/teams.html'
      }
    }
  })

  .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html'
        }
      }
    })
   .state('app.locations', {
     url: '/locations',
     views: {
       'menuContent': {
         templateUrl: 'templates/locations.html',
        }
      }
    })
  .state('app.points', {
      url: '/points',
      views: {
        'menuContent': {
          templateUrl: 'templates/points.html',
        }
      }
    })

//  .state('app.single', {
//    url: '/playlists/:playlistId',
//    views: {
//      'menuContent': {
//        templateUrl: 'templates/playlist.html',
//        controller: 'PlaylistCtrl'
//      }
//    }
//    })

  .state('app.favorites', {
    url: '/favorites',
    views: {
      'menuContent': {
        templateUrl: 'templates/favorites.html',
      }
    }

  });

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/app/home');
});
