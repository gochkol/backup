(function(){
  'use strict';

  angular
    .module('app')
    .provider('config', configProvider);


  function configProvider(){
    var userUrl = "none";
    var workoutUrl = "none";
    var globalUrl = "none";
    var curEnv =  "production";
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
        initialize: initialize,
        getFacebookAppID: getFacebookAppID
      }
      return config;

      function initialize(){
        setEnv();
        setUrls();
      }

      function setEnv(){
        var urlMap = envUrls();
        var url = $location.absUrl();
        var urls = Object.keys(urlMap);

        for (var k = 0; k < urls.length; k++){
          if (url.indexOf(urls[k]) != -1){
            curEnv = urlMap[urls[k]];
            break;
          }
        }
      }


      function setUrls(){
        var baseUrl = '/api/' + frontendAPIVersion + '/';

        if (curEnv == 'local'){
          userUrl = 'http://localhost:3001' + baseUrl;
          workoutUrl = 'http://localhost:3002' + baseUrl;
          globalUrl = 'http://localhost:3002' + baseUrl;
        }
        else if (curEnv == 'staging'){
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

      function getFacebookAppID(){
        switch(curEnv){
          case 'local':
            return '1135189293182026';
          case 'staging':
            return '1134539146580374';
          case 'production':
            return '1047666361934320';
          default:
            return '1047666361934320';
        }
      }

      function envUrls(){
        return {
          "http://local-local.updowntech.com": "local",
          "http://local-staging.updowntech.com": "staging",
          "http://local-production.updowntech.com": "production",
          "https://staging.updowntech.com": "staging",
          "https://updowntech.com": "production",
          "https://www.updowntech.com": "production",
          "file://": "local",
          //"file://": "staging",
          //"file://": "production".
        };
      }


    }
  }
})();
