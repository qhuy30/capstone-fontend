myApp.registerFilter('work_flow_checkRule', ['$rootScope', function ($rootScope) {
    return function (rule, department_id) {
        if (!rule
            || !$rootScope.logininfo
            || !$rootScope.logininfo.data
            || !$rootScope.logininfo.data.rule
            || ! department_id
        ) { return false; }
        var ruleItem = $rootScope.logininfo.data.rule.filter(e => e.rule === rule)[0];
        if (ruleItem) {
            switch (ruleItem.details.type) {
                case "All":
                    return true;
                    break;
                case "NotAllow":
                    return false;
                    break;
                case "Working":
                    if (department_id === $rootScope.logininfo.data.employee_details.department) {
                        return true;
                    } else {
                        return false;
                    }
                    break;
                default:
                    return false;
                    break;
            }
        } else {
            return false;
        }

    }
}]);