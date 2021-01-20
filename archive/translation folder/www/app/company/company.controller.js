(function () {
  'use strict';

  angular
    .module('app.company')
    .controller('CompanyController', CompanyController);

  CompanyController.$inject = ['userData', 'userDataSet', 'infoFactory'];

  function CompanyController(userData, userDataSet, infoFactory) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.company = userDataSet.company;
    vm.joinCompany = joinCompany;
    vm.signupCode = "JPOWZSUQ";
    vm.departments = vm.company.departments;
    vm.teams = [];
    vm.isCollapsed = infoFactory.getCollapsed(vm.user);
    vm.infoClicked = infoFactory.getClicked;
    vm.members = [];
    for(var d in vm.departments){
      vm.departments[d].members = [];
      for(var t in vm.departments[d].teams){
        vm.teams.push(vm.departments[d].teams[t]);
        for(var m in vm.departments[d].teams[t].members){
          vm.members.push(vm.departments[d].teams[t].members[m]);
          vm.departments[d].members.push(vm.departments[d].teams[t].members[m]);
          vm.departments[d].teams[t].daily_points += vm.departments[d].teams[t].members[m].daily_points;
          vm.departments[d].teams[t].monthly_points += vm.departments[d].teams[t].members[m].monthly_points;
          vm.departments[d].teams[t].total_points += vm.departments[d].teams[t].members[m].total_points;
          vm.departments[d].daily_points += vm.departments[d].teams[t].members[m].daily_points;
          vm.departments[d].monthly_points += vm.departments[d].teams[t].members[m].monthly_points;
          vm.departments[d].total_points += vm.departments[d].teams[t].members[m].total_points;
          vm.departments[d].totalPointsPerMember = (vm.departments[d].total_points) / (vm.departments[d].members.length);
          vm.departments[d].dailyPointsPerMember = (vm.departments[d].daily_points) / (vm.departments[d].members.length);
          vm.departments[d].monthlyPointsPerMember = (vm.departments[d].monthly_points) / (vm.departments[d].members.length);
        }
      }
    }
    vm.focused = 0;
    vm.focus = focus;
    vm.companyPredicate = 'monthly_points';
    vm.companyReverse = true;
    vm.companyShowDay = true;
    vm.companyShowMonth = false;
    vm.companyShowTotal = true;
    vm.orderCompany = orderCompany;
    vm.departmentsPredicate = 'monthly_points';
    vm.departmentsReverse = true;
    vm.departmentsShowDay = true;
    vm.departmentsShowMonth = false;
    vm.departmentsShowTotal = true;
    vm.orderDepartments = orderDepartments;
    vm.departmentsTwoPredicate = 'monthlyPointsPerMember';
    vm.departmentsTwoReverse = true;
    vm.departmentsTwoShowDay = true;
    vm.departmentsTwoShowMonth = false;
    vm.departmentsTwoShowTotal = true;
    vm.orderDepartmentsTwo = orderDepartmentsTwo;
    vm.departmentPredicate = 'monthly_points';
    vm.departmentReverse = true;
    vm.departmentShowDay = true;
    vm.departmentShowMonth = false;
    vm.departmentShowTotal = true;
    vm.orderDepartment = orderDepartment;
   

//    orderCompany('monthly_points');
//    orderDepartments('monthly_points');
//    orderDepartment('monthly_points');

    function focus(department){
      for(var d in vm.departments){
        if(vm.departments[d] === department){
          vm.focused = d;
        }
      }
    }

    function orderCompany(predicate){
      vm.companyReverse = (vm.companyPredicate === predicate) ? !vm.companyReverse : true;
      vm.companyPredicate = predicate;
      switch(predicate){
        case 'daily_points':
          vm.companyShowDay = false;
          vm.companyShowMonth = true;
          vm.companyShowTotal = true;
          break;
        case 'monthly_points':
          vm.companyShowDay = true;
          vm.companyShowMonth = false;
          vm.companyShowTotal = true;
          break;
        case 'total_points':
          vm.companyShowDay = true;
          vm.companyShowMonth = true;
          vm.companyShowTotal = false;
          break;
      }
    }

    function orderDepartments(predicate){
      vm.departmentsReverse = (vm.departmentsPredicate === predicate) ? !vm.departmentsReverse : true;
      vm.departmentsPredicate = predicate;
      switch(predicate){
        case 'daily_points':
          vm.departmentsShowDay = false;
          vm.departmentsShowMonth = true;
          vm.departmentsShowTotal = true;
          break;
        case 'monthly_points':
          vm.departmentsShowDay = true;
          vm.departmentsShowMonth = false;
          vm.departmentsShowTotal = true;
          break;
        case 'total_points':
          vm.departmentsShowDay = true;
          vm.departmentsShowMonth = true;
          vm.departmentsShowTotal = false;
          break;
      }
    }

    function orderDepartmentsTwo(predicate){
      vm.departmentsTwoReverse = (vm.departmentsTwoPredicate === predicate) ? !vm.departmentsTwoReverse : true;
      vm.departmentsTwoPredicate = predicate;
      switch(predicate){
        case 'dailyPointsPerMember':
          vm.departmentsTwoShowDay = false;
          vm.departmentsTwoShowMonth = true;
          vm.departmentsTwoShowTotal = true;
          break;
        case 'monthlyPointsPerMember':
          vm.departmentsTwoShowDay = true;
          vm.departmentsTwoShowMonth = false;
          vm.departmentsTwoShowTotal = true;
          break;
        case 'totalPointsPerMember':
          vm.departmentsTwoShowDay = true;
          vm.departmentsTwoShowMonth = true;
          vm.departmentsTwoShowTotal = false;
          break;
      }
    }

    function orderDepartment(predicate){
      vm.departmentReverse = (vm.departmentPredicate === predicate) ? !vm.departmentReverse : true;
      vm.departmentPredicate = predicate;
      switch(predicate){
        case 'daily_points':
          vm.departmentShowDay = false;
          vm.departmentShowMonth = true;
          vm.departmentShowTotal = true;
          break;
        case 'monthly_points':
          vm.departmentShowDay = true;
          vm.departmentShowMonth = false;
          vm.departmentShowTotal = true;
          break;
        case 'total_points':
          vm.departmentShowDay = true;
          vm.departmentShowMonth = true;
          vm.departmentShowTotal = false;
          break;
      }
    }

    function joinCompany(){
      userData.joinCompany(vm, vm.signupCode);
    }

  }

})();

