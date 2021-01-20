(function () {
  'use strict';

  angular
    .module('app.profile')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['$filter', 'globalData', 'userData', 'globalDataSet', 'userDataSet', 'helpers', 'workout'];

  function ProfileController($filter, globalData, userData, globalDataSet, userDataSet, helpers, workout) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.points = userDataSet.points;
    vm.bodyStats = helpers.bodyStatsConvert(vm.user.settings.units, true)(JSON.parse(JSON.stringify(userDataSet.bodyStats)));
    vm.bodyPartStats = helpers.bodyStatsConvert(vm.user.settings.units, true)(JSON.parse(JSON.stringify(userDataSet.bodyPartStats)));
    vm.bodyStatHistory = [];
    vm.bodyPartStatHistory = [];
    vm.userHistory = userDataSet.userHistory;
    vm.formatTime = helpers.formatTime;
    vm.timeString = helpers.timeString;
    vm.weeklyColor = "info";
    vm.maxDay = 50;
    vm.helpers = helpers;
    vm.totalPoints = vm.user['current_total_points'];
    vm.dProgress = (vm.user['current_daily_points'] / vm.maxDay)*100;
    vm.wProgress = (vm.user['current_weekly_points'] / vm.user.current_weekly_points_goal_value)*100;
    vm.statusString;
    vm.updateStatus = updateStatus;
    vm.options = options;
    vm.nameFilter = nameFilter;
    vm.unitsFilter = unitsFilter;
    vm['hiding'] = {};
    vm.displayBodyStatHistory = displayBodyStatHistory;
    vm.displayBodyPartStatHistory = displayBodyPartStatHistory;
    vm.submitStats = submitStats;
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
    
    if(workout.getMetric() === ""){
      workout.setMetric(vm.user.settings.units);
      if(vm.user.settings.units != "standard"){
        vm.criterionDisplayInfo.weight.name = 'Kg';
      }
    }else if(workout.getMetric() != "standard"){
      vm.criterionDisplayInfo.weight.name = 'Kg';
    }

    if(vm.user.current_weekly_points >= vm.user.current_weekly_points_goal_value){
		  vm.weeklyColor = 'success'
	  } else {
		  vm.weeklyColor = 'info'
	  };

    initialize();

    function updateStatus(){
      vm.user.current_status = vm.statusString;
      userData.updateUserStatus(vm, vm.user.current_status);
      var form = document.getElementById("statusForm");
      form.reset();
    }

    function displayBodyStatHistory(bodyStat){
      vm.options = options;
      userData.getBodyStatHistory(vm, bodyStat, refresher(bodyStat.value));
      for(var h in vm.hiding){
        vm.hiding[h] = true;
      }
      vm.hiding[bodyStat['value']] = vm.hiding[bodyStat['value']] ? false : true;
    }

    function displayBodyPartStatHistory(bodyPartStat){
      vm.options = options;
      userData.getBodyPartStatHistory(vm, bodyPartStat, refresher(bodyPartStat.value));
      for(var h in vm.hiding){
        vm.hiding[h] = true;
      }
      vm.hiding[bodyPartStat['body_part_id']] = vm.hiding[bodyPartStat['body_part_id']] ? false : true;
    }
    
    function refresher(type){
      return function(){helpers.bodyStatsHistoryConvert(vm.bodyStatHistory, type, workout.getMetric())};
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
      if(vm.user.settings.units ==='standard'){
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

    function submitStats(){
      userData.updateBodyStats(vm, helpers.bodyStatsConvert(workout.getMetric(), false)(vm.bodyStats));
      userData.updateBodyPartStats(vm, helpers.bodyStatsConvert(workout.getMetric(), false)(vm.bodyPartStats));
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
        if(vm.user.settings.units === "standard"){
          vm.bodyStats[indicies.bmi].data = (703*vm.bodyStats[indicies.weight].data)/(vm.bodyStats[indicies.height].data*vm.bodyStats[indicies.height].data);
          vm.bodyStats[indicies.bmi].data = parseFloat($filter('number')(vm.bodyStats[indicies.bmi].data, 2));
        }else{
          vm.bodyStats[indicies.bmi].data = (vm.bodyStats[indicies.weight].data)/(vm.bodyStats[indicies.height].data*vm.bodyStats[indicies.height].data*(1/10000));
          vm.bodyStats[indicies.bmi].data = parseFloat($filter('number')(vm.bodyStats[indicies.bmi].data, 2));
        }
      }
      if(vm.bodyStats[ind].value === 'weight'){
        if(vm.user.settings.units === "standard"){
          vm.bodyStats[indicies.bmi].data = (703*vm.bodyStats[indicies.weight].data)/(vm.bodyStats[indicies.height].data*vm.bodyStats[indicies.height].data);
          vm.bodyStats[indicies.bmi].data = parseFloat($filter('number')(vm.bodyStats[indicies.bmi].data, 2));
        }else{
          vm.bodyStats[indicies.bmi].data = (vm.bodyStats[indicies.weight].data)/(vm.bodyStats[indicies.height].data*vm.bodyStats[indicies.height].data*(1/10000));
          vm.bodyStats[indicies.bmi].data = parseFloat($filter('number')(vm.bodyStats[indicies.bmi].data, 2));
        }
      }
    }

    //Blue: 11C1F3
    //Orange:FFC900
    var options = {
      axes: {
        x: {type: 'date', innerTicks: true},
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

  }

})();
