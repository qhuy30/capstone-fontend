
myApp.compileProvider.directive("workflowFeatureDepartmentChild", function () {
    return {
        restrict: "E",
        templateUrl: FrontendDomain + "/modules/office/workflow/directives/child_department.html",
        scope: {
            item:"=",
            ctrl:"="
        }
    };
});