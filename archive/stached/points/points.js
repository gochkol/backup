angular.module( 'points', [
  'ui.router',
  'angular-storage'
])
.config(function($stateProvider) {
  $stateProvider.state('points', {
    url: '/points',
    controller: 'PointsCtrl',
    templateUrl: 'points/points.html'
  });
})
.controller( 'PointsCtrl', function SignupController( $scope, $http, store, $state, Data) {
  $scope.user = Data.getUser();

  $scope.max_month = 600;
  $scope.max_day = 60;
  $scope.points = {};
  $scope.this_day_points = $scope.user.current_daily_points;
  $scope.this_month_points = $scope.user.current_monthly_points;
  $scope.total_points = $scope.user.current_total_points;

  var d = new Date();
  var date = {year: d.getFullYear(), month: (d.getMonth()+1), day: d.getDate()}
  $http.get(Data.backendURL('/v1/points'), { skipAuthorization: false}).then(function (result){
    $scope.points = result.data;
  $scope.dprogress = ($scope.user.current_daily_points/$scope.max_day)*100;
  $scope.mprogress = ($scope.user.current_monthly_points/$scope.max_month)*100;
  if ($scope.mprogress < 33){
    $scope.month_pbarcolor = 'progress-bar-danger';
    }else if ($scope.mprogress < 66) {
    $scope.month_pbarcolor = 'progress-bar-warning';
    }else if ($scope.mprogress < 99) {
    $scope.month_pbarcolor = 'progress-bar-success';
    }else{
    $scope.month_pbarcolor = 'progress-bar-info';
  }

  });

});
