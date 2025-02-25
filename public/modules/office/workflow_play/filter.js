myApp.registerFilter('odb_department_checkRule', ['$rootScope', function ($rootScope) {
    return function (rule, department_id) {
        const loginInfo = $rootScope.logininfo?.data;
        const ruleItem = loginInfo?.rule?.find(e => e.rule === rule);

        if (!rule || !loginInfo || !ruleItem || !department_id) return false;

        switch (ruleItem.details.type) {
            case "All":
                return true;
            case "NotAllow":
                return false;
            case "Working":
                return department_id === loginInfo.employee_details.department;
            case "Specific":
                return ruleItem.details.department.includes(department_id);
            default:
                return false;
        }
    }
}]);
