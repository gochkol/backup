(function(){
  'use strict';

  angular
    .module('app')
    .factory('dateUtils', dateUtils);

  dateUtils.$inject = [];

  function dateUtils(){
    var ageLimit = 13;
    var date = new Date();
    var days, months, years;

    var factory = {
      days: days,
      months: months,
      years: years,
      getMonths: getMonths,
      getYears: getYears,
      getDays: getDays
    }

    var defaultDays = []
    for(var x = 0; x < 4; x++){
      defaultDays.push([]);
      for(var y = 0; y <28+x; y++){
        defaultDays[x].push({value: y+1});
      }
    }

    var defaultMonths = [{name: "January", value: "1"},
                         {name: "February", value: "2"},
                         {name: "March", value: "3"},
                         {name: "April", value: "4"},
                         {name: "May", value: "5"},
                         {name: "June", value: "6"},
                         {name: "July", value: "7"},
                         {name: "August", value: "8"},
                         {name: "September", value: "9"},
                         {name: "October", value: "10"},
                         {name: "November", value: "11"},
                         {name: "December", value: "12"}];

    var defaultYears = [];
    for(var startYear = date.getFullYear() - ageLimit; startYear > 1900; startYear--){
      defaultYears.push({value: startYear});
    }

    return factory;

    function getDays(month, year){
      if(year.value != (date.getFullYear() - ageLimit)){
        switch(month.value){
          case '1':
            return defaultDays[3];
            break;
          case '2':
            if(year%4 != 0){
              return defaultDays[0];
            }else if(year%100 != 0){
              return defaultDays[1];
            }else if(year%400 != 0){
              return defaultDays[0];
            }else{
              return defaultDays[1];
            }
            break;
          case '3':
            return defaultDays[3];
            break;
          case '4':
            return defaultDays[2];
            break;
          case '5':
            return defaultDays[3];
            break;
          case '6':
            return defaultDays[2];
          break;
          case '7':
            return defaultDays[3];
            break;
          case '8':
            return defaultDays[3];
            break;
          case '9':
            return defaultDays[2];
            break;
          case '10':
            return defaultDays[3];
            break;
          case '11':
            return defaultDays[2];
            break;
          case '12':
            return defaultDays[3];
            break;
          default:
            return defaultDays[3];
        }
      }else if(parseFloat(month.value) < (date.getMonth()+1)){
        switch(month.value){
          case '1':
            return defaultDays[3];
            break;
          case '2':
            if(year%4 != 0){
              return defaultDays[0];
            }else if(year%100 != 0){
              return defaultDays[1];
            }else if(year%400 != 0){
              return defaultDays[0];
            }else{
              return defaultDays[1];
            }
            break;
          case '3':
            return defaultDays[3];
            break;
          case '4':
            return defaultDays[2];
            break;
          case '5':
            return defaultDays[3];
            break;
          case '6':
            return defaultDays[2];
          break;
          case '7':
            return defaultDays[3];
            break;
          case '8':
            return defaultDays[3];
            break;
          case '9':
            return defaultDays[2];
            break;
          case '10':
            return defaultDays[3];
            break;
          case '11':
            return defaultDays[2];
            break;
          case '12':
            return defaultDays[3];
            break;
          default:
            return defaultDays[3];
        }
      }else if(parseFloat(month.value) == (date.getMonth()+1)){
        var tempDays = [];
        for(x = 1; x < date.getDate(); x++){
          tempDays.push({value: x.toString()});
        }
        return tempDays;
      }else{
        return [];
      }
    }

    function getMonths(year){
      if(year.value != date.getFullYear() - ageLimit){
        return defaultMonths;
      }else{
        var tempMonths =[];
        for(var e in defaultMonths){
          if(e <= date.getMonth){
            tempMonths.push(defaultMonths[e]);
          }
        }
        return tempMonths;
      }
    }

    function getYears(){
      return defaultYears;
    }
  }

})();
