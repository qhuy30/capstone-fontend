myApp.registerFilter('task_project_checkRule', ['$rootScope', function ($rootScope) {
    return function (rule, project_id, projects_creator, project_joiner) {
        if (!rule
            || !$rootScope.logininfo
            || !$rootScope.logininfo.data
            || !$rootScope.logininfo.data.rule
            || ! project_id
            || !projects_creator
            || !project_joiner
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
                case "Specific":
                    if (ruleItem.details.project.indexOf(project_id) !== -1) {
                        return true;
                    } else {
                        return false;
                    }
                    break;
                case "Self":
                    if (projects_creator === $rootScope.logininfo.username) {
                        return true;
                    } else {
                        return false;
                    }
                    break;
                case "Join":
                    if (project_joiner.indexOf($rootScope.logininfo.username) !== -1) {
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


myApp.registerFilter('task_department_checkRule', ['$rootScope', function ($rootScope) {
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
                case "Specific":
                    if (ruleItem.details.department.indexOf(department_id) !== -1) {
                        return true;
                    } else {
                        return false;
                    }
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

myApp.registerFilter('task_department_checkRuleLabel', ['$rootScope', function ($rootScope) {
    return function (rule) {
        if (!rule
            || !$rootScope.logininfo
            || !$rootScope.logininfo.data
            || !$rootScope.logininfo.data.rule
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
                case "Specific":
                    return true;
                    break;
                case "Working":
                    return true;
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

myApp.registerFilter('task_department_checkRule_item', ['$rootScope', function ($rootScope) {
    return function (rule, department_id,creator,done) {
        if (!rule
            || !$rootScope.logininfo
            || !$rootScope.logininfo.data
            || !$rootScope.logininfo.data.rule
            || !department_id
            || ! creator
            || done
        ) { return false; }
        if(creator===$rootScope.logininfo.username){
            return true;
        }
        var ruleItem = $rootScope.logininfo.data.rule.filter(e => e.rule === rule)[0];
        if (ruleItem) {
            switch (ruleItem.details.type) {
                case "All":
                    return true;
                    break;
                case "NotAllow":
                    return false;
                    break;
                case "Specific":
                    if (ruleItem.details.department.indexOf(department_id) !== -1) {
                        return true;
                    } else {
                        return false;
                    }
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

myApp.registerFilter('task_project_checkRule_item', ['$rootScope', function ($rootScope) {
    return function (rule, project_id, projects_creator, project_joiner,creator,done) {
        if (!rule
            || !$rootScope.logininfo
            || !$rootScope.logininfo.data
            || !$rootScope.logininfo.data.rule
            || ! project_id
            || !projects_creator
            || !project_joiner
            || ! creator
            || done
        ) { return false; }
        if(creator===$rootScope.logininfo.username){
            return true;
        }
        var ruleItem = $rootScope.logininfo.data.rule.filter(e => e.rule === rule)[0];
        if (ruleItem) {
            switch (ruleItem.details.type) {
                case "All":
                    return true;
                    break;
                case "NotAllow":
                    return false;
                    break;
                case "Specific":
                    if (ruleItem.details.project.indexOf(project_id) !== -1) {
                        return true;
                    } else {
                        return false;
                    }
                    break;
                case "Self":
                    if (projects_creator === $rootScope.logininfo.username) {
                        return true;
                    } else {
                        return false;
                    }
                    break;
                case "Join":
                    if (project_joiner.indexOf($rootScope.logininfo.username) !== -1) {
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

myApp.registerFilter('transform_data_preview_task',function(){
    return function(tasks){
        for(let i in tasks){
            tasks[i].check_main_person = {};
            for(let j in tasks[i].main_person){
                tasks[i].check_main_person[tasks[i].main_person[j]]=true;
            }
            tasks[i].check_participant = {};
            for(let j in tasks[i].participant){
                tasks[i].check_participant[tasks[i].participant[j]]=true;
            }
            tasks[i].check_observer = {};
            for(let j in tasks[i].observer){
                tasks[i].check_observer[tasks[i].observer[j]]=true;
            }

            tasks[i].searching = tasks[i].searching ||"";
        }
        return tasks
    }
});

myApp.registerFilter('filterByType',function(){
    return function(tasks, type){
        if (!tasks) {
            return [];
        }
        return tasks.filter(e => e.type === type);
    }
});

