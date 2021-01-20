(function () {
  'use strict';

  angular
    .module('app.profile')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$filter', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'helpers', 'infoFactory'];

  function ProfileController($filter, globalData, userData, globalDataSet, userDataSet, helpers, infoFactory) {
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
    vm.isCollapsedLogs = true;
    vm.isCollapsedStats = true;
    vm.isCollapsedBody = true;
    vm.isCollapsedWorkouts = true;
    vm.infoClicked = infoFactory.getClicked;
    vm.options = options;
    vm.expander = expander;
    vm.getWorkout = getWorkout;
    vm.nameFilter = nameFilter;
    vm.unitsFilter = unitsFilter;
    vm.displayBodyStatHistory = displayBodyStatHistory;
    vm.displayBodyPartStatHistory = displayBodyPartStatHistory;
    vm.submitStats = submitStats;
    vm.exerciseLookup = globalDataSet.exerciseLookup;
    vm['hiding'] = {};
    vm.workouts = {};
    vm.workoutHidden = {};
    vm.updateBS = updateBS;
    var indicies = {height: null, weight: null, bmi: null, bfp: null};
    vm.criterionDisplayInfo = {
      duration:     {name: 'Time:'},
      reps:         {name: 'Reps:'},
      breath:       {name: 'Breaths:'},
      pattern:      {name: 'Pattern:'},
      weight:       {name: 'Lb:'},
      rest:         {name: 'Rest:'}
    }

    initialize();

    function displayBodyStatHistory(bodyStat){
      vm.options = options;
      userData.getBodyStatHistory(vm, bodyStat);
      for(var h in vm.hiding){
        vm.hiding[h] = true;
      }
      vm.hiding[bodyStat['value']] = vm.hiding[bodyStat['value']] ? false : true;
    }

    function displayBodyPartStatHistory(bodyPartStat){
      vm.options = options;
      userData.getBodyPartStatHistory(vm, bodyPartStat);
      for(var h in vm.hiding){
        vm.hiding[h] = true;
      }
      vm.hiding[bodyPartStat['body_part_id']] = vm.hiding[bodyPartStat['body_part_id']] ? false : true;
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
      for(var w in vm.userHistory.workouts){
        vm.workoutHidden[vm.userHistory.workouts[w].id] = true;
      }
    }

    function updateBS(ind){
      for(var bs in vm.bodyStats){
        switch(vm.bodyStats[bs].value){
          case 'bmi':
            indicies.bmi = bs;
            break;
          case 'height':
            indicies.height = bs;
            break;
          case 'weight':
            indicies.weight = bs;
            break;
          case 'body_fat':
            indicies.bfp = bs;
            break;
        }
      }

      if(vm.bodyStats[ind].value === 'height'){
        vm.bodyStats[indicies.bmi].data = (703*vm.bodyStats[indicies.weight].data)/(vm.bodyStats[indicies.height].data*vm.bodyStats[indicies.height].data);
        vm.bodyStats[indicies.bmi].data = parseFloat($filter('number')(vm.bodyStats[indicies.bmi].data, 2));
      }
      if(vm.bodyStats[ind].value === 'weight'){
        vm.bodyStats[indicies.bmi].data = (703*vm.bodyStats[indicies.weight].data)/(vm.bodyStats[indicies.height].data*vm.bodyStats[indicies.height].data);
        vm.bodyStats[indicies.bmi].data = parseFloat($filter('number')(vm.bodyStats[indicies.bmi].data, 2));
      }
    }

    var options = {
      axes: {
        x: {type: 'date', innerTicks: true, ticks: 4},
        y: {type: 'linear', min: 0, innerTicks: true},
      },
      margin: {
        left: 100
      },
      series: [
        {y: 'value', axis: 'y', color: '#11C1F3', thickness: '2px', type: 'area', label: "A time series"},
      ],
      lineMode: 'linear',
      tension: 0.7,
      tooltip: {mode: 'scrubber'},
      drawLegend: false,
      drawDots: true,
      hideOverflow: false,
      columnsHGap: 5
    }

    function getWorkout(workoutId){
      userData.getWorkout(vm.workouts, workoutId);
    }

    function submitStats(){
      userData.updateBodyStats(vm, vm.bodyStats);
      userData.updateBodyPartStats(vm, vm.bodyPartStats);
    }

    function expander(wh, wo){
      if(!vm.workouts[wo.id]){
        getWorkout(wo.id)
      }
      vm.workoutHidden[wo.id] = !vm.workoutHidden[wo.id];
    }

    function infoClicked(){
      vm.isCollapsed = !vm.isCollapsed;
      vm.user['settings']['help']['profile'] = vm.isCollapsed;
      userData.updateUser(vm.user);
    }

  }

})();
