(function(){
  'use strict';

  angular
    .module('app')
    .factory('helpers', helpers);

  helpers.$inject = ['constants'];

  function helpers(constants){

    var factory = {
      modeDisplay: modeDisplay,
      getRandomValue: getRandomValue,
      eventSentence: eventSentence,
      mergeDefaultSettings: mergeDefaultSettings,
      secondsToString: secondsToString,
      timeString: timeString,
      formatTime: formatTime
    }

    return factory;

    function secondsToString(timeSeconds){
      var hours = parseInt(timeSeconds/3600);
      var minutes = parseInt((timeSeconds-hours*3600)/60);
      var seconds = ((timeSeconds-hours*3600)%60);
      var timeString = "";

      timeString = hours ? hours + "h " : "";
      timeString += minutes ? minutes + "m " : "0m ";
      timeString += seconds ? seconds + "s" : "0s";

      return timeString;
    }

    function mergeDefaultSettings(responseData){
      var userSettings = responseData.settings || {};
      var defaultSettings = constants().DEFAULT_SETTINGS;

      for (var level1 in defaultSettings){
        userSettings[level1] = userSettings[level1] || defaultSettings[level1];
        if (defaultSettings[level1].constructor === Object){
          for (var level2 in defaultSettings[level1]){
            userSettings[level1][level2] = userSettings[level1][level2] || defaultSettings[level1][level2];
          }
        }
      }
      responseData.settings = userSettings;
      return responseData;
    }

    function getRandomValue(values){
      return (typeof values != "undefined" && values != null && values.length > 0) ? values[Math.floor(Math.random() * values.length)].text : "";
    }

    function eventSentence(event){
      var ed = event.event_data;
      switch (event.event_type){
        case "finish_quick_log":
          if(!ed.quick_log){
            return event.sentence;
          }else{
            return ed.quick_log.user.first_name + " " + ed.quick_log.user.last_name + " did " + ed.quick_log.duration + " minutes of " + ed.quick_log.quick_activity.name + ".";
          }
        case "update_status":
          if(!ed.user){
            return event.sentence;
          }else{
            return ed.user.first_name + " " + ed.user.last_name + ": '" + ed.user.current_status + "'";
          }
        case "finish_workout":
          if(!ed.workout){
            return event.sentence;
          }else{
            return ed.workout.user.first_name + " " + ed.workout.user.last_name + " finished " + ed.workout.name + ".";
          }
          default:
          return event.sentence;
      }
    }

    function modeDisplay(input){
      var out = "";
      if(input === 'duration'){
        out = "Time(s):";
      }
      if(input === 'reps'){
        out = "Reps:";
      }
      if(input === 'distance'){
        out = "Distance(ft):";
      }
      if(input === 'breath'){
        out = "Breaths:";
      }
      if(input === 'pattern'){
        out = "Pattern:";
      }
      if(input === 'weight'){
        out = "Wt.(lbs):";
      }
      if(input === 'rest'){
        out = "Rest(s):";
      }
      return out;
    }

    function timeString(time){
      var hours = 0;
      var minutes = 0;
      var seconds = 0;
      var timestring = "";
      while(time >= 60){
        while(time >= 3600){
          time -= 3600;
          hours++
        }
        if(time >= 60){
          time -= 60;
          minutes++;
        }
      }
      seconds = time;

      if(hours > 0){
        timestring += hours + ":";
        if(minutes > 9){
          timestring += minutes + ":";
        }else{
          timestring += "0" + minutes + ":";
        }
        if(seconds > 9){
        timestring += seconds;
        }else{
          timestring += "0" +seconds;
        }
      }else{
        if(minutes > 9){
          timestring += minutes + ":";
        }else{
          timestring += minutes + ":";
        }
        if(seconds > 9){
          timestring += seconds;
        }else{
          timestring += "0" +seconds;
        }
      }
      return timestring;
    }

    function formatTime(t){
      if(!t){
        return "";
      }else{
        var outTime = "";
        var nowTime = new Date();
        var date_time = t.split('T');
        var date = date_time[0];
        var time = date_time[1];
        var y_m_d = date.split('-');
        var year = parseInt(y_m_d[0], 10);
        var month = parseInt(y_m_d[1], 10);
        var day = parseInt(y_m_d[2], 10);
        var H_M_S_MS = time.split(',');
        var H_M_S = H_M_S_MS[0];
        var h_m_s = H_M_S.split(':');
        var hours = parseInt(h_m_s[0], 10);
        var minutes = parseInt(h_m_s[1], 10);
        var seconds = parseInt(h_m_s[2], 10);
        var date = new Date(Date.UTC(year, month-1, day, hours, minutes, seconds));
        var options = {
          weekday: "long", year: "numeric", month: "short",
          day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        var old = nowTime.getTime() - date.getTime();
        old = old/1000;
        old = Math.round(old);
        if(old < 60){
          outTime = old + "s ago";
        }else if(old < 120){
          outTime = "1 min ago";
        }else if(old < 3600){
          outTime = Math.round(old/60) + " mins ago";
        }else if(old < 7200){
          outTime = "1hr ago";
        }else if(old < 86400){
          outTime = Math.round(old/3600) + " hrs ago";
        }else if(old < 172800){
          outTime = "1 day ago";
        }else if(old < 604800){
          outTime = Math.round(old/86400) + " days ago";
        }else if(old < 1209600){
          outTime = "1 week ago";
        }else if(old < 2419200){
          outTime = Math.round(old/604800) + " weeks ago";
        }else{
          outTime = date.toLocaleTimeString("en-us", options);
        }
        return outTime;
      }
    }

  }

})();
