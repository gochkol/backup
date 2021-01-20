(function(){
  'use strict';

  angular
    .module('app')
    .factory('helpers', helpers);

  helpers.$inject = ['$q', 'constants'];

  function helpers($q, constants){

    var factory = {
      modeDisplay: modeDisplay,
      getRandomValue: getRandomValue,
      eventSentence: eventSentence,
      mergeDefaultSettings: mergeDefaultSettings,
      secondsToString: secondsToString,
      timeString: timeString,
      formatTime: formatTime,
      firstLetter: firstLetter,
      pointSentence: pointSentence,
      tokenChangeSentence: tokenChangeSentence,
      getLevelInfo: getLevelInfo,
      deferIt: deferIt,
      blur: blur,
      bodyStatsConvert: bodyStatsConvert,
      bodyStatsHistoryConvert: bodyStatsHistoryConvert,
      workoutConvert: workoutConvert,
      blocksConvert: blocksConvert,
      mi_to_km: mi_to_km,
      km_to_mi: km_to_mi,
      round: round
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
        userSettings[level1] = userSettings[level1] == undefined ? defaultSettings[level1] : userSettings[level1];
        if (defaultSettings[level1].constructor === Object){
          for (var level2 in defaultSettings[level1]){
            userSettings[level1][level2] = userSettings[level1][level2] == undefined ? defaultSettings[level1][level2] : userSettings[level1][level2];
          }
        }
      }
      responseData.settings = userSettings;
      return responseData;
    }

    function getRandomValue(values){
      return (typeof values != "undefined" && values != null && values.length > 0) ? values[Math.floor(Math.random() * values.length)].text : "";
    }

    function tokenChangeSentence(tokenChange){
      var changeData = tokenChange['change_data'];
      var tokenChangeReasonValue = tokenChange['token_change_reason']['value'];
      var sError = "Unknown reason for token change";
      var s = "";

      try{
        switch (tokenChangeReasonValue){
          case "points_earned_rule":
            s = "Earned 50 points";
            break;
          case "weekly_point_goal_reached":
            s = "Reached weekly goal";
            break;
          default:
            s = sError;
        }
      }
      catch(error){
        console.log(error);
        s = sError;
      }
      return s;
    }

	  function pointSentence(point){
      var pd = point.point_data;
      var s = "";
      var sError = "A Human has failed to programmatically generate the correct sentence for point_id=" + point['id'] + ". Please help us create a better product for you and report this to support@updowntech.com.  Cheers!";

      try{

        switch (point['point_type']){
          case "finish_quick_log":
            var distancePart = "";
            s = pd['quick_log']['user']['first_name'] + " " + pd['quick_log']['user']['last_name'];
            if(pd['distance_miles']){
              distancePart = "over a distance of " + pd['distance_miles'] + " miles";
            }
            if (point['number_of'] > 0){
              s += " earned " + point['number_of'] + " points for logging " + pd['quick_log']['duration'] + " minutes of ";
              s += pd['quick_log']['quick_activity']['name'] + distancePart + ".";
            }
            else{
              s += " finished logging " + pd['quick_log']['duration'] + " minutes of ";
              s += pd['quick_log']['quick_activity']['name'] + distancePart + " and has reached max points for the day.";
            }
            break;
          case "finish_workout":
            s = pd['workout']['user']['first_name'] + " " + pd['workout']['user']['last_name'];
            if (point['number_of'] > 0){
              s += " earned " + point['number_of'] + " points for finishing " + pd['workout']['name'] + ".";
            }
            else{
              s += " has finished " + pd['workout']['name'] + " and has reached max points for the day.";
            }
            break;
          case "weekly_goal_bonus":
            s += "You reached your weekly point goal and received " + point['number_of'] + " bonus points.";
            break;
          default:
            s = sError;
            break;
        }
      }
      catch(error){
        console.log(error);
        s = sError;
      }
      return s;
    }

    function eventSentence(event){
      var ed = event.event_data;
      var s = "";
      var sError = "A Human has failed to programmatically generate the correct sentence for event_id=" + event['id'] + ". Please help us create a better product for you and report this to support@updowntech.com.  Cheers!";

      try{
        s = event['user']['first_name'] + " " + event['user']['last_name'];

        switch (event['event_type']){
          case "finish_quick_log":
            s += " did " + ed['quick_log']['duration'] + " minutes of " + ed['quick_log']['quick_activity']['name'] + ".";
            break;
          case "update_status":
            s += ": '" + ed['user']['current_status'] + "'";
            break;
          case "level_jump":
            // available raw data...
            // {"level"=>{"id"=>4, "min_points"=>250, "max_points"=>499, "name"=>"L4", "value"=>4, "next_level_points"=>500}}
            s += " leveled up to " + ed['level']['name'] + ".";
            break;
          case "finish_workout":
            s += " finished " + ed['workout']['name'] + ".";
            break;
          case "weekly_goal":
            s += " reached their weekly point goal and received " + ed['number_of_bonus_points'] + " bonus points.";
            break;
          default:
		    s = sError;
            break;
        }
      }catch(error){
        console.log(error);
        s = sError;
	    }
	    return s;
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

		//not using these options for now as they don't work with iOS/Safari
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
          outTime = date.toLocaleString();
        }
        return outTime;
      }
    }

    function firstLetter(name){
      return name.charAt(0);
    }

    function getLevelInfo(user, userLevel, levels){
      var levelRange = userLevel['next_level_points'] - userLevel['min_points'];
      var levelProgress = user['current_total_points'] - userLevel['min_points'];
      return {
        range: levelRange,
        progress: levelProgress,
      };
    }

    function deferIt(fun, time){
      var deferred = $q.defer();
      setTimeout(function(){
        fun;
        deferred.resolve();
      }, time);
      return deferred.promise;
    }

    function bodyStatsConvert(units, incoming){
      if(incoming){
        if(units === "standard"){
          return empty;
        }else{
          return bodyStatsConversionIncoming;
        }
      }else{
        if(units === "standard"){
          return empty;
        }else{
          return bodyStatsConversionOutgoing;
        }
      }
    }

    function empty(pass){
      return pass;
    }

    function bodyStatsConversionIncoming(stats){
      for(var s in stats){
        switch(stats[s].value){
          case "height":
            stats[s].data = in_to_cm(stats[s].data);
            break;
          case "weight":
            stats[s].data = lb_to_kg(stats[s].data);
            break;
          case "bmi":
          case "body_fat":
          case "resting_heart_rate":
            break;
          default:
            stats[s].data = in_to_cm(stats[s].data);
        }
      }
      return stats;
    }

    function bodyStatsConversionOutgoing(stats){
      for(var s in stats){
        switch(stats[s].value){
          case "height":
            stats[s].data = cm_to_in(stats[s].data);
            break;
          case "weight":
            stats[s].data = kg_to_lb(stats[s].data);
            break;
          default:
            stats[s].data = cm_to_in(stats[s].data);
        }
      }
      return stats;
    }

    function bodyStatsHistoryConvert(stats, type, metric){
      if(metric === "metric"){
        for(var s in stats){
          switch(type){
            case 'weight':
              stats[s].value = lb_to_kg(stats[s].value);
              break;
            case 'height':
              stats[s].value = in_to_cm(stats[s].value);
              break;
            case 'bmi':
            case 'body_fat':
            case 'resting_heart_rate':
              break;
            default:
              stats[s].value = in_to_cm(stats[s].value);
          }
        }
      }
      return stats;
    }

    function workoutConvert(units, incoming){
      if(incoming){
        if(units === "standard"){
          return empty;
        }else{
          return workoutConversionIncoming;
        }
      }else{
        if(units === "standard"){
          return empty;
        }else{
          return workoutConversionOutgoing;
        }
      }
    }

    function workoutConversionIncoming(workout){
      for(var b in workout.blocks){
        for(var s in workout.blocks[b].block_sets){
          if(workout.blocks[b].block_sets[s].criterion.weight){
            workout.blocks[b].block_sets[s].criterion.weight = lb_to_kg(workout.blocks[b].block_sets[s].criterion.weight);
          }
        }
      }
      return workout;
    }

    function workoutConversionOutgoing(workout){
      for(var b in workout.blocks){
        for(var s in workout.blocks[b].block_sets){
          if(workout.blocks[b].block_sets[s].criterion.weight){
            workout.blocks[b].block_sets[s].criterion.weight = kg_to_lb(workout.blocks[b].block_sets[s].criterion.weight);
          }
        }
      }
      return workout;
    }

    function blocksConvert(blocks, setting){
      if(setting != "standard"){
        for(var b in blocks){
          for(var s in blocks[b].block_data.block_sets){
            if(blocks[b].block_data.block_sets[s].criterion.weight){
              blocks[b].block_data.block_sets[s].criterion.weight = lb_to_kg(blocks[b].block_data.block_sets[s].criterion.weight);
            }
          }
        }
      }
      return blocks;
    }

    function in_to_cm(measure){
      return Math.round(measure*2.54);
    }

    function cm_to_in(measure){
      return Math.round(measure*0.393701);
    }

    function lb_to_kg(measure){
      return Math.round(measure*0.453592);
    }

    function kg_to_lb(measure){
      return Math.round(measure*2.20462);
    }

    function mi_to_km(measure){
      return round(measure*1.60934, -2);
    }

    function km_to_mi(measure){
      return round(measure*0.621371, -2);
    }

    function nearest5(measure){
      var mod5 = measure%5;
      var div5 = (measure-mod5)/5;
      if(mod5 >= 3){
        return 5*(div5+1);
      }else{
        return 5*(div5);
      }
    }

    function round(num, pow){
      var t = Math.round(num*Math.pow(10, -1*pow));
      return (t*Math.pow(10, (pow)));
    }

    function blur(e){
      var key = e.keyCode;

      if(key == 13){
        cordova.plugins.Keyboard.close();
      }
    }

  }

})();
