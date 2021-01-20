(function(){
  'use strict';

  angular
    .module('app')
    .factory('globalData', globalData);

  globalData.$inject = [
    '$http', '$location', '$q',
    'store',
    'config', 'data'
  ];

  function globalData($http, $location, $q, store, config, data) {
    var dataStore = store.getNamespacedStore(config.options.globalStoreName);
    var dataInfo = [];
    var dataInfoLookup = {};
    var factory = {
      initialize: initialize,
      getAll: getAll,
      get: get,
      clearData: clearData
    };

    return factory;

    function initialize(){
      dataInfo = [
        {name: 'bodyAreas', store: true, target: 'body_areas'},
        {name: 'bodyAreasNested', store: true, target: 'body_areas', params: {nested: true}},
        {name: 'quickActivities', store: true, target: 'quick_activities'},
        {name: 'categories', store: true, target: 'categories'},
        {name: 'equipmentGroups', store: true, target: 'equipments', transform: makeEquipementGroups},
        {name: 'equipments', lookup: 'equipmentLookup', store: true, target: 'equipments'},
        {name: 'motivations', store: true, target: 'messages', params: {message_type: 'feel_good'}},
        {name: 'spaces', store: true, target: 'spaces'},
        {name: 'tips', store: true, target: 'messages', params: {message_type: 'tip'}},
        {name: 'usages', store: true, target: 'usages'},
        {name: 'exercises', lookup: 'exerciseLookup', store: true, target: 'exercises'}
      ]

      for(var i = 0; i < dataInfo.length; i++){
        var info = dataInfo[i];
        info.skipAuthorization = true;
        info.waitCache = true;
        dataInfoLookup[info.name] = info;
      }

      data.initStoredData(dataStore, dataInfo);
    }

    function getAll(forceCheck){
      return data.getDataSet(dataInfo, forceCheck);
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

    function makeEquipementGroups(equipments){
      var equipmentGroups = [];
      var groups = {};

      for (var i = 0; i < equipments.length; i++){
        var e = equipments[i];
        var eg = e.equipment_group;

        groups[eg.id] = groups[eg.id] ? groups[eg.id] : {id: eg.id, name: eg.name, equipments: []}
        groups[eg.id].equipments.push({id: e.id, name: e.name});
      }

      for (var key in groups){
        equipmentGroups.push(groups[key]);
      }

      return equipmentGroups;
    }
  }

})();



