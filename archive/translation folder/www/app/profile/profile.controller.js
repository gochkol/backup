(function () {
  'use strict';

  angular
    .module('app.profile')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['globalData', 'userData', 'globalDataSet', 'userDataSet', 'helpers', 'infoFactory'];

  function ProfileController(globalData, userData, globalDataSet, userDataSet, helpers, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.bodyStats = userDataSet.bodyStats;
    vm.bodyPartStats = userDataSet.bodyPartStats;
    vm.bodyStatHistory = [];
    vm.bodyPartStatHistory = [];
    vm.userHistory = userDataSet.userHistory;
    vm.formatTime = helpers.formatTime;
    vm.timeString = helpers.timeString;
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.options = options;
    vm.closeAll = closeAll;
    vm.expand = expand;
    vm.nameFilter = nameFilter;
    vm.unitsFilter = unitsFilter;
    vm.displayBodyStatHistory = displayBodyStatHistory;
    vm.displayBodyPartStatHistory = displayBodyPartStatHistory;
    vm.submitStats = submitStats;
    vm['hiding'] = {};
    initialize();

    function displayBodyStatHistory(bodyStat){
      vm.options = options;
      userData.getBodyStatHistory(vm, bodyStat);
    }

    function displayBodyPartStatHistory(bodyPartStat){
      vm.options = options;
      userData.getBodyPartStatHistory(vm, bodyPartStat);
    }

    function nameFilter(input){
      var out = "";
      if(input === 'height'){
       out = 'Height';
      }
      if(input === 'weight'){
        out = 'Weight';
      }
      if(input === 'bmi'){
        out = 'BMI';
      }
      if(input === 'body_fat'){
        out = 'Body Fat %';
      }
      if(input === 'resting_heart_rate'){
        out = 'Resting Heart Rate';
      }
      return out;
    }

    function unitsFilter(input){
      var out = "";
      if(vm.user['settings']['units'] ==='standard'){
        if(input === 'height'){
          out = '(inches)';
        }
        if(input === 'weight'){
          out = '(lbs)';
        }
      }else{
        if(input === 'height'){
          out = '(cm)';
        }
        if(input === 'weight'){
          out = '(kg)';
        }
      }
      if(input === 'bmi'){
        out = '(calculated)';
      }
      if(input === 'resting_heart_rate'){
        out = '(BPM)';
      }

      return out;
    }

    function initialize(){
      for(var b in vm.bodyStats){
        vm.hiding[vm.bodyStats[b]['value']] = true;
        //vm.bodyStatsHistory[vm.bodyStats[b].value] = [];
      }
      for(var b in vm.bodyPartStats){
        vm.hiding[vm.bodyPartStats[b]['body_part_id']] = true;
        //vm.bodyPartStatsHistory[vm.bodyPartStats[b].id] = [];
      }
    }

    var options = {
      axes: {
        x: {key: 'x', type: 'date', grid: true, innerTicks: true, zoomable: true, ticks: 4, ticksFormatter: function(v){return vm.formatTime(v.toISOString());} },
        y: {type: 'linear', min: 0, grid: true, innerTicks: true, zoomable: true},
      },
      margin: {
        left: 100
      },
      series: [
        {y: 'value', axis: 'y', color: '"#9467bd', thickness: '2px', type: 'area', label: "A time series"},
      ],
      lineMode: 'linear',
      tension: 0.7,
      tooltip: {mode: 'scrubber'},
      drawLegend: false,
      drawDots: true,
      hideOverflow: false,
      columnsHGap: 5
    }

    function expand(h){
      userData.getWorkout(vm, h);
    }

    function submitStats(){
      userData.updateBodyStats(vm.bodyStats);
      userData.updateBodyPartStats(vm.bodyPartStats);
    }

    function closeAll(wh, wo){
      for(var w in wh){
        if(wh[w] != wo){
          wh[w][wh[w].id] = {};
        }
      }
    }

    function infoClicked(){
      vm.isCollapsed = !vm.isCollapsed;
      vm.user['settings']['help']['profile'] = vm.isCollapsed;
      userData.updateUser(vm.user);
    }

  }

})();
