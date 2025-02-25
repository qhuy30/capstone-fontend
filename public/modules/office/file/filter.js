myApp.registerFilter('file_folder_department_checkrule', [
    '$rootScope',
    function ($rootScope) {
        return function (rule, department_id) {
            if (!rule || !$rootScope.logininfo || !$rootScope.logininfo.data || !$rootScope.logininfo.data.rule) {
                return false;
            }
            let ruleAdmin = $rootScope.logininfo.data.rule.filter((e) => e.rule === '*')[0];
            if (ruleAdmin) {
                return true;
            } else {
                var ruleItem = $rootScope.logininfo.data.rule.filter((e) => e.rule === rule)[0];
                if (ruleItem) {
                    switch (ruleItem.details.type) {
                        case 'All':
                            return true;
                            break;
                        case 'NotAllow':
                            return false;
                            break;
                        case 'Specific':
                            if (ruleItem.details.department.indexOf(department_id) !== -1) {
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
        };
    },
]);

myApp.registerFilter('file_folder_project_checkrule', [
    '$rootScope',
    function ($rootScope) {
        return function (rule, project_id) {
            if (!rule || !$rootScope.logininfo || !$rootScope.logininfo.data || !$rootScope.logininfo.data.rule) {
                return false;
            }
            let ruleAdmin = $rootScope.logininfo.data.rule.filter((e) => e.rule === '*')[0];
            if (ruleAdmin) {
                return true;
            } else {
                var ruleItem = $rootScope.logininfo.data.rule.filter((e) => e.rule === rule)[0];
                if (ruleItem) {
                    switch (ruleItem.details.type) {
                        case 'All':
                            return true;
                            break;
                        case 'NotAllow':
                            return false;
                            break;
                        case 'Specific':
                            if (ruleItem.details.project.indexOf(project_id) !== -1) {
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
        };
    },
]);

