(function () {
  'use strict';

  angular
    .module('app.company')
    .controller('CompanyController', CompanyController);

  CompanyController.$inject = ['userData', 'userDataSet'];

  function CompanyController(userData, userDataSet) {
    var vm = this;
    vm.user = userDataSet.user;
    vm.company = userDataSet.company;
    vm.joinCompany = joinCompany;
    vm.leaveCompany = leaveCompany;
    vm.signupCode = "";
    vm.departments = vm.company.departments;
    vm.teams = [];
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
	vm.ordering = {company: {daily: null, monthly: null, total: null}, departments: {daily: null, monthly: null, total: null}, departmentsTwo: {daily: null, monthly: null, total: null}, department: {daily: null, monthly: null, total: null}};
    vm.companyPredicate = 'monthly_points';
    vm.companyReverse = false;
    vm.companyShowDay = true;
    vm.companyShowMonth = false;
    vm.companyShowTotal = true;
	vm.ordering.company.daily = "";
    vm.ordering.company.monthly = "";
    vm.ordering.company.total = "";
    vm.orderCompany = orderCompany;
    vm.departmentsPredicate = 'monthly_points';
    vm.departmentsReverse = false;
    vm.departmentsShowDay = true;
    vm.departmentsShowMonth = false;
    vm.departmentsShowTotal = true;
	vm.ordering.departments.daily = "";
    vm.ordering.departments.monthly = "";
    vm.ordering.departments.total = "";
    vm.orderDepartments = orderDepartments;
    vm.departmentsTwoPredicate = 'monthlyPointsPerMember';
    vm.departmentsTwoReverse = false;
    vm.departmentsTwoShowDay = true;
    vm.departmentsTwoShowMonth = false;
    vm.departmentsTwoShowTotal = true;
	vm.ordering.departmentsTwo.daily = "";
    vm.ordering.departmentsTwo.monthly = "";
    vm.ordering.departmentsTwo.total = "";
    vm.orderDepartmentsTwo = orderDepartmentsTwo;
    vm.departmentPredicate = 'monthly_points';
    vm.departmentReverse = false;
    vm.departmentShowDay = true;
    vm.departmentShowMonth = false;
    vm.departmentShowTotal = true;
	vm.ordering.department.daily = "";
    vm.ordering.department.monthly = "";
    vm.ordering.department.total = "";
    vm.orderDepartment = orderDepartment;
	orderDepartmentsTwo('monthlyPointsPerMember');
   

    orderCompany('monthly_points');
    orderDepartments('monthly_points');
    orderDepartment('monthly_points');
	orderDepartmentsTwo('monthlyPointsPerMember');

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
		  vm.ordering.company.daily = "active";
          vm.ordering.company.monthly = "";
          vm.ordering.company.total = "";
          break;
        case 'monthly_points':
          vm.companyShowDay = true;
          vm.companyShowMonth = false;
          vm.companyShowTotal = true;
		  vm.ordering.company.daily = "";
          vm.ordering.company.monthly = "active";
          vm.ordering.company.total = "";
          break;
        case 'total_points':
          vm.companyShowDay = true;
          vm.companyShowMonth = true;
          vm.companyShowTotal = false;
		  vm.ordering.company.daily = "";
          vm.ordering.company.monthly = "";
          vm.ordering.company.total = "active";
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
		  vm.ordering.departments.daily = "active";
          vm.ordering.departments.monthly = "";
          vm.ordering.departments.total = "";
          break;
        case 'monthly_points':
          vm.departmentsShowDay = true;
          vm.departmentsShowMonth = false;
          vm.departmentsShowTotal = true;
		  vm.ordering.departments.daily = "";
          vm.ordering.departments.monthly = "active";
          vm.ordering.departments.total = "";
          break;
        case 'total_points':
          vm.departmentsShowDay = true;
          vm.departmentsShowMonth = true;
          vm.departmentsShowTotal = false;
		  vm.ordering.departments.daily = "";
          vm.ordering.departments.monthly = "";
          vm.ordering.departments.total = "active";
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
		  vm.ordering.departmentsTwo.daily = "active";
          vm.ordering.departmentsTwo.monthly = "";
          vm.ordering.departmentsTwo.total = "";
          break;
        case 'monthlyPointsPerMember':
          vm.departmentsTwoShowDay = true;
          vm.departmentsTwoShowMonth = false;
          vm.departmentsTwoShowTotal = true;
		  vm.ordering.departmentsTwo.daily = "";
          vm.ordering.departmentsTwo.monthly = "active";
          vm.ordering.departmentsTwo.total = "";
          break;
        case 'totalPointsPerMember':
          vm.departmentsTwoShowDay = true;
          vm.departmentsTwoShowMonth = true;
          vm.departmentsTwoShowTotal = false;
		  vm.ordering.departmentsTwo.daily = "";
          vm.ordering.departmentsTwo.monthly = "";
          vm.ordering.departmentsTwo.total = "active";
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
		  vm.ordering.department.daily = "active";
          vm.ordering.department.monthly = "";
          vm.ordering.department.total = "";
          break;
        case 'monthly_points':
          vm.departmentShowDay = true;
          vm.departmentShowMonth = false;
          vm.departmentShowTotal = true;
		  vm.ordering.department.daily = "";
          vm.ordering.department.monthly = "active";
          vm.ordering.department.total = "";
          break;
        case 'total_points':
          vm.departmentShowDay = true;
          vm.departmentShowMonth = true;
          vm.departmentShowTotal = false;
		  vm.ordering.department.daily = "";
          vm.ordering.department.monthly = "";
          vm.ordering.department.total = "active";
          break;
      }
    }

    function joinCompany(){
      userData.joinCompany(vm, vm.signupCode);
    }

    function leaveCompany(){
      userData.leaveCompany(vm, vm.company);
    }

  }

})();

