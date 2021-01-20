(function(){
  'use strict';

  angular
    .module('app')
    .factory('data', data);

  data.$inject = ['$http', '$location', '$q', '$state', 'store', 'config', '$rootScope', 'modalUtils'];

  function data($http, $location, $q, $state, store, config, $rootScope, modalUtils){
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
      deleteData: deleteData,
      postLogin: postLogin
    }

    initialize();
    return factory;

    function initialize(){
      $rootScope.showLoading = false;
    }

    function initStoredData(dataStore, dataInfo){
      for (var i = 0; i < dataInfo.length; i++){
        if (dataInfo[i].store){
          dataInfo[i].dataStore = dataStore;
          data = dataStore.get(dataInfo[i].name);
          if (!data){
            data = {};
            data.response_data = null;
            data.errors = "Not loaded";
            data.lastCheck = 0;
            dataStore.set(dataInfo[i].name, data);
          }
        }
      }
    }

    function getData(info, params, forceCheck) {
      var deferred = $q.defer();
      var data = info.store ? info.dataStore.get(info.name) : null;
      var timeT = Math.floor((new Date()).getTime() / 1000);
      var reload = (data && info.waitCache && ((timeT - data.lastCheck) < config.options.cacheCheckWaitSeconds)) ? false : true

      if (data && !reload && !forceCheck){
        deferred.resolve(data.response_data);
      }
      else{
        deferred.resolve(loadData(info, params));
      }

      return deferred.promise;
    }

    function getDataSet(dataInfos, forceCheck){
      var deferred = $q.defer();
      var promises = [];
      var dataSet = {};

      for (var i = 0; i < dataInfos.length; i++){
        var params = (dataInfos[i].params) ? dataInfos[i].params : {};
        promises.push(getData(dataInfos[i], params, forceCheck));
      }

      $q.all(promises).then(
        function (data) {
          for (var i = 0; i < dataInfos.length; i++) {
            dataSet[dataInfos[i].name] = data[i];
            if (dataInfos[i].lookup){
              dataSet[dataInfos[i].lookup] = createLookup(data[i]);
            }
          }
          deferred.resolve(dataSet);
        }
      )
      return deferred.promise;
    }

    function createLookup(dataArray){
      var lookup = {};

      for (var i = 0; i < dataArray.length; i++){
        lookup[dataArray[i].id] = dataArray[i];
      }

      return lookup;
    }

    function loadData(info, params){
      var deferred = $q.defer();
      var data = info.store ? info.dataStore.get(info.name) : null;
      var timeT = Math.floor((new Date()).getTime() / 1000);
      var requestOptions = {
        method: 'GET',
        url: info.url + info.target,
        skipAuthorization: info.skipAuthorization || false,
        params: info.params || params || {}
      };

      if (data){
        requestOptions.headers = {'If-None-Match': data.etag};
      }

      addLoading();

      $http(requestOptions).then(
        function(response){
          if (info.transform){
            response.data = info.transform(response.data);
          }
          if (data){
            data.response_data = response.data;
            data.etag = response.headers().etag;
            data.errors = null;
            data.lastCheck = timeT;
            info.dataStore.set(info.name, data);
          }
          removeLoading();
          deferred.resolve(response.data);
        },
        function(response){
          if (!response.status){
            if (data){
              info.dataStore.set(info.name, null);
            }
            modalUtils.launch('error', 'Could not connect to the server. Please try again shortly');
            removeLoading();
            deferred.reject(response.data);
          }
          else if (response.status == 304){
            if (data){
              data.lastCheck = timeT;
              info.dataStore.set(info.name, data);
              removeLoading();
              deferred.resolve(data.response_data);
            }
            else{
              removeLoading();
              if(info.name === 'workout'){
                $state.go('nav.home');
              }else{
                modalUtils.launch('error', "Could not load '" + info.name + "' data.");
              }
              deferred.reject(response.data);
            }
          }
          else{
            if (data){
              data.response_data = null;
              data.etag = '';
              data.errors= response.data['errors'];
              data.lastCheck = 0;
              info.dataStore.set(info.name, data);
            }
            removeLoading();
            if(info.name === 'workout'){
              $state.go('nav.home');
            }else{
              modalUtils.launch('error', "Could not load '" + info.name + "' data.");
            }
            deferred.reject(response.data);
          }
        }
      );
      return deferred.promise;
    }


    function patchData(info, params){
      var deferred = $q.defer();
      var data = info.store ? info.dataStore.get(info.name) : null;
      var timeT = Math.floor((new Date()).getTime() / 1000);
      var requestOptions = {
        method: 'PATCH',
        url: info.url + info.target,
        skipAuthorization: false,
        data: params
      };

      addLoading();

      $http(requestOptions).then(
        function(response){
          if (data){
            data.response_data = response.data;
            data.etag = response.headers().etag;
            data.errors = null;
            data.lastCheck = timeT;
            info.dataStore.set(info.name, data);
          }
          removeLoading();
          deferred.resolve(response.data);
        },
        function(response){
          if (response.data && response.data.errors){
            modalUtils.launch('error', response.data.errors);
          }
          else{
            modalUtils.launch('error', 'Could not connect to the server. Please try again shortly');
          }

          removeLoading();
          deferred.reject(response.data);
        }
      );
      return deferred.promise;
    }

    function postLogin(info, postData) {
      var deferred = $q.defer();
      var requestOptions = {
        method: 'POST',
        url: info.url + info.target,
        skipAuthorization: true,
        data: postData
      };

      addProcessing();

      $http(requestOptions).then(
        function(response){
          deferred.resolve(response);
          removeProcessing();
        },
        function(response){
          deferred.reject(response);
          removeProcessing();
        }
      );
      return deferred.promise;
    }

    function postData(info, postData, handleError) {
      var deferred = $q.defer();
      var requestOptions = {
        method: 'POST',
        url: info.url + info.target,
        skipAuthorization: false,
        data: postData
      };

      addProcessing();

      $http(requestOptions).then(
        function(response){
          deferred.resolve(response.data);
          removeProcessing();
        },
        function(response){
          if (handleError){
            handleError(response);
          }
          else{
            if (response.data && response.data.errors){
              modalUtils.launch('error', response.data.errors);
            }
            else{
              modalUtils.launch('error', 'Could not connect to the server. Please try again shortly');
            }
          }
          deferred.reject(response.data);
          removeProcessing();
        }
      );
      return deferred.promise;
    }

    function deleteData(info, params) {
      var deferred = $q.defer();
      var requestOptions = {
        method: 'DELETE',
        url: info.url + info.target,
        skipAuthorization: false,
        params: params
      };

      addProcessing();

      $http(requestOptions).then(
        function(response){
          deferred.resolve(response.data);
          removeProcessing();
        },
        function(response){
          modalUtils.launch('error', 'Could not connect to the server. Please try again shortly');
          deferred.reject(response.data);
          removeProcessing();
        }
      );
      return deferred.promise;
    }

    function addLoading() {
      countLoading++;
      $rootScope.showLoading = true;
    }

    function removeLoading() {
      if ((--countLoading) === 0) {
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
})();


