angular.module( 'stats', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('stats_body', {
    url: '/stats',
    controller: 'StatsCtrl',
    templateUrl: 'stats/stats_body.html'
  });
})
.config(function($stateProvider) {
  $stateProvider.state('stats_history', {
    url: '/stats',
    controller: 'StatsCtrl',
    templateUrl: 'stats/stats_history.html'
  });
})

.controller( 'StatsCtrl', function SignupController( $scope, $http, store, $state, $filter, Data) {
  
  $scope.isCollapsed = true;
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  $scope.labels = ["", "", ""]
  $scope.series = [''];
  $scope.data = [[]];

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
//Set up body parts values
  $scope.body_part_stats = Data.getBody_part_stats();
  $scope.body_stats = Data.getBody_stats();
  if(!$scope.body_part_stats || !$scope.body_stats){
    $state.go('loading');
  }else{

  $scope.selected_body_part = 0;
  $scope.settings = store.get('settings') || Data.getSettings();

//Convert Standard to metric
  if($scope.settings.units === "metric"){
    var bsi = 0;
    var hsi = 0;
    var wsi = 0;
    for(b in $scope.body_stats){
      if($scope.body_stats[b].value === 'height'){
        $scope.body_stats[b].data *=2.54;
        hsi = b;
      }
      if($scope.body_stats[b].value === 'weight'){
        $scope.body_stats[b].data *= 0.453592;
        wsi = b;
      }
      if($scope.body_stats[b].value === 'bmi'){
        bsi = b;
      }
    }
    $scope.body_stats[bsi].data = ($scope.body_stats[wsi].data)/($scope.body_stats[hsi].data*$scope.body_stats[hsi].data);
  }

  for(b in $scope.body_stats){
    $scope.body_stats[b].data = parseFloat($filter('number')($scope.body_stats[b].data, 2));
  }

  if($scope.settings.units === "metric"){
    for(b in $scope.body_part_stats){
      $scope.body_part_stats[b].data *= 2.54;
    }
  }
  for(b in $scope.body_part_stats){
    $scope.body_part_stats[b].data = parseFloat($filter('number')($scope.body_part_stats[b].data, 2));
  }

//Change behavior for body stats
  $scope.update_bs = function(bsi){
    var bmi_index = 0;
    var height_index = 0;
    var weight_index = 0;
    var body_fat_index = 0;
    for(b in $scope.body_stats){
      if($scope.body_stats[b].value === 'bmi'){
        bmi_index = b;
      }
      if($scope.body_stats[b].value === 'height'){
        height_index = b;
      }
      if($scope.body_stats[b].value === 'weight'){
        weight_index = b;
      }
      if($scope.body_stats[b].value === 'body_fat'){
        body_fat_index_index = b;
      }
    }

    if($scope.body_stats[bsi].value === 'height'){
      if($scope.settings.units === 'standard'){
        $scope.body_stats[bmi_index].data = (703*$scope.body_stats[weight_index].data)/($scope.body_stats[height_index].data*$scope.body_stats[height_index].data);
      }else{
        $scope.body_stats[bmi_index].data = ($scope.body_stats[weight_index].data*10000)/($scope.body_stats[height_index].data*$scope.body_stats[height_index].data);
      }
      $scope.body_stats[bmi_index].data = parseFloat($filter('number')($scope.body_stats[bmi_index].data, 2));
    }
    if($scope.body_stats[bsi].value === 'weight'){
      if($scope.settings.units === 'standard'){
        $scope.body_stats[bmi_index].data = (703*$scope.body_stats[weight_index].data)/($scope.body_stats[height_index].data*$scope.body_stats[height_index].data);
      }else{
        $scope.body_stats[bmi_index].data = ($scope.body_stats[weight_index].data*10000)/($scope.body_stats[height_index].data*$scope.body_stats[height_index].data);
      }
      $scope.body_stats[bmi_index].data = parseFloat($filter('number')($scope.body_stats[bmi_index].data, 2));
    }
  }

//Filters
  $scope.name_filter = function(input){
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

  $scope.units_filter = function(input){
    var out = "";
    if($scope.settings.units ==='standard'){
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


//Submit Stats
  $scope.submit_stats = function(){
    var history = Data.getStateHistory();
    var end = history.pop();
    if(end === $state.current.name){
      history.push(end);
    }else{
      history.push(end);
      history.push($state.current.name);
    }
    if(Data.getLastState() === 'home'){ Data.setLastState('stats_body');}

    Data.addToStateHistory('home');
    $state.go('loading');
    if($scope.settings.units === "metric"){
      for(b in $scope.body_stats){
        if($scope.body_stats[b].value === 'height'){
          $scope.body_stats[b].data *= 0.393701;
        }
        if($scope.body_stats[b].value === 'weight'){
          $scope.body_stats[b].data *= 2.20462;
        }
      }
      for(b in $scope.body_part_stats){
        $scope.body_part_stats[b].data *= 0.393701;
      }
    }
    Data.setBody_stats($scope.body_stats);
    Data.setBody_part_stats($scope.body_part_stats);
    var target = Data.backendURL('/v1/stats');
    $http({
      url: target,
      method: 'PATCH',
     data: {body_stats: $scope.body_stats, body_part_stats: $scope.body_part_stats}
    }).then(function(response) {
    }, function(response) {
      alert(response.data.errors);
    });
  }


}});
// cm = in * 2.54
// in = cm * 0.393701
// kg = lbs * 0.453592
// lbs = kg * 2.20462
// BMI = (weight / height**2) * 703
//Adult Body Fat % = (1.20 x BMI) + (0.23 x Age) – (10.8 x gender) – 5.4
