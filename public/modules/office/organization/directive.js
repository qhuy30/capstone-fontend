myApp.compileProvider.directive("departmentFeatureChild", function () {
    return {
        restrict: "E",
        templateUrl: FrontendDomain + "/modules/office/organization/directives/child_department.html",
        scope: {
            item:"=",
            ctrl:"="
        }
    };
});