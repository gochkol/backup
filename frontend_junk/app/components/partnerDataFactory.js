(function(){
  'use strict';

  angular
    .module('app')
    .factory('partnerData', partnerData);

  partnerData.$inject = ['data', 'store', 'config'];

  function partnerData(data, store, config){
    var dataStore = store.getNamespacedStore(config.options.partnerStoreName);
    var dataInfo = [];
    var dataInfoLookup = {};
    var factory = {
      initialize: initialize,
      getPartner: getPartner,
      partnerLogin: partnerLogin,
      clearData: clearData,
      getGym: getGym,
      getStateData: getStateData,
      setStateData: setStateData,
    };

    return factory;

    function initialize(){
      dataInfo = [
        {name: 'partner', target: 'partner'},
        {name: 'partner_auth', target: 'partner_auth', store: false},
        {name: 'gym', target: 'partners/gym', store: false}
      ]

      for(var i = 0; i < dataInfo.length; i++){
        dataInfo[i].url = config.getUserUrl();
        var info = dataInfo[i];
        dataInfoLookup[info.name] = info;
      }
    }

    function clearData(){
      for (var i = 0; i < dataInfo.length; i++){
        if (dataInfo[i].store){
          dataStore.set(dataInfo[i].name, null);
        }
      }
      dataStore.set('stateData', undefined);
    }

    function getStateData(name, defaultValue){
      var stateData = dataStore.get('stateData');

      if (!stateData){
        dataStore.set('stateData', {});
        stateData = dataStore.get('stateData');
      }

      if (stateData[name] == undefined){
        stateData[name] = (defaultValue != undefined) ? defaultValue : null;
        dataStore.set('stateData', stateData);
      }

      return stateData[name];
    }

    function setStateData(name, value){
      var stateData = dataStore.get('stateData');

      if (!stateData){
        dataStore.set('stateData', {});
        stateData = dataStore.get('stateData');
      }
      stateData[name] = value;
      dataStore.set('stateData', stateData);
      return stateData[name];
    }

    function partnerLogin(params){
      return data.postLogin(dataInfoLookup['partner_auth'], params);
    }

    function getPartner(){
      return data.getData(dataInfoLookup['partner']);
    }

    function getGym(vm, gymID){
      var params = {id: gymID};

      data.getData(dataInfoLookup['gym'], params).then(
        function(responseData){
          vm.gym = responseData;
        }
      );
    }
  }

})();
