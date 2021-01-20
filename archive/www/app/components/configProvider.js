(function(){
  'use strict';

  angular
    .module('app')
    .provider('config', configProvider);


  function configProvider(){
    var userUrl = "none";
    var workoutUrl = "none";
    var globalUrl = "none";
    var env =  "production";
    var frontendAppVersion = "27";
    var frontendAPIVersion = "v2";
    var frontendAppID = ionic.Platform.platform() + '_' + ionic.Platform.version();

    var options = {
      cacheCheckWaitSeconds: 60,
      globalStoreName: 'UpDownData.'+frontendAPIVersion+'.global',
      userStoreName:   'UpDownData.'+frontendAPIVersion+'.user'
    };
    var provider = {
      getOptions: getOptions,
      setOptions: setOptions,
      $get: configFactory
    }

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
        getUserUrl: getUserUrl,
        getWorkoutUrl: getWorkoutUrl,
        getGlobalUrl: getGlobalUrl,
        getEnv: getEnv,
        frontendAppVersion: frontendAppVersion,
        frontendAPIVersion: frontendAPIVersion,
        frontendAppID: frontendAppID,
        options: options,
        initialize: initialize
      }
      return config;

      function initialize(){
        setEnv();
        setUrls();
      }

      function setEnv(){
        var url = $location.absUrl();

        env = "production";
        if(url.indexOf("localhost") != -1) {
          if(url.indexOf("localhost:8080") || url.indexOf("localhost:8100")  != -1) {
            env = 'staging';
          }
          else {
            env = 'localhost';
          }
        }
        else if (url.indexOf("staging") != -1) {
          env = 'staging';
          }
        }

      function setUrls(){
        var baseUrl = '/api/' + frontendAPIVersion + '/';

        if (env == 'localhost' || env == 'staging'){
//          userUrl = 'http://localhost:3001' + baseUrl;
//          workoutUrl = 'http://localhost:3002' + baseUrl;
//          globalUrl = 'http://localhost:3002' + baseUrl;
//        }
//        else if (env == 'staging'){
          userUrl = 'https://us.backendupdowntech.com' + baseUrl;
          workoutUrl = 'https://ws.backendupdowntech.com' + baseUrl;
          globalUrl = 'https://gs.backendupdowntech.com' + baseUrl;
        }
        else{
          userUrl = 'https://up.backendupdowntech.com' + baseUrl;
          workoutUrl = 'https://wp.backendupdowntech.com' + baseUrl;
          globalUrl = 'https://gp.backendupdowntech.com' + baseUrl;
        }
      }

      function getUserUrl(){
        return userUrl;
      }

      function getWorkoutUrl(){
        return workoutUrl;
      }

      function getGlobalUrl(){
        return globalUrl;
      }

      function getEnv(){
        return env;
      }

    }
  }
})();
