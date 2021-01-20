(function(){
  'use strict';

  angular
    .module('app')
    .factory('globalData', globalData);

  globalData.$inject = [
    '$http', '$location', '$q', '$window',
    'store',
    'config', 'data'
  ];

  function globalData($http, $location, $q, $window, store, config, data) {
    var dataStore = store.getNamespacedStore(config.options.globalStoreName);
    var dataInfo = [];
    var dataMap = [];
    var dataInfoLookup = {};
    var factory = {
      initialize: initialize,
      getAll: getAll,
      get: get,
      clearData: clearData
    };

    return factory;

    function initialize(){
      dataMap = [
        {name: 'bodyAreas', target: 'body_areas'},
        {name: 'bodyAreasNested', target: 'body_areas_nested'},
        {name: 'quickActivities', target: 'quick_activities'},
        {name: 'categories', target: 'categories'},
        {name: 'equipmentGroups', target: 'equipment_groups'},
        {name: 'equipments', lookup: 'equipmentLookup', store: true, target: 'equipments'},
        {name: 'motivations', store: true, target: 'motivations'},
        {name: 'spaces', store: true, target: 'spaces'},
        {name: 'tips', store: true, target: 'tips'},
        {name: 'usages', store: true, target: 'usages'},
        {name: 'exercises', lookup: 'exerciseLookup', store: true, target: 'exercises'},
        {name: 'levels', lookup: 'levelLookup', store: true, target: 'levels'}
      ];

      dataInfo = [
        {
          name: 'globals',
          store: true,
          target: 'globals',
          skipAuthorization: true,
          waitCache: true,
          url: config.getGlobalUrl()
        }
      ];
      data.initStoredData(dataStore, dataInfo);
    }

    function getAll(forceCheck){
      var dataSet = {};
      var deferred = $q.defer();

      data.getData(dataInfo[0], {}, forceCheck).then(
        function (data) {
          for (var i = 0; i < dataMap.length; i++) {
            dataSet[dataMap[i].name] = data[dataMap[i].target];
            if (dataMap[i].lookup){
              dataSet[dataMap[i].lookup] = createLookup(dataSet[dataMap[i].name]);
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

    function clearData(){
      for (var i = 0; i < dataInfo.length; i++){
        if (dataInfo[i].store){
          dataStore.set(dataInfo[i].name, null);
        }
      }
    }

    function get(dataName){
      return data.getData(dataStore, dataName);
    }
  }
})();