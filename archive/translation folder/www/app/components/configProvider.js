(function(){
  'use strict';

  angular
    .module('app')
    .provider('config', configProvider);


  function configProvider(){
    var baseUrl = "none";
    var env;
    var options = {
      cacheCheckWaitSeconds: 60,
      globalStoreName: 'UpDownData.v1.global',
      userStoreName:   'UpDownData.v1.user'
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
        getBaseUrl: getBaseUrl,
        getEnv: getEnv,
        options: options,
        initialize: initialize
      }
      return config;

      function initialize(){
        setBaseUrl();
        setEnv();
      }

      function getBaseUrl(){
        return baseUrl;
      }

      function setBaseUrl(){
        var url = $location.absUrl();

        if(url.indexOf("localhost") != -1) {
          if(url.indexOf("localhost:3000") != -1) {
            baseUrl = 'http://localhost:3001/api/v1/';
          }
          else {
            baseUrl = 'https://updowntech-staging.herokuapp.com/api/v1/';
          }
        }
        else if (url.indexOf("staging") != -1) {
          baseUrl = 'https://updowntech-staging.herokuapp.com/api/v1/';
        }
        else {
          baseUrl = 'https://updowntech-production.herokuapp.com/api/v1/';
        }

        //baseUrl = 'https://updowntech-staging.herokuapp.com/api/v1/';
      }

      function getEnv(){
        return env;
      }

      function setEnv(){
        var url = $location.absUrl();

        if(url.indexOf("localhost") != -1){
          env = "development";
        }
        else if (url.indexOf("staging") != -1) {
          env = "staging";
        }
        else {
          env = "production";
        }
      }
    }
  }
})();

