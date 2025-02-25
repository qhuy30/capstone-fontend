
myApp.compileProvider.directive("humanStatus", function () {
    return {
        restrict: "E",
        templateUrl: FrontendDomain + "/modules/office/human/directives/human-status.html",
        scope: {
            humanStatusModel: "<"
        },
        link: function (scope, elem, attrs) {
            scope.$watch('humanStatusModel',function(){
                scope.humanStatusData = [{ key: 'quit', title: 'QuitJob' }, { key: 'working', title: 'Working' }, { key: 'leave', title: 'LeaveJob' }];
                for (var i in scope.humanStatusData) {
                    if (scope.humanStatusData[i].key === scope.humanStatusModel) {
                        scope.humanStatusLabel = scope.humanStatusData[i].title;
                        break;
                    }
                }
            });
        }

    };
});

myApp.compileProvider.directive("humanPosition", function () {
    return {
        restrict: "E",
        templateUrl: FrontendDomain + "/modules/office/human/directives/human-position.html",
        scope: {
            humanPositionModel: "<"
        },
        link: function (scope, elem, attrs) {
            scope.$watch('humanPositionModel',function(){
                scope.humanPositionData = [{ key: 'chief', title: 'Chief' }, { key: 'deputy', title: 'Deputy' }, { key: 'personnel', title: 'Personnel' }];
                for (var i in scope.humanPositionData) {
                    if (scope.humanPositionData[i].key === scope.humanPositionModel) {
                        scope.humanPositionLabel = scope.humanPositionData[i].title;
                        break;
                    }
                }
            });
        }
    };
});

myApp.compileProvider.directive("humanDepartment", function () {
    return {
        restrict: "E",
        templateUrl: FrontendDomain + "/modules/office/human/directives/human-department.html",
        scope: {
            humanDepartmentModel: "<",
            humanDepartmentData:"<"
        },
        link: function (scope, elem, attrs) {
            scope.$watchGroup(['humanDepartmentModel','humanDepartmentData'],function(){
                scope.humanDepartmentAr =[];
                var item = {};
                if (scope.humanDepartmentModel && scope.humanDepartmentData){
                    for (var i in scope.humanDepartmentData){
                        if (scope.humanDepartmentData[i].key == scope.humanDepartmentModel){
                         item = angular.copy(scope.humanDepartmentData[i]);
                         scope.humanDepartmentAr.push(item.title);
                         break;
                        } 
                     }
                     for (var i in scope.humanDepartmentData){
                         if (item.parent.indexOf(scope.humanDepartmentData[i].key)!==-1){
                             scope.humanDepartmentAr.push(scope.humanDepartmentData[i].title);
                         }
                     }
                }
            });
        }

    };
});