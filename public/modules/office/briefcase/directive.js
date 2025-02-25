myApp.compileProvider.directive("briefcaseInfo", function () {
    return {
        restrict: "E",
        templateUrl:
            FrontendDomain +
            "/modules/office/briefcase/directives/briefcase_info.html",
        scope: {
            item: "<",
        },
        controller: [
            "$scope",
            "$q",
            "storage_details_service",
            function ($scope,$q, storage_details_service) {

                $scope.load_file_info = function (params) {
                    return function () {
                        var dfd = $q.defer();
                        storage_details_service.load_file_info(params.id, params.name).then(function (res) {
                            dfd.resolve({
                                display: res.data.display,
                                embedUrl: res.data.url,
                                guid: res.data.guid
                            });
                            res = undefined;
                            dfd = undefined;
                        }, function (err) {
                        });
                        return dfd.promise;
                    }
                  }
            },
        ],
    };
});
